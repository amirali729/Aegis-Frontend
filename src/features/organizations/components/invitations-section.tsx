import { Mail } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { useFormattedDateTime } from "@/shared/timezone/format";
import { useInvitations } from "@/features/organizations/queries/use-organizations";
import { useRevokeInvitation } from "@/features/organizations/mutations/use-invitation-actions";
import { InviteMemberDialog } from "@/features/organizations/components/invite-member-dialog";
import type {
  Invitation,
  InvitationStatus,
} from "@/features/organizations/types/organization.types";

const STATUS_VARIANT: Record<
  InvitationStatus,
  "success" | "secondary" | "destructive" | "outline"
> = {
  pending: "outline",
  accepted: "success",
  revoked: "destructive",
  expired: "secondary",
};

function InvitationRow({
  invitation,
  orgId,
}: {
  invitation: Invitation;
  orgId: string;
}) {
  const expires = useFormattedDateTime(invitation.expiresAt);
  const revokeInvitation = useRevokeInvitation(orgId);

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{invitation.email}</p>
          <Badge variant={STATUS_VARIANT[invitation.status]}>
            {invitation.status}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Expires {expires.dateTime}
        </p>
      </div>

      {invitation.status === "pending" && (
        <ConfirmDialog
          trigger={
            <Button variant="destructive" size="sm">
              Revoke
            </Button>
          }
          title="Revoke this invitation?"
          description={`The invite link sent to ${invitation.email} will stop working.`}
          confirmLabel="Revoke"
          isPending={revokeInvitation.isPending}
          onConfirm={() => revokeInvitation.mutate(invitation.id)}
        />
      )}
    </div>
  );
}

export function InvitationsSection({ orgId }: { orgId: string }) {
  const invitationsQuery = useInvitations(orgId);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <InviteMemberDialog orgId={orgId} />
      </div>

      {invitationsQuery.isPending && (
        <>
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </>
      )}

      {invitationsQuery.isError && (
        <ErrorState
          error={invitationsQuery.error}
          onRetry={() => invitationsQuery.refetch()}
        />
      )}

      {invitationsQuery.isSuccess && invitationsQuery.data.length === 0 && (
        <EmptyState icon={Mail} title="No invitations yet" />
      )}

      {invitationsQuery.isSuccess &&
        invitationsQuery.data.map((invitation) => (
          <InvitationRow key={invitation.id} invitation={invitation} orgId={orgId} />
        ))}
    </div>
  );
}