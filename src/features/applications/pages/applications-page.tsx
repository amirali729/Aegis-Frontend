import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AppWindow, MoreHorizontal, Trash2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useFormattedDateTime } from "@/shared/timezone/format";
import { ROUTES } from "@/shared/config/routes";
import { cn } from "@/shared/lib/utils";
import { useApplications } from "@/features/applications/queries/use-applications";
import { useDeleteApplication } from "@/features/applications/mutations/use-application-actions";
import { CreateApplicationDialog } from "@/features/applications/components/create-application-dialog";
import type { Application } from "@/features/applications/types/application.types";

type StatusFilter = "all" | "active" | "inactive";

function ApplicationTableRow({
  application,
  onDelete,
  isDeleting,
}: {
  application: Application;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  const created = useFormattedDateTime(application.createdAt);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <TableRow>
      <TableCell>
        <Link
          to={ROUTES.applicationDetails(application.id)}
          className="flex items-center gap-2.5 font-medium hover:underline"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
            <AppWindow className="size-4" />
          </span>
          {application.name}
        </Link>
      </TableCell>
      <TableCell>
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
          {application.clientId}
        </code>
      </TableCell>
      <TableCell>
        <Badge variant={application.isActive ? "success" : "secondary"}>
          {application.isActive ? "Active" : "Inactive"}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">{created.date}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" aria-label="Application actions">
                <MoreHorizontal />
              </Button>
            }
          />
          <DropdownMenuContent>
            <DropdownMenuItem render={<Link to={ROUTES.applicationDetails(application.id)} />}>
              View details
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setConfirmOpen(true)}
            >
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Delete this application?"
          description={`This will permanently delete "${application.name}" and revoke all of its API keys. This cannot be undone.`}
          confirmLabel="Delete"
          isPending={isDeleting}
          onConfirm={() => onDelete(application.id)}
        />
      </TableCell>
    </TableRow>
  );
}

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export default function ApplicationsPage() {
  const applicationsQuery = useApplications();
  const deleteApplication = useDeleteApplication();
  const [filter, setFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    const data = applicationsQuery.data ?? [];
    if (filter === "active") return data.filter((app) => app.isActive);
    if (filter === "inactive") return data.filter((app) => !app.isActive);
    return data;
  }, [applicationsQuery.data, filter]);

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

      <Card className="gap-0 py-0">
        <CardHeader className="flex-row items-center justify-between gap-4 border-b border-border py-4">
          <div>
            <CardTitle>All applications</CardTitle>
            <CardDescription>
              Each application gets its own client ID/secret pair for OAuth flows.
            </CardDescription>
          </div>

          <div className="flex gap-1 rounded-lg bg-muted p-1">
            {FILTERS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-sm font-medium text-muted-foreground transition-colors",
                  filter === item.value && "bg-background text-foreground shadow-sm",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {applicationsQuery.isPending && (
            <div className="flex flex-col gap-2 p-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          )}

          {applicationsQuery.isError && (
            <div className="p-4">
              <ErrorState
                error={applicationsQuery.error}
                onRetry={() => applicationsQuery.refetch()}
              />
            </div>
          )}

          {applicationsQuery.isSuccess && filtered.length === 0 && (
            <div className="p-4">
              <EmptyState
                icon={AppWindow}
                title="No applications yet"
                description="Create your first application to get a client ID and secret for OAuth integration."
              />
            </div>
          )}

          {applicationsQuery.isSuccess && filtered.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application</TableHead>
                  <TableHead>Client ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((application) => (
                  <ApplicationTableRow
                    key={application.id}
                    application={application}
                    onDelete={(id) => deleteApplication.mutate(id)}
                    isDeleting={
                      deleteApplication.isPending &&
                      deleteApplication.variables === application.id
                    }
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}