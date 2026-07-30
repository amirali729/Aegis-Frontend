import { apiDelete, apiGet } from "@/shared/api/request";
import type { SessionDto, MessageResponse } from "@/features/auth/types/auth.types";

export const sessionsApi = {
  list() {
    return apiGet<SessionDto[]>("/sessions");
  },

  revoke(sessionId: string) {
    return apiDelete<MessageResponse>(`/sessions/${sessionId}`);
  },
};