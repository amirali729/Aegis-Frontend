import { apiDelete, apiGet, apiPost } from "@/shared/api/request";
import type {
  ApiKey,
  CreateApiKeyResponse,
} from "@/features/applications/types/application.types";
import type { CreateApiKeyFormValues } from "@/features/applications/schemas/application.schemas";

export const apiKeysApi = {
  list(applicationId: string) {
    return apiGet<ApiKey[]>(`/applications/${applicationId}/api-keys`);
  },

  create(applicationId: string, body: CreateApiKeyFormValues) {
    return apiPost<CreateApiKeyResponse>(
      `/applications/${applicationId}/api-keys`,
      body,
    );
  },

  revoke(applicationId: string, keyId: string) {
    return apiDelete<{ message: string }>(
      `/applications/${applicationId}/api-keys/${keyId}`,
    );
  },
};