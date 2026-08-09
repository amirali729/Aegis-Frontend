import { Outlet } from "react-router-dom";

import { Topbar } from "@/layouts/topbar";
import { CommandPalette } from "@/features/command-palette/components/command-palette";
import { useCommandPaletteShortcut } from "@/features/command-palette/hooks/use-command-palette-shortcut";
import { AdminSidebar } from "@/features/admin/layout/admin-sidebar";

export function AdminLayout() {
  useCommandPaletteShortcut();

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar searchPlaceholder="Search users, orgs, apps, sessions..." />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      <CommandPalette />
    </div>
  );
}
