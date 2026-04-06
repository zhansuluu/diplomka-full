import { apiClient, type RequestOptions } from "../client";
import { normalizeListPayload } from "../normalizeList";
import { unwrapEntity } from "../unwrapEntity";
import type {
  CompanyResponse,
  CreateCompanyRequest,
  UpdateCompanyRequest,
  ListCompaniesResponse,
  ListCompanyFollowersResponse,
  StatusOK,
} from "../types";

export const companyService = {
  // Get list of companies
  listCompanies: async (
    limit = 50,
    offset = 0,
    options?: RequestOptions
  ): Promise<ListCompaniesResponse> => {
    const raw = await apiClient.get<unknown>(
      `/company/api/v1/companies?limit=${limit}&offset=${offset}`,
      options
    );
    return normalizeListPayload<CompanyResponse>(raw);
  },

  // Create a new company
  createCompany: async (data: CreateCompanyRequest): Promise<CompanyResponse> => {
    const raw = await apiClient.post<unknown>("/company/api/v1/companies", data, { auth: false });
    return unwrapEntity<CompanyResponse>(raw);
  },

  // Get company by ID
  getCompany: async (
    id: string,
    options?: RequestOptions
  ): Promise<CompanyResponse> => {
    const raw = await apiClient.get<unknown>(`/company/api/v1/companies/${id}`, options);
    return unwrapEntity<CompanyResponse>(raw);
  },

  // Update company
  updateCompany: async (
    id: string,
    data: UpdateCompanyRequest
  ): Promise<StatusOK> => {
    return apiClient.put(`/company/api/v1/companies/${id}`, data);
  },

  // Delete company
  deleteCompany: async (id: string): Promise<StatusOK> => {
    return apiClient.delete(`/company/api/v1/companies/${id}`);
  },

  // Get company followers
  getFollowers: async (
    id: string,
    limit = 50,
    offset = 0
  ): Promise<ListCompanyFollowersResponse> => {
    const raw = await apiClient.get<unknown>(
      `/company/api/v1/companies/${id}/followers?limit=${limit}&offset=${offset}`
    );
    return normalizeListPayload(raw) as ListCompanyFollowersResponse;
  },

};
