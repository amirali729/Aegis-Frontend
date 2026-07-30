import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "@/features/auth/store/auth-store";
import { queryClient } from "@/shared/query/query-client";
import { ROUTES } from "@/shared/config/routes";

/**
 * Bridges the imperative `auth:session-expired` CustomEvent dispatched
 * by the axios response interceptor (shared/api/axios.ts) into React
 * state: clears the auth store + query cache and redirects to login.
 * Mount this once, near the root of the router.
 */
export function useSessionExpiredListener() {
  const setUnauthenticated = useAuthStore((state) => state.setUnauthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    function handleSessionExpired() {
      setUnauthenticated();
      queryClient.clear();
      navigate(ROUTES.login, { replace: true });
    }

    window.addEventListener("auth:session-expired", handleSessionExpired);
    return () =>
      window.removeEventListener("auth:session-expired", handleSessionExpired);
  }, [navigate, setUnauthenticated]);
}