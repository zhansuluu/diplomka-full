import { studentService } from "./services/student";
import { companyService } from "./services/company";
import { parseJwtPayload, getJwtSubject } from "./jwt";
import type { StudentResponse, CompanyResponse } from "./types";

export type ResolvedRole = "student" | "company";

export interface ResolvedUser {
  role: ResolvedRole;
  user: StudentResponse | CompanyResponse;
}

function normalizeRoleClaim(raw: unknown): ResolvedRole | null {
  if (typeof raw !== "string") return null;
  const s = raw.toLowerCase();
  if (s === "student" || s === "students") return "student";
  if (s === "company" || s === "companies" || s === "employer") return "company";
  return null;
}

/** Swagger has no `/me` routes — resolve profile from JWT `sub` and/or email. */
export async function resolveUserFromAccessToken(
  accessToken: string,
  emailHint?: string
): Promise<ResolvedUser> {
  const payload = parseJwtPayload(accessToken);
  const fromClaim =
    normalizeRoleClaim(payload?.role) ??
    normalizeRoleClaim(payload?.user_role) ??
    normalizeRoleClaim(payload?.typ);

  const sub = getJwtSubject(accessToken);

  if (sub) {
    if (fromClaim === "student") {
      const user = await studentService.getStudent(sub);
      return { role: "student", user };
    }
    if (fromClaim === "company") {
      const user = await companyService.getCompany(sub);
      return { role: "company", user };
    }

    try {
      const user = await studentService.getStudent(sub);
      return { role: "student", user };
    } catch {
      /* try company */
    }

    try {
      const user = await companyService.getCompany(sub);
      return { role: "company", user };
    } catch {
      /* fall through */
    }
  }

  if (emailHint) {
    const students = await studentService.listStudents(200, 0);
    const s = (students.items ?? []).find(
      (x) => x.email?.toLowerCase() === emailHint.toLowerCase()
    );
    if (s) return { role: "student", user: s };

    const companies = await companyService.listCompanies(200, 0);
    const c = (companies.items ?? []).find(
      (x) => x.email?.toLowerCase() === emailHint.toLowerCase()
    );
    if (c) return { role: "company", user: c };
  }

  throw new Error(
    "Could not load your profile. Ensure the JWT includes `sub` or your account email is listed."
  );
}
