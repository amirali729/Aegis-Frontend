import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/empty-state";
import { ROUTES } from "@/shared/config/routes";
import { CHANGELOG_ENTRIES } from "@/features/developer/changelog/data/changelog-entries";
import { ChangelogEntryCard } from "@/features/developer/changelog/components/changelog-entry-card";

export default function ChangelogDetailPage() {
  const { version } = useParams<{ version: string }>();
  const entry = CHANGELOG_ENTRIES.find((item) => item.version === version);

  return (
    <div className="flex flex-col gap-6">
      <Button variant="ghost" size="sm" className="w-fit" render={<Link to={ROUTES.developerChangelog} />}>
        <ArrowLeft />
        Back to changelog
      </Button>

      {entry ? (
        <ChangelogEntryCard entry={entry} />
      ) : (
        <EmptyState
          title="Release not found"
          description={`There's no changelog entry for "${version}".`}
        />
      )}
    </div>
  );
}
