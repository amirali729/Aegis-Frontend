const PREFIX = "aegis:oauth-playground:";

export interface PlaygroundConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string;
}

export const playgroundStorage = {
  saveFlow(config: PlaygroundConfig, verifier: string, state: string) {
    sessionStorage.setItem(`${PREFIX}config`, JSON.stringify(config));
    sessionStorage.setItem(`${PREFIX}verifier`, verifier);
    sessionStorage.setItem(`${PREFIX}state`, state);
    sessionStorage.removeItem(`${PREFIX}code`);
    sessionStorage.removeItem(`${PREFIX}callback-error`);
  },

  loadConfig(): PlaygroundConfig | null {
    const raw = sessionStorage.getItem(`${PREFIX}config`);
    return raw ? (JSON.parse(raw) as PlaygroundConfig) : null;
  },

  loadVerifier(): string | null {
    return sessionStorage.getItem(`${PREFIX}verifier`);
  },

  loadState(): string | null {
    return sessionStorage.getItem(`${PREFIX}state`);
  },

  saveCode(code: string) {
    sessionStorage.setItem(`${PREFIX}code`, code);
  },

  loadCode(): string | null {
    return sessionStorage.getItem(`${PREFIX}code`);
  },

  clearCode() {
    sessionStorage.removeItem(`${PREFIX}code`);
  },

  saveCallbackError(error: string) {
    sessionStorage.setItem(`${PREFIX}callback-error`, error);
  },

  loadCallbackError(): string | null {
    return sessionStorage.getItem(`${PREFIX}callback-error`);
  },

  clearCallbackError() {
    sessionStorage.removeItem(`${PREFIX}callback-error`);
  },
};