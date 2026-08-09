import { Search } from "lucide-react";

import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

export function ChangelogFilters({
  search,
  onSearchChange,
  versions,
  version,
  onVersionChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  versions: string[];
  version: string;
  onVersionChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search releases..."
          className="pl-9"
        />
      </div>

      <Select value={version} onValueChange={(v) => v && onVersionChange(v)}>
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Versions</SelectItem>
          {versions.map((v) => (
            <SelectItem key={v} value={v}>
              {v}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
