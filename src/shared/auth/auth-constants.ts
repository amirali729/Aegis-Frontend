/**
 * Auth uses httpOnly cookies (accessToken/refreshToken) as the primary
 * session mechanism — the frontend never reads or stores those tokens
 * itself; the browser attaches them automatically on credentialed requests.
 *
 * The only thing the frontend persists locally is the last-known user
 * object, purely so the UI can rehydrate instantly on page load while
 * the session is silently validated in the background.
 */
export const AUTH_STORAGE_KEY = "auth-user";