import { apiGet, apiPost } from "@/shared/api/request";
import type {
  LoginResponse,
  Me,
  MessageResponse,
  RefreshResponse,
  SignupResponse,
} from "@/features/auth/types/auth.types";

export const authApi = {
  login(body: { username: string; password: string }) {
    return apiPost<LoginResponse>("/auth/login", body);
  },

  signup(body: { username: string; email: string; password: string }) {
    return apiPost<SignupResponse>("/auth/signup", body);
  },

  refresh() {
    return apiPost<RefreshResponse>("/auth/refresh");
  },
  me() {
    return apiGet<Me>("/auth/me")
  },
  logout() {
    return apiPost<MessageResponse>("/auth/logout");
  },

  logoutAll() {
    return apiPost<MessageResponse>("/auth/logoutAll");
  },

  verifyEmail(body: { token: string }) {
    return apiPost<MessageResponse>("/auth/verifyEmail", body);
  },

  resendVerification(body: { email: string }) {
    return apiPost<MessageResponse>("/auth/resendVerification", body);
  },

  forgotPassword(body: { email: string }) {
    return apiPost<MessageResponse>("/auth/forgotPassword", body);
  },

  resetPassword(body: {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }) {
    return apiPost<MessageResponse>("/auth/resetPassword", body);
  },

  changePassword(body: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) {
    return apiPost<MessageResponse>("/auth/changePassword", body);
  },
};