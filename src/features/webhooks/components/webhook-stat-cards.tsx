import type { LucideIcon } from "lucide-react";
import { CheckCircle2, Link2, ShieldCheck, XCircle } from "lucide-react";

import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";
import type { ComputedWebhookStats } from "@/features/webhooks/types/webhook.types";

const ICON_STYLES = {
  violet: "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
  emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  rose: "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
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
  caption?: string;
  icon: LucideIcon;
  color: keyof typeof ICON_STYLES;
}) {
  return (
    <Card className="flex-row items-start justify-between p-4">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1.5 text-2xl font-semibold tabular-nums">{value}</p>
        {caption && <p className="mt-1 text-xs text-muted-foreground">{caption}</p>}
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
  stats: ComputedWebhookStats | undefined;
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

  const sampleCaption = `Based on last ${stats.sampledDeliveryCount} deliveries fetched`;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Active Webhooks"
        value={`${stats.activeWebhooks} / ${stats.totalWebhooks}`}
        caption="Enabled / total configured"
        icon={Link2}
        color="violet"
      />
      <StatCard
        label="Deliveries Sampled"
        value={stats.sampledDeliveryCount.toLocaleString()}
        caption="Most recent per webhook"
        icon={CheckCircle2}
        color="emerald"
      />
      <StatCard
        label="Recent Success Rate"
        value={stats.successRate === null ? "—" : `${stats.successRate.toFixed(1)}%`}
        caption={sampleCaption}
        icon={ShieldCheck}
        color="blue"
      />
      <StatCard
        label="Recent Failures"
        value={stats.failedCount.toLocaleString()}
        caption={sampleCaption}
        icon={XCircle}
        color="rose"
      />
    </div>
  );
}
