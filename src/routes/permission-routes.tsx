import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "@/features/auth/store/auth-store";
import { can } from "@/shared/permissions/can";
import { ROUTES } from "@/shared/config/routes";

/**
 * UX-only gate: prevents navigating to a page the user has no
 * permission to use. The backend remains the source of truth and
 * enforces the real check on every request regardless of this guard.
 */
export function PermissionRoute({ permission }: { permission: string }) {
  const user = useAuthStore((state) => state.user);

  if (!can(user, permission)) {
    return <Navigate to={ROUTES.forbidden} replace />;
  }

  return <Outlet />;
}