import { useState } from "react";
import { ScrollText } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { Pagination } from "@/shared/table/pagination";
import { useAuditLogs } from "@/features/audit-logs/queries/use-audit-logs";
import { AuditLogRow } from "@/features/audit-logs/components/audit-log-row";
import type { AuditLogFilters } from "@/features/audit-logs/types/audit-log.types";

const PAGE_SIZE = 50;

export default function AuditLogsPage() {
  const [filters, setFilters] = useState<AuditLogFilters>({
    page: 1,
    limit: PAGE_SIZE,
  });

  const auditLogsQuery = useAuditLogs(filters);

  function updateFilter(patch: Partial<AuditLogFilters>) {
    setFilters((prev) => ({ ...prev, ...patch, page: 1 }));
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Audit Logs</h1>
        <p className="text-sm text-muted-foreground">
          Every significant action taken across your workspace.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="grid gap-1.5">
            <Label>Action</Label>
            <Input
              placeholder="e.g. auth.login"
              value={filters.action ?? ""}
              onChange={(event) =>
                updateFilter({ action: event.target.value || undefined })
              }
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Target type</Label>
            <Input
              placeholder="e.g. role"
              value={filters.targetType ?? ""}
              onChange={(event) =>
                updateFilter({ targetType: event.target.value || undefined })
              }
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Actor ID</Label>
            <Input
              placeholder="user or api key ID"
              value={filters.actorId ?? ""}
              onChange={(event) =>
                updateFilter({ actorId: event.target.value || undefined })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
          <CardDescription>
            Click a row with an arrow to see its full metadata.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {auditLogsQuery.isPending && (
            <>
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </>
          )}

          {auditLogsQuery.isError && (
            <ErrorState
              error={auditLogsQuery.error}
              onRetry={() => auditLogsQuery.refetch()}
            />
          )}

          {auditLogsQuery.isSuccess && auditLogsQuery.data.logs.length === 0 && (
            <EmptyState
              icon={ScrollText}
              title="No matching events"
              description="Try broadening your filters."
            />
          )}

          {auditLogsQuery.isSuccess &&
            auditLogsQuery.data.logs.map((entry) => (
              <AuditLogRow key={entry.id} entry={entry} />
            ))}

          {auditLogsQuery.isSuccess && auditLogsQuery.data.total > 0 && (
            <Pagination
              page={auditLogsQuery.data.page}
              limit={auditLogsQuery.data.limit}
              total={auditLogsQuery.data.total}
              onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}