import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { useFormattedDateTime } from "@/shared/timezone/format";
import type { AuditLogEntry } from "@/features/audit-logs/types/audit-log.types";

export function AuditLogRow({ entry }: { entry: AuditLogEntry }) {
  const [expanded, setExpanded] = useState(false);
  const created = useFormattedDateTime(entry.createdAt);
  const hasMetadata = Object.keys(entry.metadata ?? {}).length > 0;

  return (
    <div className="rounded-lg border border-border">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 p-3 text-left"
        onClick={() => hasMetadata && setExpanded((prev) => !prev)}
      >
        <div className="flex items-center gap-3">
          {hasMetadata ? (
            expanded ? (
              <ChevronDown className="size-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="size-4 text-muted-foreground" />
            )
          ) : (
            <span className="size-4" />
          )}
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">{entry.action}</p>
              <Badge variant={entry.success ? "success" : "destructive"}>
                {entry.success ? "Success" : "Failed"}
              </Badge>
              <Badge variant="outline">{entry.actorType}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {entry.targetType && `${entry.targetType} · `}
              {entry.ipAddress ?? "—"} · {created.dateTime}
            </p>
          </div>
        </div>
      </button>

      {expanded && hasMetadata && (
        <pre className="overflow-x-auto border-t border-border bg-muted/50 p-3 text-xs">
          {JSON.stringify(entry.metadata, null, 2)}
        </pre>
      )}
    </div>
  );
}