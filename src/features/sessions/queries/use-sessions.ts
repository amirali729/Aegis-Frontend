import { useQuery } from "@tanstack/react-query";

import { sessionsApi } from "@/features/sessions/api/sessions.api";
import { queryKeys } from "@/shared/query/query-keys";

export function useSessions() {
  return useQuery({
    queryKey: queryKeys.sessions.list,
    queryFn: () => sessionsApi.list(),
  });
}