/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_DEFAULT_TIMEZONE: string;
  readonly VITE_ENABLE_DEVTOOLS: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_DOCUMENTATION_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}