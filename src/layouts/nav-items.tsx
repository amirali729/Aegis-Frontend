import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  AppWindow,
  ShieldCheck,
  KeyRound,
  Building2,
  ScrollText,
  Settings,
  Monitor,
} from "lucide-react";

import { ROUTES } from "@/shared/config/routes";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Permission required to see this item; omit for always-visible items. */
  permission?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
  {
    label: "Applications",
    href: ROUTES.applications,
    icon: AppWindow,
    permission: "application:view",
  },
  {
    label: "Roles",
    href: ROUTES.roles,
    icon: ShieldCheck,
    permission: "role:view",
  },
  {
    label: "Permissions",
    href: ROUTES.permissions,
    icon: KeyRound,
    permission: "permission:view",
  },
  {
    label: "Organizations",
    href: ROUTES.organizations,
    icon: Building2,
    permission: "organization:view",
  },
  { label: "Sessions", href: ROUTES.sessions, icon: Monitor },
  {
    label: "Audit Logs",
    href: ROUTES.auditLogs,
    icon: ScrollText,
    permission: "audit:view",
  },
  { label: "Settings", href: ROUTES.settings, icon: Settings },
];