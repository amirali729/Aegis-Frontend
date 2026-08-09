import { Search } from "lucide-react";

import { Input } from "@/shared/components/ui/input";
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
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { useFormattedDateTime } from "@/shared/timezone/format";
import { cn } from "@/shared/lib/utils";
import { useAdminUsers } from "@/features/admin/queries/use-admin-users";
import type { AdminUser, AdminUserFilters } from "@/features/admin/types/admin.types";

const ROLE_BADGE_VARIANT: Record<AdminUser["platformRole"], "default" | "secondary" | "outline"> = {
  owner: "default",
  admin: "default",
  support: "secondary",
  user: "outline",
};

function UserRow({
  user,
  isSelected,
  onSelect,
}: {
  user: AdminUser;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const joined = useFormattedDateTime(user.createdAt);

  return (
    <TableRow
      onClick={onSelect}
      className={cn("cursor-pointer", isSelected && "bg-muted")}
    >
      <TableCell>
        <div className="flex items-center gap-2.5">
          <Avatar className="size-8">
            <AvatarFallback>{(user.fullName ?? user.username).slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium">{user.fullName ?? user.username}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={ROLE_BADGE_VARIANT[user.platformRole]} className="capitalize">
          {user.platformRole}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={user.status === "active" ? "success" : "secondary"} className="capitalize">
          {user.status}
        </Badge>
      </TableCell>
      <TableCell>
        {user.isVerified ? (
          <Badge variant="success">Verified</Badge>
        ) : (
          <Badge variant="secondary">Unverified</Badge>
        )}
      </TableCell>
      <TableCell className="text-muted-foreground">{joined.date}</TableCell>
    </TableRow>
  );
}

export function AdminUsersTable({
  filters,
  onFiltersChange,
  selectedUserId,
  onSelectUser,
}: {
  filters: AdminUserFilters;
  onFiltersChange: (filters: AdminUserFilters) => void;
  selectedUserId: string | null;
  onSelectUser: (id: string) => void;
}) {
  const usersQuery = useAdminUsers(filters);
  const totalPages = Math.max(1, Math.ceil((usersQuery.data?.total ?? 0) / filters.limit));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.search ?? ""}
            onChange={(event) =>
              onFiltersChange({ ...filters, search: event.target.value, page: 1 })
            }
            placeholder="Search by name, username, or email..."
            className="pl-9"
          />
        </div>

        <Select
          value={filters.status ?? "all"}
          onValueChange={(v) => v && onFiltersChange({ ...filters, status: v as AdminUserFilters["status"], page: 1 })}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="deactivated">Deactivated</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.platformRole ?? "all"}
          onValueChange={(v) =>
            v && onFiltersChange({ ...filters, platformRole: v as AdminUserFilters["platformRole"], page: 1 })
          }
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="owner">Owner</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="support">Support</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {usersQuery.isPending && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {usersQuery.isError && (
        <ErrorState error={usersQuery.error} onRetry={() => usersQuery.refetch()} />
      )}

      {usersQuery.isSuccess && usersQuery.data.users.length === 0 && (
        <EmptyState title="No users found" description="Try a different search or filter." />
      )}

      {usersQuery.isSuccess && usersQuery.data.users.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Platform Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersQuery.data.users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  isSelected={user.id === selectedUserId}
                  onSelect={() => onSelectUser(user.id)}
                />
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between px-1">
            <p className="text-sm text-muted-foreground">
              Showing {(filters.page - 1) * filters.limit + 1} to{" "}
              {Math.min(filters.page * filters.limit, usersQuery.data.total)} of {usersQuery.data.total} users
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page === 1}
                onClick={() => onFiltersChange({ ...filters, page: filters.page - 1 })}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {filters.page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page >= totalPages}
                onClick={() => onFiltersChange({ ...filters, page: filters.page + 1 })}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
