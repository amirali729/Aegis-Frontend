import { useState } from "react";
import { Search, User } from "lucide-react";

import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { cn } from "@/shared/lib/utils";
import { useAdminUsers } from "@/features/admin/queries/use-admin-users";
import { AdminUserSessionsTab } from "@/features/admin/components/users/admin-user-sessions-tab";
import type { AdminUser } from "@/features/admin/types/admin.types";

function UserResultRow({
  user,
  isSelected,
  onSelect,
}: {
  user: AdminUser;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left hover:bg-muted",
        isSelected && "bg-muted",
      )}
    >
      <Avatar className="size-8">
        <AvatarFallback>{(user.fullName ?? user.username).slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{user.fullName ?? user.username}</p>
        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
      </div>
    </button>
  );
}

/**
 * There's no global "every session across every user" endpoint — only
 * GET /admin/users/:userId/sessions (api-guide.md 5.17). So this page
 * finds a user first (reusing the real /admin/users search), then shows
 * that user's sessions with the same revoke action already built into
 * the Users detail panel's Sessions tab.
 */
export default function AdminSessionsPage() {
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const usersQuery = useAdminUsers({ page: 1, limit: 10, search: search.trim() || undefined });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Sessions</h1>
        <p className="text-sm text-muted-foreground">
          Find a user to view and revoke their active sessions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="gap-0 py-0 lg:col-span-1">
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search users..."
                className="pl-9"
              />
            </div>
          </div>

          <CardContent className="flex flex-col gap-0.5 p-2">
            {usersQuery.isPending && (
              <div className="flex flex-col gap-2 p-1">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            )}

            {usersQuery.isError && (
              <ErrorState error={usersQuery.error} onRetry={() => usersQuery.refetch()} />
            )}

            {usersQuery.isSuccess && usersQuery.data.users.length === 0 && (
              <EmptyState icon={User} title="No users found" className="border-none py-8" />
            )}

            {usersQuery.isSuccess &&
              usersQuery.data.users.map((user) => (
                <UserResultRow
                  key={user.id}
                  user={user}
                  isSelected={user.id === selectedUserId}
                  onSelect={() => setSelectedUserId(user.id)}
                />
              ))}
          </CardContent>
        </Card>

        <Card className="gap-0 py-0 lg:col-span-2">
          <div className="border-b border-border p-4">
            <p className="font-semibold">
              {selectedUserId ? "Active sessions" : "Select a user"}
            </p>
          </div>
          {selectedUserId ? (
            <AdminUserSessionsTab userId={selectedUserId} />
          ) : (
            <CardContent className="pt-6">
              <EmptyState
                icon={User}
                title="No user selected"
                description="Search for a user on the left to view their sessions."
              />
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}