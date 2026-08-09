export type ChangelogCategory =
  | "new-feature"
  | "improvement"
  | "bug-fix"
  | "security"
  | "developer";

export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  description: string;
  isLatest?: boolean;
  categories: ChangelogCategory[];
  items: string[];
}
