import { create } from "zustand";

import { authStorage } from "@/shared/auth/auth-storage";
import type { AuthUser } from "@/features/auth/types/auth.types";

export type AuthStatus = "idle" | "authenticated" | "unauthenticated";

interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
  setAuthenticated: (user: AuthUser) => void;
  setUnauthenticated: () => void;
  updateUser: (patch: Partial<AuthUser>) => void;
}

/**
 * Client-only auth state. This store never fetches or caches server
 * data itself — it's populated by the auth mutations/bootstrap hook
 * and read by route guards and permission checks (see 04-Authentication-and-State.md §7).
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  user: authStorage.getUser<AuthUser>(),
  status: "idle",

  setAuthenticated: (user) => {
    authStorage.setUser(user);
    set({ user, status: "authenticated" });
  },

  setUnauthenticated: () => {
    authStorage.clearUser();
    set({ user: null, status: "unauthenticated" });
  },

  updateUser: (patch) => {
    const current = get().user;
    if (!current) return;
    const updated = { ...current, ...patch };
    authStorage.setUser(updated);
    set({ user: updated });
  },
}));

export function getAuthUser(): AuthUser | null {
  return useAuthStore.getState().user;
}