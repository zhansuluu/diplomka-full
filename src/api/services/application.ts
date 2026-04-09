import {
  getApplicationById,
  listApplicationsForCompany,
  listApplicationsForStudent,
  listCandidateStudentsForCompany,
  submitApplicationLocally,
  updateApplicationStatus,
  type LocalApplication,
} from "../localDb";
import type { StudentResponse } from "../types";

export const applicationService = {
  submit: async (internshipId: string, coverLetter: string): Promise<LocalApplication> => {
    return submitApplicationLocally(internshipId, coverLetter);
  },

  listForCompany: async (companyId: string): Promise<LocalApplication[]> => {
    return listApplicationsForCompany(companyId);
  },

  listForStudent: async (studentId: string): Promise<LocalApplication[]> => {
    return listApplicationsForStudent(studentId);
  },

  getById: async (applicationId: string): Promise<LocalApplication> => {
    return getApplicationById(applicationId);
  },

  updateStatus: async (
    applicationId: string,
    status: "PENDING" | "ACCEPTED" | "REJECTED"
  ): Promise<LocalApplication> => {
    return updateApplicationStatus(applicationId, status);
  },

  listCandidatesForCompany: async (companyId: string): Promise<StudentResponse[]> => {
    return listCandidateStudentsForCompany(companyId);
  },
};
