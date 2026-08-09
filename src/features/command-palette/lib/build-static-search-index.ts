import type { LucideIcon } from "lucide-react";

import { NAV_ITEMS } from "@/layouts/nav-items";
import { SETTINGS_NAV } from "@/features/settings/settings-nav";

export type SearchResultGroup =
  | "Pages"
  | "Organizations"
  | "Applications"
  | "Roles"
  | "Permissions";

export interface SearchResult {
  id: string;
  group: SearchResultGroup;
  label: string;
  description?: string;
  href: string;
  icon: LucideIcon;
  /** Extra terms cmdk should match against besides `label` (e.g. a slug or key). */
  keywords?: string[];
}

/**
 * Static, always-available results — every navigable page, sourced from
 * the same config the sidebar and settings nav already use (so this
 * never drifts out of sync with what's actually in the app).
 */
export function buildStaticPageResults(): SearchResult[] {
  const navPages: SearchResult[] = NAV_ITEMS.map((item) => ({
    id: `page:${item.href}`,
    group: "Pages",
    label: item.label,
    href: item.href,
    icon: item.icon,
  }));

  const settingsPages: SearchResult[] = SETTINGS_NAV.map((item) => ({
    id: `page:${item.href}`,
    group: "Pages",
    label: `Settings — ${item.label}`,
    description: item.description,
    href: item.href,
    icon: item.icon,
  }));

  return [...navPages, ...settingsPages];
}
