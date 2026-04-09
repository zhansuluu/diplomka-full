import { createLocalAccessToken, findUserByEmail } from "../localDb";
import type { LoginRequest, LoginResponse } from "../types";

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const email = data.email.trim().toLowerCase();
    const user = findUserByEmail(email);

    if (!user || user.password !== data.password) {
      throw new Error("Invalid email or password.");
    }

    const accessToken = createLocalAccessToken(user);
    return {
      accessToken,
      tokenType: "Bearer",
      expiresIn: 60 * 60 * 24 * 7,
    };
  },

  logout: () => {
    localStorage.removeItem("accessToken");
  },

  getToken: () => {
    return localStorage.getItem("accessToken");
  },

  setToken: (token: string) => {
    localStorage.setItem("accessToken", token);
  },
};
