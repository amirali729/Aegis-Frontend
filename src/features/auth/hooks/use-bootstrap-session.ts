import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { authApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { queryKeys } from "@/shared/query/query-keys";

/**
 * Validates the httpOnly session cookie on app load via GET /auth/me and
 * refreshes the cached user's permissions[] at the same time — the
 * canonical pattern from the architecture doc's "Authorization Flow"
 * (Backend → GET /auth/me → permissions[] → Frontend Store).
 *
 * A 401 here is handled by the axios refresh interceptor automatically;
 * if that also fails, `auth:session-expired` fires and clears the store
 * (see use-session-expired-listener.ts).
 */
export function useBootstrapSession() {
  const user = useAuthStore((state) => state.user);
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const setUnauthenticated = useAuthStore((state) => state.setUnauthenticated);
  const status = useAuthStore((state) => state.status);

  const query = useQuery({
    queryKey: queryKeys.auth.session,
    queryFn: () => authApi.me(),
    enabled: Boolean(user) && status === "idle",
    retry: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!user) {
      useAuthStore.setState({ status: "unauthenticated" });
      return;
    }
    if (query.data) {
      setAuthenticated({ ...query.data.user, permissions: query.data.permissions });
    }
    if (query.isError) {
      setUnauthenticated();
    }
  }, [user, query.data, query.isError, setAuthenticated, setUnauthenticated]);

  return {
    isBootstrapping: Boolean(user) && status === "idle" && query.isPending,
  };
}