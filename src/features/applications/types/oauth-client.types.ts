export type OAuthClientType = "confidential" | "public";
export type OAuthClientStatus = "active" | "revoked";

export interface OAuthClient {
  id: string;
  applicationId: string;
  name: string;
  clientId: string;
  clientType: OAuthClientType;
  redirectUris: string[];
  grantTypes: string[];
  scopes: string[];
  status: OAuthClientStatus;
  createdAt: string;
}

export interface OAuthClientSecretReveal {
  clientId: string;
  clientSecret: string;
  warning: string;
}

export type CreateOAuthClientResponse = OAuthClient & Partial<OAuthClientSecretReveal>;
export type RegenerateOAuthClientSecretResponse = OAuthClientSecretReveal;