import { apiGet } from "@/shared/api/request";
import type {
  Overview,
  Activity,
  Security,
  Resources,
  RecentActivity,
} from "@/features/dashboard/types/dashboard.types";

export const dashboardApi = {
  getOverview() {
    return apiGet<Overview>("/dashboard/overview");
  },

  getActivity() {
    return apiGet<Activity>("/dashboard/activity");
  },

  getSecurity() {
    return apiGet<Security>("/dashboard/security");
  },

  getResources() {
    return apiGet<Resources>("/dashboard/resources");
  },

  /** `limit` max 50 per Auth_System recentActivityQuerySchema; defaults to 10 server-side. */
  getRecentActivity(limit?: number) {
    return apiGet<RecentActivity>("/dashboard/recent-activity", {
      params: limit ? { limit } : undefined,
    });
  },
};
