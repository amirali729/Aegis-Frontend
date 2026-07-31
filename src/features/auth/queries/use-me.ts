import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { authApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/store/auth-store";

export function useMe() {
  const setAuthenticated = useAuthStore(
    (state) => state.setAuthenticated,
  );

  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.me,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  useEffect(() => {
    if (!query.data) return;

    setAuthenticated({
      ...query.data.user,
      permissions: query.data.permissions,
    });
  }, [query.data, setAuthenticated]);

  return query;
}