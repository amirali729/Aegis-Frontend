import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, ShieldCheck } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { appConfig } from "@/shared/config/app";
import { useSidebarStore } from "@/app/store/sidebar-store";
import { ADMIN_NAV_GROUPS } from "@/features/admin/layout/admin-nav-items";

export function AdminSidebar() {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);
  const toggle = useSidebarStore((state) => state.toggle);
  const location = useLocation();
  const [expandedItem, setExpandedItem] = useState<string | null>("Users");

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
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{appConfig.name}</p>
            <p className="truncate text-[10px] font-medium text-sidebar-foreground/50">
              Admin Platform
            </p>
          </div>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-4">
        {ADMIN_NAV_GROUPS.map((group, groupIndex) => (
          <div key={groupIndex} className="flex flex-col gap-1">
            {group.items.map((item) => {
              const isActive = item.children
                ? location.pathname.startsWith(item.href)
                : location.pathname === item.href;
              const isExpanded = expandedItem === item.label;

              return (
                <div key={item.href}>
                  {item.children ? (
                    <button
                      type="button"
                      title={isCollapsed ? item.label : undefined}
                      onClick={() => setExpandedItem(isExpanded ? null : item.label)}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-sidebar-foreground/80 transition-colors",
                        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        isActive &&
                          "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
                      )}
                    >
                      <item.icon className="size-4 shrink-0" />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 truncate text-left">{item.label}</span>
                          <ChevronDown
                            className={cn(
                              "size-3.5 shrink-0 transition-transform",
                              isExpanded && "rotate-180",
                            )}
                          />
                        </>
                      )}
                    </button>
                  ) : (
                    <NavLink
                      to={item.href}
                      title={isCollapsed ? item.label : undefined}
                      className={({ isActive: linkActive }) =>
                        cn(
                          "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-sidebar-foreground/80 transition-colors",
                          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          linkActive &&
                            "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
                        )
                      }
                    >
                      <item.icon className="size-4 shrink-0" />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </NavLink>
                  )}

                  {item.children && isExpanded && !isCollapsed && (
                    <div className="mt-1 ml-4 flex flex-col gap-0.5 border-l border-sidebar-border pl-3.5">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.href}
                          to={child.href}
                          className={({ isActive: childActive }) =>
                            cn(
                              "rounded-md px-2.5 py-1.5 text-sm text-sidebar-foreground/70 transition-colors",
                              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                              childActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                            )
                          }
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <button
          type="button"
          onClick={toggle}
          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <ChevronDown className={cn("size-4 rotate-90", isCollapsed && "-rotate-90")} />
          {!isCollapsed && "Collapse"}
        </button>
      </div>
    </aside>
  );
}
