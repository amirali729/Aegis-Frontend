import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/empty-state";
import { OutcomeDonut } from "@/features/dashboard/components/outcome-donut";
import type { WebhookEventBreakdown } from "@/features/webhooks/types/webhook.types";

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

export function EventOverviewChart({
  topEvents,
  isLoading,
}: {
  topEvents: WebhookEventBreakdown[] | undefined;
  isLoading: boolean;
}) {
  const data = (topEvents ?? []).map((item, index) => ({
    name: item.event,
    value: item.count,
    color: COLORS[index % COLORS.length],
  }));
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Overview</CardTitle>
        <CardDescription>Top events in the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <Skeleton className="h-36 w-full" />}
        {!isLoading && data.length === 0 && (
          <EmptyState title="No events yet" className="border-none py-6" />
        )}
        {!isLoading && data.length > 0 && (
          <OutcomeDonut data={data} total={total} unitLabel="events" />
        )}
      </CardContent>
    </Card>
  );
}