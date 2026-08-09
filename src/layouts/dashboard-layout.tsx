import { Outlet } from "react-router-dom";

import { Sidebar } from "@/layouts/sidebar";
import { Topbar } from "@/layouts/topbar";
import { CommandPalette } from "@/features/command-palette/components/command-palette";
import { useCommandPaletteShortcut } from "@/features/command-palette/hooks/use-command-palette-shortcut";

export function DashboardLayout() {
  useCommandPaletteShortcut();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      <CommandPalette />
    </div>
  );
}