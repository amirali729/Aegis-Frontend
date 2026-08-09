import { Link } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useFormattedDateTime } from "@/shared/timezone/format";
import { ROUTES } from "@/shared/config/routes";
import type { Organization } from "@/features/organizations/types/organization.types";

function OrgRow({ org }: { org: Organization }) {
  const formatted = useFormattedDateTime(org.createdAt);

  return (
    <Link
      to={ROUTES.organizationDetails(org.id)}
      className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted"
    >
      <Avatar className="size-8">
        <AvatarFallback>{org.name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{org.name}</p>
        <p className="truncate text-xs text-muted-foreground">{formatted.date}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <Badge variant="outline" className="capitalize">{org.plan}</Badge>
        <Badge variant={org.status === "active" ? "success" : "secondary"} className="capitalize">
          {org.status}
        </Badge>
      </div>
    </Link>
  );
}

/**
 * Renamed from "Top Organizations" — the real GET /organizations
 * response has no per-org user count or growth figure to rank by
 * (Organization is just {id, name, slug, status, plan, createdAt}), so
 * this lists the most recently created organizations instead of
 * fabricating a ranking metric.
 */
export function RecentOrganizationsPanel({
  organizations,
  isLoading,
}: {
  organizations: Organization[] | undefined;
  isLoading: boolean;
}) {
  const recent = [...(organizations ?? [])]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="flex-row items-center justify-between border-b border-border py-4">
        <CardTitle className="text-base">Recent Organizations</CardTitle>
        <Link to={ROUTES.adminOrganizations} className="text-sm font-medium text-primary hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 p-2">
        {isLoading &&
          Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="h-12 w-full" />)}

        {!isLoading && recent.map((org) => <OrgRow key={org.id} org={org} />)}
      </CardContent>
    </Card>
  );
}
