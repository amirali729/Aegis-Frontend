import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Building2,
  AppWindow,
  KeyRound,
  Monitor,
  ScrollText,
  BarChart3,
  Activity,
  HeartPulse,
  ListChecks,
  Flag,
  Megaphone,
  ShieldAlert,
  Settings,
  FileBarChart,
  LifeBuoy,
} from "lucide-react";

import { ROUTES } from "@/shared/config/routes";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** True once the page is actually built — everything else renders a "coming soon" placeholder. */
  isBuilt?: boolean;
  children?: { label: string; href: string; isBuilt?: boolean }[];
}

export interface AdminNavGroup {
  items: AdminNavItem[];
}

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    items: [
      { label: "Overview", href: ROUTES.adminOverview, icon: LayoutDashboard, isBuilt: true },
      {
        label: "Users",
        href: ROUTES.adminUsers,
        icon: Users,
        isBuilt: true,
        children: [
          { label: "All Users", href: ROUTES.adminUsers, isBuilt: true },
          { label: "Invitations", href: ROUTES.adminUserInvitations },
          { label: "User Roles", href: ROUTES.adminUserRoles },
        ],
      },
      { label: "Organizations", href: ROUTES.adminOrganizations, icon: Building2 },
      { label: "Applications", href: ROUTES.adminApplications, icon: AppWindow },
      { label: "OAuth Clients", href: ROUTES.adminOAuthClients, icon: KeyRound },
      { label: "API Keys", href: ROUTES.adminApiKeys, icon: KeyRound },
      { label: "Sessions", href: ROUTES.adminSessions, icon: Monitor },
      { label: "Audit Logs", href: ROUTES.adminAuditLogs, icon: ScrollText },
    ],
  },
  {
    items: [
      { label: "Metrics", href: ROUTES.adminMetrics, icon: BarChart3 },
      { label: "Monitoring", href: ROUTES.adminMonitoring, icon: Activity },
      { label: "Health", href: ROUTES.adminHealth, icon: HeartPulse },
    ],
  },
  {
    items: [
      { label: "Jobs", href: ROUTES.adminJobs, icon: ListChecks },
      { label: "Feature Flags", href: ROUTES.adminFeatureFlags, icon: Flag },
      { label: "Announcements", href: ROUTES.adminAnnouncements, icon: Megaphone },
    ],
  },
  {
    items: [
      { label: "Security", href: ROUTES.adminSecurity, icon: ShieldAlert },
      { label: "System Settings", href: ROUTES.adminSystemSettings, icon: Settings },
    ],
  },
  {
    items: [
      { label: "Reports", href: ROUTES.adminReports, icon: FileBarChart },
      { label: "Support Tools", href: ROUTES.adminSupportTools, icon: LifeBuoy },
    ],
  },
];

/** Flat list of every admin nav route (including sub-items) — used to build placeholder routes. */
export const ADMIN_NAV_FLAT_ITEMS: { label: string; href: string; isBuilt?: boolean }[] =
  ADMIN_NAV_GROUPS.flatMap((group) =>
    group.items.flatMap((item) => [
      { label: item.label, href: item.href, isBuilt: item.isBuilt },
      ...(item.children ?? []),
    ]),
  );
