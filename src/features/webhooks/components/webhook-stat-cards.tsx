import type { LucideIcon } from "lucide-react";
import { ArrowDown, ArrowUp, Grid2x2, ShieldCheck, Users2, XCircle } from "lucide-react";

import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";
import type { WebhookStats } from "@/features/webhooks/types/webhook.types";

const ICON_STYLES = {
  violet: "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
  emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  rose: "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
} as const;

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color: keyof typeof ICON_STYLES;
  deltaLabel?: string;
  deltaDirection?: "up" | "down";
  deltaGood?: boolean;
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  deltaLabel,
  deltaDirection,
  deltaGood = true,
}: StatCardProps) {
  const DeltaIcon = deltaDirection === "down" ? ArrowDown : ArrowUp;

  return (
    <Card className="flex-row items-start justify-between p-4">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1.5 text-2xl font-semibold tabular-nums">{value}</p>
        {deltaLabel && (
          <p
            className={cn(
              "mt-1 flex items-center gap-1 text-xs font-medium",
              deltaGood ? "text-emerald-600 dark:text-emerald-400" : "text-destructive",
            )}
          >
            <DeltaIcon className="size-3" />
            {deltaLabel}
          </p>
        )}
      </div>
      <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", ICON_STYLES[color])}>
        <Icon className="size-5" />
      </div>
    </Card>
  );
}

export function WebhookStatCards({
  stats,
  isLoading,
}: {
  stats: WebhookStats | undefined;
  isLoading: boolean;
}) {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="p-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-2 h-7 w-16" />
            <Skeleton className="mt-2 h-3 w-20" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Active Webhooks"
        value={stats.activeWebhooks.toLocaleString()}
        icon={Users2}
        color="violet"
        deltaLabel={stats.activeWebhooksDeltaLabel}
        deltaDirection="up"
      />
      <StatCard
        label="Events Delivered"
        value={stats.eventsDelivered.toLocaleString()}
        icon={Grid2x2}
        color="emerald"
        deltaLabel={`${stats.eventsDeliveredDeltaPct >= 0 ? "+" : ""}${stats.eventsDeliveredDeltaPct}% vs last 7 days`}
        deltaDirection={stats.eventsDeliveredDeltaPct >= 0 ? "up" : "down"}
      />
      <StatCard
        label="Delivery Success"
        value={`${stats.deliverySuccessRate.toFixed(1)}%`}
        icon={ShieldCheck}
        color="blue"
        deltaLabel={`${stats.deliverySuccessDeltaPct >= 0 ? "+" : ""}${stats.deliverySuccessDeltaPct}% vs last 7 days`}
        deltaDirection={stats.deliverySuccessDeltaPct >= 0 ? "up" : "down"}
      />
      <StatCard
        label="Delivery Failures"
        value={stats.deliveryFailures.toLocaleString()}
        icon={XCircle}
        color="rose"
        deltaLabel={`${stats.deliveryFailuresDeltaPct >= 0 ? "+" : ""}${stats.deliveryFailuresDeltaPct}% vs last 7 days`}
        deltaDirection={stats.deliveryFailuresDeltaPct >= 0 ? "up" : "down"}
        deltaGood={stats.deliveryFailuresDeltaPct <= 0}
      />
    </div>
  );
}