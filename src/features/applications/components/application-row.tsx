import { Link } from "react-router-dom";
import { AppWindow, Trash2 } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { useFormattedDateTime } from "@/shared/timezone/format";
import { ROUTES } from "@/shared/config/routes";
import type { Application } from "@/features/applications/types/application.types";

export function ApplicationRow({
  application,
  onDelete,
  isDeleting,
}: {
  application: Application;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  const created = useFormattedDateTime(application.createdAt);

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
      <Link
        to={ROUTES.applicationDetails(application.id)}
        className="flex flex-1 items-start gap-3"
      >
        <AppWindow className="mt-0.5 size-5 text-muted-foreground" />
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{application.name}</p>
            <Badge variant={application.isActive ? "success" : "secondary"}>
              {application.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {application.clientId} · Created {created.date}
          </p>
        </div>
      </Link>

      <ConfirmDialog
        trigger={
          <Button variant="ghost" size="icon" aria-label="Delete application">
            <Trash2 className="text-destructive" />
          </Button>
        }
        title="Delete this application?"
        description={`This will permanently delete "${application.name}" and revoke all of its API keys. This cannot be undone.`}
        confirmLabel="Delete"
        isPending={isDeleting}
        onConfirm={() => onDelete(application.id)}
      />
    </div>
  );
}