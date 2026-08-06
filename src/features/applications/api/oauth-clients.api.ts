import { apiDelete, apiGet, apiPost } from "@/shared/api/request";
import type {
  CreateOAuthClientResponse,
  OAuthClient,
  RegenerateOAuthClientSecretResponse,
} from "@/features/applications/types/oauth-client.types";
import type { CreateOAuthClientFormValues } from "@/features/applications/schemas/application.schemas";

export const oauthClientsApi = {
  list(applicationId: string) {
    return apiGet<OAuthClient[]>(`/applications/${applicationId}/oauth-clients`);
  },

  create(applicationId: string, body: CreateOAuthClientFormValues) {
    return apiPost<CreateOAuthClientResponse>(
      `/applications/${applicationId}/oauth-clients`,
      {
        ...body,
        // PKCE-only authorization code flow, matching the mandatory S256
        // requirement documented for the authorize endpoint.
        grantTypes: ["authorization_code", "refresh_token"],
      },
    );
  },

  regenerateSecret(applicationId: string, clientId: string) {
    return apiPost<RegenerateOAuthClientSecretResponse>(
      `/applications/${applicationId}/oauth-clients/${clientId}/regenerate-secret`,
    );
  },

  revoke(applicationId: string, clientId: string) {
    return apiDelete<{ message: string }>(
      `/applications/${applicationId}/oauth-clients/${clientId}`,
    );
  },
};