import {
  getTaskSubmissionById,
  getTaskSubmissionForStudentTask,
  listTaskSubmissionsForCompany,
  listTaskSubmissionsForStudent,
  submitTaskSubmissionLocally,
  updateTaskSubmissionStatus,
  type LocalTaskSubmission,
} from "../localDb";

export const taskSubmissionService = {
  submit: async (input: {
    internshipId: string;
    taskId: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    fileDataUrl?: string;
  }): Promise<LocalTaskSubmission> => {
    return submitTaskSubmissionLocally(input);
  },

  listForCompany: async (companyId: string): Promise<LocalTaskSubmission[]> => {
    return listTaskSubmissionsForCompany(companyId);
  },

  listForStudent: async (studentId: string): Promise<LocalTaskSubmission[]> => {
    return listTaskSubmissionsForStudent(studentId);
  },

  getById: async (submissionId: string): Promise<LocalTaskSubmission> => {
    return getTaskSubmissionById(submissionId);
  },

  getForStudentTask: async (
    studentId: string,
    internshipId: string,
    taskId: string
  ): Promise<LocalTaskSubmission | null> => {
    return getTaskSubmissionForStudentTask(studentId, internshipId, taskId);
  },

  updateStatus: async (
    submissionId: string,
    status: "PENDING" | "APPROVED" | "REJECTED"
  ): Promise<LocalTaskSubmission> => {
    return updateTaskSubmissionStatus(submissionId, status);
  },
};
