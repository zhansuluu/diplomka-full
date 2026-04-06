import { apiClient } from "../client";
import { normalizeListPayload } from "../normalizeList";
import { unwrapEntity } from "../unwrapEntity";
import type {
  InternshipResponse,
  CreateInternshipRequest,
  UpdateInternshipRequest,
  ListInternshipsResponse,
  StatusOK,
} from "../types";

export const internshipService = {
  // Get list of internships
  listInternships: async (
    companyId?: string,
    limit = 50,
    offset = 0
  ): Promise<ListInternshipsResponse> => {
    let endpoint = `/internship/api/v1/internships?limit=${limit}&offset=${offset}`;
    if (companyId) {
      endpoint += `&companyId=${companyId}`;
    }
    const raw = await apiClient.get<unknown>(endpoint, { auth: false });
    return normalizeListPayload<InternshipResponse>(raw);
  },

  // Create a new internship
  createInternship: async (
    data: CreateInternshipRequest
  ): Promise<InternshipResponse> => {
    const raw = await apiClient.post<unknown>("/internship/api/v1/internships", data);
    return unwrapEntity<InternshipResponse>(raw);
  },

  // Get internship by ID
  getInternship: async (id: string): Promise<InternshipResponse> => {
    const raw = await apiClient.get<unknown>(`/internship/api/v1/internships/${id}`, { auth: false });
    return unwrapEntity<InternshipResponse>(raw);
  },

  // Update internship
  updateInternship: async (
    id: string,
    data: UpdateInternshipRequest
  ): Promise<StatusOK> => {
    return apiClient.put(`/internship/api/v1/internships/${id}`, data);
  },

  // Delete internship
  deleteInternship: async (id: string): Promise<StatusOK> => {
    return apiClient.delete(`/internship/api/v1/internships/${id}`);
  },
};
