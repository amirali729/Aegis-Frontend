import type { LucideIcon } from "lucide-react";

import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";

const ICON_STYLES = {
  violet: "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  emerald:
    "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  amber: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
} as const;

interface StatCardProps {
  label: string;
  value: number | undefined;
  icon: LucideIcon;
  color?: keyof typeof ICON_STYLES;
}

export function StatCard({ label, value, icon: Icon, color = "violet" }: StatCardProps) {
  return (
    <Card className="flex-row items-center gap-3 p-4">
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl",
          ICON_STYLES[color],
        )}
      >
        <Icon className="size-5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        {value === undefined ? (
          <Skeleton className="mt-1 h-6 w-12" />
        ) : (
          <p className="text-xl font-semibold tabular-nums">{value.toLocaleString()}</p>
        )}
      </div>
    </Card>
  );
}