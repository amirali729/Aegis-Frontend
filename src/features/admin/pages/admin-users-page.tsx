import { useState } from "react";

import { useAdminAuthMetrics } from "@/features/admin/queries/use-admin-overview";
import { AdminUsersStatCards } from "@/features/admin/components/users/admin-users-stat-cards";
import { AdminUsersTable } from "@/features/admin/components/users/admin-users-table";
import { AdminUserDetailPanel } from "@/features/admin/components/users/admin-user-detail-panel";
import type { AdminUserFilters } from "@/features/admin/types/admin.types";

const DEFAULT_FILTERS: AdminUserFilters = { page: 1, limit: 10 };

export default function AdminUsersPage() {
  const authMetricsQuery = useAdminAuthMetrics();
  const [filters, setFilters] = useState<AdminUserFilters>(DEFAULT_FILTERS);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-sm text-muted-foreground">Manage and monitor all users on the platform.</p>
      </div>

      <AdminUsersStatCards metrics={authMetricsQuery.data} isLoading={authMetricsQuery.isLoading} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AdminUsersTable
            filters={filters}
            onFiltersChange={setFilters}
            selectedUserId={selectedUserId}
            onSelectUser={setSelectedUserId}
          />
        </div>

        {selectedUserId && (
          <AdminUserDetailPanel userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
        )}
      </div>
    </div>
  );
}
