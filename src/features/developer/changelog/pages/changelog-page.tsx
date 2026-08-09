import { useMemo, useState } from "react";
import { ScrollText } from "lucide-react";

import { EmptyState } from "@/shared/components/empty-state";
import { CHANGELOG_ENTRIES } from "@/features/developer/changelog/data/changelog-entries";
import { ChangelogEntryCard } from "@/features/developer/changelog/components/changelog-entry-card";
import { ChangelogFilters } from "@/features/developer/changelog/components/changelog-filters";
import { ChangelogCategoriesPanel } from "@/features/developer/changelog/components/changelog-categories-panel";
import { ChangelogSubscribePanel } from "@/features/developer/changelog/components/changelog-subscribe-panel";
import { RecentReleasesPanel } from "@/features/developer/changelog/components/recent-releases-panel";
import type { ChangelogCategory } from "@/features/developer/changelog/types/changelog.types";

type CategoryFilter = ChangelogCategory | "all";

export default function ChangelogPage() {
  const [search, setSearch] = useState("");
  const [version, setVersion] = useState("all");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const versions = useMemo(() => CHANGELOG_ENTRIES.map((entry) => entry.version), []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return CHANGELOG_ENTRIES.filter((entry) => {
      if (version !== "all" && entry.version !== version) return false;
      if (category !== "all" && !entry.categories.includes(category)) return false;
      if (!query) return true;

      const haystack = [entry.title, entry.description, entry.version, ...entry.items]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [search, version, category]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Changelog</h1>
        <p className="text-sm text-muted-foreground">
          Stay up to date with the latest features, improvements, and fixes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <ChangelogFilters
            search={search}
            onSearchChange={setSearch}
            versions={versions}
            version={version}
            onVersionChange={setVersion}
          />

          {filtered.length === 0 ? (
            <EmptyState
              icon={ScrollText}
              title="No releases found"
              description="Try a different search term or filter."
            />
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.map((entry) => (
                <ChangelogEntryCard key={entry.version} entry={entry} />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <ChangelogSubscribePanel />
          <ChangelogCategoriesPanel entries={CHANGELOG_ENTRIES} active={category} onChange={setCategory} />
          <RecentReleasesPanel
            entries={CHANGELOG_ENTRIES}
            onViewAll={() => {
              setSearch("");
              setVersion("all");
              setCategory("all");
            }}
          />
        </div>
      </div>
    </div>
  );
}
