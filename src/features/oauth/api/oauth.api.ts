import { httpClient } from "@/shared/api/axios";
import { oauthOrigin } from "@/shared/auth/o-auth";
import type { ApiSuccessEnvelope } from "@/shared/api/response";
import type { OAuthAuthorizeParams } from "@/shared/auth/o-auth";

/** Matches OAuth-OIDC-Guide.md 4.3 exactly: POST returns { redirect_url }. */
export interface OAuthConsentDecisionResponse {
  redirect_url: string;
}

export const oauthApi = {
  /**
   * Like every other /oauth/* endpoint, this lives at the bare,
   * unversioned origin — not under /api/v1 — so it goes through
   * `httpClient` directly with an absolute URL (overriding its
   * configured baseURL) rather than the `apiPost` helper. Unlike
   * /oauth/token & friends, this one IS enveloped (it's not in the
   * guide's list of raw-JSON exceptions), so the `.data.data` unwrap
   * still happens here, just manually.
   */
  async decide(params: OAuthAuthorizeParams, approved: boolean) {
    const { client_id, redirect_uri, code_challenge, code_challenge_method, scope, state } = params;
    const response = await httpClient.post<ApiSuccessEnvelope<OAuthConsentDecisionResponse>>(
      `${oauthOrigin}/oauth/consent/decision`,
      { client_id, redirect_uri, code_challenge, code_challenge_method, scope, state, approved },
    );
    return response.data.data;
  },
};