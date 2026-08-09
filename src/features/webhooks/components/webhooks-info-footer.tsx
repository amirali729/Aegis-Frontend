import { Link } from "react-router-dom";
import { ArrowRight, Headphones, Lock, RotateCcw } from "lucide-react";

import { Card } from "@/shared/components/ui/card";
import { ROUTES } from "@/shared/config/routes";

const CARDS = [
  {
    icon: Lock,
    title: "Secure by Default",
    description: "All webhooks are signed using HMAC SHA-256. Verify signatures to ensure requests are from Aegis.",
    linkLabel: "Learn more about security",
    href: ROUTES.developerApiReference,
  },
  {
    icon: RotateCcw,
    title: "Retry Policy",
    description: "Failed deliveries are retried for up to 72 hours with exponential backoff.",
    linkLabel: "View retry schedule",
    href: ROUTES.developerApiReference,
  },
  {
    icon: Headphones,
    title: "Need Help?",
    description: "Check out our webhook documentation or contact our support team.",
    linkLabel: "Go to documentation",
    href: ROUTES.developerApiReference,
  },
];

export function WebhooksInfoFooter() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {CARDS.map((card) => (
        <Card key={card.title} className="flex-row items-start gap-3 p-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <card.icon className="size-4" />
          </div>
          <div>
            <p className="text-sm font-medium">{card.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{card.description}</p>
            <Link
              to={card.href}
              className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              {card.linkLabel}
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}
