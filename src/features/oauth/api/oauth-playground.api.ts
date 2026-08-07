import { httpClient } from "@/shared/api/axios";

/**
 * These three endpoints return raw RFC 6749/7009/7662 JSON, not the
 * `{success, data, ...}` envelope the rest of the API uses (Integration
 * Guide §2), so they go straight through `httpClient` rather than the
 * `apiPost` helper, which always unwraps `.data.data`.
 *
 * Assumption to verify against the live backend: the exact request
 * content-type for /oauth/token. RFC 6749 specifies
 * `application/x-www-form-urlencoded`; this sends form-encoded to
 * match the spec exactly.
 */

export interface TokenExchangeParams {
  code: string;
  redirectUri: string;
  clientId: string;
  clientSecret?: string;
  codeVerifier: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
  refresh_token?: string;
  id_token?: string;
}

export interface OAuthErrorResponse {
  error: string;
  error_description?: string;
}

function toFormBody(fields: Record<string, string | undefined>) {
  const body = new URLSearchParams();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined) body.set(key, value);
  });
  return body;
}

async function postForm<T>(path: string, fields: Record<string, string | undefined>) {
  const response = await httpClient.post<T>(path, toFormBody(fields), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return response.data;
}

export const oauthPlaygroundApi = {
  exchangeCode(params: TokenExchangeParams) {
    return postForm<TokenResponse>("/oauth/token", {
      grant_type: "authorization_code",
      code: params.code,
      redirect_uri: params.redirectUri,
      client_id: params.clientId,
      client_secret: params.clientSecret,
      code_verifier: params.codeVerifier,
    });
  },

  refreshToken(params: { refreshToken: string; clientId: string; clientSecret?: string }) {
    return postForm<TokenResponse>("/oauth/token", {
      grant_type: "refresh_token",
      refresh_token: params.refreshToken,
      client_id: params.clientId,
      client_secret: params.clientSecret,
    });
  },

  introspect(params: { token: string; clientId: string; clientSecret?: string }) {
    return postForm<Record<string, unknown>>("/oauth/introspect", {
      token: params.token,
      client_id: params.clientId,
      client_secret: params.clientSecret,
    });
  },

  revoke(params: { token: string; clientId: string; clientSecret?: string }) {
    return postForm<void>("/oauth/revoke", {
      token: params.token,
      client_id: params.clientId,
      client_secret: params.clientSecret,
    });
  },
};