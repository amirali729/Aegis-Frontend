import { Check } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";
import { useCurrentOrganization } from "@/features/settings/hooks/use-current-organization";
import { toast } from "@/shared/lib/toast";
import type { OrganizationPlan } from "@/features/organizations/types/organization.types";

const PLANS: {
  id: OrganizationPlan;
  name: string;
  price: string;
  description: string;
  features: string[];
}[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    description: "For personal projects and evaluation.",
    features: ["Up to 5 users", "Core RBAC", "Community support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$99",
    description: "For growing teams that need more control.",
    features: ["Up to 100 users", "Audit logs", "Priority support"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$599",
    description: "For organizations with advanced security needs.",
    features: [
      "Unlimited users",
      "SSO & SCIM",
      "Advanced security",
      "Custom branding",
      "Priority support",
    ],
  },
];

export default function BillingSettingsPage() {
  const { organization, isLoading } = useCurrentOrganization();
  const currentPlan = organization?.plan ?? "free";

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Plans</CardTitle>
          <CardDescription>
            {isLoading
              ? "Loading your current plan…"
              : organization
                ? `Your organization "${organization.name}" is currently on the ${currentPlan} plan.`
                : "Choose the plan that fits your organization."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {PLANS.map((plan) => {
                const isCurrent = plan.id === currentPlan;
                return (
                  <Card
                    key={plan.id}
                    className={cn(
                      "gap-4",
                      isCurrent && "border-primary shadow-md",
                    )}
                  >
                    <CardHeader className="flex-row items-center justify-between space-y-0">
                      <CardTitle>{plan.name}</CardTitle>
                      {isCurrent && <Badge>Current</Badge>}
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                      <div>
                        <span className="text-2xl font-semibold">{plan.price}</span>
                        <span className="text-sm text-muted-foreground"> / month</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                      <ul className="flex flex-col gap-1.5">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm">
                            <Check className="size-4 shrink-0 text-success" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        variant={isCurrent ? "outline" : "default"}
                        disabled={isCurrent}
                        onClick={() =>
                          toast.info("Billing isn't wired up yet — contact sales to upgrade.")
                        }
                      >
                        {isCurrent ? "Current Plan" : "Contact Sales"}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>
            No payment method on file — required before upgrading past Free.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={() => toast.info("Payment integration isn't available yet.")}
          >
            Add Payment Method
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}