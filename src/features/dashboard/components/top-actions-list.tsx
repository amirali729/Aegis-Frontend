import type { ActionCount } from "@/features/dashboard/types/dashboard.types";

export function TopActionsList({ actions }: { actions: ActionCount[] }) {
  if (actions.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No activity yet.
      </p>
    );
  }

  const max = Math.max(...actions.map((a) => a.count), 1);

  return (
    <div className="flex flex-col gap-3">
      {actions.slice(0, 6).map((entry) => (
        <div key={entry.action} className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-sm">
            <span className="truncate font-medium">{entry.action}</span>
            <span className="tabular-nums text-muted-foreground">{entry.count}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${(entry.count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
