import { AlertTriangle, OctagonAlert } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/empty-state";
import type { AuthMetrics, WebhookMetrics } from "@/features/admin/types/admin.types";

interface DerivedAlert {
  id: string;
  severity: "critical" | "warning";
  title: string;
  description: string;
}

/**
 * There's no alerts/incidents endpoint, so this doesn't show discrete
 * timestamped events like "webhook delivery failed 2m ago" — that would
 * be fabricated. Instead it derives a small set of current-state
 * warnings from real metrics (failed logins, locked accounts, failed
 * webhook deliveries) whenever those counts are non-zero. No fake
 * "X minutes ago" timestamps — these are current 24h/point-in-time
 * totals, labeled as such.
 */
function deriveAlerts(auth: AuthMetrics | undefined, webhooks: WebhookMetrics | undefined): DerivedAlert[] {
  const alerts: DerivedAlert[] = [];

  if (auth && auth.loginsFailedLast24h > 0) {
    alerts.push({
      id: "failed-logins",
      severity: auth.loginsFailedLast24h > 50 ? "critical" : "warning",
      title: `${auth.loginsFailedLast24h.toLocaleString()} failed login attempts`,
      description: "In the last 24 hours",
    });
  }

  if (auth && auth.lockedAccounts > 0) {
    alerts.push({
      id: "locked-accounts",
      severity: "warning",
      title: `${auth.lockedAccounts.toLocaleString()} locked accounts`,
      description: "Currently locked out",
    });
  }

  if (webhooks) {
    const failing = webhooks.deliveriesByStatus.failed + webhooks.deliveriesByStatus.dead_letter;
    if (failing > 0) {
      alerts.push({
        id: "webhook-failures",
        severity: webhooks.deliveriesByStatus.dead_letter > 0 ? "critical" : "warning",
        title: `${failing.toLocaleString()} failing webhook deliveries`,
        description: `${webhooks.deliveriesByStatus.dead_letter.toLocaleString()} in dead letter`,
      });
    }
  }

  return alerts;
}

export function RecentAlertsPanel({
  authMetrics,
  webhookMetrics,
  isLoading,
}: {
  authMetrics: AuthMetrics | undefined;
  webhookMetrics: WebhookMetrics | undefined;
  isLoading: boolean;
}) {
  const alerts = deriveAlerts(authMetrics, webhookMetrics);

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b border-border py-4">
        <CardTitle className="text-base">Alerts</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 p-2">
        {isLoading &&
          Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-14 w-full" />)}

        {!isLoading && alerts.length === 0 && (
          <EmptyState title="No active alerts" className="border-none py-6" />
        )}

        {!isLoading &&
          alerts.map((alert) => {
            const Icon = alert.severity === "critical" ? OctagonAlert : AlertTriangle;
            const colorClass =
              alert.severity === "critical"
                ? "bg-destructive/10 text-destructive"
                : "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400";

            return (
              <div key={alert.id} className="flex items-start gap-2.5 rounded-lg px-2 py-2">
                <span className={`flex size-7 shrink-0 items-center justify-center rounded-full ${colorClass}`}>
                  <Icon className="size-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{alert.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{alert.description}</p>
                </div>
              </div>
            );
          })}
      </CardContent>
    </Card>
  );
}
