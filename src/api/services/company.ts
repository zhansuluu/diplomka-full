import {
  createLocalCompany,
  getCompanyFromDb,
  listCompaniesFromDb,
  listFollowersForCompany,
  updateLocalCompany,
} from "../localDb";
import type {
  CompanyResponse,
  CreateCompanyRequest,
  ListCompaniesResponse,
  ListCompanyFollowersResponse,
  StatusOK,
  UpdateCompanyRequest,
} from "../types";

export const companyService = {
  listCompanies: async (
    limit = 50,
    offset = 0
  ): Promise<ListCompaniesResponse> => {
    const items = listCompaniesFromDb().slice(offset, offset + limit);
    return {
      items,
      total: listCompaniesFromDb().length,
    };
  },

  createCompany: async (data: CreateCompanyRequest): Promise<CompanyResponse> => {
    return createLocalCompany(data);
  },

  getCompany: async (id: string): Promise<CompanyResponse> => {
    return getCompanyFromDb(id);
  },

  updateCompany: async (
    id: string,
    data: UpdateCompanyRequest
  ): Promise<StatusOK> => {
    updateLocalCompany(id, data);
    return { status: "ok" };
  },

  deleteCompany: async (): Promise<StatusOK> => {
    throw new Error("Deleting companies is disabled in local demo mode.");
  },

  getFollowers: async (
    id: string,
    limit = 50,
    offset = 0
  ): Promise<ListCompanyFollowersResponse> => {
    const items = listFollowersForCompany(id);
    return {
      items: items.slice(offset, offset + limit),
      total: items.length,
    };
  },
};
