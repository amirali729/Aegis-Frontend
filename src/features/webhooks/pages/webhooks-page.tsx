import { Link } from "react-router-dom";
import { useState } from "react";
import { AppWindow, ExternalLink } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { EmptyState } from "@/shared/components/empty-state";
import { ROUTES } from "@/shared/config/routes";
import { useApplications } from "@/features/applications/queries/use-applications";
import { useWebhooks, useWebhookStats, useWebhookDeliveries } from "@/features/webhooks/queries/use-webhooks";
import { WebhookStatCards } from "@/features/webhooks/components/webhook-stat-cards";
import { WebhooksTable } from "@/features/webhooks/components/webhooks-table";
import { CreateWebhookDialog } from "@/features/webhooks/components/create-webhook-dialog";
import { RecentDeliveriesPanel } from "@/features/webhooks/components/recent-deliveries-panel";
import { EventOverviewChart } from "@/features/webhooks/components/event-overview-chart";
import { HowWebhooksWork } from "@/features/webhooks/components/how-webhooks-work";
import { CommonEventsPanel } from "@/features/webhooks/components/common-events-panel";
import { WebhooksInfoFooter } from "@/features/webhooks/components/webhooks-info-footer";
import { DeliveriesTab } from "@/features/webhooks/components/deliveries-tab";

type WebhookTab = "webhooks" | "events" | "logs" | "deliveries" | "settings";

const TABS: { value: WebhookTab; label: string }[] = [
  { value: "webhooks", label: "Webhooks" },
  { value: "events", label: "Events" },
  { value: "logs", label: "Logs" },
  { value: "deliveries", label: "Deliveries" },
  { value: "settings", label: "Settings" },
];

/** Tabs that are real, wired features today vs. still-scoped placeholders. */
const BUILT_TABS: WebhookTab[] = ["webhooks", "deliveries"];

function WebhooksTabContent({
  applicationId,
  onViewAllDeliveries,
}: {
  applicationId: string;
  onViewAllDeliveries: () => void;
}) {
  const webhooksQuery = useWebhooks(applicationId);
  const statsQuery = useWebhookStats(applicationId);
  const recentDeliveriesQuery = useWebhookDeliveries(applicationId, { page: 1, limit: 5 });

  return (
    <div className="flex flex-col gap-6">
      <WebhookStatCards stats={statsQuery.data} isLoading={statsQuery.isLoading} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="gap-0 py-0 xl:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-4 py-4">
            <p className="font-semibold">Your Webhooks</p>
          </div>
          <WebhooksTable applicationId={applicationId} />
          {webhooksQuery.isSuccess && webhooksQuery.data.length > 0 && (
            <div className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
              Showing 1 to {webhooksQuery.data.length} of {webhooksQuery.data.length} webhooks
            </div>
          )}
        </Card>

        <RecentDeliveriesPanel
          deliveries={recentDeliveriesQuery.data?.deliveries}
          isLoading={recentDeliveriesQuery.isLoading}
          isError={recentDeliveriesQuery.isError}
          onRetry={() => recentDeliveriesQuery.refetch()}
          onViewAll={onViewAllDeliveries}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <EventOverviewChart topEvents={statsQuery.data?.topEvents} isLoading={statsQuery.isLoading} />
        <div className="xl:col-span-2">
          <HowWebhooksWork />
        </div>
      </div>

      <CommonEventsPanel />

      <WebhooksInfoFooter />
    </div>
  );
}

export default function WebhooksPage() {
  const applicationsQuery = useApplications();
  const [applicationId, setApplicationId] = useState<string | undefined>();
  const [tab, setTab] = useState<WebhookTab>("webhooks");

  const applications = applicationsQuery.data ?? [];
  const activeApplicationId = applicationId ?? applications[0]?.id;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">Webhooks</h1>
            <Badge variant="outline">Beta</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Receive real-time events from Aegis to your endpoints.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {applications.length > 1 && (
            <Select value={activeApplicationId} onValueChange={(v) => v && setApplicationId(v)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select application" />
              </SelectTrigger>
              <SelectContent>
                {applications.map((app) => (
                  <SelectItem key={app.id} value={app.id}>
                    {app.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button
            variant="outline"
            render={<Link to={ROUTES.developerApiReference} />}
          >
            Webhook Docs
            <ExternalLink />
          </Button>
          {activeApplicationId && <CreateWebhookDialog applicationId={activeApplicationId} />}
        </div>
      </div>

      {applicationsQuery.isSuccess && applications.length === 0 && (
        <EmptyState
          icon={AppWindow}
          title="Create an application first"
          description="Webhooks are configured per application. Create one to get started."
        />
      )}

      {activeApplicationId && (
        <>
          <Tabs value={tab} onValueChange={(v) => setTab(v as WebhookTab)}>
            <TabsList>
              {TABS.map((item) => (
                <TabsTrigger key={item.value} value={item.value}>
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {tab === "webhooks" && (
            <WebhooksTabContent
              applicationId={activeApplicationId}
              onViewAllDeliveries={() => setTab("deliveries")}
            />
          )}

          {tab === "deliveries" && (
            <Card>
              <CardContent className="pt-6">
                <DeliveriesTab applicationId={activeApplicationId} />
              </CardContent>
            </Card>
          )}

          {!BUILT_TABS.includes(tab) && (
            <EmptyState
              title={`${TABS.find((item) => item.value === tab)?.label} — coming soon`}
              description="This section isn't built yet. Webhooks and Deliveries are fully functional; Events, Logs, and Settings are next."
            />
          )}
        </>
      )}
    </div>
  );
}