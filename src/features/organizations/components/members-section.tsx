import { Users } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { useFormattedDateTime } from "@/shared/timezone/format";
import { useMembers } from "@/features/organizations/queries/use-organizations";
import {
  useReactivateMember,
  useRemoveMember,
  useSuspendMember,
} from "@/features/organizations/mutations/use-member-actions";
import type { Member } from "@/features/organizations/types/organization.types";

function MemberRow({
  member,
  orgId,
}: {
  member: Member;
  orgId: string;
}) {
  const joined = useFormattedDateTime(member.joinedAt);
  const suspendMember = useSuspendMember(orgId);
  const reactivateMember = useReactivateMember(orgId);
  const removeMember = useRemoveMember(orgId);

  const isBusy =
    suspendMember.isPending ||
    reactivateMember.isPending ||
    removeMember.isPending;

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{member.username}</p>
          <Badge variant={member.status === "active" ? "success" : "secondary"}>
            {member.status}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {member.email} · Joined {joined.date}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {member.status === "active" ? (
          <Button
            variant="outline"
            size="sm"
            disabled={isBusy}
            onClick={() => suspendMember.mutate(member.userId)}
          >
            Suspend
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled={isBusy}
            onClick={() => reactivateMember.mutate(member.userId)}
          >
            Reactivate
          </Button>
        )}

        <ConfirmDialog
          trigger={
            <Button variant="destructive" size="sm" disabled={isBusy}>
              Remove
            </Button>
          }
          title="Remove this member?"
          description={`This removes ${member.username} from the organization. Their user account is untouched.`}
          confirmLabel="Remove"
          isPending={removeMember.isPending}
          onConfirm={() => removeMember.mutate(member.userId)}
        />
      </div>
    </div>
  );
}

export function MembersSection({ orgId }: { orgId: string }) {
  const membersQuery = useMembers(orgId);

  if (membersQuery.isPending) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    );
  }

  if (membersQuery.isError) {
    return (
      <ErrorState error={membersQuery.error} onRetry={() => membersQuery.refetch()} />
    );
  }

  if (membersQuery.data.length === 0) {
    return <EmptyState icon={Users} title="No members yet" />;
  }

  return (
    <div className="flex flex-col gap-3">
      {membersQuery.data.map((member) => (
        <MemberRow key={member.userId} member={member} orgId={orgId} />
      ))}
    </div>
  );
}