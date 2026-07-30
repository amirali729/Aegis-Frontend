import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useUpdateOrganization } from "@/features/organizations/mutations/use-organization-actions";
import type { Organization } from "@/features/organizations/types/organization.types";

export function OrganizationOverview({ organization }: { organization: Organization }) {
  const updateOrganization = useUpdateOrganization(organization.id);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between rounded-lg border border-border p-3">
        <div>
          <Label>Status</Label>
          <p className="text-xs text-muted-foreground">
            Suspended organizations lose access immediately.
          </p>
        </div>
        <Select
          value={organization.status}
          onValueChange={(status) =>
            updateOrganization.mutate({ status: status as "active" | "suspended" })
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border p-3">
        <div>
          <Label>Plan</Label>
          <p className="text-xs text-muted-foreground">
            Controls plan-gated feature access.
          </p>
        </div>
        <Select
          value={organization.plan}
          onValueChange={(plan) =>
            updateOrganization.mutate({
              plan: plan as "free" | "pro" | "enterprise",
            })
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}