import { LogIn, ShieldAlert, UserCheck, UserPlus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import type { AuthMetrics } from "@/features/admin/types/admin.types";

/**
 * There's no daily-granularity auth time-series endpoint (the closest
 * real data, /metrics/auth, only has rolling totals like
 * "signupsLast7Days" and "loginsFailedLast24h" — no per-day breakdown
 * to plot). Rather than fabricate a daily trend line to fill the chart
 * shape from the original design, this shows the real aggregate
 * numbers directly.
 */
export function AuthenticationSummaryPanel({
  metrics,
  isLoading,
}: {
  metrics: AuthMetrics | undefined;
  isLoading: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading || !metrics ? (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-border p-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <LogIn className="size-3.5" />
                <span className="text-xs">Logins succeeded (24h)</span>
              </div>
              <p className="mt-1 text-xl font-semibold tabular-nums">
                {metrics.loginsSucceededLast24h.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ShieldAlert className="size-3.5" />
                <span className="text-xs">Logins failed (24h)</span>
              </div>
              <p className="mt-1 text-xl font-semibold tabular-nums">
                {metrics.loginsFailedLast24h.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <UserPlus className="size-3.5" />
                <span className="text-xs">Signups (7d / 30d)</span>
              </div>
              <p className="mt-1 text-xl font-semibold tabular-nums">
                {metrics.signupsLast7Days.toLocaleString()} / {metrics.signupsLast30Days.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <UserCheck className="size-3.5" />
                <span className="text-xs">Verified users</span>
              </div>
              <p className="mt-1 text-xl font-semibold tabular-nums">
                {metrics.verifiedUsers.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
