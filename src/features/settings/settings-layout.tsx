import { NavLink, Outlet } from "react-router-dom";

import { cn } from "@/shared/lib/utils";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { can } from "@/shared/permissions/can";
import { SETTINGS_NAV } from "@/features/settings/settings-nav";

export default function SettingsLayout() {
  const user = useAuthStore((state) => state.user);
  const items = SETTINGS_NAV.filter(
    (item) => !item.permission || can(user, item.permission),
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account, security, and platform preferences.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <nav className="flex w-full shrink-0 flex-col gap-1 lg:w-64">
          {items.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-start gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm transition-colors",
                  "hover:bg-muted",
                  isActive &&
                    "border-primary/15 bg-accent text-accent-foreground hover:bg-accent",
                  item.danger && !isActive && "hover:bg-destructive/10",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn(
                      "mt-0.5 size-4 shrink-0",
                      isActive
                        ? "text-primary"
                        : item.danger
                          ? "text-destructive"
                          : "text-muted-foreground",
                    )}
                  />
                  <span className="flex flex-col">
                    <span
                      className={cn(
                        "font-medium",
                        item.danger && "text-destructive",
                      )}
                    >
                      {item.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}