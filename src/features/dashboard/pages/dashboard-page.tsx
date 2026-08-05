import { Link } from "react-router-dom";
import {
  AppWindow,
  Building2,
  Monitor,
  ScrollText,
  ShieldCheck,
  ArrowRight,
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
import { useApplications } from "@/features/applications/queries/use-applications";
import { useOrganizations } from "@/features/organizations/queries/use-organizations";
import { useSessions } from "@/features/sessions/queries/use-sessions";
import { useRoles } from "@/features/roles/queries/use-roles";
import { useDashboardActivity } from "@/features/dashboard/hooks/use-dashboard-activity";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { ActivityChart } from "@/features/dashboard/components/activity-chart";
import { OutcomeDonut } from "@/features/dashboard/components/outcome-donut";
import { RecentActivityList } from "@/features/dashboard/components/recent-activity-list";
import { ROUTES } from "@/shared/config/routes";

const QUICK_LINKS = [
  { label: "Applications", href: ROUTES.applications, icon: AppWindow },
  { label: "Organizations", href: ROUTES.organizations, icon: Building2 },
  { label: "Sessions", href: ROUTES.sessions, icon: Monitor },
  { label: "Audit Logs", href: ROUTES.auditLogs, icon: ScrollText },
];

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const applicationsQuery = useApplications();
  const organizationsQuery = useOrganizations();
  const sessionsQuery = useSessions();
  const rolesQuery = useRoles();
  const activity = useDashboardActivity();

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

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Applications"
          value={applicationsQuery.data?.length}
          icon={AppWindow}
          color="violet"
        />
        <StatCard
          label="Organizations"
          value={organizationsQuery.data?.length}
          icon={Building2}
          color="blue"
        />
        <StatCard
          label="Active Sessions"
          value={sessionsQuery.data?.length}
          icon={Monitor}
          color="emerald"
        />
        <StatCard
          label="Roles"
          value={rolesQuery.data?.length}
          icon={ShieldCheck}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Activity overview</CardTitle>
            <CardDescription>Audit log events over the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent>
            {activity.isPending && <Skeleton className="h-[220px] w-full" />}
            {activity.isError && (
              <ErrorState error={activity.error} onRetry={activity.refetch} />
            )}
            {!activity.isPending && !activity.isError && (
              <ActivityChart data={activity.dailyActivity} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Event outcomes</CardTitle>
            <CardDescription>Success vs. failure, most recent events.</CardDescription>
          </CardHeader>
          <CardContent>
            {activity.isPending && <Skeleton className="h-[140px] w-full" />}
            {!activity.isPending && !activity.isError && (
              <OutcomeDonut
                data={activity.outcomeBreakdown}
                total={activity.totalEvents}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>The latest events across your workspace.</CardDescription>
            </div>
            <Link
              to={ROUTES.auditLogs}
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View all
              <ArrowRight className="size-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            {activity.isPending && (
              <div className="flex flex-col gap-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            )}
            {!activity.isPending && !activity.isError && (
              <RecentActivityList entries={activity.recentLogs} />
            )}
          </CardContent>
        </Card>

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
      </div>
    </div>
  );
}