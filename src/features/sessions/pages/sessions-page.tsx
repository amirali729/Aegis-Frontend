import { Monitor } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { Button } from "@/shared/components/ui/button";
import { useSessions } from "@/features/sessions/queries/use-sessions";
import { useRevokeSession } from "@/features/sessions/mutations/use-revoke-session";
import { useLogoutAll } from "@/features/auth/mutations/use-logout";
import { SessionRow } from "@/features/sessions/components/session-row";

export default function SessionsPage() {
  const sessionsQuery = useSessions();
  const revokeSession = useRevokeSession();
  const logoutAll = useLogoutAll();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Sessions</h1>
          <p className="text-sm text-muted-foreground">
            Devices currently signed in to your account.
          </p>
        </div>

        <ConfirmDialog
          trigger={<Button variant="outline">Log out everywhere</Button>}
          title="Log out of all devices?"
          description="This will end every active session, including this one. You'll need to sign in again."
          confirmLabel="Log out everywhere"
          isPending={logoutAll.isPending}
          onConfirm={() => logoutAll.mutate()}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active sessions</CardTitle>
          <CardDescription>
            If you don&apos;t recognize a device, revoke it immediately.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {sessionsQuery.isPending && (
            <>
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </>
          )}

          {sessionsQuery.isError && (
            <ErrorState
              error={sessionsQuery.error}
              onRetry={() => sessionsQuery.refetch()}
            />
          )}

          {sessionsQuery.isSuccess && sessionsQuery.data.length === 0 && (
            <EmptyState icon={Monitor} title="No active sessions found." />
          )}

          {sessionsQuery.isSuccess &&
            sessionsQuery.data.map((session) => (
              <SessionRow
                key={session.id}
                session={session}
                onRevoke={(id) => revokeSession.mutate(id)}
                isRevoking={
                  revokeSession.isPending &&
                  revokeSession.variables === session.id
                }
              />
            ))}
        </CardContent>
      </Card>
    </div>
  );
}