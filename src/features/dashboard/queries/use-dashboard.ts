import { useQuery } from "@tanstack/react-query";

import { dashboardApi } from "@/features/dashboard/api/dashboard.api";
import { queryKeys } from "@/shared/query/query-keys";

/**
 * Every /dashboard/* route (except system-health, which the Admin
 * section owns separately) is gated only by `verifyjwt` + resolveTenant
 * on the backend — no permission check, same pattern as /settings and
 * /sessions. So these never take an `enabled` permission flag; they
 * just reflect whatever the caller is already entitled to see for
 * their own account and, if an org is active, that org.
 */
export function useDashboardOverview() {
  return useQuery({
    queryKey: queryKeys.dashboard.overview,
    queryFn: () => dashboardApi.getOverview(),
  });
}

export function useDashboardActivity() {
  return useQuery({
    queryKey: queryKeys.dashboard.activity,
    queryFn: () => dashboardApi.getActivity(),
  });
}

export function useDashboardSecurity() {
  return useQuery({
    queryKey: queryKeys.dashboard.security,
    queryFn: () => dashboardApi.getSecurity(),
  });
}

export function useDashboardResources() {
  return useQuery({
    queryKey: queryKeys.dashboard.resources,
    queryFn: () => dashboardApi.getResources(),
  });
}

export function useDashboardRecentActivity(limit?: number) {
  return useQuery({
    queryKey: queryKeys.dashboard.recentActivity(limit),
    queryFn: () => dashboardApi.getRecentActivity(limit),
  });
}
