import { Building2 } from "lucide-react";

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
import { useOrganizations } from "@/features/organizations/queries/use-organizations";
import { useDeleteOrganization } from "@/features/organizations/mutations/use-organization-actions";
import { CreateOrganizationDialog } from "@/features/organizations/components/create-organization-dialog";
import { OrganizationRow } from "@/features/organizations/components/organization-row";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { can } from "@/shared/permissions/can";
import { ORGANIZATION_VIEW_PERMISSION } from "@/shared/permissions/route-permissions";

export default function OrganizationsPage() {
  const user = useAuthStore((state) => state.user);
  const organizationsQuery = useOrganizations(can(user, ORGANIZATION_VIEW_PERMISSION));
  const deleteOrganization = useDeleteOrganization();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Organizations</h1>
          <p className="text-sm text-muted-foreground">
            The companies using your platform.
          </p>
        </div>
        <CreateOrganizationDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All organizations</CardTitle>
          <CardDescription>
            Manage members and invitations from an organization&apos;s
            details page.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {organizationsQuery.isPending && (
            <>
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </>
          )}

          {organizationsQuery.isError && (
            <ErrorState
              error={organizationsQuery.error}
              onRetry={() => organizationsQuery.refetch()}
            />
          )}

          {organizationsQuery.isSuccess &&
            organizationsQuery.data.length === 0 && (
              <EmptyState
                icon={Building2}
                title="No organizations yet"
                description="Create your first organization to start inviting members."
              />
            )}

          {organizationsQuery.isSuccess &&
            organizationsQuery.data.map((organization) => (
              <OrganizationRow
                key={organization.id}
                organization={organization}
                onDelete={(id) => deleteOrganization.mutate(id)}
                isDeleting={
                  deleteOrganization.isPending &&
                  deleteOrganization.variables === organization.id
                }
              />
            ))}
        </CardContent>
      </Card>
    </div>
  );
}