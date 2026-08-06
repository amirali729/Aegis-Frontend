import { useState } from "react";
import { Link2, RefreshCw } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { OneTimeSecretDialog } from "@/shared/components/one-time-secret-dialog";
import { useFormattedDateTime } from "@/shared/timezone/format";
import { useOAuthClients } from "@/features/applications/queries/use-oauth-clients";
import {
  useRegenerateOAuthClientSecret,
  useRevokeOAuthClient,
} from "@/features/applications/mutations/use-oauth-clients";
import type { OAuthClient } from "@/features/applications/types/oauth-client.types";

function OAuthClientRow({
  applicationId,
  client,
}: {
  applicationId: string;
  client: OAuthClient;
}) {
  const created = useFormattedDateTime(client.createdAt);
  const regenerateSecret = useRegenerateOAuthClientSecret(applicationId);
  const revoke = useRevokeOAuthClient(applicationId);
  const [reveal, setReveal] = useState<{ clientSecret: string; warning: string } | null>(
    null,
  );

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border p-3">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium">{client.name}</p>
            <Badge variant={client.status === "active" ? "success" : "secondary"}>
              {client.status}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {client.clientType}
            </Badge>
          </div>
          <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
            {client.clientId}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Created {created.date} · Scopes: {client.scopes.join(", ") || "none"}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {client.clientType === "confidential" && client.status === "active" && (
            <ConfirmDialog
              trigger={
                <Button variant="outline" size="sm">
                  <RefreshCw />
                  Regenerate
                </Button>
              }
              title="Regenerate client secret?"
              description="The current secret will stop working immediately. Any running integrations using it will break until updated."
              confirmLabel="Regenerate"
              isPending={regenerateSecret.isPending}
              onConfirm={() =>
                regenerateSecret.mutate(client.clientId, {
                  onSuccess: (data) => setReveal(data),
                })
              }
            />
          )}
          <ConfirmDialog
            trigger={
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            }
            title="Delete this OAuth client?"
            description={`Any app using "${client.name}" will immediately stop being able to sign users in. This cannot be undone.`}
            confirmLabel="Delete"
            isPending={revoke.isPending}
            onConfirm={() => revoke.mutate(client.clientId)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {client.redirectUris.map((uri) => (
          <span
            key={uri}
            className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 font-mono text-[11px] text-muted-foreground"
          >
            <Link2 className="size-3" />
            {uri}
          </span>
        ))}
      </div>

      {reveal && (
        <OneTimeSecretDialog
          open={Boolean(reveal)}
          onOpenChange={(isOpen) => !isOpen && setReveal(null)}
          title="Secret regenerated"
          label="Client secret"
          secret={reveal.clientSecret}
          warning={reveal.warning}
        />
      )}
    </div>
  );
}

export function OAuthClientsSection({ applicationId }: { applicationId: string }) {
  const oauthClientsQuery = useOAuthClients(applicationId);

  return (
    <div className="flex flex-col gap-3">
      {oauthClientsQuery.isPending && (
        <>
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </>
      )}

      {oauthClientsQuery.isError && (
        <ErrorState
          error={oauthClientsQuery.error}
          onRetry={() => oauthClientsQuery.refetch()}
        />
      )}

      {oauthClientsQuery.isSuccess && oauthClientsQuery.data.length === 0 && (
        <EmptyState
          icon={Link2}
          title="No OAuth clients yet"
          description="Create one to let a third-party app authenticate users through Aegis."
        />
      )}

      {oauthClientsQuery.isSuccess &&
        oauthClientsQuery.data.map((client) => (
          <OAuthClientRow key={client.id} applicationId={applicationId} client={client} />
        ))}
    </div>
  );
}