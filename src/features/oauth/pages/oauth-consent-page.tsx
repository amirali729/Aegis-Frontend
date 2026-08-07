import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ShieldCheck, ShieldAlert, Check, X } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Spinner } from "@/shared/components/ui/spinner";
import { appConfig } from "@/shared/config/app";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { parseOAuthAuthorizeParams } from "@/shared/auth/o-auth";
import { oauthApi } from "@/features/oauth/api/oauth.api";
import { getErrorMessage } from "@/shared/errors/get-error-message";

const SCOPE_DESCRIPTIONS: Record<string, string> = {
  openid: "Confirm it's you",
  profile: "Your username and basic profile info",
  email: "Your email address",
  offline_access: "Stay signed in on your behalf",
};

export default function OAuthConsentPage() {
  const [searchParams] = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const params = parseOAuthAuthorizeParams(`?${searchParams.toString()}`);
  const scopes = params?.scope?.split(/\s+/).filter(Boolean) ?? [];

  let redirectHost = params?.redirect_uri;
  try {
    if (params?.redirect_uri) redirectHost = new URL(params.redirect_uri).host;
  } catch {
    // leave the raw value if it doesn't parse as a URL
  }

  async function respond(approved: boolean) {
    if (!params) return;
    setStatus("submitting");
    setError(null);
    try {
      const result = await oauthApi.decide(params, approved);
      const target = result.redirectUri ?? result.redirect_uri ?? result.url;
      if (target) {
        window.location.href = target;
      } else {
        // Fall back to the app's own redirect_uri if the backend
        // response didn't include an explicit target.
        window.location.href = params.redirect_uri;
      }
    } catch (err) {
      setStatus("error");
      setError(getErrorMessage(err));
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-muted/30 p-4">
      <div className="flex items-center gap-2 text-foreground">
        <ShieldCheck className="size-6" />
        <span className="text-lg font-semibold">{appConfig.name}</span>
      </div>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Authorize access</CardTitle>
          <CardDescription>
            {params ? (
              <>
                An application wants to access your Aegis account
                {user ? ` as ${user.username}` : ""}.
              </>
            ) : (
              "This link is missing required parameters."
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {!params && (
            <Alert variant="destructive">
              <AlertDescription>
                We couldn&apos;t read a valid authorization request from this
                link. Go back to the application and try connecting again.
              </AlertDescription>
            </Alert>
          )}

          {params && (
            <>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">Requesting application</p>
                <p className="mt-0.5 truncate font-mono text-sm">{params.client_id}</p>
                {redirectHost && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Will redirect to <span className="font-medium">{redirectHost}</span>
                  </p>
                )}
              </div>

              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">
                  This will allow the app to:
                </p>
                <div className="flex flex-col gap-2">
                  {(scopes.length > 0 ? scopes : ["openid"]).map((scope) => (
                    <div key={scope} className="flex items-center gap-2.5 text-sm">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                        <Check className="size-3" />
                      </span>
                      <span>{SCOPE_DESCRIPTIONS[scope] ?? scope}</span>
                      <Badge variant="outline" className="ml-auto font-mono text-[10px]">
                        {scope}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {status === "error" && error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex items-start gap-2 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
                <ShieldAlert className="mt-0.5 size-3.5 shrink-0" />
                Only authorize apps you trust. You can revoke access later
                from your account settings.
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  disabled={status === "submitting"}
                  onClick={() => respond(false)}
                >
                  <X />
                  Deny
                </Button>
                <Button
                  className="flex-1"
                  disabled={status === "submitting"}
                  onClick={() => respond(true)}
                >
                  {status === "submitting" ? <Spinner /> : <Check />}
                  Allow
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}