import { Outlet } from "react-router-dom";

import { useSessionExpiredListener } from "@/features/auth/hooks/use-session-expired-listener";

/**
 * `useSessionExpiredListener` needs `useNavigate`, which only works
 * inside the router tree — so it's mounted here, as the router's root
 * route element, rather than alongside <RouterProvider> in App.tsx.
 */
export function RootLayout() {
  useSessionExpiredListener();
  return <Outlet />;
}