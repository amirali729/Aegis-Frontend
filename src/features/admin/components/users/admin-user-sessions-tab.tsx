import { Monitor } from "lucide-react";

import { CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { useFormattedDateTime } from "@/shared/timezone/format";
import {
  useAdminUserSessions,
  useRevokeAdminUserSession,
} from "@/features/admin/queries/use-admin-users";
import type { AdminUserSession } from "@/features/admin/types/admin.types";

function SessionRow({ userId, session }: { userId: string; session: AdminUserSession }) {
  const lastActive = useFormattedDateTime(session.lastActiveAt);
  const revoke = useRevokeAdminUserSession(userId);

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
      <div className="flex items-center gap-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Monitor className="size-4" />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-medium">{session.deviceName}</p>
            {session.isCurrent && <Badge variant="success">Current</Badge>}
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {session.ipAddress} · Last active {lastActive.dateTime}
          </p>
        </div>
      </div>
      {!session.isCurrent && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => revoke.mutate(session.id)}
          disabled={revoke.isPending}
        >
          Revoke
        </Button>
      )}
    </div>
  );
}

export function AdminUserSessionsTab({ userId }: { userId: string }) {
  const sessionsQuery = useAdminUserSessions(userId);

  return (
    <CardContent className="flex flex-col gap-2 p-4">
      {sessionsQuery.isPending && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      )}

      {sessionsQuery.isError && (
        <ErrorState error={sessionsQuery.error} onRetry={() => sessionsQuery.refetch()} />
      )}

      {sessionsQuery.isSuccess && sessionsQuery.data.sessions.length === 0 && (
        <EmptyState icon={Monitor} title="No active sessions" />
      )}

      {sessionsQuery.isSuccess &&
        sessionsQuery.data.sessions.map((session) => (
          <SessionRow key={session.id} userId={userId} session={session} />
        ))}
    </CardContent>
  );
}
