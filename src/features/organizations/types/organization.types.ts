export type OrganizationPlan = "free" | "pro" | "enterprise";
export type OrganizationStatus = "active" | "suspended";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  status: OrganizationStatus;
  plan: OrganizationPlan;
  createdAt: string;
}

export type MemberStatus = "active" | "suspended";

export interface Member {
  userId: string;
  username: string;
  email: string;
  status: MemberStatus;
  joinedAt: string;
}

export type InvitationStatus = "pending" | "accepted" | "revoked" | "expired";

export interface Invitation {
  id: string;
  organizationId: string;
  email: string;
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
}