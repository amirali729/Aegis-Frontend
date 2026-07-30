import { useParams } from "react-router-dom";

import { Skeleton } from "@/shared/components/ui/skeleton";
import { ErrorState } from "@/shared/components/error-state";
import { Badge } from "@/shared/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { useOrganization } from "@/features/organizations/queries/use-organizations";
import { OrganizationOverview } from "@/features/organizations/components/organization-overview";
import { MembersSection } from "@/features/organizations/components/members-section";
import { InvitationsSection } from "@/features/organizations/components/invitations-section";

export default function OrganizationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const organizationQuery = useOrganization(id ?? "");

  if (organizationQuery.isPending) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (organizationQuery.isError || !organizationQuery.data) {
    return (
      <ErrorState
        error={organizationQuery.error}
        onRetry={() => organizationQuery.refetch()}
      />
    );
  }

  const organization = organizationQuery.data;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">{organization.name}</h1>
          <Badge
            variant={organization.status === "active" ? "success" : "secondary"}
          >
            {organization.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{organization.slug}</p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OrganizationOverview organization={organization} />
        </TabsContent>

        <TabsContent value="members">
          <MembersSection orgId={organization.id} />
        </TabsContent>

        <TabsContent value="invitations">
          <InvitationsSection orgId={organization.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}