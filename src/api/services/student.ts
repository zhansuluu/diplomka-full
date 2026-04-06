import { apiClient, type RequestOptions } from "../client";
import { normalizeListPayload } from "../normalizeList";
import { unwrapEntity } from "../unwrapEntity";
import type {
  StudentResponse,
  CreateStudentRequest,
  UpdateStudentRequest,
  ListStudentsResponse,
  CreateEducationRequest,
  UpdateEducationRequest,
  EducationItem,
  CreateExperienceRequest,
  UpdateExperienceRequest,
  ExperienceItem,
  ListFollowedCompaniesResponse,
  StatusOK,
} from "../types";

/** API may send skills as strings or legacy integers — always use string[] in the app. */
function normalizeStudent(s: StudentResponse): StudentResponse {
  const skills = Array.isArray(s.skills)
    ? (s.skills as unknown[]).map((x) => String(x).trim()).filter(Boolean)
    : [];
  return { ...s, skills };
}

export const studentService = {
  // Get list of students
  listStudents: async (
    limit = 50,
    offset = 0,
    options?: RequestOptions
  ): Promise<ListStudentsResponse> => {
    const raw = await apiClient.get<unknown>(
      `/student/api/v1/students?limit=${limit}&offset=${offset}`,
      options
    );
    const list = normalizeListPayload<StudentResponse>(raw);
    return {
      ...list,
      items: list.items.map(normalizeStudent),
    };
  },

  // Create a new student
  createStudent: async (data: CreateStudentRequest): Promise<StudentResponse> => {
    const raw = await apiClient.post<unknown>("/student/api/v1/students", data, { auth: false });
    return normalizeStudent(unwrapEntity<StudentResponse>(raw));
  },

  // Get student by ID
  getStudent: async (
    id: string,
    options?: RequestOptions
  ): Promise<StudentResponse> => {
    const raw = await apiClient.get<unknown>(`/student/api/v1/students/${id}`, options);
    return normalizeStudent(unwrapEntity<StudentResponse>(raw));
  },

  // Update student
  updateStudent: async (
    id: string,
    data: UpdateStudentRequest
  ): Promise<StatusOK> => {
    return apiClient.put(`/student/api/v1/students/${id}`, data);
  },

  // Delete student
  deleteStudent: async (id: string): Promise<StatusOK> => {
    return apiClient.delete(`/student/api/v1/students/${id}`);
  },

  // Education endpoints
  addEducation: async (
    studentId: string,
    data: CreateEducationRequest
  ): Promise<EducationItem> => {
    const raw = await apiClient.post<unknown>(
      `/student/api/v1/students/${studentId}/education`,
      data
    );
    return unwrapEntity<EducationItem>(raw);
  },

  updateEducation: async (
    studentId: string,
    educationId: string,
    data: UpdateEducationRequest
  ): Promise<StatusOK> => {
    return apiClient.put(
      `/student/api/v1/students/${studentId}/education/${educationId}`,
      data
    );
  },

  deleteEducation: async (
    studentId: string,
    educationId: string
  ): Promise<StatusOK> => {
    return apiClient.delete(
      `/student/api/v1/students/${studentId}/education/${educationId}`
    );
  },

  // Experience endpoints
  addExperience: async (
    studentId: string,
    data: CreateExperienceRequest
  ): Promise<ExperienceItem> => {
    const raw = await apiClient.post<unknown>(
      `/student/api/v1/students/${studentId}/experience`,
      data
    );
    return unwrapEntity<ExperienceItem>(raw);
  },

  updateExperience: async (
    studentId: string,
    experienceId: string,
    data: UpdateExperienceRequest
  ): Promise<StatusOK> => {
    return apiClient.put(
      `/student/api/v1/students/${studentId}/experience/${experienceId}`,
      data
    );
  },

  deleteExperience: async (
    studentId: string,
    experienceId: string
  ): Promise<StatusOK> => {
    return apiClient.delete(
      `/student/api/v1/students/${studentId}/experience/${experienceId}`
    );
  },

  // Company subscription endpoints
  followCompany: async (companyId: string): Promise<StatusOK> => {
    return apiClient.post(
      `/student/api/v1/companies/${companyId}/follow`,
      {}
    );
  },

  unfollowCompany: async (companyId: string): Promise<StatusOK> => {
    return apiClient.delete(
      `/student/api/v1/companies/${companyId}/follow`
    );
  },

  getFollowedCompanies: async (
    limit = 50,
    offset = 0
  ): Promise<ListFollowedCompaniesResponse> => {
    const raw = await apiClient.get<unknown>(
      `/student/api/v1/me/followed-companies?limit=${limit}&offset=${offset}`
    );
    return normalizeListPayload(raw) as ListFollowedCompaniesResponse;
  },
};
