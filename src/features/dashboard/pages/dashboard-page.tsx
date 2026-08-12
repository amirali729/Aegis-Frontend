import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  AppWindow,
  Building2,
  Monitor,
  ScrollText,
  ShieldCheck,
  ArrowRight,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { ErrorState } from "@/shared/components/error-state";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { can } from "@/shared/permissions/can";
import { useApplications } from "@/features/applications/queries/use-applications";
import { useMembers, useInvitations } from "@/features/organizations/queries/use-organizations";
import {
  useDashboardOverview,
  useDashboardActivity,
  useDashboardSecurity,
  useDashboardResources,
  useDashboardRecentActivity,
} from "@/features/dashboard/queries/use-dashboard";
import { useCurrentOrganization } from "@/features/settings/hooks/use-current-organization";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { ActivityChart } from "@/features/dashboard/components/activity-chart";
import { TopActionsList } from "@/features/dashboard/components/top-actions-list";
import { MembersStatusDonut } from "@/features/dashboard/components/members-status-donut";
import { ApplicationsList } from "@/features/dashboard/components/applications-list";
import { RecentActivityList } from "@/features/dashboard/components/recent-activity-list";
import { SystemStatusCard } from "@/features/settings/components/system-status-card";
import { ROUTES } from "@/shared/config/routes";

const RECENT_ACTIVITY_LIMIT = 6;

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  const canViewApplications = can(user, "application:view");
  const canViewOrganizations = can(user, "organization:view");
  const canViewRoles = can(user, "role:view");
  const canViewAudit = can(user, "audit:view");

  const applicationsQuery = useApplications(canViewApplications);

  // /dashboard/* is self-scoped on the backend (verifyjwt + resolveTenant
  // only, no permission gate) — every caller gets real numbers back,
  // narrowed to their own account when no organization is active. No
  // `enabled` flag needed here, unlike the feature-specific queries above.
  const overview = useDashboardOverview();
  const resources = useDashboardResources();
  const security = useDashboardSecurity();
  const activity = useDashboardActivity();
  const recentActivity = useDashboardRecentActivity(RECENT_ACTIVITY_LIMIT);

  const { organization } = useCurrentOrganization();
  const canViewMembers = can(user, "member:view");
  const canViewInvitations = can(user, "invitation:view");
  const membersQuery = useMembers(canViewMembers ? (organization?.id ?? "") : "");
  const invitationsQuery = useInvitations(
    canViewInvitations ? (organization?.id ?? "") : "",
  );

  const STATS = [
    {
      key: "applications",
      visible: canViewApplications,
      label: "Applications",
      value: resources.data?.applications,
      icon: AppWindow,
      color: "violet" as const,
    },
    {
      key: "organizations",
      visible: canViewOrganizations,
      label: "Organizations",
      value: resources.data?.organizations,
      icon: Building2,
      color: "blue" as const,
    },
    {
      key: "sessions",
      visible: true,
      label: "Active Sessions",
      value: security.data?.activeSessionsCount,
      icon: Monitor,
      color: "emerald" as const,
    },
    {
      key: "roles",
      visible: canViewRoles,
      label: "Roles",
      value: resources.data?.roles,
      icon: ShieldCheck,
      color: "amber" as const,
    },
    {
      key: "auditLogs",
      visible: canViewAudit,
      label: "Events (30d)",
      value: activity.data?.totalLast30Days,
      icon: ScrollText,
      color: "violet" as const,
    },
  ].filter((stat) => stat.visible);

  const QUICK_LINKS = [
    {
      label: "Applications",
      href: ROUTES.applications,
      icon: AppWindow,
      visible: canViewApplications,
    },
    {
      label: "Organizations",
      href: ROUTES.organizations,
      icon: Building2,
      visible: canViewOrganizations,
    },
    { label: "Sessions", href: ROUTES.sessions, icon: Monitor, visible: true },
    {
      label: "Audit Logs",
      href: ROUTES.auditLogs,
      icon: ScrollText,
      visible: canViewAudit,
    },
  ].filter((link) => link.visible);

  const showMembersWidget = canViewMembers && Boolean(organization);
  const showApplicationsWidget = canViewApplications;

  const chartData = (activity.data?.dailyCounts ?? []).map((d) => ({
    label: format(new Date(d.date), "MMM d"),
    count: d.count,
  }));

  const activityScopeLabel = activity.data?.scopedToSelf
    ? "your account"
    : organization?.name
      ? organization.name
      : "your workspace";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Welcome back{user ? `, ${user.username}` : ""} 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening across your Aegis workspace.
        </p>
      </div>

      {STATS.length > 0 && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((stat) => (
            <StatCard
              key={stat.key}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>
      )}

      {/*
        Unlike the old client-side derivation (which required
        audit:view because it read /audit-logs directly), /dashboard/
        activity and /dashboard/recent-activity are self-scoped on the
        backend and fall back to the caller's own actions when they
        can't see the whole organization — so these are shown to every
        signed-in user, not just audit:view holders.
      */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Activity overview</CardTitle>
            <CardDescription>
              Events for {activityScopeLabel} over the last 7 days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activity.isPending && <Skeleton className="h-[220px] w-full" />}
            {activity.isError && (
              <ErrorState error={activity.error} onRetry={() => activity.refetch()} />
            )}
            {!activity.isPending && !activity.isError && (
              <ActivityChart data={chartData} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top actions</CardTitle>
            <CardDescription>Most frequent events, last 30 days.</CardDescription>
          </CardHeader>
          <CardContent>
            {activity.isPending && <Skeleton className="h-[140px] w-full" />}
            {!activity.isPending && !activity.isError && (
              <TopActionsList actions={activity.data?.topActions ?? []} />
            )}
          </CardContent>
        </Card>
      </div>

      {(showMembersWidget || showApplicationsWidget) && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {showMembersWidget && (
            <Card>
              <CardHeader>
                <CardTitle>Members by Status</CardTitle>
                <CardDescription>
                  {organization ? `Across ${organization.name}.` : "Across your organization."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {membersQuery.isPending && <Skeleton className="h-[140px] w-full" />}
                {membersQuery.isError && (
                  <ErrorState error={membersQuery.error} onRetry={membersQuery.refetch} />
                )}
                {!membersQuery.isPending && !membersQuery.isError && (
                  <MembersStatusDonut
                    members={membersQuery.data ?? []}
                    invitations={
                      canViewInvitations ? (invitationsQuery.data ?? []) : undefined
                    }
                  />
                )}
              </CardContent>
            </Card>
          )}

          {showApplicationsWidget && (
            <Card className={showMembersWidget ? "lg:col-span-2" : "lg:col-span-3"}>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Applications</CardTitle>
                  <CardDescription>Your most recently created applications.</CardDescription>
                </div>
                <Link
                  to={ROUTES.applications}
                  className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  View all
                  <ArrowRight className="size-3.5" />
                </Link>
              </CardHeader>
              <CardContent>
                {applicationsQuery.isPending && (
                  <div className="flex flex-col gap-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                )}
                {applicationsQuery.isError && (
                  <ErrorState error={applicationsQuery.error} onRetry={applicationsQuery.refetch} />
                )}
                {!applicationsQuery.isPending && !applicationsQuery.isError && (
                  <ApplicationsList applications={applicationsQuery.data ?? []} />
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>
                The latest events for {activityScopeLabel}.
              </CardDescription>
            </div>
            {canViewAudit && (
              <Link
                to={ROUTES.auditLogs}
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View all
                <ArrowRight className="size-3.5" />
              </Link>
            )}
          </CardHeader>
          <CardContent>
            {recentActivity.isPending && (
              <div className="flex flex-col gap-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            )}
            {recentActivity.isError && (
              <ErrorState error={recentActivity.error} onRetry={() => recentActivity.refetch()} />
            )}
            {!recentActivity.isPending && !recentActivity.isError && (
              <RecentActivityList entries={recentActivity.data?.items ?? []} />
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          {QUICK_LINKS.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Quick links</CardTitle>
                <CardDescription>Jump to what you manage most.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-1">
                {QUICK_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <link.icon className="size-4 text-muted-foreground" />
                    {link.label}
                    <ArrowRight className="ml-auto size-3.5 text-muted-foreground" />
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          <SystemStatusCard />
        </div>
      </div>

      {STATS.length === 0 &&
        !showMembersWidget &&
        !showApplicationsWidget &&
        !overview.data && (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
              <Users className="size-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Your account doesn&apos;t have visibility into any workspace
                metrics yet — ask an administrator to grant a few view
                permissions.
              </p>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
