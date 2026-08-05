import { Link } from "react-router-dom";
import { ChevronRight, History } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useAuditLogs } from "@/features/audit-logs/queries/use-audit-logs";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { can } from "@/shared/permissions/can";
import { useFormattedDateTime } from "@/shared/timezone/format";
import { ROUTES } from "@/shared/config/routes";

function ActivityRow({ action, createdAt, success }: { action: string; createdAt: string; success: boolean }) {
  const { dateTime } = useFormattedDateTime(createdAt);
  return (
    <div className="flex items-start gap-3">
      <span
        className={
          "mt-1.5 size-1.5 shrink-0 rounded-full " +
          (success ? "bg-success" : "bg-destructive")
        }
      />
      <div>
        <p className="text-sm font-medium">{action.replaceAll(".", " ").replaceAll("_", " ")}</p>
        <p className="text-xs text-muted-foreground">{dateTime}</p>
      </div>
    </div>
  );
}

export function RecentActivityCard() {
  const user = useAuthStore((state) => state.user);
  const canViewAudit = can(user, "audit:view");

  const query = useAuditLogs({
    page: 1,
    limit: 5,
    actorId: user?.id,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Account Activity</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {!canViewAudit && (
          <p className="text-sm text-muted-foreground">
            You don&apos;t have permission to view audit activity for your
            account. Ask an administrator for the{" "}
            <span className="font-medium text-foreground">audit:view</span>{" "}
            permission.
          </p>
        )}

        {canViewAudit && query.isLoading && (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        )}

        {canViewAudit && query.isError && (
          <p className="text-sm text-muted-foreground">
            Couldn&apos;t load recent activity right now.
          </p>
        )}

        {canViewAudit &&
          query.data &&
          (query.data.logs.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-6 text-center">
              <History className="size-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No recent activity recorded yet.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {query.data.logs.map((log) => (
                <ActivityRow
                  key={log.id}
                  action={log.action}
                  createdAt={log.createdAt}
                  success={log.success}
                />
              ))}
            </div>
          ))}

        {canViewAudit && (
          <Link
            to={ROUTES.auditLogs}
            className="flex items-center justify-between rounded-lg px-1 py-1 text-sm font-medium text-primary hover:underline"
          >
            View All Activity
            <ChevronRight className="size-4" />
          </Link>
        )}
      </CardContent>
    </Card>
  );
}