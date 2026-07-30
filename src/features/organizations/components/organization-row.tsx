import { Link } from "react-router-dom";
import { Building2, Trash2 } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { ROUTES } from "@/shared/config/routes";
import type { Organization } from "@/features/organizations/types/organization.types";

export function OrganizationRow({
  organization,
  onDelete,
  isDeleting,
}: {
  organization: Organization;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
      <Link
        to={ROUTES.organizationDetails(organization.id)}
        className="flex flex-1 items-start gap-3"
      >
        <Building2 className="mt-0.5 size-5 text-muted-foreground" />
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{organization.name}</p>
            <Badge
              variant={organization.status === "active" ? "success" : "secondary"}
            >
              {organization.status}
            </Badge>
            <Badge variant="outline">{organization.plan}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">{organization.slug}</p>
        </div>
      </Link>

      <ConfirmDialog
        trigger={
          <Button variant="ghost" size="icon" aria-label="Delete organization">
            <Trash2 className="text-destructive" />
          </Button>
        }
        title="Delete this organization?"
        description={`This will permanently delete "${organization.name}" and all of its members, invitations, and data. This cannot be undone.`}
        confirmLabel="Delete"
        isPending={isDeleting}
        onConfirm={() => onDelete(organization.id)}
      />
    </div>
  );
}