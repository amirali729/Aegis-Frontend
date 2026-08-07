import { useState } from "react";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { cn } from "@/shared/lib/utils";
import { useFormattedDateTime } from "@/shared/timezone/format";
import { useWebhookDeliveries } from "@/features/webhooks/queries/use-webhooks";
import type { DeliveryStatus, WebhookDelivery } from "@/features/webhooks/types/webhook.types";

type StatusFilter = "all" | DeliveryStatus;

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "success", label: "Success" },
  { value: "failed", label: "Failed" },
  { value: "pending", label: "Pending" },
];

const STATUS_BADGE_VARIANT: Record<DeliveryStatus, "success" | "destructive" | "secondary"> = {
  success: "success",
  failed: "destructive",
  pending: "secondary",
};

const PAGE_SIZE = 10;

function DeliveryTableRow({ delivery }: { delivery: WebhookDelivery }) {
  const occurred = useFormattedDateTime(delivery.occurredAt);
  const StatusIcon =
    delivery.status === "success" ? CheckCircle2 : delivery.status === "failed" ? XCircle : Clock;

  return (
    <TableRow>
      <TableCell className="font-mono text-xs">{delivery.event}</TableCell>
      <TableCell>{delivery.webhookName}</TableCell>
      <TableCell className="text-muted-foreground">{delivery.subjectLabel}</TableCell>
      <TableCell>
        <Badge variant={STATUS_BADGE_VARIANT[delivery.status]} className="capitalize">
          <StatusIcon className="size-3" />
          {delivery.status}
        </Badge>
      </TableCell>
      <TableCell className="tabular-nums">{delivery.httpStatus ?? "—"}</TableCell>
      <TableCell className="tabular-nums">
        {delivery.responseTimeMs ? `${delivery.responseTimeMs}ms` : "—"}
      </TableCell>
      <TableCell className="text-muted-foreground">{occurred.dateTime}</TableCell>
    </TableRow>
  );
}

export function DeliveriesTab({ applicationId }: { applicationId: string }) {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);

  const deliveriesQuery = useWebhookDeliveries(applicationId, {
    page,
    limit: PAGE_SIZE,
    status: status === "all" ? undefined : status,
  });

  const deliveries = deliveriesQuery.data?.deliveries ?? [];
  const total = deliveriesQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        {FILTERS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => {
              setStatus(item.value);
              setPage(1);
            }}
            className={cn(
              "rounded-md px-2.5 py-1 text-sm font-medium text-muted-foreground transition-colors",
              status === item.value && "bg-background text-foreground shadow-sm",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {deliveriesQuery.isPending && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}

      {deliveriesQuery.isError && (
        <ErrorState error={deliveriesQuery.error} onRetry={() => deliveriesQuery.refetch()} />
      )}

      {deliveriesQuery.isSuccess && deliveries.length === 0 && (
        <EmptyState
          icon={Clock}
          title="No deliveries"
          description="Nothing matches this filter yet."
        />
      )}

      {deliveriesQuery.isSuccess && deliveries.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Webhook</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>HTTP</TableHead>
                <TableHead>Response Time</TableHead>
                <TableHead>Occurred</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.map((delivery) => (
                <DeliveryTableRow key={delivery.id} delivery={delivery} />
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, total)} of {total}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}