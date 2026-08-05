import { Link } from "react-router-dom";
import { Check } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/config/routes";
import type { OrganizationPlan } from "@/features/organizations/types/organization.types";

const PLAN_DISPLAY: Record<
  OrganizationPlan,
  { label: string; price: string; features: string[] }
> = {
  free: {
    label: "Free",
    price: "$0",
    features: ["Up to 5 users", "Community support", "Core RBAC"],
  },
  pro: {
    label: "Pro",
    price: "$99",
    features: ["Up to 100 users", "Priority support", "Audit logs"],
  },
  enterprise: {
    label: "Enterprise",
    price: "$599",
    features: [
      "Unlimited users",
      "SSO & SCIM",
      "Advanced security",
      "Audit logs",
      "Priority support",
      "Custom branding",
    ],
  },
};

export function PlanCard({ plan }: { plan?: OrganizationPlan }) {
  const display = PLAN_DISPLAY[plan ?? "free"];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Your Plan</CardTitle>
        <Badge className="capitalize">{display.label}</Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <span className="text-3xl font-semibold">{display.price}</span>
          <span className="text-sm text-muted-foreground"> / month</span>
        </div>

        <ul className="flex flex-col gap-1.5">
          {display.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <Check className="size-4 shrink-0 text-success" />
              {feature}
            </li>
          ))}
        </ul>

        <Button variant="outline" className="w-full" render={<Link to={ROUTES.settingsBilling} />}>
          Manage Billing
        </Button>
      </CardContent>
    </Card>
  );
}