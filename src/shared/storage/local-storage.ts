const NAMESPACE = "aegis";

function namespacedKey(key: string): string {
  return `${NAMESPACE}:${key}`;
}

/**
 * Type-safe wrapper around localStorage with safe JSON parsing.
 * Never call `window.localStorage` directly from feature code.
 */
export const localStorageHelper = {
  get<T>(key: string): T | null {
    try {
      const raw = window.localStorage.getItem(namespacedKey(key));
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      window.localStorage.setItem(namespacedKey(key), JSON.stringify(value));
    } catch {
      // Storage may be unavailable (private mode, quota exceeded). Fail silently;
      // the app should degrade gracefully rather than crash.
    }
  },

  remove(key: string): void {
    try {
      window.localStorage.removeItem(namespacedKey(key));
    } catch {
      // ignore
    }
  },

  clear(): void {
    try {
      Object.keys(window.localStorage)
        .filter((key) => key.startsWith(`${NAMESPACE}:`))
        .forEach((key) => window.localStorage.removeItem(key));
    } catch {
      // ignore
    }
  },
};