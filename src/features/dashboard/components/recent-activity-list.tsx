import { CheckCircle2, XCircle } from "lucide-react";

import { useFormattedDateTime } from "@/shared/timezone/format";
import type { AuditLogEntry } from "@/features/audit-logs/types/audit-log.types";

function ActivityRow({ entry }: { entry: AuditLogEntry }) {
  const { dateTime } = useFormattedDateTime(entry.createdAt);

  return (
    <div className="flex items-center gap-3 py-2">
      {entry.success ? (
        <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
      ) : (
        <XCircle className="size-4 shrink-0 text-destructive" />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{entry.action}</p>
        <p className="truncate text-xs text-muted-foreground">
          {entry.targetType ? `${entry.targetType} · ` : ""}
          {dateTime}
        </p>
      </div>
    </div>
  );
}

export function RecentActivityList({ entries }: { entries: AuditLogEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No recent activity yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-border">
      {entries.map((entry) => (
        <ActivityRow key={entry.id} entry={entry} />
      ))}
    </div>
  );
}