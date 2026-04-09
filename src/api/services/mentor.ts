import type { LocalCaseTask } from "../localDb";

const OPENAI_API_URL = "https://api.openai.com/v1/responses";

export type MentorChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function getApiKeyFromEnv(): string {
  return import.meta.env.VITE_OPENAI_API_KEY?.trim() ?? "";
}

export function getMentorApiKey(): string {
  return getApiKeyFromEnv();
}

function buildInstructions(task: LocalCaseTask): string {
  return [
    "You are CaseUp AI Mentor for a virtual internship platform.",
    "Your job is to coach the student, not do the task for them.",
    "Be practical, encouraging, and concise.",
    "Do not provide a complete final solution or a copy-paste implementation.",
    "Help by clarifying requirements, breaking the task into steps, pointing out risks, and suggesting how to self-check.",
    "If the student asks for a direct final answer, refuse briefly and redirect into guidance.",
    "Prefer bullet points when useful.",
    "",
    `Current task title: ${task.title}`,
    `Difficulty: ${task.difficulty}`,
    `Estimated duration: ${task.duration}`,
    `Objective: ${task.objective}`,
    `Requirements: ${task.requirements}`,
    `Acceptance criteria: ${task.acceptance}`,
  ].join("\n");
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

  throw new Error("The AI mentor returned an empty response.");
}

export const mentorService = {
  getApiKey: getMentorApiKey,

  askAboutTask: async (input: {
    task: LocalCaseTask;
    history: MentorChatMessage[];
    userMessage: string;
  }): Promise<string> => {
    const apiKey = getMentorApiKey();

    if (!apiKey) {
      throw new Error("Add your OpenAI API key to use AI Mentor.");
    }

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: import.meta.env.VITE_OPENAI_MODEL || "gpt-4.1-mini",
        instructions: buildInstructions(input.task),
        input: [
          ...input.history.map((message) => ({
            role: message.role,
            content: message.content,
          })),
          {
            role: "user",
            content: input.userMessage,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "The AI mentor request failed.");
    }

    const payload = await response.json();
    return extractOutputText(payload);
  },
};
