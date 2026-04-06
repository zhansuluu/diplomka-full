// Auth DTOs
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

// Company DTOs
export interface CompanyResponse {
  id: string;
  companyName: string;
  email: string;
  description: string;
  industry: string;
  headquarters: string;
  foundedYear: number;
  companySize: string;
  websiteUrl: string;
  logoUrl: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  focusAreas: string[];
  createdAt: string;
}

export interface CreateCompanyRequest {
  email: string;
  password: string;
  companyName: string;
  description: string;
  industry: string;
  headquarters: string;
  foundedYear: number;
  companySize: string;
  websiteUrl: string;
  logoUrl?: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  focusAreas: string[];
}

export interface UpdateCompanyRequest {
  companyName?: string;
  description?: string;
  industry?: string;
  headquarters?: string;
  foundedYear?: number;
  companySize?: string;
  websiteUrl?: string;
  logoUrl?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  focusAreas?: string[];
  email?: string;
  password?: string;
}

export interface ListCompaniesResponse {
  items: CompanyResponse[];
  total: number;
}

export interface CompanyFollowerItem {
  studentId: string;
  firstName: string;
  lastName: string;
  followedAt: string;
}

export interface ListCompanyFollowersResponse {
  items: CompanyFollowerItem[];
  total: number;
}

// Student DTOs
export interface StudentResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  contactEmail?: string;
  phone?: string;
  location?: string;
  resumeUrl?: string;
  githubUrl?: string;
  /** Skill names (strings). If the API still returns numbers, normalize when reading. */
  skills: string[];
  education: EducationItem[];
  experience: ExperienceItem[];
  createdAt: string;
}

export interface CreateStudentRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  contactEmail?: string;
  phone?: string;
  location?: string;
  resumeUrl?: string;
  githubUrl?: string;
  skills?: string[];
}

export interface UpdateStudentRequest {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  contactEmail?: string;
  phone?: string;
  location?: string;
  resumeUrl?: string;
  githubUrl?: string;
  skills?: string[];
  email?: string;
  password?: string;
}

export interface ListStudentsResponse {
  items: StudentResponse[];
  total: number;
}

// Education DTOs
export interface EducationItem {
  id: string;
  institutionName: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  createdAt: string;
}

export interface CreateEducationRequest {
  institutionName: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
}

export interface UpdateEducationRequest {
  institutionName?: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  gpa?: string;
}

// Experience DTOs
export interface ExperienceItem {
  id: string;
  jobTitle: string;
  companyName: string;
  description?: string;
  startDate: string;
  endDate?: string;
  createdAt: string;
}

export interface CreateExperienceRequest {
  jobTitle: string;
  companyName: string;
  description?: string;
  startDate: string;
  endDate?: string;
}

export interface UpdateExperienceRequest {
  jobTitle?: string;
  companyName?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

// Internship DTOs
export interface InternshipResponse {
  id: string;
  companyId: string;
  title: string;
  description: string;
  requirements: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInternshipRequest {
  companyId: string;
  title: string;
  description: string;
  requirements: string;
  startDate: string;
  endDate: string;
}

export interface UpdateInternshipRequest {
  title?: string;
  description?: string;
  requirements?: string;
  startDate?: string;
  endDate?: string;
}

export interface ListInternshipsResponse {
  items: InternshipResponse[];
  total: number;
}

// Followed Companies
export interface FollowedCompanyItem {
  companyId: string;
  companyName: string;
  industry: string;
  logoUrl?: string;
  followedAt: string;
}

export interface ListFollowedCompaniesResponse {
  items: FollowedCompanyItem[];
  total: number;
}

// Generic Responses
export interface StatusOK {
  status: string;
}

// Error Response
export interface ErrorResponse {
  error?: string;
  message?: string;
}
