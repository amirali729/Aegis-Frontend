import { CheckCircle2, XCircle, Clock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { useFormattedDateTime } from "@/shared/timezone/format";
import type { WebhookDelivery, DeliveryStatus } from "@/features/webhooks/types/webhook.types";

const STATUS_ICON: Record<DeliveryStatus, typeof CheckCircle2> = {
  success: CheckCircle2,
  failed: XCircle,
  pending: Clock,
};

const STATUS_ICON_CLASS: Record<DeliveryStatus, string> = {
  success: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  failed: "bg-destructive/10 text-destructive",
  pending: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
};

const STATUS_BADGE_VARIANT: Record<DeliveryStatus, "success" | "destructive" | "secondary"> = {
  success: "success",
  failed: "destructive",
  pending: "secondary",
};

function DeliveryRow({ delivery }: { delivery: WebhookDelivery }) {
  const occurred = useFormattedDateTime(delivery.occurredAt);
  const Icon = STATUS_ICON[delivery.status];

  return (
    <div className="flex items-start gap-2.5 py-2">
      <div
        className={`flex size-7 shrink-0 items-center justify-center rounded-full ${STATUS_ICON_CLASS[delivery.status]}`}
      >
        <Icon className="size-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-sm font-medium">{delivery.event}</p>
        <p className="truncate text-xs text-muted-foreground">{delivery.subjectLabel}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <Badge variant={STATUS_BADGE_VARIANT[delivery.status]} className="capitalize">
          {delivery.status}
        </Badge>
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
  deliveries: WebhookDelivery[] | undefined;
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