import type { LucideIcon } from "lucide-react";
import { AppWindow, Building2, KeyRound, Users2, Zap } from "lucide-react";

import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";
import type {
  ApplicationMetrics,
  AuthMetrics,
  OAuthMetrics,
  OrganizationMetrics,
} from "@/features/admin/types/admin.types";

const ICON_STYLES = {
  violet: "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  indigo: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400",
  emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  amber: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
} as const;

function StatCard({
  label,
  value,
  caption,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  caption: string;
  icon: LucideIcon;
  color: keyof typeof ICON_STYLES;
}) {
  return (
    <Card className="flex-row items-start justify-between p-4">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1.5 text-2xl font-semibold tabular-nums">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{caption}</p>
      </div>
      <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", ICON_STYLES[color])}>
        <Icon className="size-5" />
      </div>
    </Card>
  );
}

/**
 * Every card here is backed by a real /metrics/* endpoint. There's no
 * "vs last 7 days" percentage delta on any of them (no historical
 * baseline field exists) — each caption instead shows a real supporting
 * count from the same endpoint. There's also no real analog for
 * "Active Sessions" or generic "API Requests" (no /metrics/sessions
 * endpoint exists), so those cards were replaced with the closest real
 * OAuth-token metrics instead of being left as fabricated numbers.
 */
export function AdminStatCards({
  authMetrics,
  oauthMetrics,
  applicationMetrics,
  organizationMetrics,
  isLoading,
}: {
  authMetrics: AuthMetrics | undefined;
  oauthMetrics: OAuthMetrics | undefined;
  applicationMetrics: ApplicationMetrics | undefined;
  organizationMetrics: OrganizationMetrics | undefined;
  isLoading: boolean;
}) {
  if (isLoading || !authMetrics || !oauthMetrics || !applicationMetrics || !organizationMetrics) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="p-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="mt-2 h-7 w-14" />
            <Skeleton className="mt-2 h-3 w-24" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard
        label="Total Users"
        value={authMetrics.totalUsers.toLocaleString()}
        caption={`${authMetrics.signupsLast7Days.toLocaleString()} new in last 7 days`}
        icon={Users2}
        color="violet"
      />
      <StatCard
        label="Organizations"
        value={organizationMetrics.total.toLocaleString()}
        caption={`${organizationMetrics.createdLast7Days.toLocaleString()} new in last 7 days`}
        icon={Building2}
        color="blue"
      />
      <StatCard
        label="Applications"
        value={applicationMetrics.total.toLocaleString()}
        caption={`${applicationMetrics.active.toLocaleString()} active`}
        icon={AppWindow}
        color="indigo"
      />
      <StatCard
        label="OAuth Clients"
        value={oauthMetrics.totalClients.toLocaleString()}
        caption={`${oauthMetrics.activeClients.toLocaleString()} active`}
        icon={KeyRound}
        color="violet"
      />
      <StatCard
        label="Active Access Tokens"
        value={oauthMetrics.activeAccessTokens.toLocaleString()}
        caption={`${oauthMetrics.activeRefreshTokens.toLocaleString()} active refresh tokens`}
        icon={Zap}
        color="emerald"
      />
      <StatCard
        label="OAuth Tokens Issued (24h)"
        value={oauthMetrics.accessTokensIssuedLast24h.toLocaleString()}
        caption={`${oauthMetrics.tokensRevokedLast24h.toLocaleString()} revoked in 24h`}
        icon={Zap}
        color="amber"
      />
    </div>
  );
}
