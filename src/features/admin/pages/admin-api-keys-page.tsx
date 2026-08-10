import { useState } from "react";
import { KeyRound } from "lucide-react";

import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
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
import { useAdminApiKeys } from "@/features/admin/queries/use-admin-api-keys";
import type { AdminApiKey, AdminApiKeyStatus } from "@/features/admin/types/admin.types";

const PAGE_SIZE = 10;

function ApiKeyRow({ apiKey }: { apiKey: AdminApiKey }) {
  const created = useFormattedDateTime(apiKey.createdAt);
  const lastUsed = useFormattedDateTime(apiKey.lastUsedAt);
  const expires = useFormattedDateTime(apiKey.expiresAt);

  return (
    <TableRow>
      <TableCell className="font-medium">{apiKey.name}</TableCell>
      <TableCell>
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
          {apiKey.keyPrefix}…
        </code>
      </TableCell>
      <TableCell className="font-mono text-xs text-muted-foreground">{apiKey.applicationId}</TableCell>
      <TableCell>
        <Badge variant={apiKey.status === "active" ? "success" : "secondary"} className="capitalize">
          {apiKey.status}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {apiKey.lastUsedAt ? lastUsed.date : "Never used"}
      </TableCell>
      <TableCell className="text-muted-foreground">{apiKey.expiresAt ? expires.date : "No expiry"}</TableCell>
      <TableCell className="text-muted-foreground">{created.date}</TableCell>
    </TableRow>
  );
}

/** Real GET /admin/api-keys (api-guide.md 5.17) — cross-tenant. */
export default function AdminApiKeysPage() {
  const [applicationId, setApplicationId] = useState("");
  const [status, setStatus] = useState<AdminApiKeyStatus | "all">("all");
  const [page, setPage] = useState(1);

  const apiKeysQuery = useAdminApiKeys({
    page,
    limit: PAGE_SIZE,
    applicationId: applicationId.trim() || undefined,
    status,
  });

  const total = apiKeysQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">API Keys</h1>
        <p className="text-sm text-muted-foreground">
          Every API key across every application on the platform.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={applicationId}
          onChange={(event) => {
            setApplicationId(event.target.value);
            setPage(1);
          }}
          placeholder="Filter by application ID..."
          className="max-w-sm"
        />
        <Select
          value={status}
          onValueChange={(v) => {
            if (!v) return;
            setStatus(v as AdminApiKeyStatus | "all");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="revoked">Revoked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="gap-0 py-0">
        {apiKeysQuery.isPending && (
          <div className="flex flex-col gap-2 p-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}

        {apiKeysQuery.isError && (
          <CardContent className="pt-6">
            <ErrorState error={apiKeysQuery.error} onRetry={() => apiKeysQuery.refetch()} />
          </CardContent>
        )}

        {apiKeysQuery.isSuccess && apiKeysQuery.data.apiKeys.length === 0 && (
          <CardContent className="pt-6">
            <EmptyState icon={KeyRound} title="No API keys found" />
          </CardContent>
        )}

        {apiKeysQuery.isSuccess && apiKeysQuery.data.apiKeys.length > 0 && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key Prefix</TableHead>
                  <TableHead>Application</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeysQuery.data.apiKeys.map((apiKey) => (
                  <ApiKeyRow key={apiKey.id} apiKey={apiKey} />
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