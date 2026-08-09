import { Link } from "react-router-dom";
import { Building2, KeyRound, Link2, LogIn, ShieldCheck, User } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/empty-state";
import { ROUTES } from "@/shared/config/routes";
import type { AuditLogEntry } from "@/features/audit-logs/types/audit-log.types";

function iconFor(action: string) {
  const lower = action.toLowerCase();
  if (lower.includes("organization")) return Building2;
  if (lower.includes("auth") || lower.includes("login")) return LogIn;
  if (lower.includes("application")) return Link2;
  if (lower.includes("apikey") || lower.includes("oauth")) return KeyRound;
  if (lower.includes("role")) return ShieldCheck;
  return User;
}

function humanizeAction(action: string): string {
  return action.replace(/[._]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

/** Real GET /audit-logs entries, cross-org (api-guide.md 5.14). */
export function RecentActivityPanel({
  entries,
  isLoading,
}: {
  entries: AuditLogEntry[] | undefined;
  isLoading: boolean;
}) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="flex-row items-center justify-between border-b border-border py-4">
        <CardTitle className="text-base">Recent Activity</CardTitle>
        <Link to={ROUTES.adminAuditLogs} className="text-sm font-medium text-primary hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 p-2">
        {isLoading &&
          Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="h-12 w-full" />)}

        {!isLoading && entries?.length === 0 && (
          <EmptyState title="No recent activity" className="border-none py-6" />
        )}

        {!isLoading &&
          entries?.map((entry) => {
            const Icon = iconFor(entry.action);
            return (
              <div key={entry.id} className="flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-muted">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{humanizeAction(entry.action)}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {entry.actorType}
                    {entry.actorId ? ` · ${entry.actorId}` : ""}
                    {!entry.success ? " · failed" : ""}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatDistanceToNowStrict(new Date(entry.createdAt), { addSuffix: true })}
                </span>
              </div>
            );
          })}
      </CardContent>
    </Card>
  );
}
