import { OutcomeDonut } from "@/features/dashboard/components/outcome-donut";
import type { Member } from "@/features/organizations/types/organization.types";
import type { Invitation } from "@/features/organizations/types/organization.types";

interface MembersStatusDonutProps {
  members: Member[];
  invitations?: Invitation[];
}

export function MembersStatusDonut({ members, invitations }: MembersStatusDonutProps) {
  const active = members.filter((m) => m.status === "active").length;
  const suspended = members.filter((m) => m.status === "suspended").length;
  const pending = invitations?.filter((i) => i.status === "pending").length ?? 0;

  const data = [
    { name: "Active", value: active, color: "var(--success)" },
    ...(invitations
      ? [{ name: "Pending", value: pending, color: "var(--warning)" }]
      : []),
    { name: "Suspended", value: suspended, color: "var(--destructive)" },
  ];

  const total = active + suspended + (invitations ? pending : 0);

  return <OutcomeDonut data={data} total={total} unitLabel="members" />;
}