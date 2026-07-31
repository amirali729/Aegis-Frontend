import { NavLink } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { appConfig } from "@/shared/config/app";
import { NAV_GROUPS } from "@/layouts/nav-items";
import { useSidebarStore } from "@/app/store/sidebar-store";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { can } from "@/shared/permissions/can";

export function Sidebar() {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  const user = useAuthStore((state) => state.user);
  console.warn(user?.permissions)
  console.warn(user)

  return (
    <aside
      className={cn(
        "flex shrink-0 flex-col bg-sidebar text-sidebar-foreground transition-[width] duration-200",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-14 items-center gap-2.5 px-4">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
          <ShieldCheck className="size-4 text-sidebar-primary-foreground" />
        </div>
        {!isCollapsed && (
          <span className="truncate text-sm font-semibold text-white">
            {appConfig.name}
          </span>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => {
          const items = group.items.filter(
            (item) => !item.permission || can(user, item.permission),
          );
          if (items.length === 0) return null;

          return (
            <div key={group.label} className="flex flex-col gap-1">
              {!isCollapsed && (
                <span className="px-2.5 pb-1 text-[11px] font-semibold tracking-wider text-sidebar-foreground/45 uppercase">
                  {group.label}
                </span>
              )}
              {items.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  title={isCollapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-sidebar-foreground/80 transition-colors",
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      isActive &&
                        "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
                    )
                  }
                >
                  <item.icon className="size-4 shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>
      {/* <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => {
          const items = group.items

          return (
            <div key={group.label} className="flex flex-col gap-1">
              {!isCollapsed && (
                <span className="px-2.5 pb-1 text-[11px] font-semibold tracking-wider text-sidebar-foreground/45 uppercase">
                  {group.label}
                </span>
              )}
              {items.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  title={isCollapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-sidebar-foreground/80 transition-colors",
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      isActive &&
                        "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
                    )
                  }
                >
                  <item.icon className="size-4 shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav> */}
    </aside>
  );
}