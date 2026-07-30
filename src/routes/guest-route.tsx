import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "@/features/auth/store/auth-store";
import { ROUTES } from "@/shared/config/routes";

export function GuestRoute() {
  const status = useAuthStore((state) => state.status);

  if (status === "authenticated") {
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  return <Outlet />;
}