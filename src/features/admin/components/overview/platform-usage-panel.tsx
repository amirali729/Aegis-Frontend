import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";

interface PlatformUsageMetric {
  label: string;
  used: number;
  limit: number;
  unit: string;
}

/**
 * No plan/quota/usage-limit endpoint exists anywhere in the API guide —
 * there's nothing real to back a "usage vs plan limit" panel with. This
 * stays illustrative placeholder data, visibly labeled "Preview" in the
 * UI itself (not just a code comment) so it can't be mistaken for real
 * numbers. Replace with a real endpoint if/when one exists, or remove
 * this panel entirely.
 */
const PLACEHOLDER_USAGE: PlatformUsageMetric[] = [
  { label: "Monthly Active Users", used: 28_700, limit: 100_000, unit: "" },
  { label: "Storage Used", used: 128, limit: 1000, unit: "GB" },
  { label: "Background Jobs", used: 2_300_000, limit: 20_000_000, unit: "" },
];

function formatCount(value: number, unit: string): string {
  if (unit) return `${value.toLocaleString()} ${unit}`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

export function PlatformUsagePanel() {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="flex-row items-center justify-between border-b border-border py-4">
        <CardTitle className="text-base">Platform Usage</CardTitle>
        <Badge variant="outline">Preview — no usage API yet</Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-4">
        {PLACEHOLDER_USAGE.map((metric) => {
          const pct = Math.min((metric.used / metric.limit) * 100, 100);
          return (
            <div key={metric.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{metric.label}</span>
                <span className="text-muted-foreground">
                  {formatCount(metric.used, metric.unit)} / {formatCount(metric.limit, metric.unit)}
                  <span className="ml-2 tabular-nums">{pct.toFixed(1)}%</span>
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
