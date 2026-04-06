import { useEffect, useState } from "react";
import { Fragment, type ReactNode } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Wrench,
  GraduationCap,
  Briefcase,
  Loader,
  AlertCircle,
  Trash2,
  Pencil,
  Github,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { studentService } from "../../api";
import type {
  StudentResponse,
  EducationItem,
  ExperienceItem,
  CreateEducationRequest,
  CreateExperienceRequest,
} from "../../api/types";

function parseSkillsInput(text: string): string[] {
  return text
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function formatRange(start?: string, end?: string): string {
  const a = start ? new Date(start).getFullYear() : "";
  const b = end ? new Date(end).getFullYear() : "";
  if (a && b) return `${a} – ${b}`;
  if (a) return `${a} – present`;
  return "";
}

/** Split description into lines; strip common leading bullet chars the user may type. */
function descriptionLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/^[\s•\-\*◦]+/u, "").trim())
    .filter(Boolean);
}

function DescriptionBullets({ text, className = "" }: { text: string; className?: string }) {
  const lines = descriptionLines(text);
  if (lines.length === 0) return null;
  return (
    <ul className={`mt-2 list-disc pl-5 space-y-1 text-sm break-words ${className}`}>
      {lines.map((line, i) => (
        <li key={i} className="text-gray-700 pl-0.5">
          <span className="break-words">{line}</span>
        </li>
      ))}
    </ul>
  );
}

/** Right-aligned years on resume. */
function ResumeRightColumn({ range }: { range: string }) {
  if (!range) return null;
  return (
    <div className="shrink-0 text-right text-sm max-w-[42%]">
      <div className="font-semibold text-gray-900 tabular-nums">{range}</div>
    </div>
  );
}

export const Profile = () => {
  const { user, refreshUser } = useAuth();
  const studentId = user?.id;

  const [activeTab, setActiveTab] = useState<"profile" | "resume">("profile");
  const [editingProfile, setEditingProfile] = useState(false);

  const [profile, setProfile] = useState<StudentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [skillsCsv, setSkillsCsv] = useState("");
  const [saving, setSaving] = useState(false);

  const [eduOpen, setEduOpen] = useState(false);
  const [expOpen, setExpOpen] = useState(false);
  const [eduForm, setEduForm] = useState<CreateEducationRequest>({
    institutionName: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    gpa: "",
  });
  const [expForm, setExpForm] = useState<CreateExperienceRequest>({
    jobTitle: "",
    companyName: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (!studentId) return;
    let cancelled = false;
    (async () => {
      try {
        const s = await studentService.getStudent(studentId);
        if (cancelled) return;
        applyStudentToForm(s);
        setLoading(false);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load profile");
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [studentId]);

  function applyStudentToForm(s: StudentResponse) {
    setProfile(s);
    setFirstName(s.firstName ?? "");
    setLastName(s.lastName ?? "");
    setPhone(s.phone ?? "");
    setLocation(s.location ?? "");
    setContactEmail(s.contactEmail ?? "");
    setGithubUrl(s.githubUrl ?? "");
    setResumeUrl(s.resumeUrl ?? "");
    setAvatarUrl(s.avatarUrl ?? "");
    setSkillsCsv((s.skills ?? []).join(", "));
  }

  const displayName = [firstName, lastName].filter(Boolean).join(" ") || profile?.email || "Student";
  const primaryEmail = profile?.email ?? user?.email ?? "";
  const showEmail = contactEmail || primaryEmail;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) return;
    setSaving(true);
    setError(null);
    const skills = parseSkillsInput(skillsCsv);
    try {
      await studentService.updateStudent(studentId, {
        firstName,
        lastName,
        phone: phone || undefined,
        location: location || undefined,
        contactEmail: contactEmail || undefined,
        githubUrl: githubUrl || undefined,
        resumeUrl: resumeUrl || undefined,
        avatarUrl: avatarUrl || undefined,
        skills,
      });
      await refreshUser();
      const s = await studentService.getStudent(studentId);
      applyStudentToForm(s);
      setEditingProfile(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const reload = async () => {
    if (!studentId) return;
    const s = await studentService.getStudent(studentId);
    applyStudentToForm(s);
  };

  if (!studentId) {
    return (
      <div className="px-20 py-10">
        <p className="text-gray-600">Sign in as a student to view your profile.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="px-20 py-10 flex items-center gap-3">
        <Loader className="animate-spin" />
        <span className="text-gray-700">Loading profile…</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 px-20 py-5 max-w-5xl">
      {error && (
        <div className="bg-red-50 border-2 border-red-300 p-4 rounded flex gap-2 shadow-[4px_4px_0px_black]">
          <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`border-2 border-black px-6 py-2 rounded shadow-[4px_4px_0px_black] transition
          ${activeTab === "profile" ? "bg-[#5D0CA0] text-white" : "bg-white hover:translate-y-[1px]"}`}
        >
          Profile
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("resume")}
          className={`border-2 border-black px-6 py-2 rounded shadow-[4px_4px_0px_black] transition
          ${activeTab === "resume" ? "bg-[#5D0CA0] text-white" : "bg-white hover:translate-y-[1px]"}`}
        >
          Resume
        </button>
      </div>

      {activeTab === "profile" ? (
        <>
          {!editingProfile ? (
            <div className="bg-white border-2 border-black p-8 shadow-[4px_4px_0px_black] rounded flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-start">
              <div className="flex gap-7 items-start">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt=""
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover border-2 border-black rounded shadow-[3px_3px_0px_black] shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#5D0CA0] border-2 border-black rounded flex items-center justify-center text-2xl sm:text-3xl text-white font-bold shadow-[3px_3px_0px_black] shrink-0">
                    {(firstName[0] || "?").toUpperCase()}
                    {(lastName[0] || "").toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold">{displayName}</h2>
                  <div className="flex flex-col sm:flex-row sm:flex-wrap mt-4 gap-4 sm:gap-10 text-gray-600 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail size={22} className="p-1 border-2 border-black rounded-[4px] shrink-0" />
                      <span>{showEmail}</span>
                    </div>
                    {phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={22} className="p-1 border-2 border-black rounded-[4px] shrink-0" />
                        <span>{phone}</span>
                      </div>
                    )}
                    {location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={22} className="p-1 border-2 border-black rounded-[4px] shrink-0" />
                        <span>{location}</span>
                      </div>
                    )}
                  </div>
                  {!phone && !location && (
                    <p className="text-sm text-gray-500 mt-3">Add phone and location when you edit your profile.</p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingProfile(true)}
                className="border-2 border-black px-4 py-2 bg-white shadow-[4px_4px_0px_black] rounded hover:translate-y-[2px] hover:shadow-none transition shrink-0"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSaveProfile}
              className="bg-white border-2 border-black p-8 shadow-[4px_4px_0px_black] rounded flex flex-col gap-5"
            >
              <h3 className="text-lg font-bold border-b-2 border-black pb-2">Edit profile</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="First name" value={firstName} onChange={setFirstName} />
                <Field label="Last name" value={lastName} onChange={setLastName} />
              </div>
              <Field label="Avatar URL" value={avatarUrl} onChange={setAvatarUrl} />
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Phone" value={phone} onChange={setPhone} />
                <Field label="Location" value={location} onChange={setLocation} />
              </div>
              <Field label="Contact email" value={contactEmail} onChange={setContactEmail} type="email" />
              <Field label="GitHub URL" value={githubUrl} onChange={setGithubUrl} />
              <Field label="Resume URL" value={resumeUrl} onChange={setResumeUrl} />
              <label className="flex flex-col gap-1">
                <span className="text-xs font-bold tracking-wide">Skills</span>
                <textarea
                  value={skillsCsv}
                  onChange={(e) => setSkillsCsv(e.target.value)}
                  className="border-2 border-black p-3 rounded min-h-[88px]"
                  placeholder="JavaScript, React, Docker, SQL…"
                  rows={3}
                />
                <span className="text-xs text-gray-500">
                  List skills separated by commas or new lines — they are stored as text on the server.
                </span>
              </label>
              <div className="flex gap-3 flex-wrap">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#5D0CA0] text-white border-2 border-black px-6 py-2 shadow-[4px_4px_0px_black] rounded disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingProfile(false);
                    if (profile) applyStudentToForm(profile);
                    setError(null);
                  }}
                  className="border-2 border-black px-6 py-2 bg-white shadow-[4px_4px_0px_black] rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <Section title="Skills" icon={Wrench}>
            {(profile?.skills?.length ?? 0) > 0 ? (
              <div className="flex flex-wrap gap-3">
                {profile!.skills!.map((skill, i) => (
                  <span
                    key={`${skill}-${i}`}
                    className="border-2 border-[#5D0CA0] text-[#5D0CA0] px-4 py-1 rounded shadow-[2px_2px_0px_black] text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">No skills yet. Add them in Edit profile.</p>
            )}
          </Section>

          <Section title="Education" icon={GraduationCap}>
            <button
              type="button"
              onClick={() => setEduOpen((v) => !v)}
              className="text-sm text-[#5D0CA0] font-semibold underline mb-4"
            >
              {eduOpen ? "Cancel" : "+ Add education"}
            </button>
            {eduOpen && (
              <EduForm
                value={eduForm}
                onChange={setEduForm}
                onSubmit={async () => {
                  await studentService.addEducation(studentId, {
                    ...eduForm,
                    startDate: new Date(eduForm.startDate).toISOString(),
                    endDate: eduForm.endDate
                      ? new Date(eduForm.endDate).toISOString()
                      : undefined,
                  });
                  setEduOpen(false);
                  setEduForm({
                    institutionName: "",
                    degree: "",
                    fieldOfStudy: "",
                    startDate: "",
                    endDate: "",
                    gpa: "",
                  });
                  await reload();
                }}
              />
            )}
            <ul className="flex flex-col gap-4">
              {(profile?.education ?? []).length > 0 ? (
                (profile?.education ?? []).map((e) => (
                  <EducationRow
                    key={e.id}
                    item={e}
                    studentId={studentId}
                    onChanged={reload}
                  />
                ))
              ) : (
                <p className="text-gray-600 text-sm border-2 border-dashed border-gray-300 rounded p-6 text-center">
                  No education entries yet.
                </p>
              )}
            </ul>
          </Section>

          <Section title="Past internships" icon={Briefcase}>
            <button
              type="button"
              onClick={() => setExpOpen((v) => !v)}
              className="text-sm text-[#5D0CA0] font-semibold underline mb-4"
            >
              {expOpen ? "Cancel" : "+ Add experience"}
            </button>
            {expOpen && (
              <ExpForm
                value={expForm}
                onChange={setExpForm}
                onSubmit={async () => {
                  await studentService.addExperience(studentId, {
                    ...expForm,
                    startDate: new Date(expForm.startDate).toISOString(),
                    endDate: expForm.endDate
                      ? new Date(expForm.endDate).toISOString()
                      : undefined,
                  });
                  setExpOpen(false);
                  setExpForm({
                    jobTitle: "",
                    companyName: "",
                    description: "",
                    startDate: "",
                    endDate: "",
                  });
                  await reload();
                }}
              />
            )}
            <ul className="flex flex-col gap-6">
              {(profile?.experience ?? []).length > 0 ? (
                (profile?.experience ?? []).map((x) => (
                  <ExperienceRow
                    key={x.id}
                    item={x}
                    studentId={studentId}
                    onChanged={reload}
                  />
                ))
              ) : (
                <p className="text-gray-600 text-sm border-2 border-dashed border-gray-300 rounded p-6 text-center">
                  No experience yet. Add roles you have held.
                </p>
              )}
            </ul>
          </Section>
        </>
      ) : (
        <div className="w-full flex justify-center px-4 sm:px-6">
          <ResumeView
            displayName={displayName}
            email={showEmail}
            phone={phone}
            location={location}
            githubUrl={githubUrl}
            resumeUrl={resumeUrl}
            profile={profile}
          />
        </div>
      )}
    </div>
  );
};

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-bold tracking-wide">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-2 border-black p-3 rounded"
      />
    </label>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border-2 border-black p-8 shadow-[4px_4px_0px_black] rounded">
      <div className="flex items-center gap-3 mb-6">
        <Icon size={28} className="p-1 border-2 border-black rounded-[4px]" />
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ResumeView({
  displayName,
  email,
  phone,
  location,
  githubUrl,
  resumeUrl,
  profile,
}: {
  displayName: string;
  email: string;
  phone: string;
  location: string;
  githubUrl: string;
  resumeUrl: string;
  profile: StudentResponse | null;
}) {
  const contactSegments: ReactNode[] = [];
  if (email) {
    contactSegments.push(
      <span key="email" className="inline-flex items-center gap-1.5 max-w-full min-w-0">
        <Mail size={16} className="shrink-0 text-gray-700" aria-hidden />
        <span className="break-all">{email}</span>
      </span>
    );
  }
  if (phone) {
    contactSegments.push(
      <span key="phone" className="inline-flex items-center gap-1.5">
        <Phone size={16} className="shrink-0 text-gray-700" aria-hidden />
        <span>{phone}</span>
      </span>
    );
  }
  if (location) {
    contactSegments.push(
      <span key="loc" className="inline-flex items-center gap-1.5 min-w-0">
        <MapPin size={16} className="shrink-0 text-gray-700" aria-hidden />
        <span className="break-words">{location}</span>
      </span>
    );
  }
  if (githubUrl) {
    contactSegments.push(
      <a
        key="gh"
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-black shrink-0"
        aria-label="GitHub profile"
      >
        <Github size={20} strokeWidth={2} />
      </a>
    );
  }
  if (resumeUrl) {
    contactSegments.push(
      <a
        key="cv"
        href={resumeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-black underline break-all"
      >
        Resume
      </a>
    );
  }

  return (
    <article
      className="bg-white border-2 border-black shadow-[4px_4px_0px_black] rounded box-border
        w-[680px] max-w-full min-h-[720px] shrink-0
        py-10 px-8 sm:px-12
        overflow-x-hidden overflow-y-visible
        break-words [word-break:break-word]"
    >
      <h1 className="text-3xl font-bold text-center break-words px-1">{displayName}</h1>
      {contactSegments.length > 0 && (
        <p className="flex flex-wrap justify-center items-center gap-x-2 gap-y-2 text-center text-gray-600 mt-3 text-sm sm:text-base px-1">
          {contactSegments.map((node, i) => (
            <Fragment key={`contact-${i}`}>
              {i > 0 && <span className="text-gray-400 select-none" aria-hidden>•</span>}
              {node}
            </Fragment>
          ))}
        </p>
      )}

      <hr className="my-8 border-black" />

      <SectionTitle title="EDUCATION" />
      {(profile?.education ?? []).length > 0 ? (
        (profile?.education ?? []).map((ed) => (
          <div key={ed.id} className="mb-8 max-w-full flex justify-between gap-6 items-start">
            <div className="min-w-0 flex-1">
              <h4 className="font-bold break-words">{ed.degree}</h4>
              <p className="text-gray-600 break-words">{ed.institutionName}</p>
              <p className="text-gray-500 text-sm mt-1 break-words">
                {ed.fieldOfStudy}
                {ed.gpa ? ` • GPA: ${ed.gpa}` : ""}
              </p>
            </div>
            <ResumeRightColumn range={formatRange(ed.startDate, ed.endDate)} />
          </div>
        ))
      ) : (
        <p className="text-gray-600 mb-8 text-sm">No education listed.</p>
      )}

      <SectionTitle title="EXPERIENCE" />
      {(profile?.experience ?? []).length > 0 ? (
        (profile?.experience ?? []).map((ex) => (
          <div key={ex.id} className="mb-6 max-w-full">
            <div className="flex justify-between gap-6 items-start">
              <div className="min-w-0 flex-1">
                <h4 className="font-bold break-words">{ex.jobTitle}</h4>
                <p className="text-gray-600 break-words">{ex.companyName}</p>
              </div>
              <ResumeRightColumn range={formatRange(ex.startDate, ex.endDate)} />
            </div>
            {ex.description && <DescriptionBullets text={ex.description} />}
          </div>
        ))
      ) : (
        <p className="text-gray-600 mb-8 text-sm">No experience listed.</p>
      )}

      <SectionTitle title="SKILLS" />
      {(profile?.skills?.length ?? 0) > 0 ? (
        <div className="text-sm text-gray-700 space-y-2">
          <p className="break-words">{(profile?.skills ?? []).join(", ")}</p>
        </div>
      ) : (
        <p className="text-sm text-gray-600">—</p>
      )}
    </article>
  );
}

const SectionTitle = ({ title }: { title: string }) => (
  <>
    <h2 className="font-bold text-lg tracking-wide">{title}</h2>
    <hr className="my-4 border-black" />
  </>
);

function EduForm({
  value,
  onChange,
  onSubmit,
}: {
  value: CreateEducationRequest;
  onChange: (v: CreateEducationRequest) => void;
  onSubmit: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="border-2 border-dashed border-black p-4 rounded mb-4 grid gap-3">
      <input
        placeholder="Institution"
        className="border-2 border-black p-2 rounded"
        value={value.institutionName}
        onChange={(e) => onChange({ ...value, institutionName: e.target.value })}
      />
      <input
        placeholder="Degree"
        className="border-2 border-black p-2 rounded"
        value={value.degree}
        onChange={(e) => onChange({ ...value, degree: e.target.value })}
      />
      <input
        placeholder="Field of study"
        className="border-2 border-black p-2 rounded"
        value={value.fieldOfStudy}
        onChange={(e) => onChange({ ...value, fieldOfStudy: e.target.value })}
      />
      <input
        placeholder="GPA"
        className="border-2 border-black p-2 rounded"
        value={value.gpa ?? ""}
        onChange={(e) => onChange({ ...value, gpa: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-2">
        <input
          type="date"
          className="border-2 border-black p-2 rounded"
          value={value.startDate}
          onChange={(e) => onChange({ ...value, startDate: e.target.value })}
        />
        <input
          type="date"
          className="border-2 border-black p-2 rounded"
          value={value.endDate}
          onChange={(e) => onChange({ ...value, endDate: e.target.value })}
        />
      </div>
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await onSubmit();
          } finally {
            setBusy(false);
          }
        }}
        className="bg-[#5D0CA0] text-white border-2 border-black px-4 py-2 rounded w-fit text-sm shadow-[3px_3px_0px_black]"
      >
        {busy ? "Saving…" : "Add"}
      </button>
    </div>
  );
}

function ExpForm({
  value,
  onChange,
  onSubmit,
}: {
  value: CreateExperienceRequest;
  onChange: (v: CreateExperienceRequest) => void;
  onSubmit: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="border-2 border-dashed border-black p-4 rounded mb-4 grid gap-3">
      <input
        placeholder="Job title"
        className="border-2 border-black p-2 rounded"
        value={value.jobTitle}
        onChange={(e) => onChange({ ...value, jobTitle: e.target.value })}
      />
      <input
        placeholder="Company"
        className="border-2 border-black p-2 rounded"
        value={value.companyName}
        onChange={(e) => onChange({ ...value, companyName: e.target.value })}
      />
      <div className="flex flex-col gap-1">
        <textarea
          placeholder="One achievement per line — each line becomes a bullet on your resume"
          className="border-2 border-black p-2 rounded font-sans"
          rows={5}
          value={value.description}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
        />
        <p className="text-xs text-gray-500">Press Enter for a new line; each line is a bullet in the resume preview.</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input
          type="date"
          className="border-2 border-black p-2 rounded"
          value={value.startDate}
          onChange={(e) => onChange({ ...value, startDate: e.target.value })}
        />
        <input
          type="date"
          className="border-2 border-black p-2 rounded"
          value={value.endDate}
          onChange={(e) => onChange({ ...value, endDate: e.target.value })}
        />
      </div>
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await onSubmit();
          } finally {
            setBusy(false);
          }
        }}
        className="bg-[#5D0CA0] text-white border-2 border-black px-4 py-2 rounded w-fit text-sm shadow-[3px_3px_0px_black]"
      >
        {busy ? "Saving…" : "Add"}
      </button>
    </div>
  );
}

function EducationRow({
  item,
  studentId,
  onChanged,
}: {
  item: EducationItem;
  studentId: string;
  onChanged: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [fields, setFields] = useState({
    institutionName: item.institutionName,
    degree: item.degree,
    fieldOfStudy: item.fieldOfStudy,
    startDate: item.startDate?.slice(0, 10) ?? "",
    endDate: item.endDate?.slice(0, 10) ?? "",
    gpa: item.gpa ?? "",
  });
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    try {
      await studentService.updateEducation(studentId, item.id, {
        institutionName: fields.institutionName,
        degree: fields.degree,
        fieldOfStudy: fields.fieldOfStudy,
        startDate: new Date(fields.startDate).toISOString(),
        endDate: fields.endDate ? new Date(fields.endDate).toISOString() : undefined,
        gpa: fields.gpa || undefined,
      });
      setEditing(false);
      await onChanged();
    } finally {
      setBusy(false);
    }
  };

  const del = async () => {
    if (!confirm("Delete this entry?")) return;
    setBusy(true);
    try {
      await studentService.deleteEducation(studentId, item.id);
      await onChanged();
    } finally {
      setBusy(false);
    }
  };

  return (
    <li className="border-2 border-black rounded p-6 shadow-[2px_2px_0px_black]">
      {editing ? (
        <div className="flex flex-col gap-2">
          <input
            className="border-2 border-black p-2 rounded"
            value={fields.institutionName}
            onChange={(e) => setFields({ ...fields, institutionName: e.target.value })}
          />
          <input
            className="border-2 border-black p-2 rounded"
            value={fields.degree}
            onChange={(e) => setFields({ ...fields, degree: e.target.value })}
          />
          <input
            className="border-2 border-black p-2 rounded"
            value={fields.fieldOfStudy}
            onChange={(e) => setFields({ ...fields, fieldOfStudy: e.target.value })}
          />
          <input
            className="border-2 border-black p-2 rounded"
            placeholder="GPA"
            value={fields.gpa}
            onChange={(e) => setFields({ ...fields, gpa: e.target.value })}
          />
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              disabled={busy}
              onClick={save}
              className="text-sm bg-[#5D0CA0] text-white px-3 py-1 rounded border-2 border-black"
            >
              Save
            </button>
            <button type="button" onClick={() => setEditing(false)} className="text-sm underline">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between gap-4 items-start">
          <div>
            <h4 className="font-bold">{item.degree}</h4>
            <p className="text-gray-600">{item.institutionName}</p>
            <p className="text-gray-500 text-sm mt-1">
              {item.fieldOfStudy}
              {item.gpa ? ` • GPA: ${item.gpa}` : ""}
              {formatRange(item.startDate, item.endDate) ? ` • ${formatRange(item.startDate, item.endDate)}` : ""}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="p-2 border-2 border-black rounded hover:bg-gray-50"
              aria-label="Edit"
            >
              <Pencil size={16} />
            </button>
            <button
              type="button"
              onClick={del}
              disabled={busy}
              className="p-2 border-2 border-red-600 text-red-600 rounded hover:bg-red-50"
              aria-label="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

function ExperienceRow({
  item,
  studentId,
  onChanged,
}: {
  item: ExperienceItem;
  studentId: string;
  onChanged: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [fields, setFields] = useState({
    jobTitle: item.jobTitle,
    companyName: item.companyName,
    description: item.description ?? "",
    startDate: item.startDate?.slice(0, 10) ?? "",
    endDate: item.endDate?.slice(0, 10) ?? "",
  });
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    try {
      await studentService.updateExperience(studentId, item.id, {
        jobTitle: fields.jobTitle,
        companyName: fields.companyName,
        description: fields.description || undefined,
        startDate: new Date(fields.startDate).toISOString(),
        endDate: fields.endDate ? new Date(fields.endDate).toISOString() : undefined,
      });
      setEditing(false);
      await onChanged();
    } finally {
      setBusy(false);
    }
  };

  const del = async () => {
    if (!confirm("Delete this entry?")) return;
    setBusy(true);
    try {
      await studentService.deleteExperience(studentId, item.id);
      await onChanged();
    } finally {
      setBusy(false);
    }
  };

  return (
    <li className="border-2 border-black rounded p-6 shadow-[2px_2px_0px_black]">
      {editing ? (
        <div className="flex flex-col gap-2">
          <input
            className="border-2 border-black p-2 rounded"
            value={fields.jobTitle}
            onChange={(e) => setFields({ ...fields, jobTitle: e.target.value })}
          />
          <input
            className="border-2 border-black p-2 rounded"
            value={fields.companyName}
            onChange={(e) => setFields({ ...fields, companyName: e.target.value })}
          />
          <div className="flex flex-col gap-1">
            <textarea
              className="border-2 border-black p-2 rounded font-sans"
              rows={5}
              placeholder="One achievement per line — each line becomes a bullet on your resume"
              value={fields.description}
              onChange={(e) => setFields({ ...fields, description: e.target.value })}
            />
            <p className="text-xs text-gray-500">Each new line shows as a bullet in the resume tab.</p>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              disabled={busy}
              onClick={save}
              className="text-sm bg-[#5D0CA0] text-white px-3 py-1 rounded border-2 border-black"
            >
              Save
            </button>
            <button type="button" onClick={() => setEditing(false)} className="text-sm underline">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between gap-4">
          <div>
            <h4 className="font-bold">{item.jobTitle}</h4>
            <p className="text-gray-600">
              {item.companyName}
              {formatRange(item.startDate, item.endDate) ? ` • ${formatRange(item.startDate, item.endDate)}` : ""}
            </p>
            {item.description && <DescriptionBullets text={item.description} className="text-gray-700" />}
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="p-2 border-2 border-black rounded h-fit hover:bg-gray-50"
              aria-label="Edit"
            >
              <Pencil size={16} />
            </button>
            <button
              type="button"
              onClick={del}
              disabled={busy}
              className="p-2 border-2 border-red-600 text-red-600 rounded h-fit hover:bg-red-50"
              aria-label="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
