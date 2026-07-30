import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { sessionsApi } from "@/features/sessions/api/sessions.api";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { queryKeys } from "@/shared/query/query-keys";

/**
 * There is no `GET /auth/me` endpoint — the user object only comes back
 * from login/signup. On page reload we optimistically show the cached
 * user (see auth-store) but must still confirm the httpOnly session
 * cookie is actually valid, so we probe a lightweight authenticated
 * endpoint. A 401 here is handled by the axios refresh interceptor
 * automatically; if that also fails, `auth:session-expired` fires and
 * clears the store (see use-session-expired-listener.ts).
 */
export function useBootstrapSession() {
  const user = useAuthStore((state) => state.user);
  const setUnauthenticated = useAuthStore((state) => state.setUnauthenticated);
  const status = useAuthStore((state) => state.status);

  const query = useQuery({
    queryKey: queryKeys.auth.session,
    queryFn: () => sessionsApi.list(),
    enabled: Boolean(user) && status === "idle",
    retry: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!user) {
      useAuthStore.setState({ status: "unauthenticated" });
      return;
    }
    if (query.isSuccess) {
      useAuthStore.setState({ status: "authenticated" });
    }
    if (query.isError) {
      setUnauthenticated();
    }
  }, [user, query.isSuccess, query.isError, setUnauthenticated]);

  return {
    isBootstrapping: Boolean(user) && status === "idle" && query.isPending,
  };
}