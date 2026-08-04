/**
 * Everything in this file is illustrative reference content for the
 * developer portal, NOT live data — there is no published `@aegis/sdk`
 * package yet, so these are hand-written examples of the intended API
 * shape based on the real backend endpoints (see Frontend-Integration-Guide.md).
 * Once an SDK package exists, this becomes the seed for auto-generated docs.
 */

export const SDK_VERSION = "v1.2.0";

export const WHATS_NEW = [
  "Organization invitations",
  "Membership roles & permissions",
  "Session management APIs",
  "Improved error handling",
  "New React SDK hooks",
];

export const SDK_RELEASED_AT = "Jul 25, 2025";

export const FRAMEWORKS = [
  "TypeScript",
  "React",
  "Node.js",
  "Next.js",
  "Vue",
  "NestJS",
  "Express",
] as const;

export const PACKAGE_MANAGERS = [
  { id: "npm", label: "npm", command: "npm install @aegis/sdk" },
  { id: "pnpm", label: "pnpm", command: "pnpm add @aegis/sdk" },
  { id: "yarn", label: "yarn", command: "yarn add @aegis/sdk" },
  { id: "bun", label: "bun", command: "bun add @aegis/sdk" },
] as const;

export const CONFIGURATION_SNIPPETS = {
  TypeScript: `import { Aegis } from '@aegis/sdk';

const aegis = new Aegis({
  clientId: 'client_abc123',
  baseUrl: 'https://api.aegis.dev',
  // optional: enable debug logs
  debug: true,
});`,
  JavaScript: `const { Aegis } = require('@aegis/sdk');

const aegis = new Aegis({
  clientId: 'client_abc123',
  baseUrl: 'https://api.aegis.dev',
  debug: true,
});`,
} as const;

export const FRAMEWORK_GUIDES = [
  "React",
  "Next.js",
  "Vue",
  "Angular",
  "Express",
  "NestJS",
  "SvelteKit",
  "Nuxt",
] as const;

interface CodeExample {
  label: string;
  description: string;
  request: string;
  response: string;
}

export const CODE_EXAMPLES: Record<string, CodeExample> = {
  Authentication: {
    label: "Authentication",
    description: "Authenticate a user with email and password.",
    request: `const response = await aegis.auth.login({
  username: 'amir',
  password: 'Passw0rd123',
});

console.log(response.user);`,
    response: `{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "usr_123",
      "email": "amir@example.com",
      "username": "amir"
    },
    "permissions": ["organization:view", "organization:create"]
  }
}`,
  },
  Organizations: {
    label: "Organizations",
    description: "List every organization your platform manages.",
    request: `const orgs = await aegis.organizations.list();

console.log(orgs.data);`,
    response: `{
  "success": true,
  "data": [
    { "id": "org_1", "name": "Acme Inc", "plan": "pro" },
    { "id": "org_2", "name": "Beta Corp", "plan": "free" }
  ]
}`,
  },
  Applications: {
    label: "Applications",
    description: "Create a new application and get its client credentials.",
    request: `const app = await aegis.applications.create({
  name: 'Mobile App',
  redirectUris: ['https://app.example.com/callback'],
});

console.log(app.clientSecret); // shown once`,
    response: `{
  "success": true,
  "data": {
    "id": "app_123",
    "clientId": "client_abc123",
    "clientSecret": "sk_live_••••••••",
    "warning": "Store this secret now — it will not be shown again."
  }
}`,
  },
  Sessions: {
    label: "Sessions",
    description: "List every device currently signed in.",
    request: `const sessions = await aegis.sessions.list();

console.log(sessions.data);`,
    response: `{
  "success": true,
  "data": [
    {
      "id": "ses_123",
      "deviceName": "Chrome on macOS",
      "isCurrent": true,
      "lastActiveAt": "2026-08-04T10:02:00Z"
    }
  ]
}`,
  },
  "API Keys": {
    label: "API Keys",
    description: "Create an API key for server-to-server auth.",
    request: `const key = await aegis.apiKeys.create('app_123', {
  name: 'Production server',
});

console.log(key.key); // shown once`,
    response: `{
  "success": true,
  "data": {
    "id": "key_123",
    "keyPrefix": "ak_live_",
    "key": "ak_live_••••••••••••••••",
    "warning": "Store this key now — it will not be shown again."
  }
}`,
  },
  "Roles & Permissions": {
    label: "Roles & Permissions",
    description: "Assign a role's permissions in one call.",
    request: `await aegis.roles.setPermissions('role_123', {
  permissionIds: ['perm_view', 'perm_update'],
});`,
    response: `{
  "success": true,
  "data": {
    "id": "role_123",
    "name": "Billing Manager",
    "permissions": ["invoice:view", "invoice:update"]
  }
}`,
  },
  "Audit Logs": {
    label: "Audit Logs",
    description: "Query audit events with filters and pagination.",
    request: `const logs = await aegis.auditLogs.list({
  page: 1,
  limit: 10,
  action: 'auth.login',
});`,
    response: `{
  "success": true,
  "data": {
    "logs": [{ "action": "auth.login", "success": true }],
    "total": 1,
    "page": 1,
    "limit": 10
  }
}`,
  },
};

export const CODE_EXAMPLE_RESOURCES = Object.keys(CODE_EXAMPLES);

export const DOWNLOADS = [
  { name: "TypeScript SDK", version: SDK_VERSION, iconLabel: "TS" },
  { name: "React SDK", version: SDK_VERSION, iconLabel: "⚛" },
  { name: "OpenAPI Spec", version: SDK_VERSION, iconLabel: "{}" },
  { name: "Postman Collection", version: SDK_VERSION, iconLabel: "▶" },
] as const;

export const DOCUMENTATION_LINKS = [
  { title: "Authentication", description: "Learn about authentication methods" },
  { title: "Organizations", description: "Manage organizations and memberships" },
  { title: "API Reference", description: "Complete API reference documentation" },
  { title: "RBAC", description: "Roles, permissions, and access control" },
  { title: "Sessions", description: "Manage user sessions securely" },
  { title: "SDK Reference", description: "Full SDK API reference" },
] as const;