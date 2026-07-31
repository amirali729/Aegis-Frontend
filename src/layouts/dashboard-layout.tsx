import { NavLink, Outlet } from "react-router-dom";
import { LogOut, Menu, ShieldCheck } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { appConfig } from "@/shared/config/app";
import { NAV_ITEMS } from "@/layouts/nav-items";
import { useSidebarStore } from "@/app/store/sidebar-store";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { useLogout } from "@/features/auth/mutations/use-logout";
import { can } from "@/shared/permissions/can";

export function DashboardLayout() {
  const { isCollapsed, toggle } = useSidebarStore();
  const user = useAuthStore((state) => state.user);
// console.warn("===== USER =====");
// console.warn(user);
// console.warn("===== PERMISSIONS =====");
// console.warn(user?.permissions);

  const logout = useLogout();

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          "flex shrink-0 flex-col border-r border-border bg-card transition-all",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        <div className="flex h-14 items-center gap-2 border-b border-border px-4">
          <ShieldCheck className="size-5 shrink-0" />
          {!isCollapsed && (
            <span className="truncate text-sm font-semibold">
              {appConfig.name}
            </span>
          )}
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  isActive && "bg-muted text-foreground",
                )
              }
            >
              <item.icon className="size-4 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-border px-4">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle sidebar">
            <Menu />
          </Button>

          <div className="flex items-center gap-3">
            {user && (
              <span className="text-sm text-muted-foreground">
                {user.username}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Log out"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
            >
              <LogOut />
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}