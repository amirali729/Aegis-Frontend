import { Badge } from "@/shared/components/ui/badge";
import {
  useAdminApplicationMetrics,
  useAdminAuthMetrics,
  useAdminOAuthMetrics,
  useAdminOrganizationMetrics,
  useAdminOrganizations,
  useAdminRecentActivity,
  useAdminSystemHealth,
  useAdminWebhookMetrics,
} from "@/features/admin/queries/use-admin-overview";
import { AdminStatCards } from "@/features/admin/components/overview/admin-stat-cards";
import { AuthenticationSummaryPanel } from "@/features/admin/components/overview/authentication-summary-panel";
import { SystemHealthPanel } from "@/features/admin/components/overview/system-health-panel";
import { RecentAlertsPanel } from "@/features/admin/components/overview/recent-alerts-panel";
import { RecentOrganizationsPanel } from "@/features/admin/components/overview/recent-organizations-panel";
import { RecentActivityPanel } from "@/features/admin/components/overview/recent-activity-panel";
import { PlatformUsagePanel } from "@/features/admin/components/overview/platform-usage-panel";

export default function AdminOverviewPage() {
  const authMetricsQuery = useAdminAuthMetrics();
  const oauthMetricsQuery = useAdminOAuthMetrics();
  const applicationMetricsQuery = useAdminApplicationMetrics();
  const organizationMetricsQuery = useAdminOrganizationMetrics();
  const webhookMetricsQuery = useAdminWebhookMetrics();
  const systemHealthQuery = useAdminSystemHealth();
  const organizationsQuery = useAdminOrganizations();
  const recentActivityQuery = useAdminRecentActivity();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
            <Badge variant="outline">Platform</Badge>
          </div>
          <p className="text-sm text-muted-foreground">Platform overview and key metrics.</p>
        </div>
      </div>

      <AdminStatCards
        authMetrics={authMetricsQuery.data}
        oauthMetrics={oauthMetricsQuery.data}
        applicationMetrics={applicationMetricsQuery.data}
        organizationMetrics={organizationMetricsQuery.data}
        isLoading={
          authMetricsQuery.isLoading ||
          oauthMetricsQuery.isLoading ||
          applicationMetricsQuery.isLoading ||
          organizationMetricsQuery.isLoading
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AuthenticationSummaryPanel metrics={authMetricsQuery.data} isLoading={authMetricsQuery.isLoading} />
        </div>
        <SystemHealthPanel
          health={systemHealthQuery.data}
          isLoading={systemHealthQuery.isLoading}
          isError={systemHealthQuery.isError}
          onRetry={() => systemHealthQuery.refetch()}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <RecentOrganizationsPanel organizations={organizationsQuery.data} isLoading={organizationsQuery.isLoading} />
        <RecentActivityPanel entries={recentActivityQuery.data?.logs} isLoading={recentActivityQuery.isLoading} />
        <RecentAlertsPanel
          authMetrics={authMetricsQuery.data}
          webhookMetrics={webhookMetricsQuery.data}
          isLoading={authMetricsQuery.isLoading || webhookMetricsQuery.isLoading}
        />
      </div>

      <PlatformUsagePanel />
    </div>
  );
}
