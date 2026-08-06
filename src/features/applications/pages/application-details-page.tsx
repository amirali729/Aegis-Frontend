import { useState } from "react";
import { useParams } from "react-router-dom";
import { AppWindow, KeyRound, Link2, RefreshCw, ShieldCheck } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { Label } from "@/shared/components/ui/label";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ErrorState } from "@/shared/components/error-state";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { OneTimeSecretDialog } from "@/shared/components/one-time-secret-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { useFormattedDateTime } from "@/shared/timezone/format";
import { useApplication } from "@/features/applications/queries/use-applications";
import { useApiKeys } from "@/features/applications/queries/use-api-keys";
import {
  useRegenerateSecret,
  useUpdateApplication,
} from "@/features/applications/mutations/use-application-actions";
import { CreateApiKeyDialog } from "@/features/applications/components/create-api-key-dialog";
import { ApiKeysSection } from "@/features/applications/components/api-keys-section";
import { CreateOAuthClientDialog } from "@/features/applications/components/create-oauth-client-dialog";
import { OAuthClientsSection } from "@/features/applications/components/oauth-clients-section";
import { ApplicationActivity } from "@/features/applications/components/application-activity";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { can } from "@/shared/permissions/can";

export default function ApplicationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((state) => state.user);
  const canViewOAuthClients = can(user, "oauth_client:view");
  const applicationQuery = useApplication(id ?? "");
  const apiKeysQuery = useApiKeys(id ?? "");
  const updateApplication = useUpdateApplication(id ?? "");
  const regenerateSecret = useRegenerateSecret(id ?? "");
  const [reveal, setReveal] = useState<{ clientSecret: string; warning: string } | null>(
    null,
  );

  const application = applicationQuery.data;
  const created = useFormattedDateTime(application?.createdAt);

  if (applicationQuery.isPending) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (applicationQuery.isError || !application) {
    return (
      <ErrorState
        error={applicationQuery.error}
        onRetry={() => applicationQuery.refetch()}
      />
    );
  }

  const activeApiKeys =
    apiKeysQuery.data?.filter((key) => key.status === "active").length ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
          <AppWindow className="size-5" />
        </span>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">{application.name}</h1>
            <Badge variant={application.isActive ? "success" : "secondary"}>
              {application.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Created {created.dateTime} · Client ID:{" "}
            <code className="font-mono text-xs">{application.clientId}</code>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Card className="flex-row items-center gap-3 p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
            <KeyRound className="size-5" />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Active API keys</p>
            <p className="text-xl font-semibold tabular-nums">{activeApiKeys}</p>
          </div>
        </Card>
        <Card className="flex-row items-center gap-3 p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
            <Link2 className="size-5" />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Allowed origins</p>
            <p className="text-xl font-semibold tabular-nums">
              {application.allowedOrigins.length}
            </p>
          </div>
        </Card>
        <Card className="flex-row items-center gap-3 p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
            <ShieldCheck className="size-5" />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Redirect URIs</p>
            <p className="text-xl font-semibold tabular-nums">
              {application.redirectUris.length}
            </p>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="api-keys">API keys</TabsTrigger>
          {canViewOAuthClients && (
            <TabsTrigger value="oauth-clients">OAuth clients</TabsTrigger>
          )}
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>
                Manage this application&apos;s status and credentials.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <Label>Active</Label>
                  <p className="text-xs text-muted-foreground">
                    Inactive applications can&apos;t issue new tokens.
                  </p>
                </div>
                <Switch
                  checked={application.isActive}
                  onCheckedChange={(checked) =>
                    updateApplication.mutate({ isActive: checked })
                  }
                  disabled={updateApplication.isPending}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <Label>Client secret</Label>
                  <p className="text-xs text-muted-foreground">
                    Regenerating invalidates the current secret immediately.
                  </p>
                </div>
                <ConfirmDialog
                  trigger={
                    <Button variant="outline" size="sm">
                      <RefreshCw />
                      Regenerate
                    </Button>
                  }
                  title="Regenerate client secret?"
                  description="The current secret will stop working immediately. Any running integrations using it will break until updated."
                  confirmLabel="Regenerate"
                  isPending={regenerateSecret.isPending}
                  onConfirm={() =>
                    regenerateSecret.mutate(undefined, {
                      onSuccess: (data) => setReveal(data),
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-keys">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>API keys</CardTitle>
                <CardDescription>
                  For server-to-server authentication as this application.
                </CardDescription>
              </div>
              <CreateApiKeyDialog applicationId={application.id} />
            </CardHeader>
            <CardContent>
              <ApiKeysSection applicationId={application.id} />
            </CardContent>
          </Card>
        </TabsContent>

        {canViewOAuthClients && (
          <TabsContent value="oauth-clients">
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>OAuth clients</CardTitle>
                  <CardDescription>
                    Let third-party apps authenticate users through Aegis via
                    OAuth 2.1 / OIDC.
                  </CardDescription>
                </div>
                <CreateOAuthClientDialog applicationId={application.id} />
              </CardHeader>
              <CardContent>
                <OAuthClientsSection applicationId={application.id} />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>
                Audit log events targeting this application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ApplicationActivity applicationId={application.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {reveal && (
        <OneTimeSecretDialog
          open={Boolean(reveal)}
          onOpenChange={(isOpen) => !isOpen && setReveal(null)}
          title="Secret regenerated"
          label="Client secret"
          secret={reveal.clientSecret}
          warning={reveal.warning}
        />
      )}
    </div>
  );
}