import { apiPost } from "@/shared/api/request";
import type { OAuthAuthorizeParams } from "@/shared/auth/oauth";

/**
 * The Integration Guide documents this as a normal enveloped JSON
 * endpoint (it's not in the list of raw RFC-shaped exceptions like
 * /oauth/token), but doesn't pin down the exact success payload. The
 * most plausible shape for an authorization-code flow is a redirect
 * target the browser should follow next — this type covers the
 * reasonable field-name variants. Adjust once confirmed against the
 * live backend response.
 */
export interface OAuthConsentDecisionResponse {
  redirectUri?: string;
  redirect_uri?: string;
  url?: string;
}

export const oauthApi = {
  decide(params: OAuthAuthorizeParams, approved: boolean) {
    return apiPost<OAuthConsentDecisionResponse>("/oauth/consent/decision", {
      ...params,
      approved,
    });
  },
};