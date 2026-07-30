import { AppWindow } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { useApplications } from "@/features/applications/queries/use-applications";
import { useDeleteApplication } from "@/features/applications/mutations/use-application-actions";
import { CreateApplicationDialog } from "@/features/applications/components/create-application-dialog";
import { ApplicationRow } from "@/features/applications/components/application-row";

export default function ApplicationsPage() {
  const applicationsQuery = useApplications();
  const deleteApplication = useDeleteApplication();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Applications</h1>
          <p className="text-sm text-muted-foreground">
            The web apps, mobile apps, and backends integrating with Aegis.
          </p>
        </div>
        <CreateApplicationDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All applications</CardTitle>
          <CardDescription>
            Each application gets its own client ID/secret pair for OAuth
            flows.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {applicationsQuery.isPending && (
            <>
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </>
          )}

          {applicationsQuery.isError && (
            <ErrorState
              error={applicationsQuery.error}
              onRetry={() => applicationsQuery.refetch()}
            />
          )}

          {applicationsQuery.isSuccess &&
            applicationsQuery.data.length === 0 && (
              <EmptyState
                icon={AppWindow}
                title="No applications yet"
                description="Create your first application to get a client ID and secret for OAuth integration."
              />
            )}

          {applicationsQuery.isSuccess &&
            applicationsQuery.data.map((application) => (
              <ApplicationRow
                key={application.id}
                application={application}
                onDelete={(id) => deleteApplication.mutate(id)}
                isDeleting={
                  deleteApplication.isPending &&
                  deleteApplication.variables === application.id
                }
              />
            ))}
        </CardContent>
      </Card>
    </div>
  );
}