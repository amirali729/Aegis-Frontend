import { Outlet } from "react-router-dom";

import { appConfig } from "@/shared/config/app";
import { ShieldCheck } from "lucide-react";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-muted/30 p-4">
      <div className="flex items-center gap-2 text-foreground">
        <ShieldCheck className="size-6" />
        <span className="text-lg font-semibold">{appConfig.name}</span>
      </div>
      <Outlet />
    </div>
  );
}