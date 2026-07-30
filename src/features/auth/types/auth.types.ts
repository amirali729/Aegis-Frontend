export interface AuthUser {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  /** Flat permission-key array, hydrated client-side after login for UX permission checks. */
  permissions: string[];
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  message: string;
}

export interface SignupResponse {
  user: Omit<AuthUser, "permissions">;
  message: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  message: string;
}

export interface MessageResponse {
  message: string;
}

export interface SessionDto {
  id: string;
  deviceName: string;
  userAgent: string;
  ipAddress: string;
  lastActiveAt: string;
  createdAt: string;
  isCurrent: boolean;
}