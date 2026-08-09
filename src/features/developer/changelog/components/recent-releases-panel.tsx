import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { useFormattedDateTime } from "@/shared/timezone/format";
import { ROUTES } from "@/shared/config/routes";
import type { ChangelogEntry } from "@/features/developer/changelog/types/changelog.types";

function RecentReleaseRow({ entry }: { entry: ChangelogEntry }) {
  const formatted = useFormattedDateTime(entry.date);

  return (
    <Link
      to={ROUTES.developerChangelogDetail(entry.version)}
      className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 hover:bg-muted"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{entry.title}</p>
        <p className="text-xs text-muted-foreground">
          {entry.version} · {formatted.date}
        </p>
      </div>
      {entry.isLatest && <Badge variant="default">Latest</Badge>}
    </Link>
  );
}

export function RecentReleasesPanel({
  entries,
  onViewAll,
}: {
  entries: ChangelogEntry[];
  onViewAll: () => void;
}) {
  const recent = entries.slice(0, 4);

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="border-b border-border py-4">
        <CardTitle className="text-base">Recent Releases</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-0.5 p-2">
        {recent.map((entry) => (
          <RecentReleaseRow key={entry.version} entry={entry} />
        ))}
        <button
          type="button"
          onClick={onViewAll}
          className="mt-1 flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-medium text-primary hover:bg-muted"
        >
          View all releases
          <ArrowRight className="size-3.5" />
        </button>
      </CardContent>
    </Card>
  );
}
