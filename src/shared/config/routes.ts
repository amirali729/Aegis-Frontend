/**
 * Centralized route paths. Never hardcode route strings elsewhere —
 * import from here so renaming a route only requires one edit.
 */
export const ROUTES = {
  // Guest / public
  home: "/",
  login: "/login",
  signup: "/signup",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
  acceptInvite: "/accept-invite",
  oauthConsent: "/oauth/consent",

  // Protected
  dashboard: "/dashboard",
  applications: "/applications",
  applicationDetails: (id: string) => `/applications/${id}`,
  users: "/users",
  roles: "/roles",
  permissions: "/permissions",
  organizations: "/organizations",
  organizationDetails: (id: string) => `/organizations/${id}`,
  sessions: "/sessions",
  auditLogs: "/audit-logs",
  notifications: "/notifications",
  settings: "/settings",
  settingsProfile: "/settings/profile",
  settingsGeneral: "/settings/general",
  settingsSecurity: "/settings/security",
  settingsNotifications: "/settings/notifications",
  settingsAppearance: "/settings/appearance",
  settingsBilling: "/settings/billing",
  settingsAuditLogs: "/settings/audit-logs",
  settingsDataPrivacy: "/settings/data-privacy",
  settingsIntegrations: "/settings/integrations",
  settingsDeveloper: "/settings/developer",
  settingsDanger: "/settings/danger",
  // Legacy aliases, redirected in the router — kept so old links don't 404.
  settingsLocalization: "/settings/localization",
  settingsOrganization: "/settings/organization",

  // Developer
  developerSdk: "/developer/sdk",
  developerApiReference: "/developer/api-reference",
  developerWebhooks: "/developer/webhooks",
  developerOpenapi: "/developer/openapi",
  developerPostman: "/developer/postman",
  developerChangelog: "/developer/changelog",
  developerOAuthPlayground: "/developer/oauth-playground",
  developerOAuthPlaygroundCallback: "/developer/oauth-playground/callback",

  // Errors
  forbidden: "/403",
  notFound: "/404",
} as const;