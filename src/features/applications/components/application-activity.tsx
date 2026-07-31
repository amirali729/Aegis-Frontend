import { Skeleton } from "@/shared/components/ui/skeleton";
import { ErrorState } from "@/shared/components/error-state";
import { RecentActivityList } from "@/features/dashboard/components/recent-activity-list";
import { useAuditLogs } from "@/features/audit-logs/queries/use-audit-logs";

export function ApplicationActivity({ applicationId }: { applicationId: string }) {
  const auditLogsQuery = useAuditLogs({
    page: 1,
    limit: 10,
    targetId: applicationId,
  });

  if (auditLogsQuery.isPending) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (auditLogsQuery.isError) {
    return (
      <ErrorState
        error={auditLogsQuery.error}
        onRetry={() => auditLogsQuery.refetch()}
      />
    );
  }

  return <RecentActivityList entries={auditLogsQuery.data.logs} />;
}