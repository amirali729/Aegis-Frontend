import { useState } from "react";
import { ShieldPlus } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useRoles } from "@/features/roles/queries/use-roles";
import {
  useAssignRole,
  useRemoveRole,
} from "@/features/organizations/mutations/use-role-assignment";
import type { Member } from "@/features/organizations/types/organization.types";

export function ManageRolesDialog({
  member,
  orgId,
}: {
  member: Member;
  orgId: string;
}) {
  const [open, setOpen] = useState(false);
  const [assignRoleId, setAssignRoleId] = useState("");
  const [removeRoleId, setRemoveRoleId] = useState("");
  // The backend has no endpoint to fetch a member's current roles
  // (see use-role-assignment.ts) — this only reflects what the last
  // assign/remove response for this member, this session, returned.
  const [knownRoles, setKnownRoles] = useState<string[] | null>(null);

  const rolesQuery = useRoles();
  const assignRole = useAssignRole(orgId);
  const removeRole = useRemoveRole(orgId);

  const roles = rolesQuery.data ?? [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            <ShieldPlus />
            Roles
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage roles — {member.username}</DialogTitle>
          <DialogDescription>
            The backend doesn&apos;t expose an endpoint to look up a
            member&apos;s current roles, so this can&apos;t show a
            reliable "currently assigned" list — only what the most
            recent action in this dialog returned.
          </DialogDescription>
        </DialogHeader>

        {knownRoles && (
          <div className="flex flex-wrap gap-1.5 rounded-lg border border-border p-3">
            <span className="text-xs text-muted-foreground">
              After last action:
            </span>
            {knownRoles.length === 0 ? (
              <span className="text-xs text-muted-foreground">No roles</span>
            ) : (
              knownRoles.map((r) => (
                <Badge key={r} variant="secondary">
                  {r}
                </Badge>
              ))
            )}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">Assign a role</p>
            <div className="flex gap-2">
              <Select value={assignRoleId} onValueChange={(v) => v && setAssignRoleId(v)}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                disabled={!assignRoleId || assignRole.isPending}
                onClick={() =>
                  assignRole.mutate(
                    { userId: member.userId, roleId: assignRoleId },
                    { onSuccess: (result) => setKnownRoles(result.roles) },
                  )
                }
              >
                Assign
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-border pt-4">
            <p className="text-sm font-medium">Remove a role</p>
            <div className="flex gap-2">
              <Select value={removeRoleId} onValueChange={(v) => v && setRemoveRoleId(v)}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="destructive"
                disabled={!removeRoleId || removeRole.isPending}
                onClick={() =>
                  removeRole.mutate(
                    { userId: member.userId, roleId: removeRoleId },
                    { onSuccess: (result) => setKnownRoles(result.roles) },
                  )
                }
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
