import type { LucideIcon } from "lucide-react";
import { Lock, ShieldCheck, UserCheck, UserPlus, Users2 } from "lucide-react";

import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";
import type { AuthMetrics } from "@/features/admin/types/admin.types";

const ICON_STYLES = {
  violet: "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
  emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  amber: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  indigo: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400",
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

/** Backed by real GET /metrics/auth — same endpoint as the overview page's auth card. */
export function AdminUsersStatCards({
  metrics,
  isLoading,
}: {
  metrics: AuthMetrics | undefined;
  isLoading: boolean;
}) {
  if (isLoading || !metrics) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="p-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="mt-2 h-7 w-14" />
            <Skeleton className="mt-2 h-3 w-24" />
          </Card>
        ))}
      </div>
    );
  }

  const verifiedPct =
    metrics.totalUsers > 0 ? ((metrics.verifiedUsers / metrics.totalUsers) * 100).toFixed(1) : "0";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <StatCard
        label="Total Users"
        value={metrics.totalUsers.toLocaleString()}
        caption={`${metrics.signupsLast7Days.toLocaleString()} new in last 7 days`}
        icon={Users2}
        color="violet"
      />
      <StatCard
        label="Active Accounts"
        value={metrics.activeAccounts.toLocaleString()}
        caption={`${metrics.deactivatedAccounts.toLocaleString()} deactivated`}
        icon={UserCheck}
        color="emerald"
      />
      <StatCard
        label="New Users (30d)"
        value={metrics.signupsLast30Days.toLocaleString()}
        caption={`${metrics.signupsLast7Days.toLocaleString()} in last 7 days`}
        icon={UserPlus}
        color="blue"
      />
      <StatCard
        label="Locked Accounts"
        value={metrics.lockedAccounts.toLocaleString()}
        caption="Currently locked out"
        icon={Lock}
        color="amber"
      />
      <StatCard
        label="Verified Users"
        value={metrics.verifiedUsers.toLocaleString()}
        caption={`${verifiedPct}% of total users`}
        icon={ShieldCheck}
        color="indigo"
      />
    </div>
  );
}
