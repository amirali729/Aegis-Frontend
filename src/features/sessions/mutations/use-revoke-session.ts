import { useMutation, useQueryClient } from "@tanstack/react-query";

import { sessionsApi } from "@/features/sessions/api/sessions.api";
import { queryKeys } from "@/shared/query/query-keys";
import { toast } from "@/shared/lib/toast";
import { getErrorMessage } from "@/shared/errors/get-error-message";

export function useRevokeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => sessionsApi.revoke(sessionId),
    onSuccess: () => {
      toast.success("Session revoked.");
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.list });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}