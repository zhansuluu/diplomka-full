import { apiClient } from "../client";
import type { LoginRequest, LoginResponse } from "../types";

/** Backend may return `{ code, data: { accessToken, ... }, message }`. */
function unwrapDataEnvelope(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== "object") return {};
  const root = raw as Record<string, unknown>;
  const inner = root.data ?? root.Data;
  if (inner && typeof inner === "object" && !Array.isArray(inner)) {
    return inner as Record<string, unknown>;
  }
  return root;
}

function normalizeLoginResponse(raw: unknown): LoginResponse {
  const o = unwrapDataEnvelope(raw);
  const accessToken =
    (typeof o.accessToken === "string" && o.accessToken) ||
    (typeof o.access_token === "string" && o.access_token) ||
    (typeof o.AccessToken === "string" && o.AccessToken) ||
    "";
  const tokenType =
    (typeof o.tokenType === "string" && o.tokenType) ||
    (typeof o.token_type === "string" && o.token_type) ||
    (typeof o.TokenType === "string" && o.TokenType) ||
    "Bearer";
  let expiresIn = 0;
  const e = o.expiresIn ?? o.expires_in ?? o.ExpiresIn;
  if (typeof e === "number") expiresIn = e;
  else if (typeof e === "string") expiresIn = parseInt(e, 10) || 0;
  return { accessToken, tokenType, expiresIn };
}

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const raw = await apiClient.post<unknown>("/auth/api/v1/login", data, { auth: false });
    const res = normalizeLoginResponse(raw);
    if (!res.accessToken) {
      throw new Error("Login response did not include an access token.");
    }
    return res;
  },

  logout: () => {
    apiClient.clearToken();
  },

  getToken: () => {
    return apiClient.getToken();
  },

  setToken: (token: string) => {
    apiClient.setToken(token);
  },
};
