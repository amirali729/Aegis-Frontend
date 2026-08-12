import { Slack, Github, Webhook, BarChart3, Mail, Zap, Link2Off } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/empty-state";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { useFormattedDateTime } from "@/shared/timezone/format";
import { toast } from "@/shared/lib/toast";
import { useConnectedApps } from "@/features/settings/queries/use-settings";
import { useDisconnectApp } from "@/features/settings/mutations/use-settings-actions";
import type { ConnectedApp } from "@/features/settings/types/settings.types";

const INTEGRATIONS = [
  { icon: Slack, name: "Slack", description: "Get alerts in a Slack channel." },
  { icon: Github, name: "GitHub", description: "Sync teams from a GitHub org." },
  { icon: Webhook, name: "Webhooks", description: "Subscribe your endpoint to Aegis events." },
  { icon: BarChart3, name: "Datadog", description: "Ship audit logs to Datadog." },
  { icon: Mail, name: "Custom SMTP", description: "Send platform emails from your domain." },
  { icon: Zap, name: "Zapier", description: "Automate workflows across your stack." },
];

function ConnectedAccountRow({ app }: { app: ConnectedApp }) {
  const disconnect = useDisconnectApp();
  const connected = useFormattedDateTime(app.connectedAt);

  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div>
        <p className="text-sm font-medium capitalize">{app.provider}</p>
        <p className="text-xs text-muted-foreground">
          Connected {connected.date} · {app.scopes.join(", ") || "no scopes"}
        </p>
      </div>
      <ConfirmDialog
        trigger={
          <Button variant="outline" size="sm">
            <Link2Off className="size-3.5" />
            Disconnect
          </Button>
        }
        title={`Disconnect ${app.provider}?`}
        description={`Aegis will no longer have access to your ${app.provider} account.`}
        confirmLabel="Disconnect"
        isPending={disconnect.isPending}
        onConfirm={() => disconnect.mutate(app.provider)}
      />
    </div>
  );
}

export default function IntegrationsSettingsPage() {
  const connectedAppsQuery = useConnectedApps();
  const apps = connectedAppsQuery.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>
            Third-party accounts linked to your Aegis account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {connectedAppsQuery.isLoading ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : connectedAppsQuery.isError ? (
            <p className="text-sm text-destructive">
              Couldn&apos;t load connected accounts. Try refreshing the page.
            </p>
          ) : apps.length === 0 ? (
            <EmptyState
              icon={Link2Off}
              title="No connected accounts"
              description="You haven't linked any third-party accounts yet."
            />
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {apps.map((app) => (
                <ConnectedAccountRow key={app.id} app={app} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>
            Connect Aegis to the tools your team already uses. Webhooks are
            the one integration with real backend support today — the rest
            are on the roadmap.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INTEGRATIONS.map((integration) => (
            <div
              key={integration.name}
              className="flex flex-col gap-3 rounded-xl border border-border p-4 transition-colors hover:border-primary/30 hover:shadow-sm"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                <integration.icon className="size-4.5" />
              </div>
              <div>
                <p className="text-sm font-medium">{integration.name}</p>
                <p className="text-xs text-muted-foreground">{integration.description}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={() =>
                  integration.name === "Webhooks"
                    ? toast.info("Manage webhooks from an organization's settings page.")
                    : toast.info(`${integration.name} isn't available yet.`)
                }
              >
                Connect
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}