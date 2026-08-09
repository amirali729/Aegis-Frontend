import { Bug, Code2, ShieldCheck, Sparkles, TrendingUp, type LucideIcon } from "lucide-react";

import type { ChangelogCategory, ChangelogEntry } from "@/features/developer/changelog/types/changelog.types";

export interface CategoryMeta {
  label: string;
  icon: LucideIcon;
  badgeClass: string;
  iconClass: string;
}

export const CATEGORY_META: Record<ChangelogCategory, CategoryMeta> = {
  "new-feature": {
    label: "New Feature",
    icon: Sparkles,
    badgeClass: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
    iconClass: "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
  },
  improvement: {
    label: "Improvement",
    icon: TrendingUp,
    badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
    iconClass: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  },
  "bug-fix": {
    label: "Bug Fix",
    icon: Bug,
    badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
    iconClass: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  },
  security: {
    label: "Security",
    icon: ShieldCheck,
    badgeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
    iconClass: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  developer: {
    label: "Developer",
    icon: Code2,
    badgeClass: "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-400",
    iconClass: "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-400",
  },
};

/**
 * Placeholder release history — there's no backend changelog/release
 * endpoint, so this is authored directly in code the way a CHANGELOG.md
 * would be. The entries below describe features that are genuinely
 * built (roles/permissions, sessions, API keys, webhooks) so it reads
 * as a plausible history, but the dates and version numbers are
 * illustrative. Replace with your real release history, or wire this
 * page up to a real endpoint if/when one exists.
 */
export const CHANGELOG_ENTRIES: ChangelogEntry[] = [
  {
    version: "v1.3.0",
    date: "2026-05-27",
    title: "Advanced Roles & Permissions",
    description: "Granular permissions, scoped roles, and improved access control.",
    isLatest: true,
    categories: ["new-feature", "security", "improvement"],
    items: [
      "Added fine-grained permission management",
      "Introduced role templates for faster setup",
      "Added permission inheritance for organizations",
      "Improved UI for role and permission assignment",
      "Audit logs now capture role and permission changes",
    ],
  },
  {
    version: "v1.2.0",
    date: "2026-05-12",
    title: "Sessions & Security Enhancements",
    description: "Better session management and security improvements.",
    categories: ["security", "improvement"],
    items: [
      "Added device & location tracking for sessions",
      "Added ability to revoke all user sessions",
      "Refresh token rotation is now enabled by default",
      "Improved brute-force protection and rate limiting",
    ],
  },
  {
    version: "v1.1.0",
    date: "2026-04-28",
    title: "API Keys & Webhooks",
    description: "New developer tools to extend and integrate Aegis easily.",
    categories: ["new-feature", "developer"],
    items: [
      "API keys can now be scoped to specific permissions",
      "Added webhook support for real-time events",
      "Webhook delivery logs and retry mechanism",
      "New endpoints for managing API keys",
    ],
  },
  {
    version: "v1.0.0",
    date: "2026-04-10",
    title: "Initial Release",
    description: "The first stable release of the Aegis Identity Platform.",
    categories: ["new-feature"],
    items: [
      "User authentication (signup, login, logout)",
      "Email verification and password reset",
      "Organizations and memberships",
      "Roles & permissions (basic) and audit logs",
    ],
  },
];
