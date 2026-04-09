import type {
  CompanyResponse,
  CompanyFollowerItem,
  CreateCompanyRequest,
  CreateEducationRequest,
  CreateExperienceRequest,
  CreateInternshipRequest,
  CreateStudentRequest,
  EducationItem,
  ExperienceItem,
  FollowedCompanyItem,
  InternshipResponse,
  StudentResponse,
  UpdateCompanyRequest,
  UpdateEducationRequest,
  UpdateExperienceRequest,
  UpdateInternshipRequest,
  UpdateStudentRequest,
} from "./types";

const DB_STORAGE_KEY = "caseup:local-db:v1";

export type LocalUserRole = "STUDENT" | "COMPANY" | "ADMIN";

interface LocalUser {
  id: string;
  email: string;
  password: string;
  role: LocalUserRole;
  createdAt: string;
}

interface LocalStudentProfile {
  userId: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  contactEmail?: string;
  phone?: string;
  location?: string;
  githubUrl?: string;
  resumeUrl?: string;
  skills: string[];
  createdAt: string;
}

interface LocalEducation extends EducationItem {
  studentId: string;
}

interface LocalExperience extends ExperienceItem {
  studentId: string;
}

interface LocalCompanyProfile {
  userId: string;
  companyName: string;
  logoUrl?: string;
  industry: string;
  companySize: string;
  foundedYear: number;
  description: string;
  websiteUrl: string;
  headquarters: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  focusAreas: string[];
  createdAt: string;
}

interface LocalCompanyFollower {
  companyId: string;
  studentId: string;
  createdAt: string;
}

interface LocalInternship extends InternshipResponse {}

export interface LocalApplication {
  id: string;
  internshipId: string;
  companyId: string;
  studentId: string;
  coverLetter: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  aiReviewStatus: "PENDING" | "IN_PROGRESS" | "REVIEWED" | "ERROR";
  score: number;
  appliedAt: string;
  githubUrl?: string;
  portfolioUrl?: string;
}

export interface LocalCaseTask {
  id: string;
  caseId: string;
  title: string;
  difficulty: string;
  duration: string;
  objective: string;
  requirements: string;
  acceptance: string;
}

export interface LocalTaskSubmission {
  id: string;
  internshipId: string;
  companyId: string;
  studentId: string;
  taskId: string;
  taskTitle: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileDataUrl?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
}

interface LocalDatabase {
  users: LocalUser[];
  studentProfiles: LocalStudentProfile[];
  studentEducation: LocalEducation[];
  studentExperience: LocalExperience[];
  companyProfiles: LocalCompanyProfile[];
  companyFollowers: LocalCompanyFollower[];
  internships: LocalInternship[];
  applications: LocalApplication[];
  caseTasks: LocalCaseTask[];
  taskSubmissions: LocalTaskSubmission[];
}

const seedNow = new Date("2026-04-09T09:00:00.000Z").toISOString();

type InternshipTaskSeedInput = Pick<
  LocalInternship,
  "id" | "title" | "description" | "requirements"
>;

function normalizeText(value?: string): string {
  return (value ?? "").toLowerCase();
}

function createTask(
  caseId: string,
  suffix: number,
  title: string,
  difficulty: string,
  duration: string,
  objective: string,
  requirements: string[],
  acceptance: string[]
): LocalCaseTask {
  return {
    id: `${caseId}-task-${suffix}`,
    caseId,
    title,
    difficulty,
    duration,
    objective,
    requirements: requirements.join("\n"),
    acceptance: acceptance.join("\n"),
  };
}

export function buildStarterTasksForInternship(
  internship: InternshipTaskSeedInput
): LocalCaseTask[] {
  const title = normalizeText(internship.title);
  const description = normalizeText(internship.description);
  const requirements = normalizeText(internship.requirements);
  const haystack = `${title} ${description} ${requirements}`;

  if (
    haystack.includes("frontend") ||
    haystack.includes("react") ||
    haystack.includes("ui") ||
    haystack.includes("ux") ||
    haystack.includes("component")
  ) {
    return [
      createTask(
        internship.id,
        1,
        "Audit the dashboard shell",
        "Easy",
        "1 day",
        "Understand the dashboard layout, shared UI patterns, and states before touching implementation.",
        [
          "Review the main dashboard screens",
          "List reusable cards and layout blocks",
          "Find static content that should become dynamic",
          "Capture missing empty and loading states",
        ],
        [
          "Audit notes completed",
          "Reusable UI map prepared",
          "At least 3 interface edge cases identified",
        ]
      ),
      createTask(
        internship.id,
        2,
        "Implement the internship summary card",
        "Medium",
        "2 days",
        "Build the primary summary card that presents internship status, timeline, and key company details.",
        [
          "Use the existing visual system",
          "Keep the card responsive",
          "Handle missing values gracefully",
          "Match spacing and hierarchy already used in the app",
        ],
        [
          "Card matches the existing design",
          "Desktop and mobile layouts are stable",
          "Empty states do not break the UI",
        ]
      ),
      createTask(
        internship.id,
        3,
        "Connect application state to the UI",
        "Medium",
        "2 days",
        "Reflect real internship state in actions and views so students always see the correct next step.",
        [
          "Read local internship and application data",
          "Prevent duplicate apply flows",
          "Show the right CTA for current progress",
          "Preserve existing navigation patterns",
        ],
        [
          "State changes appear immediately in the interface",
          "Duplicate apply actions are blocked",
          "My Internship opens the correct case",
        ]
      ),
      createTask(
        internship.id,
        4,
        "QA the internship frontend flow",
        "Hard",
        "1 day",
        "Verify the student experience from internship discovery to board access and task submission.",
        [
          "Check catalog and details pages",
          "Validate My Internship behavior",
          "Test board navigation and task details",
          "Document regressions clearly",
        ],
        [
          "Core flow verified end-to-end",
          "Blocking issues fixed or listed",
          "UI is stable for demo usage",
        ]
      ),
    ];
  }

  if (
    haystack.includes("qa") ||
    haystack.includes("tester") ||
    haystack.includes("testing") ||
    haystack.includes("quality assurance") ||
    haystack.includes("test")
  ) {
    return [
      createTask(
        internship.id,
        1,
        "Map the critical user flows",
        "Easy",
        "1 day",
        "Identify the highest-risk flows in the product so testing covers the most important scenarios first.",
        [
          "List core student and company flows",
          "Mark happy paths and edge cases",
          "Note pages with complex state transitions",
          "Prioritize the top regression risks",
        ],
        [
          "Critical flows documented",
          "Top risk scenarios identified",
          "Testing priorities are clear",
        ]
      ),
      createTask(
        internship.id,
        2,
        "Write the first regression checklist",
        "Medium",
        "2 days",
        "Create a repeatable checklist for verifying the most important platform behaviors before each demo.",
        [
          "Cover login and registration",
          "Cover application and internship flows",
          "Include task submission and review",
          "Keep steps concise and reproducible",
        ],
        [
          "Checklist is easy to run manually",
          "Main regressions are covered",
          "Expected results are written clearly",
        ]
      ),
      createTask(
        internship.id,
        3,
        "Test local data persistence",
        "Medium",
        "2 days",
        "Verify that key user actions survive refreshes and continue to behave correctly with local storage only.",
        [
          "Check saved applications",
          "Check active internship selection",
          "Check task board statuses",
          "Check company review data after refresh",
        ],
        [
          "Persistence issues documented",
          "Broken flows reproduced reliably",
          "At least one data consistency risk identified or cleared",
        ]
      ),
      createTask(
        internship.id,
        4,
        "Prepare the demo QA report",
        "Hard",
        "1 day",
        "Summarize testing results in a compact report the team can use right before the diploma defense.",
        [
          "List tested flows",
          "Separate blockers from minor issues",
          "Include workaround notes if needed",
          "Highlight demo-critical confirmations",
        ],
        [
          "Report is concise and usable",
          "Demo blockers are explicit",
          "Team can quickly decide what to retest",
        ]
      ),
    ];
  }

  if (
    haystack.includes("data") ||
    haystack.includes("analytics") ||
    haystack.includes("science") ||
    haystack.includes("sql") ||
    haystack.includes("python")
  ) {
    return [
      createTask(
        internship.id,
        1,
        "Profile the core datasets",
        "Easy",
        "1 day",
        "Understand the shape, quality, and business meaning of the datasets used by the analytics team.",
        [
          "Inspect the main source tables",
          "List important fields and definitions",
          "Flag missing values and quality risks",
          "Document assumptions for downstream analysis",
        ],
        [
          "Dataset notes prepared",
          "Key dimensions and metrics identified",
          "At least 3 quality issues or questions captured",
        ]
      ),
      createTask(
        internship.id,
        2,
        "Build the first KPI analysis",
        "Medium",
        "2 days",
        "Turn the raw dataset into a focused analysis that answers one product or business question clearly.",
        [
          "Use SQL or Python to prepare the data",
          "Define one clear KPI or trend to explain",
          "Show the result in a simple chart or table",
          "Keep the logic reproducible",
        ],
        [
          "Analysis can be rerun end-to-end",
          "Output highlights one meaningful trend",
          "Query or notebook is understandable by another teammate",
        ]
      ),
      createTask(
        internship.id,
        3,
        "Design an experiment readout",
        "Medium",
        "2 days",
        "Summarize a test or experiment in a way that helps the team make a decision.",
        [
          "Describe the experiment goal",
          "Compare baseline and outcome metrics",
          "Explain caveats and confidence level",
          "Recommend a next step",
        ],
        [
          "Decision-ready summary created",
          "Risks and limitations called out",
          "Recommendation is backed by data",
        ]
      ),
      createTask(
        internship.id,
        4,
        "Present findings to stakeholders",
        "Hard",
        "1 day",
        "Package the work into a concise readout that product and business stakeholders can scan quickly.",
        [
          "Prepare a short narrative",
          "Include metrics, charts, and recommendation",
          "Keep the message focused on business impact",
          "Anticipate follow-up questions",
        ],
        [
          "Readout is concise and clear",
          "Metrics are easy to verify",
          "Stakeholder next steps are explicit",
        ]
      ),
    ];
  }

  if (
    haystack.includes("product") ||
    haystack.includes("operations") ||
    haystack.includes("launch") ||
    haystack.includes("documentation") ||
    haystack.includes("delivery")
  ) {
    return [
      createTask(
        internship.id,
        1,
        "Map the launch workflow",
        "Easy",
        "1 day",
        "Document how work moves from request to launch so the team can spot coordination gaps.",
        [
          "List key steps in the workflow",
          "Identify owners and handoffs",
          "Capture tools used at each step",
          "Note recurring blockers",
        ],
        [
          "Workflow map completed",
          "At least 3 friction points identified",
          "Owners and handoffs clearly described",
        ]
      ),
      createTask(
        internship.id,
        2,
        "Create the delivery tracking view",
        "Medium",
        "2 days",
        "Build a lightweight tracker that helps the team monitor upcoming milestones and risks.",
        [
          "Define the columns or fields needed",
          "Group work by priority or launch window",
          "Add clear status labels",
          "Make the view easy to update weekly",
        ],
        [
          "Tracker covers active initiatives",
          "Risks are visible at a glance",
          "Update process is simple for the team",
        ]
      ),
      createTask(
        internship.id,
        3,
        "Refresh the operating docs",
        "Medium",
        "2 days",
        "Turn scattered notes into a clean source of truth for recurring operations work.",
        [
          "Review outdated documentation",
          "Rewrite the highest-impact sections",
          "Add missing process details",
          "Keep formatting clear and scannable",
        ],
        [
          "Docs are current and consistent",
          "Critical process steps are no longer ambiguous",
          "New teammate could follow the workflow",
        ]
      ),
      createTask(
        internship.id,
        4,
        "Review execution metrics",
        "Hard",
        "1 day",
        "Summarize delivery health with a few metrics the team can use in weekly reviews.",
        [
          "Pick 3 to 5 useful metrics",
          "Explain what each metric indicates",
          "Highlight one trend or concern",
          "Suggest one process improvement",
        ],
        [
          "Metrics are actionable",
          "Weekly review summary is easy to present",
          "One improvement proposal is documented",
        ]
      ),
    ];
  }

  return [
    createTask(
      internship.id,
      1,
      "Audit the current interface",
      "Easy",
      "1 day",
      "Understand the existing UI structure, reusable blocks, and edge states before starting implementation.",
      [
        "Open the main internship-related screens",
        "List reusable UI patterns",
        "Identify static and dynamic sections",
        "Capture at least 3 edge cases",
      ],
      [
        "Audit notes completed",
        "Reusable component opportunities identified",
        "Edge states documented clearly",
      ]
    ),
    createTask(
      internship.id,
      2,
      "Build the primary feature slice",
      "Medium",
      "2 days",
      "Implement the first meaningful product slice for this internship while keeping the current design intact.",
      [
        "Use the existing component patterns",
        "Keep the layout responsive",
        "Handle empty and loading states",
        "Avoid changing the visual design language",
      ],
      [
        "Feature works in the intended flow",
        "UI matches the existing design",
        "Desktop and mobile layouts stay stable",
      ]
    ),
    createTask(
      internship.id,
      3,
      "Connect state to the user flow",
      "Medium",
      "2 days",
      "Wire the feature into the real internship state so the screen reflects the correct student journey.",
      [
        "Read local internship data",
        "Reflect saved state in the interface",
        "Prevent duplicate actions",
        "Preserve current navigation patterns",
      ],
      [
        "State changes appear immediately in UI",
        "No duplicate actions are possible",
        "Internship flow remains consistent end-to-end",
      ]
    ),
    createTask(
      internship.id,
      4,
      "QA the internship scenario",
      "Hard",
      "1 day",
      "Verify the full scenario for this internship from entry point to final task completion.",
      [
        "Test the happy path",
        "Check one edge case and one empty state",
        "Validate task progression",
        "Document remaining issues clearly",
      ],
      [
        "Core scenario verified",
        "Blocking issues fixed or listed",
        "Task flow is stable for demo use",
      ]
    ),
  ];
}

function isLegacyGenericTaskSet(tasks: LocalCaseTask[]): boolean {
  if (tasks.length === 0) return false;
  const titles = new Set(tasks.map((task) => task.title.trim().toLowerCase()));
  const genericTitles = [
    "complete onboarding",
    "first feature slice",
    "audit the current interface",
    "build the primary feature slice",
    "connect state to the user flow",
    "qa the internship scenario",
  ];
  return genericTitles.some((title) => titles.has(title));
}

function ensureInternshipTasks(db: LocalDatabase): void {
  for (const internship of db.internships) {
    const currentTasks = db.caseTasks.filter((task) => task.caseId === internship.id);
    if (currentTasks.length > 0 && !isLegacyGenericTaskSet(currentTasks)) {
      continue;
    }

    db.caseTasks = db.caseTasks.filter((task) => task.caseId !== internship.id);
    db.caseTasks.push(...buildStarterTasksForInternship(internship));
  }
}

const seedDb: LocalDatabase = {
  users: [
    {
      id: "student-demo-1",
      email: "student@caseup.local",
      password: "student123",
      role: "STUDENT",
      createdAt: seedNow,
    },
    {
      id: "student-demo-2",
      email: "alex@caseup.local",
      password: "student123",
      role: "STUDENT",
      createdAt: seedNow,
    },
    {
      id: "company-demo-1",
      email: "company@caseup.local",
      password: "company123",
      role: "COMPANY",
      createdAt: seedNow,
    },
    {
      id: "company-demo-2",
      email: "talent@nebulalabs.local",
      password: "company123",
      role: "COMPANY",
      createdAt: seedNow,
    },
  ],
  studentProfiles: [
    {
      userId: "student-demo-1",
      firstName: "Sarah",
      lastName: "Chen",
      avatarUrl: "",
      contactEmail: "student@caseup.local",
      phone: "+1 555 0100",
      location: "San Francisco, CA",
      githubUrl: "https://github.com/sarahchen",
      resumeUrl: "https://example.com/resume/sarah-chen",
      skills: ["React", "TypeScript", "Tailwind CSS", "REST APIs"],
      createdAt: seedNow,
    },
    {
      userId: "student-demo-2",
      firstName: "Alex",
      lastName: "Morales",
      avatarUrl: "",
      contactEmail: "alex@caseup.local",
      phone: "+1 555 0134",
      location: "Austin, TX",
      githubUrl: "https://github.com/alexmorales",
      resumeUrl: "https://example.com/resume/alex-morales",
      skills: ["Python", "SQL", "Power BI", "Data Analysis"],
      createdAt: seedNow,
    },
  ],
  studentEducation: [
    {
      id: "edu-1",
      studentId: "student-demo-1",
      institutionName: "Stanford University",
      degree: "BSc Computer Science",
      fieldOfStudy: "Human-Computer Interaction",
      gpa: "3.8/4.0",
      startDate: "2022-09-01T00:00:00.000Z",
      endDate: "2026-05-20T00:00:00.000Z",
      createdAt: seedNow,
    },
    {
      id: "edu-2",
      studentId: "student-demo-2",
      institutionName: "UT Austin",
      degree: "BSc Information Systems",
      fieldOfStudy: "Business Analytics",
      gpa: "3.7/4.0",
      startDate: "2021-09-01T00:00:00.000Z",
      endDate: "2025-05-20T00:00:00.000Z",
      createdAt: seedNow,
    },
  ],
  studentExperience: [
    {
      id: "exp-1",
      studentId: "student-demo-1",
      companyName: "BrightPixel",
      jobTitle: "Frontend Intern",
      description: "Built reusable React UI components\nImproved page performance by 20%",
      startDate: "2025-06-01T00:00:00.000Z",
      endDate: "2025-08-30T00:00:00.000Z",
      createdAt: seedNow,
    },
    {
      id: "exp-2",
      studentId: "student-demo-2",
      companyName: "DataForge",
      jobTitle: "Data Analyst Intern",
      description: "Prepared dashboards for weekly business review\nAutomated KPI reporting in SQL",
      startDate: "2025-01-10T00:00:00.000Z",
      endDate: "2025-04-10T00:00:00.000Z",
      createdAt: seedNow,
    },
  ],
  companyProfiles: [
    {
      userId: "company-demo-1",
      companyName: "Orbit Labs",
      logoUrl: "",
      industry: "SaaS",
      companySize: "11-50",
      foundedYear: 2021,
      description: "Orbit Labs builds workflow tools for product and engineering teams.",
      websiteUrl: "https://orbitlabs.example.com",
      headquarters: "New York, NY",
      contactPerson: "Maya Patel",
      contactEmail: "company@caseup.local",
      contactPhone: "+1 555 0144",
      focusAreas: ["Frontend", "Product", "AI"],
      createdAt: seedNow,
    },
    {
      userId: "company-demo-2",
      companyName: "Nebula Analytics",
      logoUrl: "",
      industry: "Data / AI",
      companySize: "51-200",
      foundedYear: 2019,
      description: "Nebula Analytics helps teams operationalize business intelligence.",
      websiteUrl: "https://nebulalabs.example.com",
      headquarters: "Chicago, IL",
      contactPerson: "Jordan Lee",
      contactEmail: "talent@nebulalabs.local",
      contactPhone: "+1 555 0199",
      focusAreas: ["Data", "Machine Learning", "Analytics"],
      createdAt: seedNow,
    },
  ],
  companyFollowers: [
    {
      companyId: "company-demo-1",
      studentId: "student-demo-1",
      createdAt: seedNow,
    },
    {
      companyId: "company-demo-1",
      studentId: "student-demo-2",
      createdAt: seedNow,
    },
    {
      companyId: "company-demo-2",
      studentId: "student-demo-1",
      createdAt: seedNow,
    },
  ],
  internships: [
    {
      id: "internship-1",
      companyId: "company-demo-1",
      title: "Frontend Developer Internship",
      description: "Work on a real product dashboard, ship UI improvements, and collaborate with designers.",
      requirements: "React\nTypeScript\nAttention to detail\nComfort with component-based design",
      startDate: "2026-04-15T00:00:00.000Z",
      endDate: "2026-07-15T00:00:00.000Z",
      createdAt: seedNow,
      updatedAt: seedNow,
    },
    {
      id: "internship-2",
      companyId: "company-demo-2",
      title: "Data Science Internship",
      description: "Analyze product and business datasets, design experiments, and present findings.",
      requirements: "Python\nSQL\nStatistics\nDashboarding",
      startDate: "2026-04-20T00:00:00.000Z",
      endDate: "2026-08-01T00:00:00.000Z",
      createdAt: seedNow,
      updatedAt: seedNow,
    },
    {
      id: "internship-3",
      companyId: "company-demo-1",
      title: "Product Operations Internship",
      description: "Support cross-functional launches, keep documentation updated, and track delivery metrics.",
      requirements: "Communication\nStructured thinking\nSpreadsheets\nOwnership",
      startDate: "2026-03-01T00:00:00.000Z",
      endDate: "2026-04-01T00:00:00.000Z",
      createdAt: seedNow,
      updatedAt: seedNow,
    },
  ],
  applications: [
    {
      id: "application-1",
      internshipId: "internship-1",
      companyId: "company-demo-1",
      studentId: "student-demo-1",
      coverLetter: "I want to gain structured frontend experience and contribute to a real product team.",
      status: "PENDING",
      aiReviewStatus: "REVIEWED",
      score: 92,
      appliedAt: seedNow,
      githubUrl: "https://github.com/sarahchen",
      portfolioUrl: "https://portfolio.example.com/sarah",
    },
    {
      id: "application-2",
      internshipId: "internship-2",
      companyId: "company-demo-2",
      studentId: "student-demo-2",
      coverLetter: "I enjoy turning messy data into clear business decisions and would love to do it in a real team.",
      status: "ACCEPTED",
      aiReviewStatus: "REVIEWED",
      score: 89,
      appliedAt: "2026-04-08T12:00:00.000Z",
      githubUrl: "https://github.com/alexmorales",
      portfolioUrl: "https://portfolio.example.com/alex",
    },
  ],
  caseTasks: [
    ...buildStarterTasksForInternship({
      id: "internship-1",
      title: "Frontend Developer Internship",
      description: "Work on a real product dashboard, ship UI improvements, and collaborate with designers.",
      requirements: "React\nTypeScript\nAttention to detail\nComfort with component-based design",
    }),
    ...buildStarterTasksForInternship({
      id: "internship-2",
      title: "Data Science Internship",
      description: "Analyze product and business datasets, design experiments, and present findings.",
      requirements: "Python\nSQL\nStatistics\nDashboarding",
    }),
    ...buildStarterTasksForInternship({
      id: "internship-3",
      title: "Product Operations Internship",
      description: "Support cross-functional launches, keep documentation updated, and track delivery metrics.",
      requirements: "Communication\nStructured thinking\nSpreadsheets\nOwnership",
    }),
  ],
  taskSubmissions: [],
};

function cloneSeedDb(): LocalDatabase {
  return JSON.parse(JSON.stringify(seedDb)) as LocalDatabase;
}

function readStoredDb(): LocalDatabase | null {
  try {
    const raw = localStorage.getItem(DB_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<LocalDatabase>;
    if (!parsed || typeof parsed !== "object") return null;
    const normalized: LocalDatabase = {
      users: parsed.users ?? [],
      studentProfiles: parsed.studentProfiles ?? [],
      studentEducation: parsed.studentEducation ?? [],
      studentExperience: parsed.studentExperience ?? [],
      companyProfiles: parsed.companyProfiles ?? [],
      companyFollowers: parsed.companyFollowers ?? [],
      internships: parsed.internships ?? [],
      applications: parsed.applications ?? [],
      caseTasks: parsed.caseTasks ?? [],
      taskSubmissions: parsed.taskSubmissions ?? [],
    };
    ensureInternshipTasks(normalized);
    return normalized;
  } catch {
    return null;
  }
}

function persistDb(db: LocalDatabase): void {
  localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
}

export function ensureLocalDb(): LocalDatabase {
  const existing = readStoredDb();
  if (existing) return existing;
  const initial = cloneSeedDb();
  persistDb(initial);
  return initial;
}

export function readLocalDb(): LocalDatabase {
  return ensureLocalDb();
}

export function writeLocalDb(db: LocalDatabase): void {
  persistDb(db);
}

export function updateLocalDb(mutator: (db: LocalDatabase) => void): LocalDatabase {
  const db = readLocalDb();
  mutator(db);
  writeLocalDb(db);
  return db;
}

export function resetLocalDb(): LocalDatabase {
  const initial = cloneSeedDb();
  writeLocalDb(initial);
  return initial;
}

export function generateId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

function toStudentResponse(db: LocalDatabase, profile: LocalStudentProfile): StudentResponse {
  const user = db.users.find((item) => item.id === profile.userId);
  return {
    id: profile.userId,
    email: user?.email ?? "",
    firstName: profile.firstName,
    lastName: profile.lastName,
    avatarUrl: profile.avatarUrl,
    contactEmail: profile.contactEmail,
    phone: profile.phone,
    location: profile.location,
    resumeUrl: profile.resumeUrl,
    githubUrl: profile.githubUrl,
    skills: profile.skills ?? [],
    education: db.studentEducation.filter((item) => item.studentId === profile.userId),
    experience: db.studentExperience.filter((item) => item.studentId === profile.userId),
    createdAt: profile.createdAt,
  };
}

function toCompanyResponse(db: LocalDatabase, profile: LocalCompanyProfile): CompanyResponse {
  const user = db.users.find((item) => item.id === profile.userId);
  return {
    id: profile.userId,
    companyName: profile.companyName,
    email: user?.email ?? "",
    description: profile.description,
    industry: profile.industry,
    headquarters: profile.headquarters,
    foundedYear: profile.foundedYear,
    companySize: profile.companySize,
    websiteUrl: profile.websiteUrl,
    logoUrl: profile.logoUrl ?? "",
    contactPerson: profile.contactPerson,
    contactEmail: profile.contactEmail,
    contactPhone: profile.contactPhone,
    focusAreas: profile.focusAreas ?? [],
    createdAt: profile.createdAt,
  };
}

export function listStudentsFromDb(): StudentResponse[] {
  const db = readLocalDb();
  return db.studentProfiles.map((profile) => toStudentResponse(db, profile));
}

export function listCompaniesFromDb(): CompanyResponse[] {
  const db = readLocalDb();
  return db.companyProfiles.map((profile) => toCompanyResponse(db, profile));
}

export function listInternshipsFromDb(): InternshipResponse[] {
  return readLocalDb().internships;
}

export function getStudentFromDb(id: string): StudentResponse {
  const db = readLocalDb();
  const profile = db.studentProfiles.find((item) => item.userId === id);
  if (!profile) throw new Error("Student not found");
  return toStudentResponse(db, profile);
}

export function getCompanyFromDb(id: string): CompanyResponse {
  const db = readLocalDb();
  const profile = db.companyProfiles.find((item) => item.userId === id);
  if (!profile) throw new Error("Company not found");
  return toCompanyResponse(db, profile);
}

export function getInternshipFromDb(id: string): InternshipResponse {
  const internship = readLocalDb().internships.find((item) => item.id === id);
  if (!internship) throw new Error("Internship not found");
  return internship;
}

export function findUserByEmail(email: string): LocalUser | null {
  const normalized = email.trim().toLowerCase();
  return readLocalDb().users.find((item) => item.email.toLowerCase() === normalized) ?? null;
}

export function getUserById(id: string): LocalUser | null {
  return readLocalDb().users.find((item) => item.id === id) ?? null;
}

export function createLocalStudent(data: CreateStudentRequest): StudentResponse {
  const email = data.email.trim().toLowerCase();
  if (findUserByEmail(email)) {
    throw new Error("An account with this email already exists.");
  }

  const fullName = `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim();
  const fallbackParts = fullName ? fullName.split(/\s+/) : [];
  const firstName = (data.firstName || fallbackParts[0] || "Student").trim();
  const lastName = (data.lastName || fallbackParts.slice(1).join(" ") || "User").trim();
  const id = generateId("student");
  const createdAt = nowIso();

  updateLocalDb((db) => {
    db.users.push({
      id,
      email,
      password: data.password,
      role: "STUDENT",
      createdAt,
    });
    db.studentProfiles.push({
      userId: id,
      firstName,
      lastName,
      avatarUrl: data.avatarUrl,
      contactEmail: data.contactEmail || email,
      phone: data.phone,
      location: data.location,
      githubUrl: data.githubUrl,
      resumeUrl: data.resumeUrl,
      skills: data.skills ?? [],
      createdAt,
    });
  });

  return getStudentFromDb(id);
}

export function createLocalCompany(data: CreateCompanyRequest): CompanyResponse {
  const email = data.email.trim().toLowerCase();
  if (findUserByEmail(email)) {
    throw new Error("An account with this email already exists.");
  }

  const id = generateId("company");
  const createdAt = nowIso();

  updateLocalDb((db) => {
    db.users.push({
      id,
      email,
      password: data.password,
      role: "COMPANY",
      createdAt,
    });
    db.companyProfiles.push({
      userId: id,
      companyName: data.companyName,
      logoUrl: data.logoUrl,
      industry: data.industry,
      companySize: data.companySize,
      foundedYear: data.foundedYear,
      description: data.description,
      websiteUrl: data.websiteUrl,
      headquarters: data.headquarters,
      contactPerson: data.contactPerson,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      focusAreas: data.focusAreas ?? [],
      createdAt,
    });
  });

  return getCompanyFromDb(id);
}

export function updateLocalStudent(id: string, data: UpdateStudentRequest): StudentResponse {
  updateLocalDb((db) => {
    const user = db.users.find((item) => item.id === id && item.role === "STUDENT");
    const profile = db.studentProfiles.find((item) => item.userId === id);
    if (!user || !profile) throw new Error("Student not found");

    if (data.email && data.email.trim().toLowerCase() !== user.email.toLowerCase()) {
      const duplicate = db.users.find(
        (item) => item.id !== id && item.email.toLowerCase() === data.email!.trim().toLowerCase()
      );
      if (duplicate) throw new Error("This email is already used by another account.");
      user.email = data.email.trim().toLowerCase();
    }
    if (data.password) user.password = data.password;
    if (data.firstName !== undefined) profile.firstName = data.firstName;
    if (data.lastName !== undefined) profile.lastName = data.lastName;
    if (data.avatarUrl !== undefined) profile.avatarUrl = data.avatarUrl;
    if (data.contactEmail !== undefined) profile.contactEmail = data.contactEmail;
    if (data.phone !== undefined) profile.phone = data.phone;
    if (data.location !== undefined) profile.location = data.location;
    if (data.resumeUrl !== undefined) profile.resumeUrl = data.resumeUrl;
    if (data.githubUrl !== undefined) profile.githubUrl = data.githubUrl;
    if (data.skills !== undefined) profile.skills = data.skills;
  });

  return getStudentFromDb(id);
}

export function updateLocalCompany(id: string, data: UpdateCompanyRequest): CompanyResponse {
  updateLocalDb((db) => {
    const user = db.users.find((item) => item.id === id && item.role === "COMPANY");
    const profile = db.companyProfiles.find((item) => item.userId === id);
    if (!user || !profile) throw new Error("Company not found");

    if (data.email && data.email.trim().toLowerCase() !== user.email.toLowerCase()) {
      const duplicate = db.users.find(
        (item) => item.id !== id && item.email.toLowerCase() === data.email!.trim().toLowerCase()
      );
      if (duplicate) throw new Error("This email is already used by another account.");
      user.email = data.email.trim().toLowerCase();
    }
    if (data.password) user.password = data.password;
    if (data.companyName !== undefined) profile.companyName = data.companyName;
    if (data.description !== undefined) profile.description = data.description;
    if (data.industry !== undefined) profile.industry = data.industry;
    if (data.headquarters !== undefined) profile.headquarters = data.headquarters;
    if (data.foundedYear !== undefined) profile.foundedYear = data.foundedYear;
    if (data.companySize !== undefined) profile.companySize = data.companySize;
    if (data.websiteUrl !== undefined) profile.websiteUrl = data.websiteUrl;
    if (data.logoUrl !== undefined) profile.logoUrl = data.logoUrl;
    if (data.contactPerson !== undefined) profile.contactPerson = data.contactPerson;
    if (data.contactEmail !== undefined) profile.contactEmail = data.contactEmail;
    if (data.contactPhone !== undefined) profile.contactPhone = data.contactPhone;
    if (data.focusAreas !== undefined) profile.focusAreas = data.focusAreas;
  });

  return getCompanyFromDb(id);
}

export function addEducationToStudent(studentId: string, data: CreateEducationRequest): EducationItem {
  const item: LocalEducation = {
    id: generateId("education"),
    studentId,
    institutionName: data.institutionName,
    degree: data.degree,
    fieldOfStudy: data.fieldOfStudy,
    startDate: data.startDate,
    endDate: data.endDate,
    gpa: data.gpa,
    createdAt: nowIso(),
  };

  updateLocalDb((db) => {
    const exists = db.studentProfiles.some((profile) => profile.userId === studentId);
    if (!exists) throw new Error("Student not found");
    db.studentEducation.push(item);
  });

  return item;
}

export function updateStudentEducation(studentId: string, educationId: string, data: UpdateEducationRequest): void {
  updateLocalDb((db) => {
    const item = db.studentEducation.find((entry) => entry.studentId === studentId && entry.id === educationId);
    if (!item) throw new Error("Education entry not found");
    if (data.institutionName !== undefined) item.institutionName = data.institutionName;
    if (data.degree !== undefined) item.degree = data.degree;
    if (data.fieldOfStudy !== undefined) item.fieldOfStudy = data.fieldOfStudy;
    if (data.startDate !== undefined) item.startDate = data.startDate;
    if (data.endDate !== undefined) item.endDate = data.endDate;
    if (data.gpa !== undefined) item.gpa = data.gpa;
  });
}

export function deleteStudentEducation(studentId: string, educationId: string): void {
  updateLocalDb((db) => {
    db.studentEducation = db.studentEducation.filter(
      (entry) => !(entry.studentId === studentId && entry.id === educationId)
    );
  });
}

export function addExperienceToStudent(studentId: string, data: CreateExperienceRequest): ExperienceItem {
  const item: LocalExperience = {
    id: generateId("experience"),
    studentId,
    jobTitle: data.jobTitle,
    companyName: data.companyName,
    description: data.description,
    startDate: data.startDate,
    endDate: data.endDate,
    createdAt: nowIso(),
  };

  updateLocalDb((db) => {
    const exists = db.studentProfiles.some((profile) => profile.userId === studentId);
    if (!exists) throw new Error("Student not found");
    db.studentExperience.push(item);
  });

  return item;
}

export function updateStudentExperience(studentId: string, experienceId: string, data: UpdateExperienceRequest): void {
  updateLocalDb((db) => {
    const item = db.studentExperience.find((entry) => entry.studentId === studentId && entry.id === experienceId);
    if (!item) throw new Error("Experience entry not found");
    if (data.jobTitle !== undefined) item.jobTitle = data.jobTitle;
    if (data.companyName !== undefined) item.companyName = data.companyName;
    if (data.description !== undefined) item.description = data.description;
    if (data.startDate !== undefined) item.startDate = data.startDate;
    if (data.endDate !== undefined) item.endDate = data.endDate;
  });
}

export function deleteStudentExperience(studentId: string, experienceId: string): void {
  updateLocalDb((db) => {
    db.studentExperience = db.studentExperience.filter(
      (entry) => !(entry.studentId === studentId && entry.id === experienceId)
    );
  });
}

export function listFollowersForCompany(companyId: string): CompanyFollowerItem[] {
  const db = readLocalDb();
  return db.companyFollowers
    .filter((item) => item.companyId === companyId)
    .map((item) => {
      const student = db.studentProfiles.find((profile) => profile.userId === item.studentId);
      return {
        studentId: item.studentId,
        firstName: student?.firstName ?? "Student",
        lastName: student?.lastName ?? "",
        followedAt: item.createdAt,
      };
    });
}

export function listFollowedCompaniesForStudent(studentId: string): FollowedCompanyItem[] {
  const db = readLocalDb();
  return db.companyFollowers
    .filter((item) => item.studentId === studentId)
    .map((item) => {
      const company = db.companyProfiles.find((profile) => profile.userId === item.companyId);
      return {
        companyId: item.companyId,
        companyName: company?.companyName ?? "Company",
        industry: company?.industry ?? "",
        logoUrl: company?.logoUrl,
        followedAt: item.createdAt,
      };
    });
}

export function followCompanyLocally(studentId: string, companyId: string): void {
  updateLocalDb((db) => {
    const exists = db.companyFollowers.some(
      (item) => item.studentId === studentId && item.companyId === companyId
    );
    if (!exists) {
      db.companyFollowers.push({
        companyId,
        studentId,
        createdAt: nowIso(),
      });
    }
  });
}

export function unfollowCompanyLocally(studentId: string, companyId: string): void {
  updateLocalDb((db) => {
    db.companyFollowers = db.companyFollowers.filter(
      (item) => !(item.studentId === studentId && item.companyId === companyId)
    );
  });
}

export function createLocalInternship(data: CreateInternshipRequest): InternshipResponse {
  const id = generateId("internship");
  const createdAt = nowIso();
  const internship: LocalInternship = {
    id,
    companyId: data.companyId,
    title: data.title,
    description: data.description,
    requirements: data.requirements,
    startDate: data.startDate,
    endDate: data.endDate,
    createdAt,
    updatedAt: createdAt,
  };

  updateLocalDb((db) => {
    const companyExists = db.companyProfiles.some((profile) => profile.userId === data.companyId);
    if (!companyExists) throw new Error("Company not found");
    db.internships.push(internship);
    db.caseTasks.push(...buildStarterTasksForInternship(internship));
  });

  return internship;
}

export function updateLocalInternship(id: string, data: UpdateInternshipRequest): InternshipResponse {
  updateLocalDb((db) => {
    const internship = db.internships.find((item) => item.id === id);
    if (!internship) throw new Error("Internship not found");
    if (data.title !== undefined) internship.title = data.title;
    if (data.description !== undefined) internship.description = data.description;
    if (data.requirements !== undefined) internship.requirements = data.requirements;
    if (data.startDate !== undefined) internship.startDate = data.startDate;
    if (data.endDate !== undefined) internship.endDate = data.endDate;
    internship.updatedAt = nowIso();
  });

  return getInternshipFromDb(id);
}

export function deleteLocalInternship(id: string): void {
  updateLocalDb((db) => {
    db.internships = db.internships.filter((item) => item.id !== id);
    db.applications = db.applications.filter((item) => item.internshipId !== id);
    db.caseTasks = db.caseTasks.filter((item) => item.caseId !== id);
    db.taskSubmissions = db.taskSubmissions.filter((item) => item.internshipId !== id);
  });
}

export function submitApplicationLocally(internshipId: string, coverLetter: string): LocalApplication {
  const studentId = requireCurrentStudentId();
  const internship = getInternshipFromDb(internshipId);
  const student = getStudentFromDb(studentId);
  const existing = readLocalDb().applications.find(
    (item) => item.internshipId === internshipId && item.studentId === studentId
  );
  if (existing) {
    throw new Error("You have already applied to this internship.");
  }

  const application: LocalApplication = {
    id: generateId("application"),
    internshipId,
    companyId: internship.companyId,
    studentId,
    coverLetter: coverLetter.trim(),
    status: "PENDING",
    aiReviewStatus: "PENDING",
    score: Math.min(99, Math.max(70, 70 + (student.skills?.length ?? 0) * 4)),
    appliedAt: nowIso(),
    githubUrl: student.githubUrl,
    portfolioUrl: student.resumeUrl,
  };

  updateLocalDb((db) => {
    db.applications.push(application);
  });

  return application;
}

export function listApplicationsForCompany(companyId: string): LocalApplication[] {
  return readLocalDb().applications.filter((item) => item.companyId === companyId);
}

export function listApplicationsForStudent(studentId: string): LocalApplication[] {
  return readLocalDb().applications.filter((item) => item.studentId === studentId);
}

export function submitTaskSubmissionLocally(input: {
  internshipId: string;
  taskId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileDataUrl?: string;
}): LocalTaskSubmission {
  const studentId = requireCurrentStudentId();
  const internship = getInternshipFromDb(input.internshipId);
  const task = getCaseTaskById(input.taskId);

  if (!task || task.caseId !== input.internshipId) {
    throw new Error("Task not found for this internship.");
  }

  const submittedAt = nowIso();

  updateLocalDb((db) => {
    const existing = db.taskSubmissions.find(
      (item) =>
        item.studentId === studentId &&
        item.internshipId === input.internshipId &&
        item.taskId === input.taskId
    );

    if (existing) {
      existing.fileName = input.fileName;
      existing.fileType = input.fileType;
      existing.fileSize = input.fileSize;
      existing.fileDataUrl = input.fileDataUrl;
      existing.status = "PENDING";
      existing.submittedAt = submittedAt;
      existing.taskTitle = task.title;
      return;
    }

    db.taskSubmissions.push({
      id: generateId("submission"),
      internshipId: input.internshipId,
      companyId: internship.companyId,
      studentId,
      taskId: input.taskId,
      taskTitle: task.title,
      fileName: input.fileName,
      fileType: input.fileType,
      fileSize: input.fileSize,
      fileDataUrl: input.fileDataUrl,
      status: "PENDING",
      submittedAt,
    });
  });

  const saved = readLocalDb().taskSubmissions.find(
    (item) =>
      item.studentId === studentId &&
      item.internshipId === input.internshipId &&
      item.taskId === input.taskId
  );

  if (!saved) {
    throw new Error("Could not save submission.");
  }

  return saved;
}

export function listTaskSubmissionsForCompany(companyId: string): LocalTaskSubmission[] {
  return readLocalDb().taskSubmissions.filter((item) => item.companyId === companyId);
}

export function listTaskSubmissionsForStudent(studentId: string): LocalTaskSubmission[] {
  return readLocalDb().taskSubmissions.filter((item) => item.studentId === studentId);
}

export function getTaskSubmissionById(submissionId: string): LocalTaskSubmission {
  const submission = readLocalDb().taskSubmissions.find((item) => item.id === submissionId);
  if (!submission) throw new Error("Submission not found");
  return submission;
}

export function getTaskSubmissionForStudentTask(
  studentId: string,
  internshipId: string,
  taskId: string
): LocalTaskSubmission | null {
  return (
    readLocalDb().taskSubmissions.find(
      (item) =>
        item.studentId === studentId &&
        item.internshipId === internshipId &&
        item.taskId === taskId
    ) ?? null
  );
}

export function updateTaskSubmissionStatus(
  submissionId: string,
  status: LocalTaskSubmission["status"]
): LocalTaskSubmission {
  updateLocalDb((db) => {
    const submission = db.taskSubmissions.find((item) => item.id === submissionId);
    if (!submission) throw new Error("Submission not found");
    submission.status = status;
  });

  return getTaskSubmissionById(submissionId);
}

export function getApplicationById(applicationId: string): LocalApplication {
  const application = readLocalDb().applications.find((item) => item.id === applicationId);
  if (!application) throw new Error("Application not found");
  return application;
}

export function updateApplicationStatus(
  applicationId: string,
  status: LocalApplication["status"]
): LocalApplication {
  updateLocalDb((db) => {
    const application = db.applications.find((item) => item.id === applicationId);
    if (!application) throw new Error("Application not found");
    application.status = status;
  });
  return getApplicationById(applicationId);
}

export function listCandidateStudentsForCompany(companyId: string): StudentResponse[] {
  const studentIds = new Set(
    readLocalDb()
      .applications.filter((item) => item.companyId === companyId)
      .map((item) => item.studentId)
  );
  return [...studentIds].map((studentId) => getStudentFromDb(studentId));
}

export function getCaseTasks(caseId: string): LocalCaseTask[] {
  return readLocalDb().caseTasks.filter((item) => item.caseId === caseId);
}

export function ensureCaseTasksForInternship(caseId: string): LocalCaseTask[] {
  const db = readLocalDb();
  const internship = db.internships.find((item) => item.id === caseId);
  if (!internship) {
    return db.caseTasks.filter((item) => item.caseId === caseId);
  }

  const tasks = db.caseTasks.filter((item) => item.caseId === caseId);
  if (tasks.length > 0 && !isLegacyGenericTaskSet(tasks)) {
    return tasks;
  }

  const generated = buildStarterTasksForInternship(internship);
  updateLocalDb((draft) => {
    draft.caseTasks = draft.caseTasks.filter((item) => item.caseId !== caseId);
    draft.caseTasks.push(...generated);
  });
  return generated;
}

export function getCaseTaskById(taskId: string): LocalCaseTask | null {
  return readLocalDb().caseTasks.find((item) => item.id === taskId) ?? null;
}

export function saveCaseTasks(caseId: string, tasks: LocalCaseTask[]): LocalCaseTask[] {
  updateLocalDb((db) => {
    db.caseTasks = db.caseTasks.filter((item) => item.caseId !== caseId);
    db.caseTasks.push(
      ...tasks.map((task) => ({
        ...task,
        caseId,
      }))
    );
  });
  return getCaseTasks(caseId);
}

function toBase64Url(value: string): string {
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function createLocalAccessToken(user: LocalUser): string {
  const header = toBase64Url(JSON.stringify({ alg: "none", typ: "JWT" }));
  const payload = toBase64Url(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role.toLowerCase(),
      iat: Math.floor(Date.now() / 1000),
    })
  );
  return `${header}.${payload}.local`;
}

export function currentSessionUserId(): string | null {
  return localStorage.getItem("userId");
}

export function requireCurrentStudentId(): string {
  const id = currentSessionUserId();
  const user = id ? getUserById(id) : null;
  if (!id || !user || user.role !== "STUDENT") {
    throw new Error("A student account is required for this action.");
  }
  return id;
}

export function requireCurrentCompanyId(): string {
  const id = currentSessionUserId();
  const user = id ? getUserById(id) : null;
  if (!id || !user || user.role !== "COMPANY") {
    throw new Error("A company account is required for this action.");
  }
  return id;
}
