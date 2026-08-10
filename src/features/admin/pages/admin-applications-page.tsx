import { useState } from "react";
import { AppWindow, Search } from "lucide-react";

import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { useFormattedDateTime } from "@/shared/timezone/format";
import { useAdminApplications } from "@/features/admin/queries/use-admin-applications";
import type { AdminApplication } from "@/features/admin/types/admin.types";

const PAGE_SIZE = 10;

function ApplicationRow({ application }: { application: AdminApplication }) {
  const created = useFormattedDateTime(application.createdAt);

  return (
    <TableRow>
      <TableCell className="font-medium">{application.name}</TableCell>
      <TableCell>
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
          {application.clientId}
        </code>
      </TableCell>
      <TableCell className="font-mono text-xs text-muted-foreground">{application.tenantId}</TableCell>
      <TableCell>
        <Badge variant={application.isActive ? "success" : "secondary"}>
          {application.isActive ? "Active" : "Inactive"}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">{created.date}</TableCell>
    </TableRow>
  );
}

/**
 * Real GET /admin/applications (api-guide.md 5.17) — cross-tenant, no
 * search param documented, only page/limit/tenantId. The tenant filter
 * is exposed as a plain text input (paste a tenant/org id) rather than
 * a picker, since there's no endpoint to search/autocomplete tenants by
 * name from here.
 */
export default function AdminApplicationsPage() {
  const [tenantId, setTenantId] = useState("");
  const [page, setPage] = useState(1);

  const applicationsQuery = useAdminApplications({
    page,
    limit: PAGE_SIZE,
    tenantId: tenantId.trim() || undefined,
  });

  const total = applicationsQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Applications</h1>
        <p className="text-sm text-muted-foreground">
          Every application across every organization on the platform.
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={tenantId}
          onChange={(event) => {
            setTenantId(event.target.value);
            setPage(1);
          }}
          placeholder="Filter by tenant/organization ID..."
          className="pl-9"
        />
      </div>

      <Card className="gap-0 py-0">
        {applicationsQuery.isPending && (
          <div className="flex flex-col gap-2 p-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}

        {applicationsQuery.isError && (
          <CardContent className="pt-6">
            <ErrorState error={applicationsQuery.error} onRetry={() => applicationsQuery.refetch()} />
          </CardContent>
        )}

        {applicationsQuery.isSuccess && applicationsQuery.data.applications.length === 0 && (
          <CardContent className="pt-6">
            <EmptyState icon={AppWindow} title="No applications found" />
          </CardContent>
        )}

        {applicationsQuery.isSuccess && applicationsQuery.data.applications.length > 0 && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Client ID</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applicationsQuery.data.applications.map((application) => (
                  <ApplicationRow key={application.id} application={application} />
                ))}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <p className="text-sm text-muted-foreground">
                Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, total)} of {total}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}