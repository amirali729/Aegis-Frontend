import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ErrorState } from "@/shared/components/error-state";
import type { SystemHealth } from "@/features/admin/types/admin.types";

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function formatBytes(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(0)} MB`;
}

/**
 * The real /dashboard/system-health endpoint returns one overall
 * process health check, not a per-service breakdown (API/Database/
 * Queue/Workers/Cache/Email) — there's no such per-service monitoring
 * endpoint. This shows what's actually there: overall status, database
 * connectivity, process uptime, and memory usage.
 */
export function SystemHealthPanel({
  health,
  isLoading,
  isError,
  onRetry,
}: {
  health: SystemHealth | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="flex-row items-center justify-between border-b border-border py-4">
        <CardTitle className="text-base">System Health</CardTitle>
        {health && (
          <Badge variant={health.status === "ok" ? "success" : "destructive"} className="capitalize">
            {health.status}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-3 p-4">
        {isLoading && (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        )}

        {!isLoading && isError && <ErrorState error={new Error("Failed to load")} onRetry={onRetry} />}

        {!isLoading && !isError && health && (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Database</span>
              <Badge variant={health.database === "connected" ? "success" : "destructive"}>
                {health.database}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Uptime</span>
              <span className="font-medium tabular-nums">{formatUptime(health.uptimeSeconds)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Environment</span>
              <span className="font-medium">{health.environment}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Node version</span>
              <span className="font-medium">{health.nodeVersion}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Memory (heap used)</span>
              <span className="font-medium tabular-nums">{formatBytes(health.memory.heapUsed)}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
