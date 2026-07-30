import { NavLink, Outlet } from "react-router-dom";

import { cn } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/config/routes";

const SETTINGS_NAV = [
  { label: "Profile", href: ROUTES.settingsProfile },
  { label: "Security", href: ROUTES.settingsSecurity },
  { label: "Localization", href: ROUTES.settingsLocalization },
  { label: "Organization", href: ROUTES.settingsOrganization },
];

export default function SettingsLayout() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="flex gap-6">
        <nav className="flex w-48 shrink-0 flex-col gap-1">
          {SETTINGS_NAV.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
                  isActive && "bg-muted text-foreground",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}