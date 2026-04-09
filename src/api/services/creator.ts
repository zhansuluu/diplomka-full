import type { LocalCaseTask } from "../localDb";

const OPENAI_API_URL = "https://api.openai.com/v1/responses";

export type GeneratedProgramTask = {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  duration: string;
  objective: string;
  requirements: string[];
  acceptance: string[];
};

export type GeneratedProgram = {
  title: string;
  description: string;
  requirements: string;
  durationWeeks: number;
  tasks: GeneratedProgramTask[];
};

function getApiKey(): string {
  return import.meta.env.VITE_OPENAI_API_KEY?.trim() ?? "";
}

function extractJsonObject(text: string): string {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("The AI Creator did not return valid JSON.");
  }
  return text.slice(start, end + 1);
}

function extractOutputText(payload: any): string {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const segments = (payload?.output ?? [])
    .flatMap((item: any) => item?.content ?? [])
    .filter((item: any) => item?.type === "output_text" && typeof item?.text === "string")
    .map((item: any) => item.text.trim())
    .filter(Boolean);

  if (segments.length > 0) {
    return segments.join("\n\n");
  }

  throw new Error("The AI Creator returned an empty response.");
}

function normalizeTask(task: any, index: number): GeneratedProgramTask {
  const difficulty =
    task?.difficulty === "Easy" || task?.difficulty === "Hard" ? task.difficulty : "Medium";

  const requirements = Array.isArray(task?.requirements)
    ? task.requirements.map((item: unknown) => String(item).trim()).filter(Boolean)
    : [];

  const acceptance = Array.isArray(task?.acceptance)
    ? task.acceptance.map((item: unknown) => String(item).trim()).filter(Boolean)
    : [];

  return {
    title: String(task?.title || `Task ${index + 1}`).trim(),
    difficulty,
    duration: String(task?.duration || "2 days").trim(),
    objective: String(task?.objective || "Complete the task scope for this milestone.").trim(),
    requirements: requirements.length > 0 ? requirements : ["Review the task context and prepare a clear execution plan."],
    acceptance: acceptance.length > 0 ? acceptance : ["The task is completed and ready for review."],
  };
}

function normalizeProgram(data: any): GeneratedProgram {
  const tasks = Array.isArray(data?.tasks) ? data.tasks.slice(0, 8).map(normalizeTask) : [];

  if (tasks.length === 0) {
    throw new Error("The AI Creator did not generate any tasks.");
  }

  const requirementsSource = data?.requirements;
  const requirements = Array.isArray(requirementsSource)
    ? requirementsSource.map((item: unknown) => String(item).trim()).filter(Boolean).join("\n")
    : String(requirementsSource || "").trim();

  return {
    title: String(data?.title || "AI-generated internship draft").trim(),
    description: String(data?.description || "AI-generated internship program.").trim(),
    requirements: requirements || "Requirements to be уточнены during manual review.",
    durationWeeks: Math.min(12, Math.max(2, Number(data?.durationWeeks) || 4)),
    tasks,
  };
}

function buildPrompt(files: Array<{ name: string; content: string }>, extraContext: string): string {
  const fileBlocks = files
    .map(
      (file, index) =>
        `Source ${index + 1}: ${file.name}\n${file.content.trim().slice(0, 12000)}`
    )
    .join("\n\n");

  return [
    "Create a structured internship program draft for a virtual internship platform.",
    "Return JSON only. No markdown fences, no commentary.",
    "The result must be practical and immediately editable by a company manager.",
    "Generate 4 to 6 tasks with realistic sequencing.",
    "Every task must contain: title, difficulty, duration, objective, requirements[], acceptance[].",
    "Do not create generic filler tasks like onboarding or learn the codebase unless the source explicitly demands it.",
    "The program should be specific to the role in the source material.",
    "",
    "Required JSON shape:",
    '{',
    '  "title": "string",',
    '  "description": "string",',
    '  "requirements": ["string", "string"],',
    '  "durationWeeks": 4,',
    '  "tasks": [',
    '    {',
    '      "title": "string",',
    '      "difficulty": "Easy | Medium | Hard",',
    '      "duration": "string",',
    '      "objective": "string",',
    '      "requirements": ["string"],',
    '      "acceptance": ["string"]',
    "    }",
    "  ]",
    '}',
    "",
    extraContext ? `Additional company context:\n${extraContext.trim()}\n` : "",
    "Source material:",
    fileBlocks,
  ].join("\n");
}

export function mapGeneratedTasksToLocal(caseId: string, tasks: GeneratedProgramTask[]): LocalCaseTask[] {
  return tasks.map((task, index) => ({
    id: `${caseId}-ai-task-${index + 1}`,
    caseId,
    title: task.title,
    difficulty: task.difficulty,
    duration: task.duration,
    objective: task.objective,
    requirements: task.requirements.join("\n"),
    acceptance: task.acceptance.join("\n"),
  }));
}

export const creatorService = {
  generateProgram: async (input: {
    files: Array<{ name: string; content: string }>;
    extraContext?: string;
  }): Promise<GeneratedProgram> => {
    const apiKey = getApiKey();

    if (!apiKey) {
      throw new Error("Set VITE_OPENAI_API_KEY in .env to use AI Creator.");
    }

    if (input.files.length === 0 && !input.extraContext?.trim()) {
      throw new Error("Add a readable job description or extra context first.");
    }

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: import.meta.env.VITE_OPENAI_CREATOR_MODEL || import.meta.env.VITE_OPENAI_MODEL || "gpt-4.1-mini",
        input: buildPrompt(input.files, input.extraContext ?? ""),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "The AI Creator request failed.");
    }

    const payload = await response.json();
    const outputText = extractOutputText(payload);
    const parsed = JSON.parse(extractJsonObject(outputText));
    return normalizeProgram(parsed);
  },
};
