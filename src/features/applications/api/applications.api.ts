import { apiDelete, apiGet, apiPatch, apiPost } from "@/shared/api/request";
import type {
  Application,
  CreateApplicationResponse,
} from "@/features/applications/types/application.types";
import type { CreateApplicationFormValues } from "@/features/applications/schemas/application.schemas";

export const applicationsApi = {
  list() {
    return apiGet<Application[]>("/applications");
  },

  get(id: string) {
    return apiGet<Application>(`/applications/${id}`);
  },

  create(body: CreateApplicationFormValues) {
    return apiPost<CreateApplicationResponse>("/applications", body);
  },

  update(id: string, body: Partial<CreateApplicationFormValues & { isActive: boolean }>) {
    return apiPatch<Application>(`/applications/${id}`, body);
  },

  remove(id: string) {
    return apiDelete<{ message: string }>(`/applications/${id}`);
  },

  regenerateSecret(id: string) {
    return apiPost<{ clientId: string; clientSecret: string; warning: string }>(
      `/applications/${id}/regenerate-secret`,
    );
  },
};