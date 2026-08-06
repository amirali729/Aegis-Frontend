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
  Code2,
} from "lucide-react";

import { ROUTES } from "@/shared/config/routes";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Permission required to see this item; omit for always-visible items. */
  permission?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
      {
        label: "Applications",
        href: ROUTES.applications,
        icon: AppWindow,
        permission: "application:view",
      },
      { label: "Sessions", href: ROUTES.sessions, icon: Monitor },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        label: "Organizations",
        href: ROUTES.organizations,
        icon: Building2,
        permission: "organization:view",
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
        label: "Audit Logs",
        href: ROUTES.auditLogs,
        icon: ScrollText,
        permission: "audit:view",
      },
    ],
  },
  {
    label: "Other",
    items: [{ label: "Settings", href: ROUTES.settings, icon: Settings }],
  },
  {
    label: "Developer",
    items: [
      { label: "SDK", href: ROUTES.developerSdk, icon: Code2 },
      { label: "API Reference", href: ROUTES.developerApiReference, icon: Code2 },
      {
        label: "OAuth Playground",
        href: ROUTES.developerOAuthPlayground,
        icon: KeyRound,
      },
      { label: "Webhooks", href: ROUTES.developerWebhooks, icon: Code2 },
      { label: "OpenAPI", href: ROUTES.developerOpenapi, icon: Code2 },
      { label: "Postman Collection", href: ROUTES.developerPostman, icon: Code2 },
      { label: "Changelog", href: ROUTES.developerChangelog, icon: Code2 },
    ],
  },
];

/** Flat list, kept for anything that needs every item regardless of grouping. */
export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((group) => group.items);