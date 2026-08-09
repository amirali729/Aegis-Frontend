/**
 * Mirrors the backend's `DOMAIN_EVENTS` verbatim — see that file's own
 * doc comment for the full reasoning (these are deliberately identical
 * to each module's `RecordAuditEventDto` event-type strings, with a
 * handful of deliberate departures from a suggested naming brief, e.g.
 * `invitation.created` instead of `member.invited`, `apikey.revoked`
 * instead of `api_key.deleted`). Keep this in sync by hand if the
 * backend's event list changes.
 */
export const DOMAIN_EVENTS = {
  ORGANIZATION_CREATED: "organization.created",
  ORGANIZATION_UPDATED: "organization.updated",
  ORGANIZATION_DELETED: "organization.deleted",

  MEMBER_INVITED: "invitation.created",
  MEMBER_JOINED: "invitation.accepted",
  INVITATION_REVOKED: "invitation.revoked",
  MEMBER_REMOVED: "member.removed",
  MEMBER_SUSPENDED: "member.suspended",
  MEMBER_REACTIVATED: "member.reactivated",

  ROLE_CREATED: "role.created",
  ROLE_UPDATED: "role.updated",
  ROLE_DELETED: "role.deleted",
  ROLE_ASSIGNED: "role.assigned",
  ROLE_REMOVED: "role.removed",

  APPLICATION_CREATED: "application.created",
  APPLICATION_UPDATED: "application.updated",
  APPLICATION_DELETED: "application.deleted",

  OAUTH_CLIENT_CREATED: "oauth_client.created",
  OAUTH_CLIENT_REVOKED: "oauth_client.revoked",
  OAUTH_TOKEN_REVOKED: "oauth_token.revoked",

  API_KEY_CREATED: "apikey.created",
  API_KEY_REVOKED: "apikey.revoked",

  USER_LOGIN: "auth.login",
  USER_LOGOUT: "auth.logout_all",
} as const;

export type DomainEventType = (typeof DOMAIN_EVENTS)[keyof typeof DOMAIN_EVENTS];

export const DOMAIN_EVENT_VALUES: DomainEventType[] = Object.values(DOMAIN_EVENTS);

interface WebhookEventDefinition {
  name: DomainEventType;
  description: string;
  category: "Organizations" | "Members & Invitations" | "Roles" | "Applications" | "OAuth" | "API Keys" | "Auth";
}

/** UI grouping/descriptions layered on top of DOMAIN_EVENTS for the event picker. */
export const WEBHOOK_EVENT_CATALOG: WebhookEventDefinition[] = [
  { name: DOMAIN_EVENTS.ORGANIZATION_CREATED, description: "A new organization is created.", category: "Organizations" },
  { name: DOMAIN_EVENTS.ORGANIZATION_UPDATED, description: "An organization's settings change.", category: "Organizations" },
  { name: DOMAIN_EVENTS.ORGANIZATION_DELETED, description: "An organization is deleted.", category: "Organizations" },

  { name: DOMAIN_EVENTS.MEMBER_INVITED, description: "A user is invited to an organization.", category: "Members & Invitations" },
  { name: DOMAIN_EVENTS.MEMBER_JOINED, description: "An invited user accepts and joins.", category: "Members & Invitations" },
  { name: DOMAIN_EVENTS.INVITATION_REVOKED, description: "A pending invitation is revoked.", category: "Members & Invitations" },
  { name: DOMAIN_EVENTS.MEMBER_REMOVED, description: "A member is removed from an organization.", category: "Members & Invitations" },
  { name: DOMAIN_EVENTS.MEMBER_SUSPENDED, description: "A member is suspended.", category: "Members & Invitations" },
  { name: DOMAIN_EVENTS.MEMBER_REACTIVATED, description: "A suspended member is reactivated.", category: "Members & Invitations" },

  { name: DOMAIN_EVENTS.ROLE_CREATED, description: "A new role is created.", category: "Roles" },
  { name: DOMAIN_EVENTS.ROLE_UPDATED, description: "A role's permissions change.", category: "Roles" },
  { name: DOMAIN_EVENTS.ROLE_DELETED, description: "A role is deleted.", category: "Roles" },
  { name: DOMAIN_EVENTS.ROLE_ASSIGNED, description: "A role is assigned to a member.", category: "Roles" },
  { name: DOMAIN_EVENTS.ROLE_REMOVED, description: "A role is removed from a member.", category: "Roles" },

  { name: DOMAIN_EVENTS.APPLICATION_CREATED, description: "A new application is created.", category: "Applications" },
  { name: DOMAIN_EVENTS.APPLICATION_UPDATED, description: "An application's settings change.", category: "Applications" },
  { name: DOMAIN_EVENTS.APPLICATION_DELETED, description: "An application is deleted.", category: "Applications" },

  { name: DOMAIN_EVENTS.OAUTH_CLIENT_CREATED, description: "A new OAuth client is created.", category: "OAuth" },
  { name: DOMAIN_EVENTS.OAUTH_CLIENT_REVOKED, description: "An OAuth client is revoked.", category: "OAuth" },
  { name: DOMAIN_EVENTS.OAUTH_TOKEN_REVOKED, description: "An OAuth token is revoked.", category: "OAuth" },

  { name: DOMAIN_EVENTS.API_KEY_CREATED, description: "A new API key is created.", category: "API Keys" },
  { name: DOMAIN_EVENTS.API_KEY_REVOKED, description: "An API key is revoked.", category: "API Keys" },

  { name: DOMAIN_EVENTS.USER_LOGIN, description: "A user logs in successfully.", category: "Auth" },
  { name: DOMAIN_EVENTS.USER_LOGOUT, description: "A user logs out of all sessions.", category: "Auth" },
];

/** Representative subset surfaced in the "Common Events" panel. */
export const COMMON_WEBHOOK_EVENTS: DomainEventType[] = [
  DOMAIN_EVENTS.MEMBER_INVITED,
  DOMAIN_EVENTS.MEMBER_JOINED,
  DOMAIN_EVENTS.ORGANIZATION_CREATED,
  DOMAIN_EVENTS.API_KEY_CREATED,
  DOMAIN_EVENTS.USER_LOGIN,
];
