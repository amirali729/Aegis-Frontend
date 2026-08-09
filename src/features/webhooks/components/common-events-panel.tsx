import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ROUTES } from "@/shared/config/routes";
import { COMMON_WEBHOOK_EVENTS, WEBHOOK_EVENT_CATALOG } from "@/features/webhooks/constants/webhook-events";

export function CommonEventsPanel() {
  const events = COMMON_WEBHOOK_EVENTS.map((name) =>
    WEBHOOK_EVENT_CATALOG.find((event) => event.name === name),
  ).filter((event): event is NonNullable<typeof event> => Boolean(event));

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="flex-row items-center justify-between border-b border-border py-4">
        <CardTitle className="text-base">Common Events</CardTitle>
        <Link
          to={ROUTES.developerApiReference}
          className="text-sm font-medium text-primary hover:underline"
        >
          View all events
        </Link>
      </CardHeader>
      <CardContent className="divide-y divide-border p-0">
        {events.map((event) => (
          <div key={event.name} className="flex items-center justify-between gap-2 px-4 py-3">
            <div>
              <p className="font-mono text-sm font-medium">{event.name}</p>
              <p className="text-xs text-muted-foreground">{event.description}</p>
            </div>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground/50" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
