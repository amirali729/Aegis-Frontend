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
import NotFoundPage from "@/routes/not-found-page";
import ForbiddenPage from "@/routes/forbidden-page";

const LoginPage = lazy(() => import("@/features/auth/pages/login-page"));
const SignupPage = lazy(() => import("@/features/auth/pages/signup-page"));
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
const LocalizationSettingsPage = lazy(
  () => import("@/features/settings/pages/localization-settings-page"),
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
            element: <DashboardLayout />,
            children: [
              {
                path: ROUTES.home,
                element: <Navigate to={ROUTES.dashboard} replace />,
              },
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
              { path: ROUTES.roles, element: withSuspense(<RolesPage />) },
              {
                path: ROUTES.permissions,
                element: withSuspense(<PermissionsPage />),
              },
              {
                path: ROUTES.organizations,
                element: withSuspense(<OrganizationsPage />),
              },
              {
                path: "organizations/:id",
                element: withSuspense(<OrganizationDetailsPage />),
              },
              {
                path: ROUTES.sessions,
                element: withSuspense(<SessionsPage />),
              },
              {
                path: ROUTES.auditLogs,
                element: withSuspense(<AuditLogsPage />),
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
                    element: <ComingSoonPage title="Profile" />,
                  },
                  {
                    path: "security",
                    element: <ComingSoonPage title="Security" />,
                  },
                  {
                    path: "localization",
                    element: withSuspense(<LocalizationSettingsPage />),
                  },
                  {
                    path: "organization",
                    element: <ComingSoonPage title="Organization" />,
                  },
                ],
              },
              { path: ROUTES.forbidden, element: <ForbiddenPage /> },
            ],
          },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);