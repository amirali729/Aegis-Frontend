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
  settings: "/settings",
  settingsProfile: "/settings/profile",
  settingsSecurity: "/settings/security",
  settingsLocalization: "/settings/localization",
  settingsOrganization: "/settings/organization",

  // Developer
  developerSdk: "/developer/sdk",
  developerApiReference: "/developer/api-reference",
  developerWebhooks: "/developer/webhooks",
  developerOpenapi: "/developer/openapi",
  developerPostman: "/developer/postman",
  developerChangelog: "/developer/changelog",

  // Errors
  forbidden: "/403",
  notFound: "/404",
} as const;