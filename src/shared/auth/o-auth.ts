import { env } from "@/shared/config/env";
import { localStorageHelper } from "@/shared/storage/local-storage";

/**
 * `/oauth/*` and `/.well-known/*` are mounted at the bare root of the
 * backend (no `/api/v1` prefix) — see Integration Guide §7.9. This
 * strips the versioned API path off `env.apiBaseUrl` so we can build
 * links straight to those endpoints.
 */
export const oauthOrigin = env.apiBaseUrl.replace(/\/api\/v1\/?$/, "");

export function oauthAuthorizeUrl(search: string) {
  const query = search.startsWith("?") ? search : `?${search}`;
  return `${oauthOrigin}/oauth/authorize${query}`;
}

export function buildAuthorizeUrl(params: {
  clientId: string;
  redirectUri: string;
  scope: string;
  state: string;
  codeChallenge: string;
}) {
  const search = new URLSearchParams({
    response_type: "code",
    client_id: params.clientId,
    redirect_uri: params.redirectUri,
    scope: params.scope,
    state: params.state,
    code_challenge: params.codeChallenge,
    code_challenge_method: "S256",
  });
  return `${oauthOrigin}/oauth/authorize?${search.toString()}`;
}

/**
 * The query params GET /oauth/authorize forwards along when it
 * redirects an unauthenticated or not-yet-consented browser to our
 * login/consent pages.
 */
export interface OAuthAuthorizeParams {
  response_type: string;
  client_id: string;
  redirect_uri: string;
  scope?: string;
  state?: string;
  code_challenge?: string;
  code_challenge_method?: string;
}

export function parseOAuthAuthorizeParams(
  search: string,
): OAuthAuthorizeParams | null {
  const params = new URLSearchParams(search);
  const client_id = params.get("client_id");
  const redirect_uri = params.get("redirect_uri");
  const response_type = params.get("response_type");

  if (!client_id || !redirect_uri || !response_type) return null;

  return {
    response_type,
    client_id,
    redirect_uri,
    scope: params.get("scope") ?? undefined,
    state: params.get("state") ?? undefined,
    code_challenge: params.get("code_challenge") ?? undefined,
    code_challenge_method: params.get("code_challenge_method") ?? undefined,
  };
}

/**
 * Login and signup are separate routes, and signup requires an email
 * round-trip (verify link often opened in a brand-new tab), so the
 * original `/oauth/authorize` query string doesn't survive React Router
 * navigation or a `sessionStorage`-only approach. We persist it to
 * `localStorage` instead — namespaced, with an expiry — so a visitor who
 * gets bounced from an OAuth authorize request into signup → email
 * verification → login still lands back at the client app afterwards.
 */
const PENDING_OAUTH_KEY = "pendingOAuthAuthorize";
const PENDING_OAUTH_TTL_MS = 30 * 60 * 1000; // 30 minutes

interface PendingOAuthAuthorize {
  search: string;
  expiresAt: number;
}

export function storePendingOAuthParams(search: string): void {
  if (!parseOAuthAuthorizeParams(search)) return;
  localStorageHelper.set<PendingOAuthAuthorize>(PENDING_OAUTH_KEY, {
    search: search.startsWith("?") ? search : `?${search}`,
    expiresAt: Date.now() + PENDING_OAUTH_TTL_MS,
  });
}

export function consumePendingOAuthParams(): string | null {
  const pending = localStorageHelper.get<PendingOAuthAuthorize>(PENDING_OAUTH_KEY);
  localStorageHelper.remove(PENDING_OAUTH_KEY);
  if (!pending || pending.expiresAt < Date.now()) return null;
  return pending.search;
}

export function peekPendingOAuthParams(): string | null {
  const pending = localStorageHelper.get<PendingOAuthAuthorize>(PENDING_OAUTH_KEY);
  if (!pending || pending.expiresAt < Date.now()) return null;
  return pending.search;
}

export function clearPendingOAuthParams(): void {
  localStorageHelper.remove(PENDING_OAUTH_KEY);
}