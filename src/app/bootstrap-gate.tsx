import type { PropsWithChildren } from "react";

import { useBootstrapSession } from "@/features/auth/hooks/use-bootstrap-session";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { Spinner } from "@/shared/components/ui/spinner";

/**
 * Wraps the router so that both ProtectedRoute and GuestRoute can rely
 * on `useAuthStore().status` already being resolved ("authenticated" |
 * "unauthenticated") before any route-level logic runs. Gating on
 * `status === "idle"` directly (rather than only the bootstrapping
 * flag) avoids a one-tick flash of protected content while the
 * "no cached user" case is still settling into "unauthenticated".
 */
export function BootstrapGate({ children }: PropsWithChildren) {
  useBootstrapSession();
  const status = useAuthStore((state) => state.status);

  if (status === "idle") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  return <>{children}</>;
}