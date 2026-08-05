import { Slack, Github, Webhook, BarChart3, Mail, Zap } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { toast } from "@/shared/lib/toast";

const INTEGRATIONS = [
  { icon: Slack, name: "Slack", description: "Get alerts in a Slack channel." },
  { icon: Github, name: "GitHub", description: "Sync teams from a GitHub org." },
  { icon: Webhook, name: "Webhooks", description: "Subscribe your endpoint to Aegis events." },
  { icon: BarChart3, name: "Datadog", description: "Ship audit logs to Datadog." },
  { icon: Mail, name: "Custom SMTP", description: "Send platform emails from your domain." },
  { icon: Zap, name: "Zapier", description: "Automate workflows across your stack." },
];

export default function IntegrationsSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>
            Connect Aegis to the tools your team already uses. Webhooks are
            the one integration with real backend support today — the rest
            are on the roadmap.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INTEGRATIONS.map((integration) => (
            <div
              key={integration.name}
              className="flex flex-col gap-3 rounded-xl border border-border p-4 transition-colors hover:border-primary/30 hover:shadow-sm"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                <integration.icon className="size-4.5" />
              </div>
              <div>
                <p className="text-sm font-medium">{integration.name}</p>
                <p className="text-xs text-muted-foreground">{integration.description}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={() =>
                  integration.name === "Webhooks"
                    ? toast.info("Manage webhooks from an organization's settings page.")
                    : toast.info(`${integration.name} isn't available yet.`)
                }
              >
                Connect
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}