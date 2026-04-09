import {
  createLocalInternship,
  deleteLocalInternship,
  getInternshipFromDb,
  listInternshipsFromDb,
  updateLocalInternship,
} from "../localDb";
import type {
  CreateInternshipRequest,
  InternshipResponse,
  ListInternshipsResponse,
  StatusOK,
  UpdateInternshipRequest,
} from "../types";

export const internshipService = {
  listInternships: async (
    companyId?: string,
    limit = 50,
    offset = 0
  ): Promise<ListInternshipsResponse> => {
    const all = listInternshipsFromDb();
    const filtered = companyId ? all.filter((item) => item.companyId === companyId) : all;
    return {
      items: filtered.slice(offset, offset + limit),
      total: filtered.length,
    };
  },

  createInternship: async (
    data: CreateInternshipRequest
  ): Promise<InternshipResponse> => {
    return createLocalInternship(data);
  },

  getInternship: async (id: string): Promise<InternshipResponse> => {
    return getInternshipFromDb(id);
  },

  updateInternship: async (
    id: string,
    data: UpdateInternshipRequest
  ): Promise<StatusOK> => {
    updateLocalInternship(id, data);
    return { status: "ok" };
  },

  deleteInternship: async (id: string): Promise<StatusOK> => {
    deleteLocalInternship(id);
    return { status: "ok" };
  },
};
