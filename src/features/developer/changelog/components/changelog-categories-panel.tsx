import { LayoutGrid } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";
import { CATEGORY_META } from "@/features/developer/changelog/data/changelog-entries";
import type { ChangelogCategory, ChangelogEntry } from "@/features/developer/changelog/types/changelog.types";

type CategoryFilter = ChangelogCategory | "all";

const CATEGORY_ORDER: ChangelogCategory[] = [
  "new-feature",
  "improvement",
  "bug-fix",
  "security",
  "developer",
];

export function ChangelogCategoriesPanel({
  entries,
  active,
  onChange,
}: {
  entries: ChangelogEntry[];
  active: CategoryFilter;
  onChange: (category: CategoryFilter) => void;
}) {
  const countFor = (category: ChangelogCategory) =>
    entries.filter((entry) => entry.categories.includes(category)).length;

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b border-border py-4">
        <CardTitle className="text-base">Categories</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 p-2">
        <button
          type="button"
          onClick={() => onChange("all")}
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:bg-muted",
            active === "all" && "bg-muted",
          )}
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <LayoutGrid className="size-4" />
          </span>
          <span className="flex-1 font-medium">All Updates</span>
          <span className="text-sm text-muted-foreground">{entries.length}</span>
        </button>

        {CATEGORY_ORDER.map((category) => {
          const meta = CATEGORY_META[category];
          const count = countFor(category);
          if (count === 0) return null;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onChange(category)}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:bg-muted",
                active === category && "bg-muted",
              )}
            >
              <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-lg", meta.iconClass)}>
                <meta.icon className="size-4" />
              </span>
              <span className="flex-1 font-medium">{meta.label}s</span>
              <span className="text-sm text-muted-foreground">{count}</span>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
