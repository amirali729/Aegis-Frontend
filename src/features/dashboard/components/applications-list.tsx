import { AppWindow } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import type { Application } from "@/features/applications/types/application.types";

export function ApplicationsList({ applications }: { applications: Application[] }) {
  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <AppWindow className="size-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No applications created yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-border">
      {applications.slice(0, 6).map((app) => (
        <div key={app.id} className="flex items-center justify-between gap-3 py-2.5">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{app.name}</p>
            <p className="truncate font-mono text-xs text-muted-foreground">{app.clientId}</p>
          </div>
          <Badge variant={app.isActive ? "success" : "secondary"}>
            {app.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      ))}
    </div>
  );
}