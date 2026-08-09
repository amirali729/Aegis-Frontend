import { CheckCircle2, Clock, RefreshCw, XCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { useFormattedDateTime } from "@/shared/timezone/format";
import type { DeliveryWithWebhookName } from "@/features/webhooks/queries/use-webhooks";
import type { DeliveryStatus } from "@/features/webhooks/types/webhook.types";

const STATUS_ICON: Record<DeliveryStatus, typeof CheckCircle2> = {
  delivered: CheckCircle2,
  failed: XCircle,
  dead_letter: XCircle,
  pending: Clock,
  delivering: RefreshCw,
};

const STATUS_ICON_CLASS: Record<DeliveryStatus, string> = {
  delivered: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  failed: "bg-destructive/10 text-destructive",
  dead_letter: "bg-destructive/10 text-destructive",
  pending: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  delivering: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
};

const STATUS_BADGE_VARIANT: Record<DeliveryStatus, "success" | "destructive" | "secondary"> = {
  delivered: "success",
  failed: "destructive",
  dead_letter: "destructive",
  pending: "secondary",
  delivering: "secondary",
};

const STATUS_LABEL: Record<DeliveryStatus, string> = {
  delivered: "Delivered",
  failed: "Failed",
  dead_letter: "Dead letter",
  pending: "Pending",
  delivering: "Delivering",
};

function DeliveryRow({ delivery }: { delivery: DeliveryWithWebhookName }) {
  const occurred = useFormattedDateTime(delivery.createdAt);
  const Icon = STATUS_ICON[delivery.status];

  return (
    <div className="flex items-start gap-2.5 py-2">
      <div
        className={`flex size-7 shrink-0 items-center justify-center rounded-full ${STATUS_ICON_CLASS[delivery.status]}`}
      >
        <Icon className="size-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-sm font-medium">{delivery.eventType}</p>
        <p className="truncate text-xs text-muted-foreground">{delivery.webhookName}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <Badge variant={STATUS_BADGE_VARIANT[delivery.status]}>{STATUS_LABEL[delivery.status]}</Badge>
        <span className="text-xs text-muted-foreground" title={occurred.dateTime}>
          {occurred.time}
        </span>
      </div>
    </div>
  );
}

export function RecentDeliveriesPanel({
  deliveries,
  isLoading,
  isError,
  onRetry,
  onViewAll,
}: {
  deliveries: DeliveryWithWebhookName[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onViewAll: () => void;
}) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="flex-row items-center justify-between border-b border-border py-4">
        <CardTitle className="text-base">Recent Deliveries</CardTitle>
        <button
          type="button"
          onClick={onViewAll}
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </button>
      </CardHeader>
      <CardContent className="divide-y divide-border p-3">
        {isLoading && (
          <div className="flex flex-col gap-3 py-1">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}

        {!isLoading && isError && <ErrorState error={new Error("Failed to load")} onRetry={onRetry} />}

        {!isLoading && !isError && (deliveries?.length ?? 0) === 0 && (
          <EmptyState title="No deliveries yet" className="border-none py-8" />
        )}

        {!isLoading &&
          !isError &&
          deliveries?.map((delivery) => <DeliveryRow key={delivery.id} delivery={delivery} />)}
      </CardContent>
    </Card>
  );
}
