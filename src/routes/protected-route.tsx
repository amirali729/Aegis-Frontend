import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthStore } from "@/features/auth/store/auth-store";
import { ROUTES } from "@/shared/config/routes";

/**
 * Guards routes that require an authenticated session. Session
 * validation itself happens once at the app root (see
 * app/bootstrap-gate.tsx) — by the time any route renders, `status`
 * is already resolved to "authenticated" or "unauthenticated".
 */
export function ProtectedRoute() {
  const status = useAuthStore((state) => state.status);
  const location = useLocation();

  if (status === "unauthenticated") {
    return (
      <Navigate to={ROUTES.login} state={{ from: location.pathname }} replace />
    );
  }

  return <Outlet />;
}