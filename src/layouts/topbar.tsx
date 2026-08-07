import { Link } from "react-router-dom";
import {
  CircleHelp,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  UserCircle,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useSidebarStore } from "@/app/store/sidebar-store";
import { useThemeStore } from "@/app/store/theme-store";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { useLogout } from "@/features/auth/mutations/use-logout";
import { ROUTES } from "@/shared/config/routes";
import { appConfig } from "@/shared/config/app";
import { NotificationBell } from "@/features/notifications/components/notification-bell";

function initials(username: string) {
  return username.slice(0, 2).toUpperCase();
}

export function Topbar() {
  const toggleSidebar = useSidebarStore((state) => state.toggle);
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  const isDark = theme === "dark";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border px-4">
      <div className="flex flex-1 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu />
        </Button>

        <div className="relative hidden max-w-sm flex-1 sm:block">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search anything..."
            aria-label="Search"
            className="h-8 w-full rounded-lg border border-border bg-muted/50 pr-12 pl-8 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          {isDark ? <Sun /> : <Moon />}
        </Button>

        <NotificationBell />

        <Button
          variant="ghost"
          size="icon"
          aria-label="Help"
          render={
            <a href={appConfig.documentationUrl} target="_blank" rel="noreferrer" />
          }
        >
          <CircleHelp />
        </Button>

        <div className="mx-1 h-6 w-px bg-border" />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg py-1 pr-1 pl-1.5 text-left outline-none hover:bg-muted"
              >
                <Avatar className="size-7">
                  <AvatarFallback>
                    {user ? initials(user.username) : "?"}
                  </AvatarFallback>
                </Avatar>
                {user && (
                  <span className="hidden text-sm font-medium sm:inline">
                    {user.username}
                  </span>
                )}
              </button>
            }
          />
          <DropdownMenuContent>
            <DropdownMenuLabel>{user?.email ?? "Account"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link to={ROUTES.settingsProfile} />}>
              <UserCircle />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link to={ROUTES.settings} />}>
              <Settings />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => logout.mutate()}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}