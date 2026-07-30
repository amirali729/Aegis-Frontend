import { useState } from "react";
import { useParams } from "react-router-dom";
import { RefreshCw } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { Label } from "@/shared/components/ui/label";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ErrorState } from "@/shared/components/error-state";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { OneTimeSecretDialog } from "@/shared/components/one-time-secret-dialog";
import { useFormattedDateTime } from "@/shared/timezone/format";
import { useApplication } from "@/features/applications/queries/use-applications";
import {
  useRegenerateSecret,
  useUpdateApplication,
} from "@/features/applications/mutations/use-application-actions";
import { CreateApiKeyDialog } from "@/features/applications/components/create-api-key-dialog";
import { ApiKeysSection } from "@/features/applications/components/api-keys-section";

export default function ApplicationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const applicationQuery = useApplication(id ?? "");
  const updateApplication = useUpdateApplication(id ?? "");
  const regenerateSecret = useRegenerateSecret(id ?? "");
  const [reveal, setReveal] = useState<{ clientSecret: string; warning: string } | null>(
    null,
  );

  const application = applicationQuery.data;
  const created = useFormattedDateTime(application?.createdAt);

  if (applicationQuery.isPending) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (applicationQuery.isError || !application) {
    return (
      <ErrorState
        error={applicationQuery.error}
        onRetry={() => applicationQuery.refetch()}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{application.name}</h1>
        <p className="text-sm text-muted-foreground">
          Created {created.dateTime} · Client ID: {application.clientId}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>
            Manage this application&apos;s status and credentials.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <Label>Active</Label>
              <p className="text-xs text-muted-foreground">
                Inactive applications can&apos;t issue new tokens.
              </p>
            </div>
            <Switch
              checked={application.isActive}
              onCheckedChange={(checked) =>
                updateApplication.mutate({ isActive: checked })
              }
              disabled={updateApplication.isPending}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <Label>Client secret</Label>
              <p className="text-xs text-muted-foreground">
                Regenerating invalidates the current secret immediately.
              </p>
            </div>
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
                regenerateSecret.mutate(undefined, {
                  onSuccess: (data) => setReveal(data),
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>API keys</CardTitle>
            <CardDescription>
              For server-to-server authentication as this application.
            </CardDescription>
          </div>
          <CreateApiKeyDialog applicationId={application.id} />
        </CardHeader>
        <CardContent>
          <ApiKeysSection applicationId={application.id} />
        </CardContent>
      </Card>

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