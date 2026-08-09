import { useMemo, useState } from "react";
import { CheckCircle2, Clock, RefreshCw, RotateCcw, XCircle } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { cn } from "@/shared/lib/utils";
import { useFormattedDateTime } from "@/shared/timezone/format";
import { useWebhookDeliveries, useWebhooks } from "@/features/webhooks/queries/use-webhooks";
import { useRedeliverWebhookDelivery } from "@/features/webhooks/mutations/use-webhook-mutations";
import type { DeliveryStatus, WebhookDelivery } from "@/features/webhooks/types/webhook.types";

type StatusFilter = "all" | DeliveryStatus;

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "delivered", label: "Delivered" },
  { value: "failed", label: "Failed" },
  { value: "dead_letter", label: "Dead letter" },
  { value: "pending", label: "Pending" },
  { value: "delivering", label: "Delivering" },
];

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

const PAGE_SIZE = 10;

function DeliveryTableRow({
  orgId,
  webhookId,
  delivery,
}: {
  orgId: string;
  webhookId: string;
  delivery: WebhookDelivery;
}) {
  const created = useFormattedDateTime(delivery.createdAt);
  const redeliver = useRedeliverWebhookDelivery(orgId, webhookId);
  const StatusIcon =
    delivery.status === "delivered"
      ? CheckCircle2
      : delivery.status === "failed" || delivery.status === "dead_letter"
        ? XCircle
        : delivery.status === "delivering"
          ? RefreshCw
          : Clock;

  return (
    <TableRow>
      <TableCell className="font-mono text-xs">{delivery.eventType}</TableCell>
      <TableCell>
        <Badge variant={STATUS_BADGE_VARIANT[delivery.status]}>
          <StatusIcon className="size-3" />
          {STATUS_LABEL[delivery.status]}
        </Badge>
      </TableCell>
      <TableCell className="tabular-nums">
        {delivery.attempts} / {delivery.maxAttempts}
      </TableCell>
      <TableCell className="tabular-nums">{delivery.responseStatus ?? "—"}</TableCell>
      <TableCell className="max-w-52 truncate text-muted-foreground" title={delivery.errorMessage ?? undefined}>
        {delivery.errorMessage ?? "—"}
      </TableCell>
      <TableCell className="text-muted-foreground">{created.dateTime}</TableCell>
      <TableCell className="text-right">
        {(delivery.status === "failed" || delivery.status === "dead_letter") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => redeliver.mutate(delivery.id)}
            disabled={redeliver.isPending}
          >
            <RotateCcw />
            Redeliver
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}

/**
 * The deliveries endpoint returns every delivery for a webhook as a
 * bare, unpaginated array (api-guide.md 5.12 — no page/limit/status
 * query params exist server-side), so filtering and pagination both
 * happen client-side here over the full result.
 */
export function DeliveriesTab({ orgId }: { orgId: string }) {
  const webhooksQuery = useWebhooks(orgId);
  const webhooks = webhooksQuery.data ?? [];
  const [webhookId, setWebhookId] = useState<string | undefined>();
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);

  const activeWebhookId = webhookId ?? webhooks[0]?.id;
  const deliveriesQuery = useWebhookDeliveries(orgId, activeWebhookId ?? "");

  const filtered = useMemo(() => {
    const all = deliveriesQuery.data ?? [];
    const byStatus = status === "all" ? all : all.filter((d) => d.status === status);
    return [...byStatus].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [deliveriesQuery.data, status]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (webhooksQuery.isSuccess && webhooks.length === 0) {
    return (
      <EmptyState
        icon={Clock}
        title="No webhooks yet"
        description="Create a webhook first to see its delivery log here."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Select
          value={activeWebhookId}
          onValueChange={(v) => {
            if (!v) return;
            setWebhookId(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Select webhook" />
          </SelectTrigger>
          <SelectContent>
            {webhooks.map((webhook) => (
              <SelectItem key={webhook.id} value={webhook.id}>
                {webhook.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex flex-wrap gap-1 rounded-lg bg-muted p-1">
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
      </div>

      {(webhooksQuery.isPending || deliveriesQuery.isPending) && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}

      {deliveriesQuery.isError && (
        <ErrorState error={deliveriesQuery.error} onRetry={() => deliveriesQuery.refetch()} />
      )}

      {deliveriesQuery.isSuccess && pageItems.length === 0 && (
        <EmptyState
          icon={Clock}
          title="No deliveries"
          description="Nothing matches this filter yet."
        />
      )}

      {deliveriesQuery.isSuccess && pageItems.length > 0 && activeWebhookId && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>HTTP</TableHead>
                <TableHead>Error</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageItems.map((delivery) => (
                <DeliveryTableRow
                  key={delivery.id}
                  orgId={orgId}
                  webhookId={activeWebhookId}
                  delivery={delivery}
                />
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
