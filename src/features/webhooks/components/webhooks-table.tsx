import { useState } from "react";
import { Link2, MoreHorizontal, Pencil, RefreshCw, Send, Trash2 } from "lucide-react";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { OneTimeSecretDialog } from "@/shared/components/one-time-secret-dialog";
import { useFormattedDateTime } from "@/shared/timezone/format";
import { cn } from "@/shared/lib/utils";
import { useWebhooks } from "@/features/webhooks/queries/use-webhooks";
import {
  useDeleteWebhook,
  useRegenerateWebhookSecret,
  useSendTestPing,
  useUpdateWebhook,
} from "@/features/webhooks/mutations/use-webhook-mutations";
import type { Webhook } from "@/features/webhooks/types/webhook.types";
import { EditWebhookDialog } from "@/features/webhooks/components/edit-webhook-dialog";

function SuccessRateBar({ rate }: { rate: number }) {
  const color =
    rate >= 97 ? "bg-emerald-500" : rate >= 90 ? "bg-amber-500" : "bg-destructive";

  return (
    <div className="flex items-center gap-2">
      <span className="w-11 shrink-0 text-sm tabular-nums">{rate.toFixed(1)}%</span>
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${Math.min(rate, 100)}%` }} />
      </div>
    </div>
  );
}

function WebhookRow({ applicationId, webhook }: { applicationId: string; webhook: Webhook }) {
  const lastDelivery = useFormattedDateTime(webhook.lastDeliveryAt);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [reveal, setReveal] = useState<{ signingSecret: string; warning: string } | null>(null);

  const updateWebhook = useUpdateWebhook(applicationId);
  const deleteWebhook = useDeleteWebhook(applicationId);
  const regenerateSecret = useRegenerateWebhookSecret(applicationId);
  const sendTestPing = useSendTestPing(applicationId);

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
            <Link2 className="size-4" />
          </span>
          <div>
            <p className="font-medium">{webhook.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{webhook.environment}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
          {webhook.endpointUrl}
        </code>
      </TableCell>
      <TableCell className="text-center tabular-nums">{webhook.recentEventCount}</TableCell>
      <TableCell>
        <Badge variant={webhook.status === "active" ? "success" : "secondary"}>
          {webhook.status === "active" ? "Active" : "Inactive"}
        </Badge>
      </TableCell>
      <TableCell>
        <SuccessRateBar rate={webhook.successRate} />
      </TableCell>
      <TableCell className="text-muted-foreground">
        {webhook.lastDeliveryAt ? lastDelivery.dateTime : "—"}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" aria-label="Webhook actions">
                <MoreHorizontal />
              </Button>
            }
          />
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <Pencil />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => sendTestPing.mutate(webhook.id)}
              disabled={sendTestPing.isPending}
            >
              <Send />
              Send test event
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                updateWebhook.mutate({
                  webhookId: webhook.id,
                  body: { status: webhook.status === "active" ? "inactive" : "active" },
                })
              }
            >
              <RefreshCw />
              {webhook.status === "active" ? "Deactivate" : "Activate"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                regenerateSecret.mutate(webhook.id, {
                  onSuccess: (data) => setReveal(data),
                })
              }
            >
              <RefreshCw />
              Regenerate signing secret
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => setConfirmOpen(true)}>
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Delete this webhook?"
          description={`"${webhook.name}" will stop receiving events immediately. This cannot be undone.`}
          confirmLabel="Delete"
          isPending={deleteWebhook.isPending}
          onConfirm={() => deleteWebhook.mutate(webhook.id)}
        />

        <EditWebhookDialog
          applicationId={applicationId}
          webhook={webhook}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      </TableCell>

      {reveal && (
        <OneTimeSecretDialog
          open={Boolean(reveal)}
          onOpenChange={(isOpen) => !isOpen && setReveal(null)}
          title="Signing secret regenerated"
          label="Signing secret"
          secret={reveal.signingSecret}
          warning={reveal.warning}
        />
      )}
    </TableRow>
  );
}

export function WebhooksTable({ applicationId }: { applicationId: string }) {
  const webhooksQuery = useWebhooks(applicationId);

  if (webhooksQuery.isPending) {
    return (
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (webhooksQuery.isError) {
    return (
      <div className="p-4">
        <ErrorState error={webhooksQuery.error} onRetry={() => webhooksQuery.refetch()} />
      </div>
    );
  }

  if (webhooksQuery.data.length === 0) {
    return (
      <div className="p-4">
        <EmptyState
          icon={Link2}
          title="No webhooks yet"
          description="Create one to start receiving real-time events at your own endpoint."
        />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Endpoint URL</TableHead>
          <TableHead className="text-center">Events</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Success Rate</TableHead>
          <TableHead>Last Delivery</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {webhooksQuery.data.map((webhook) => (
          <WebhookRow key={webhook.id} applicationId={applicationId} webhook={webhook} />
        ))}
      </TableBody>
    </Table>
  );
}