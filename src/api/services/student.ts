import {
  addEducationToStudent,
  addExperienceToStudent,
  createLocalStudent,
  deleteStudentEducation,
  deleteStudentExperience,
  followCompanyLocally,
  getStudentFromDb,
  listFollowedCompaniesForStudent,
  listStudentsFromDb,
  requireCurrentStudentId,
  unfollowCompanyLocally,
  updateLocalStudent,
  updateStudentEducation,
  updateStudentExperience,
} from "../localDb";
import type {
  CreateEducationRequest,
  CreateExperienceRequest,
  CreateStudentRequest,
  EducationItem,
  ExperienceItem,
  ListFollowedCompaniesResponse,
  ListStudentsResponse,
  StatusOK,
  StudentResponse,
  UpdateEducationRequest,
  UpdateExperienceRequest,
  UpdateStudentRequest,
} from "../types";

export const studentService = {
  listStudents: async (
    limit = 50,
    offset = 0
  ): Promise<ListStudentsResponse> => {
    const all = listStudentsFromDb();
    return {
      items: all.slice(offset, offset + limit),
      total: all.length,
    };
  },

  createStudent: async (data: CreateStudentRequest): Promise<StudentResponse> => {
    return createLocalStudent(data);
  },

  getStudent: async (id: string): Promise<StudentResponse> => {
    return getStudentFromDb(id);
  },

  updateStudent: async (
    id: string,
    data: UpdateStudentRequest
  ): Promise<StatusOK> => {
    updateLocalStudent(id, data);
    return { status: "ok" };
  },

  deleteStudent: async (): Promise<StatusOK> => {
    throw new Error("Deleting students is disabled in local demo mode.");
  },

  addEducation: async (
    studentId: string,
    data: CreateEducationRequest
  ): Promise<EducationItem> => {
    return addEducationToStudent(studentId, data);
  },

  updateEducation: async (
    studentId: string,
    educationId: string,
    data: UpdateEducationRequest
  ): Promise<StatusOK> => {
    updateStudentEducation(studentId, educationId, data);
    return { status: "ok" };
  },

  deleteEducation: async (
    studentId: string,
    educationId: string
  ): Promise<StatusOK> => {
    deleteStudentEducation(studentId, educationId);
    return { status: "ok" };
  },

  addExperience: async (
    studentId: string,
    data: CreateExperienceRequest
  ): Promise<ExperienceItem> => {
    return addExperienceToStudent(studentId, data);
  },

  updateExperience: async (
    studentId: string,
    experienceId: string,
    data: UpdateExperienceRequest
  ): Promise<StatusOK> => {
    updateStudentExperience(studentId, experienceId, data);
    return { status: "ok" };
  },

  deleteExperience: async (
    studentId: string,
    experienceId: string
  ): Promise<StatusOK> => {
    deleteStudentExperience(studentId, experienceId);
    return { status: "ok" };
  },

  followCompany: async (companyId: string): Promise<StatusOK> => {
    const studentId = requireCurrentStudentId();
    followCompanyLocally(studentId, companyId);
    return { status: "ok" };
  },

  unfollowCompany: async (companyId: string): Promise<StatusOK> => {
    const studentId = requireCurrentStudentId();
    unfollowCompanyLocally(studentId, companyId);
    return { status: "ok" };
  },

  getFollowedCompanies: async (
    limit = 50,
    offset = 0
  ): Promise<ListFollowedCompaniesResponse> => {
    const studentId = requireCurrentStudentId();
    const items = listFollowedCompaniesForStudent(studentId);
    return {
      items: items.slice(offset, offset + limit),
      total: items.length,
    };
  },
};
