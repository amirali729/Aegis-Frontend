export interface Application {
  id: string;
  tenantId: string;
  name: string;
  clientId: string;
  allowedOrigins: string[];
  redirectUris: string[];
  accessTokenTTL: string;
  refreshTokenTTL: string;
  isActive: boolean;
  createdAt: string;
}

/** Only ever present in the single response right after creation or secret regeneration. */
export interface ApplicationSecretReveal {
  clientId: string;
  clientSecret: string;
  warning: string;
}

export type CreateApplicationResponse = Application & ApplicationSecretReveal;

export interface ApiKey {
  id: string;
  applicationId: string;
  name: string;
  keyPrefix: string;
  status: "active" | "revoked";
  expiresAt: string | null;
  lastUsedAt: string | null;
  createdAt: string;
}

/** Only present in the single response right after creation. */
export interface CreateApiKeyResponse extends ApiKey {
  key: string;
  warning: string;
}