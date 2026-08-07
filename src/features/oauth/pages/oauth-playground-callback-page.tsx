import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Spinner } from "@/shared/components/ui/spinner";
import { ROUTES } from "@/shared/config/routes";
import { playgroundStorage } from "@/features/oauth/lib/playground-storage";

export default function OAuthPlaygroundCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");
    const expectedState = playgroundStorage.loadState();

    if (error) {
      playgroundStorage.saveCallbackError(errorDescription ?? error);
    } else if (code && state && state === expectedState) {
      playgroundStorage.saveCode(code);
    } else if (code) {
      playgroundStorage.saveCallbackError(
        "Received a code but the state parameter didn't match — discarding it for safety.",
      );
    }

    navigate(ROUTES.developerOAuthPlayground, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-muted-foreground">
      <Spinner className="size-6" />
      <p className="text-sm">Returning to the OAuth Playground…</p>
    </div>
  );
}