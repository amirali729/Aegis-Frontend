import { useQuery } from "@tanstack/react-query";
import { ScrollText } from "lucide-react";

import { CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { useFormattedDateTime } from "@/shared/timezone/format";
import { auditLogsApi } from "@/features/audit-logs/api/audit-logs.api";
import { queryKeys } from "@/shared/query/query-keys";
import type { AuditLogEntry } from "@/features/audit-logs/types/audit-log.types";

function humanizeAction(action: string): string {
  return action.replace(/[._]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function LogRow({ entry }: { entry: AuditLogEntry }) {
  const created = useFormattedDateTime(entry.createdAt);

  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-border p-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{humanizeAction(entry.action)}</p>
        <p className="truncate text-xs text-muted-foreground">{created.dateTime}</p>
      </div>
      <Badge variant={entry.success ? "success" : "destructive"}>
        {entry.success ? "Success" : "Failed"}
      </Badge>
    </div>
  );
}

/** Reuses GET /audit-logs, filtered to this user as the actor (api-guide.md 5.14). */
export function AdminUserAuditLogsTab({ userId }: { userId: string }) {
  const filters = { page: 1, limit: 10, actorId: userId };
  const logsQuery = useQuery({
    queryKey: queryKeys.auditLogs.list(filters),
    queryFn: () => auditLogsApi.list(filters),
  });

  return (
    <CardContent className="flex flex-col gap-2 p-4">
      {logsQuery.isPending && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {logsQuery.isError && <ErrorState error={logsQuery.error} onRetry={() => logsQuery.refetch()} />}

      {logsQuery.isSuccess && logsQuery.data.logs.length === 0 && (
        <EmptyState icon={ScrollText} title="No audit log entries" />
      )}

      {logsQuery.isSuccess && logsQuery.data.logs.map((entry) => <LogRow key={entry.id} entry={entry} />)}
    </CardContent>
  );
}
