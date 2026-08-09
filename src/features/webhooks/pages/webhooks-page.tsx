import { Link } from "react-router-dom";
import { useState } from "react";
import { Building2, ExternalLink } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { EmptyState } from "@/shared/components/empty-state";
import { ROUTES } from "@/shared/config/routes";
import { useCurrentOrganization } from "@/features/settings/hooks/use-current-organization";
import { useWebhooks, useRecentDeliveriesAcrossWebhooks } from "@/features/webhooks/queries/use-webhooks";
import { computeWebhookStats } from "@/features/webhooks/lib/compute-webhook-stats";
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
  orgId,
  onViewAllDeliveries,
}: {
  orgId: string;
  onViewAllDeliveries: () => void;
}) {
  const webhooksQuery = useWebhooks(orgId);
  const webhooks = webhooksQuery.data ?? [];
  const recent = useRecentDeliveriesAcrossWebhooks(orgId, webhooks);
  const stats = webhooksQuery.isSuccess
    ? computeWebhookStats(webhooks, recent.deliveries)
    : undefined;

  return (
    <div className="flex flex-col gap-6">
      <WebhookStatCards stats={stats} isLoading={webhooksQuery.isLoading || recent.isLoading} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="gap-0 py-0 xl:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-4 py-4">
            <p className="font-semibold">Your Webhooks</p>
          </div>
          <WebhooksTable orgId={orgId} />
          {webhooksQuery.isSuccess && webhooks.length > 0 && (
            <div className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
              Showing 1 to {webhooks.length} of {webhooks.length} webhooks
            </div>
          )}
        </Card>

        <RecentDeliveriesPanel
          deliveries={recent.deliveries.slice(0, 5)}
          isLoading={recent.isLoading}
          isError={recent.isError}
          onRetry={recent.refetch}
          onViewAll={onViewAllDeliveries}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <EventOverviewChart topEvents={stats?.topEvents} isLoading={webhooksQuery.isLoading} />
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
  const { organization, isLoading: isOrgLoading } = useCurrentOrganization();
  const [tab, setTab] = useState<WebhookTab>("webhooks");

  const orgId = organization?.id;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">Webhooks</h1>
            <Badge variant="outline">Beta</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {organization
              ? `Receive real-time events from Aegis to your endpoints, for ${organization.name}.`
              : "Receive real-time events from Aegis to your endpoints."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" render={<Link to={ROUTES.developerApiReference} />}>
            Webhook Docs
            <ExternalLink />
          </Button>
          {orgId && <CreateWebhookDialog orgId={orgId} />}
        </div>
      </div>

      {!isOrgLoading && !orgId && (
        <EmptyState
          icon={Building2}
          title="No active organization"
          description="Webhooks are configured per organization. Switch to or create one from the environment switcher to get started."
        />
      )}

      {orgId && (
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
            <WebhooksTabContent orgId={orgId} onViewAllDeliveries={() => setTab("deliveries")} />
          )}

          {tab === "deliveries" && (
            <Card>
              <CardContent className="pt-6">
                <DeliveriesTab orgId={orgId} />
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
