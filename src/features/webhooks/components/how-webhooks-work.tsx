import { ArrowRight, RefreshCcw, Send, Zap } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

const STEPS = [
  {
    icon: Zap,
    title: "Event Happens",
    description: "An event occurs in Aegis (user created, login, organization invited, etc.).",
  },
  {
    icon: Send,
    title: "Aegis Sends",
    description: "We send a POST request to your webhook endpoint with event data.",
  },
  {
    icon: ArrowRight,
    title: "You Receive",
    description: "You process the event and return a 200 OK response.",
  },
  {
    icon: RefreshCcw,
    title: "Retry on Failure",
    description: "If we don't receive 2xx, we retry automatically with exponential backoff.",
  },
];

export function HowWebhooksWork() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>How Webhooks Work</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {STEPS.map((step, index) => (
            <div key={step.title} className="flex items-start gap-2">
              <div className="flex flex-col items-center gap-2">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <step.icon className="size-5" />
                </div>
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-center text-xs text-muted-foreground">{step.description}</p>
              </div>
              {index < STEPS.length - 1 && (
                <ArrowRight className="mt-4 hidden size-4 shrink-0 text-muted-foreground/40 sm:block" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}