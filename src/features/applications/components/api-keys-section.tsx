import { KeyRound } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { useFormattedDateTime } from "@/shared/timezone/format";
import { useApiKeys } from "@/features/applications/queries/use-api-keys";
import { useRevokeApiKey } from "@/features/applications/mutations/use-api-keys";
import type { ApiKey } from "@/features/applications/types/application.types";

function ApiKeyRow({
  apiKey,
  onRevoke,
  isRevoking,
}: {
  apiKey: ApiKey;
  onRevoke: (id: string) => void;
  isRevoking: boolean;
}) {
  const created = useFormattedDateTime(apiKey.createdAt);
  const lastUsed = useFormattedDateTime(apiKey.lastUsedAt);

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{apiKey.name}</p>
          <Badge variant={apiKey.status === "active" ? "success" : "secondary"}>
            {apiKey.status}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {apiKey.keyPrefix}••••••• · Created {created.date} · Last used{" "}
          {apiKey.lastUsedAt ? lastUsed.dateTime : "never"}
        </p>
      </div>

      {apiKey.status === "active" && (
        <ConfirmDialog
          trigger={
            <Button variant="destructive" size="sm">
              Revoke
            </Button>
          }
          title="Revoke this API key?"
          description={`Any requests using "${apiKey.name}" will immediately stop working. This cannot be undone.`}
          confirmLabel="Revoke"
          isPending={isRevoking}
          onConfirm={() => onRevoke(apiKey.id)}
        />
      )}
    </div>
  );
}

export function ApiKeysSection({ applicationId }: { applicationId: string }) {
  const apiKeysQuery = useApiKeys(applicationId);
  const revokeApiKey = useRevokeApiKey(applicationId);

  return (
    <div className="flex flex-col gap-3">
      {apiKeysQuery.isPending && (
        <>
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </>
      )}

      {apiKeysQuery.isError && (
        <ErrorState
          error={apiKeysQuery.error}
          onRetry={() => apiKeysQuery.refetch()}
        />
      )}

      {apiKeysQuery.isSuccess && apiKeysQuery.data.length === 0 && (
        <EmptyState
          icon={KeyRound}
          title="No API keys yet"
          description="Create one to authenticate server-to-server requests as this application."
        />
      )}

      {apiKeysQuery.isSuccess &&
        apiKeysQuery.data.map((apiKey) => (
          <ApiKeyRow
            key={apiKey.id}
            apiKey={apiKey}
            onRevoke={(id) => revokeApiKey.mutate(id)}
            isRevoking={
              revokeApiKey.isPending && revokeApiKey.variables === apiKey.id
            }
          />
        ))}
    </div>
  );
}