import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes";
import { Spinner } from "@/shared/components/ui/spinner";
import { ComingSoonPage } from "@/shared/components/coming-soon-page";
import { RootLayout } from "@/app/root-layout";
import { AuthLayout } from "@/layouts/auth-layout";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { GuestRoute } from "@/routes/guest-route";
import { ProtectedRoute } from "@/routes/protected-route";
import { PermissionRoute } from "@/routes/permission-routes";
import NotFoundPage from "@/routes/not-found-page";
import ForbiddenPage from "@/routes/forbidden-page";
import { PLATFORM_ADMIN_PERMISSION } from "@/features/admin/constants/admin-permissions";
import { AdminLayout } from "@/features/admin/layout/admin-layout";
import { ADMIN_NAV_FLAT_ITEMS } from "@/features/admin/layout/admin-nav-items";
import {
  ROLE_VIEW_PERMISSION,
  PERMISSION_VIEW_PERMISSION,
  ORGANIZATION_VIEW_PERMISSION,
  AUDIT_VIEW_PERMISSION,
} from "@/shared/permissions/route-permissions";

const LoginPage = lazy(() => import("@/features/auth/pages/login-page"));
const LandingPage = lazy(() => import("@/features/landing/pages/landing-page"));
const OAuthConsentPage = lazy(() => import("@/features/oauth/pages/oauth-consent-page"));
const OAuthPlaygroundPage = lazy(
  () => import("@/features/oauth/pages/oauth-playground-page"),
);
const OAuthPlaygroundCallbackPage = lazy(
  () => import("@/features/oauth/pages/oauth-playground-callback-page"),
);const SignupPage = lazy(() => import("@/features/auth/pages/signup-page"));
const ForgotPasswordPage = lazy(
  () => import("@/features/auth/pages/forgot-password-page"),
);
const ResetPasswordPage = lazy(
  () => import("@/features/auth/pages/reset-password-page"),
);
const VerifyEmailPage = lazy(
  () => import("@/features/auth/pages/verify-email-page"),
);
const DashboardPage = lazy(
  () => import("@/features/dashboard/pages/dashboard-page"),
);
const SessionsPage = lazy(
  () => import("@/features/sessions/pages/sessions-page"),
);
const SettingsLayout = lazy(() => import("@/features/settings/settings-layout"));
const ProfileSettingsPage = lazy(
  () => import("@/features/settings/pages/profile-settings-page"),
);
const GeneralSettingsPage = lazy(
  () => import("@/features/settings/pages/general-settings-page"),
);
const SecuritySettingsPage = lazy(
  () => import("@/features/settings/pages/security-settings-page"),
);
const NotificationsSettingsPage = lazy(
  () => import("@/features/settings/pages/notifications-settings-page"),
);
const AppearanceSettingsPage = lazy(
  () => import("@/features/settings/pages/appearance-settings-page"),
);
const BillingSettingsPage = lazy(
  () => import("@/features/settings/pages/billing-settings-page"),
);
const AuditLogsSettingsPage = lazy(
  () => import("@/features/settings/pages/audit-logs-settings-page"),
);
const DataPrivacySettingsPage = lazy(
  () => import("@/features/settings/pages/data-privacy-settings-page"),
);
const IntegrationsSettingsPage = lazy(
  () => import("@/features/settings/pages/integrations-settings-page"),
);
const DeveloperSettingsPage = lazy(
  () => import("@/features/settings/pages/developer-settings-page"),
);
const DangerZoneSettingsPage = lazy(
  () => import("@/features/settings/pages/danger-zone-settings-page"),
);
const ApplicationsPage = lazy(
  () => import("@/features/applications/pages/applications-page"),
);
const ApplicationDetailsPage = lazy(
  () => import("@/features/applications/pages/application-details-page"),
);
const RolesPage = lazy(() => import("@/features/roles/pages/roles-page"));
const PermissionsPage = lazy(
  () => import("@/features/permissions/pages/permissions-page"),
);
const OrganizationsPage = lazy(
  () => import("@/features/organizations/pages/organizations-page"),
);
const OrganizationDetailsPage = lazy(
  () => import("@/features/organizations/pages/organization-details-page"),
);
const AcceptInvitePage = lazy(
  () => import("@/features/organizations/pages/accept-invite-page"),
);
const AuditLogsPage = lazy(
  () => import("@/features/audit-logs/pages/audit-logs-page"),
);
const NotificationsPage = lazy(
  () => import("@/features/notifications/pages/notifications-page"),
);
const SdkPage = lazy(() => import("@/features/developer/sdk/pages/sdk-page"));
const WebhooksPage = lazy(() => import("@/features/webhooks/pages/webhooks-page"));
const ChangelogPage = lazy(
  () => import("@/features/developer/changelog/pages/changelog-page"),
);
const ChangelogDetailPage = lazy(
  () => import("@/features/developer/changelog/pages/changelog-detail-page"),
);
const AdminOverviewPage = lazy(() => import("@/features/admin/pages/admin-overview-page"));
const AdminUsersPage = lazy(() => import("@/features/admin/pages/admin-users-page"));
const AdminApplicationsPage = lazy(() => import("@/features/admin/pages/admin-applications-page"));
const AdminApiKeysPage = lazy(() => import("@/features/admin/pages/admin-api-keys-page"));
const AdminSessionsPage = lazy(() => import("@/features/admin/pages/admin-sessions-page"));
const AdminSystemSettingsPage = lazy(
  () => import("@/features/admin/pages/admin-system-settings-page"),
);

function withSuspense(element: React.ReactNode) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Spinner className="size-8" />
        </div>
      }
    >
      {element}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        // Public marketing home — reachable regardless of auth status,
        // its own navbar adapts the CTA if the visitor is signed in.
        path: ROUTES.home,
        element: withSuspense(<LandingPage />),
      },
      {
        element: <GuestRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              { path: ROUTES.login, element: withSuspense(<LoginPage />) },
              { path: ROUTES.signup, element: withSuspense(<SignupPage />) },
              {
                path: ROUTES.forgotPassword,
                element: withSuspense(<ForgotPasswordPage />),
              },
            ],
          },
        ],
      },
      {
        // Reachable regardless of auth status — a logged-in user clicking
        // an old reset/verify link should still be able to complete the flow.
        element: <AuthLayout />,
        children: [
          {
            path: ROUTES.resetPassword,
            element: withSuspense(<ResetPasswordPage />),
          },
          {
            path: ROUTES.verifyEmail,
            element: withSuspense(<VerifyEmailPage />),
          },
          {
            path: ROUTES.acceptInvite,
            element: withSuspense(<AcceptInvitePage />),
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            // Standalone — must be logged in, but rendered without the
            // dashboard chrome since it's a third-party-facing screen.
            path: ROUTES.oauthConsent,
            element: withSuspense(<OAuthConsentPage />),
          },
          {
            path: ROUTES.developerOAuthPlaygroundCallback,
            element: withSuspense(<OAuthPlaygroundCallbackPage />),
          },
          {
            element: <DashboardLayout />,
            children: [
              {
                path: ROUTES.dashboard,
                element: withSuspense(<DashboardPage />),
              },
              {
                path: ROUTES.applications,
                element: withSuspense(<ApplicationsPage />),
              },
              {
                path: "applications/:id",
                element: withSuspense(<ApplicationDetailsPage />),
              },
              {
                element: <PermissionRoute permission={ROLE_VIEW_PERMISSION} />,
                children: [{ path: ROUTES.roles, element: withSuspense(<RolesPage />) }],
              },
              {
                element: <PermissionRoute permission={PERMISSION_VIEW_PERMISSION} />,
                children: [
                  { path: ROUTES.permissions, element: withSuspense(<PermissionsPage />) },
                ],
              },
              {
                element: <PermissionRoute permission={ORGANIZATION_VIEW_PERMISSION} />,
                children: [
                  {
                    path: ROUTES.organizations,
                    element: withSuspense(<OrganizationsPage />),
                  },
                  {
                    path: "organizations/:id",
                    element: withSuspense(<OrganizationDetailsPage />),
                  },
                ],
              },
              {
                // Self-scoped on the backend (SessionController.list
                // calls listByUser with the caller's own id, no
                // permission check) — matches nav-items.ts having no
                // `permission` field here. Auth-only is correct.
                path: ROUTES.sessions,
                element: withSuspense(<SessionsPage />),
              },
              {
                element: <PermissionRoute permission={AUDIT_VIEW_PERMISSION} />,
                children: [
                  { path: ROUTES.auditLogs, element: withSuspense(<AuditLogsPage />) },
                ],
              },
              {
                path: ROUTES.notifications,
                element: withSuspense(<NotificationsPage />),
              },
              {
                path: ROUTES.settings,
                element: withSuspense(<SettingsLayout />),
                children: [
                  {
                    index: true,
                    element: <Navigate to={ROUTES.settingsProfile} replace />,
                  },
                  {
                    path: "profile",
                    element: withSuspense(<ProfileSettingsPage />),
                  },
                  {
                    path: "general",
                    element: withSuspense(<GeneralSettingsPage />),
                  },
                  {
                    path: "security",
                    element: withSuspense(<SecuritySettingsPage />),
                  },
                  {
                    path: "notifications",
                    element: withSuspense(<NotificationsSettingsPage />),
                  },
                  {
                    path: "appearance",
                    element: withSuspense(<AppearanceSettingsPage />),
                  },
                  {
                    path: "billing",
                    element: withSuspense(<BillingSettingsPage />),
                  },
                  {
                    path: "audit-logs",
                    element: withSuspense(<AuditLogsSettingsPage />),
                  },
                  {
                    path: "data-privacy",
                    element: withSuspense(<DataPrivacySettingsPage />),
                  },
                  {
                    path: "integrations",
                    element: withSuspense(<IntegrationsSettingsPage />),
                  },
                  {
                    path: "developer",
                    element: withSuspense(<DeveloperSettingsPage />),
                  },
                  {
                    path: "danger",
                    element: withSuspense(<DangerZoneSettingsPage />),
                  },
                  // Legacy aliases from the previous nav structure.
                  {
                    path: "localization",
                    element: <Navigate to={ROUTES.settingsAppearance} replace />,
                  },
                  {
                    path: "organization",
                    element: <Navigate to={ROUTES.settingsGeneral} replace />,
                  },
                ],
              },
              { path: ROUTES.forbidden, element: <ForbiddenPage /> },
              {
                path: ROUTES.developerSdk,
                element: withSuspense(<SdkPage />),
              },
              {
                path: ROUTES.developerOAuthPlayground,
                element: withSuspense(<OAuthPlaygroundPage />),
              },
              {
                path: ROUTES.developerApiReference,
                element: <ComingSoonPage title="API Reference" />,
              },
              {
                path: ROUTES.developerWebhooks,
                element: withSuspense(<WebhooksPage />),
              },
              {
                path: ROUTES.developerOpenapi,
                element: <ComingSoonPage title="OpenAPI" />,
              },
              {
                path: ROUTES.developerPostman,
                element: <ComingSoonPage title="Postman Collection" />,
              },
              {
                path: ROUTES.developerChangelog,
                element: withSuspense(<ChangelogPage />),
              },
              {
                path: `${ROUTES.developerChangelog}/:version`,
                element: withSuspense(<ChangelogDetailPage />),
              },
            ],
          },
          {
            // Platform-role-only admin section — separate layout/sidebar
            // from the org-scoped dashboard above. Gated on `user:view`,
            // the permission api-guide.md itself recommends checking to
            // decide whether to render this nav at all (owner/admin/
            // support platform roles get it; a regular user never does).
            element: <PermissionRoute permission={PLATFORM_ADMIN_PERMISSION} />,
            children: [
              {
                element: <AdminLayout />,
                children: [
                  { path: ROUTES.adminOverview, element: withSuspense(<AdminOverviewPage />) },
                  { path: ROUTES.adminUsers, element: withSuspense(<AdminUsersPage />) },
                  { path: ROUTES.adminApplications, element: withSuspense(<AdminApplicationsPage />) },
                  { path: ROUTES.adminApiKeys, element: withSuspense(<AdminApiKeysPage />) },
                  { path: ROUTES.adminSessions, element: withSuspense(<AdminSessionsPage />) },
                  {
                    path: ROUTES.adminSystemSettings,
                    element: withSuspense(<AdminSystemSettingsPage />),
                  },
                  ...ADMIN_NAV_FLAT_ITEMS.filter((item) => !item.isBuilt).map((item) => ({
                    path: item.href,
                    element: <ComingSoonPage title={item.label} />,
                  })),
                ],
              },
            ],
          },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);