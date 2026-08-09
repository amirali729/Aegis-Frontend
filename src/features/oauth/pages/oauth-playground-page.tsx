import { useEffect, useState } from "react";
import { Check, Copy, KeyRound, Play, RefreshCw, ShieldQuestion, Trash2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Badge } from "@/shared/components/ui/badge";
import { Spinner } from "@/shared/components/ui/spinner";
import { useCopyToClipboard } from "@/shared/hooks/use-copy-to-clipboard";
import { getErrorMessage } from "@/shared/errors/get-error-message";
import { decodeJwt } from "@/shared/lib/decode-jwt";
import {
  generateCodeChallenge,
  generateCodeVerifier,
  generateState,
} from "@/shared/auth/pkce";
import { buildAuthorizeUrl } from "@/shared/auth/o-auth";
import { ROUTES } from "@/shared/config/routes";
import {
  oauthPlaygroundApi,
  type TokenResponse,
} from "@/features/oauth/api/oauth-playground.api";
import {
  playgroundStorage,
  type PlaygroundConfig,
} from "@/features/oauth/lib/playground-storage";

function CopyButton({ value }: { value: string }) {
  const { copy, copied } = useCopyToClipboard();
  return (
    <button
      type="button"
      onClick={() => copy(value)}
      className="text-muted-foreground hover:text-foreground"
      aria-label="Copy"
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </button>
  );
}

function JsonBlock({ value }: { value: unknown }) {
  const text = JSON.stringify(value, null, 2);
  return (
    <div className="relative rounded-lg border border-white/10 bg-[#0d1117] p-3">
      <div className="absolute top-2 right-2">
        <CopyButton value={text} />
      </div>
      <pre className="overflow-x-auto pr-6 font-mono text-xs text-white/90">{text}</pre>
    </div>
  );
}

const defaultConfig: PlaygroundConfig = {
  clientId: "",
  clientSecret: "",
  redirectUri: `${window.location.origin}${ROUTES.developerOAuthPlaygroundCallback}`,
  scope: "openid profile email",
};

export default function OAuthPlaygroundPage() {
  const [config, setConfig] = useState<PlaygroundConfig>(
    () => playgroundStorage.loadConfig() ?? defaultConfig,
  );
  const [code, setCode] = useState<string | null>(null);
  const [callbackError, setCallbackError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<TokenResponse | null>(null);
  const [exchangeError, setExchangeError] = useState<string | null>(null);
  const [isExchanging, setIsExchanging] = useState(false);

  const [inspectToken, setInspectToken] = useState("");
  const [introspectResult, setIntrospectResult] = useState<Record<string, unknown> | null>(
    null,
  );
  const [introspectError, setIntrospectError] = useState<string | null>(null);
  const [isIntrospecting, setIsIntrospecting] = useState(false);
  const [revokeStatus, setRevokeStatus] = useState<"idle" | "revoking" | "revoked" | "error">(
    "idle",
  );
  const [revokeError, setRevokeError] = useState<string | null>(null);

  useEffect(() => {
    setCode(playgroundStorage.loadCode());
    setCallbackError(playgroundStorage.loadCallbackError());
  }, []);

  const decodedAccessToken = tokens ? decodeJwt(tokens.access_token) : null;
  const decodedIdToken = tokens?.id_token ? decodeJwt(tokens.id_token) : null;

  async function startAuthorization() {
    const verifier = generateCodeVerifier();
    const state = generateState();
    const challenge = await generateCodeChallenge(verifier);

    playgroundStorage.saveFlow(config, verifier, state);
    setCode(null);
    setCallbackError(null);
    setTokens(null);

    window.location.href = buildAuthorizeUrl({
      clientId: config.clientId,
      redirectUri: config.redirectUri,
      scope: config.scope,
      state,
      codeChallenge: challenge,
    });
  }

  async function exchangeCode() {
    const verifier = playgroundStorage.loadVerifier();
    if (!code || !verifier) return;

    setIsExchanging(true);
    setExchangeError(null);
    try {
      const result = await oauthPlaygroundApi.exchangeCode({
        code,
        redirectUri: config.redirectUri,
        clientId: config.clientId,
        clientSecret: config.clientSecret || undefined,
        codeVerifier: verifier,
      });
      setTokens(result);
      playgroundStorage.clearCode();
      setCode(null);
    } catch (error) {
      setExchangeError(getErrorMessage(error));
    } finally {
      setIsExchanging(false);
    }
  }

  async function runIntrospect() {
    if (!inspectToken) return;
    setIsIntrospecting(true);
    setIntrospectError(null);
    setIntrospectResult(null);
    try {
      const result = await oauthPlaygroundApi.introspect({
        token: inspectToken,
        clientId: config.clientId,
        clientSecret: config.clientSecret || undefined,
      });
      setIntrospectResult(result);
    } catch (error) {
      setIntrospectError(getErrorMessage(error));
    } finally {
      setIsIntrospecting(false);
    }
  }

  async function runRevoke() {
    if (!inspectToken) return;
    setRevokeStatus("revoking");
    setRevokeError(null);
    try {
      await oauthPlaygroundApi.revoke({
        token: inspectToken,
        clientId: config.clientId,
        clientSecret: config.clientSecret || undefined,
      });
      setRevokeStatus("revoked");
    } catch (error) {
      setRevokeStatus("error");
      setRevokeError(getErrorMessage(error));
    }
  }

  const canStart = Boolean(config.clientId && config.redirectUri);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">OAuth Playground</h1>
        <p className="text-sm text-muted-foreground">
          Test the OAuth 2.1 / OIDC authorization-code flow (PKCE, S256
          only) against your own Aegis instance — register an OAuth
          client under an application first, then configure it below.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1. Configure a client</CardTitle>
          <CardDescription>
            Use a real OAuth client's ID (and secret, if confidential).
            Add the callback URL below as one of that client's redirect
            URIs so this playground can capture the authorization code.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label>Client ID</Label>
            <Input
              value={config.clientId}
              onChange={(e) => setConfig({ ...config, clientId: e.target.value })}
              placeholder="oauth_client_..."
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Client Secret (confidential clients only)</Label>
            <Input
              type="password"
              value={config.clientSecret}
              onChange={(e) => setConfig({ ...config, clientSecret: e.target.value })}
              placeholder="optional for public clients"
            />
          </div>
          <div className="grid gap-1.5 sm:col-span-2">
            <Label>Redirect URI</Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={config.redirectUri}
                className="font-mono text-xs"
              />
              <CopyButton value={config.redirectUri} />
            </div>
            <p className="text-xs text-muted-foreground">
              Add this exact URL to the client&apos;s redirect URIs on the
              application&apos;s OAuth Clients tab.
            </p>
          </div>
          <div className="grid gap-1.5 sm:col-span-2">
            <Label>Scopes</Label>
            <Input
              value={config.scope}
              onChange={(e) => setConfig({ ...config, scope: e.target.value })}
              placeholder="openid profile email"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Run the authorization code flow</CardTitle>
          <CardDescription>
            Generates a fresh PKCE code_verifier/code_challenge and state,
            then sends you through the real login and consent screens.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {callbackError && (
            <Alert variant="destructive">
              <AlertDescription>{callbackError}</AlertDescription>
            </Alert>
          )}

          <div>
            <Button onClick={startAuthorization} disabled={!canStart}>
              <Play />
              Start Authorization
            </Button>
          </div>

          {code && (
            <div className="flex flex-col gap-3 rounded-lg border border-border p-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">Authorization code received</p>
                  <p className="truncate font-mono text-xs text-muted-foreground">
                    {code}
                  </p>
                </div>
                <Badge variant="success">Ready to exchange</Badge>
              </div>

              {exchangeError && (
                <Alert variant="destructive">
                  <AlertDescription>{exchangeError}</AlertDescription>
                </Alert>
              )}

              <Button onClick={exchangeCode} disabled={isExchanging} className="w-fit">
                {isExchanging ? <Spinner /> : <KeyRound />}
                Exchange for tokens
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {tokens && (
        <Card>
          <CardHeader>
            <CardTitle>3. Tokens</CardTitle>
            <CardDescription>
              Raw response from POST /oauth/token. Decoded below without
              signature verification, for inspection only.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <JsonBlock value={tokens} />

            {decodedAccessToken && (
              <div>
                <p className="mb-1.5 text-sm font-medium">Access token payload</p>
                <JsonBlock value={decodedAccessToken.payload} />
              </div>
            )}

            {decodedIdToken && (
              <div>
                <p className="mb-1.5 text-sm font-medium">ID token payload</p>
                <JsonBlock value={decodedIdToken.payload} />
              </div>
            )}

            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInspectToken(tokens.access_token)}
              >
                Use access token below
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>4. Introspect or revoke a token</CardTitle>
          <CardDescription>
            Paste any access or refresh token issued by this client.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Textarea
            placeholder="Paste a token here"
            value={inspectToken}
            onChange={(e) => setInspectToken(e.target.value)}
            className="font-mono text-xs"
            rows={3}
          />

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={runIntrospect}
              disabled={!inspectToken || isIntrospecting}
            >
              {isIntrospecting ? <Spinner /> : <ShieldQuestion />}
              Introspect
            </Button>
            <Button
              variant="destructive"
              onClick={runRevoke}
              disabled={!inspectToken || revokeStatus === "revoking"}
            >
              {revokeStatus === "revoking" ? <Spinner /> : <Trash2 />}
              Revoke
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setIntrospectResult(null);
                setIntrospectError(null);
                setRevokeStatus("idle");
                setRevokeError(null);
              }}
            >
              <RefreshCw />
              Clear result
            </Button>
          </div>

          {introspectError && (
            <Alert variant="destructive">
              <AlertDescription>{introspectError}</AlertDescription>
            </Alert>
          )}
          {introspectResult && <JsonBlock value={introspectResult} />}

          {revokeStatus === "revoked" && (
            <Alert variant="success">
              <AlertDescription>Token revoked.</AlertDescription>
            </Alert>
          )}
          {revokeStatus === "error" && revokeError && (
            <Alert variant="destructive">
              <AlertDescription>{revokeError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}