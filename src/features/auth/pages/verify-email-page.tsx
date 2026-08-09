import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Spinner } from "@/shared/components/ui/spinner";
import { useVerifyEmail } from "@/features/auth/mutations/use-password-reset";
import { getErrorMessage } from "@/shared/errors/get-error-message";
import { ROUTES } from "@/shared/config/routes";
import { peekPendingOAuthParams } from "@/shared/auth/o-auth";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const verifyEmail = useVerifyEmail();
  const hasSubmitted = useRef(false);
  const [status, setStatus] = useState<"pending" | "success" | "error">(
    "pending",
  );

  // Verification links are opened from an email, often in a fresh tab, so
  // any pending OAuth authorize request only lives in localStorage now —
  // surface it here so "back to sign in" carries it forward to /login.
  const pendingOAuthSearch = peekPendingOAuthParams();
  const loginLinkTo = pendingOAuthSearch
    ? { pathname: ROUTES.login, search: pendingOAuthSearch }
    : ROUTES.login;

  useEffect(() => {
    if (!token || hasSubmitted.current) return;
    hasSubmitted.current = true;

    verifyEmail.mutate(token, {
      onSuccess: () => setStatus("success"),
      onError: () => setStatus("error"),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!token) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <XCircle className="mb-2 size-10 text-destructive" />
          <CardTitle className="text-xl">Invalid link</CardTitle>
          <CardDescription>
            This verification link is missing its token.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button render={<Link to={loginLinkTo} />} className="w-full">
            Back to sign in
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="items-center text-center">
        {status === "pending" && <Spinner className="mb-2 size-10" />}
        {status === "success" && (
          <CheckCircle2 className="mb-2 size-10 text-emerald-500" />
        )}
        {status === "error" && (
          <XCircle className="mb-2 size-10 text-destructive" />
        )}

        <CardTitle className="text-xl">
          {status === "pending" && "Verifying your email…"}
          {status === "success" && "Email verified"}
          {status === "error" && "Verification failed"}
        </CardTitle>
        <CardDescription>
          {status === "success" &&
            "Your email has been verified. You can now sign in."}
          {status === "error" &&
            (verifyEmail.error
              ? getErrorMessage(verifyEmail.error)
              : "This link is invalid or has expired.")}
        </CardDescription>
      </CardHeader>
      {status !== "pending" && (
        <CardContent>
          <Button render={<Link to={loginLinkTo} />} className="w-full">
            Back to sign in
          </Button>
        </CardContent>
      )}
    </Card>
  );
}