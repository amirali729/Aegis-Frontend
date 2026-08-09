import { Link } from "react-router-dom";
import { CheckCircle2, ChevronRight } from "lucide-react";

import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import { useFormattedDateTime } from "@/shared/timezone/format";
import { ROUTES } from "@/shared/config/routes";
import { CATEGORY_META } from "@/features/developer/changelog/data/changelog-entries";
import type { ChangelogEntry } from "@/features/developer/changelog/types/changelog.types";

export function ChangelogEntryCard({ entry }: { entry: ChangelogEntry }) {
  const formatted = useFormattedDateTime(entry.date);

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <div className="flex shrink-0 flex-col items-center sm:w-28">
          <p className="text-sm font-medium text-muted-foreground">{formatted.date}</p>
          {entry.isLatest && (
            <Badge variant="default" className="mt-1">
              Latest
            </Badge>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="default">{entry.version}</Badge>
              {entry.isLatest && <Badge variant="success">New</Badge>}
            </div>
            <Link
              to={ROUTES.developerChangelogDetail(entry.version)}
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View details
              <ChevronRight className="size-3.5" />
            </Link>
          </div>

          <h3 className="mt-2 text-lg font-semibold">{entry.title}</h3>
          <p className="text-sm text-muted-foreground">{entry.description}</p>

          <ul className="mt-3 flex flex-col gap-1.5">
            {entry.items.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex flex-wrap gap-2">
            {entry.categories.map((category) => {
              const meta = CATEGORY_META[category];
              return (
                <span
                  key={category}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
                    meta.badgeClass,
                  )}
                >
                  <meta.icon className="size-3" />
                  {meta.label}
                </span>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
