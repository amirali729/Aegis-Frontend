import type { LucideIcon } from "lucide-react";
import {
  User,
  SlidersHorizontal,
  ShieldCheck,
  Bell,
  Paintbrush,
  CreditCard,
  ScrollText,
  Lock,
  Plug,
  Code2,
  TriangleAlert,
} from "lucide-react";

import { ROUTES } from "@/shared/config/routes";

export interface SettingsNavItem {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  /** Permission required to see this item; omit for always-visible items. */
  permission?: string;
  danger?: boolean;
}

export const SETTINGS_NAV: SettingsNavItem[] = [
  {
    label: "Profile",
    description: "Manage your personal information",
    href: ROUTES.settingsProfile,
    icon: User,
  },
  {
    label: "General",
    description: "Basic account and platform settings",
    href: ROUTES.settingsGeneral,
    icon: SlidersHorizontal,
  },
  {
    label: "Security",
    description: "Password, 2FA and security options",
    href: ROUTES.settingsSecurity,
    icon: ShieldCheck,
  },
  {
    label: "Notifications",
    description: "Email and in-app notification settings",
    href: ROUTES.settingsNotifications,
    icon: Bell,
  },
  {
    label: "Appearance",
    description: "Theme, brand and UI preferences",
    href: ROUTES.settingsAppearance,
    icon: Paintbrush,
  },
  {
    label: "Billing & Plan",
    description: "Manage your plan and billing",
    href: ROUTES.settingsBilling,
    icon: CreditCard,
  },
  {
    label: "Audit & Logs",
    description: "Retention and log settings",
    href: ROUTES.settingsAuditLogs,
    icon: ScrollText,
    permission: "audit:view",
  },
  {
    label: "Data & Privacy",
    description: "Data export and privacy controls",
    href: ROUTES.settingsDataPrivacy,
    icon: Lock,
  },
  {
    label: "Integrations",
    description: "Third-party services and integrations",
    href: ROUTES.settingsIntegrations,
    icon: Plug,
  },
  {
    label: "Developer",
    description: "API and developer preferences",
    href: ROUTES.settingsDeveloper,
    icon: Code2,
  },
  {
    label: "Danger Zone",
    description: "Irreversible and destructive actions",
    href: ROUTES.settingsDanger,
    icon: TriangleAlert,
    danger: true,
  },
];