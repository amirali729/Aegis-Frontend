import {
  Lock,
  Building2,
  Users,
  ShieldCheck,
  Clock,
  Box,
  KeyRound,
  ScrollText,
  Mail as MailIcon,
  UserPlus,
  Code2,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FEATURES: FeatureItem[] = [
  { icon: Lock, title: "Authentication", description: "Secure login, signup, and password management." },
  { icon: Building2, title: "Organizations", description: "Multi-tenant organization management." },
  { icon: Users, title: "Users", description: "Manage users, profiles, and user metadata." },
  { icon: ShieldCheck, title: "RBAC", description: "Role-based access control system." },
  { icon: Clock, title: "Sessions", description: "Monitor and manage user sessions." },
  { icon: KeyRound, title: "API Keys", description: "Create and manage API keys securely." },
  { icon: ScrollText, title: "Audit Logs", description: "Track and monitor important events." },
  { icon: Box, title: "Applications", description: "Manage OAuth apps and clients." },
  { icon: UserPlus, title: "Invitations", description: "Invite users to your organization." },
  { icon: MailIcon, title: "Email Templates", description: "Customize and manage email templates." },
  { icon: Code2, title: "SDK", description: "Developer SDKs for modern frameworks." },
  { icon: BookOpen, title: "Documentation", description: "Complete guides and API documentation." },
];

export const DEVELOPER_CHECKLIST: string[] = [
  "Fully Typed SDK",
  "Auto Token Refresh",
  "React Hooks",
  "Axios Integration",
  "TanStack Query Ready",
  "Framework Guides",
  "OpenAPI Spec",
  "Postman Collection",
];

export const SECURITY_FEATURES: string[] = [
  "JWT",
  "RBAC",
  "Sessions",
  "Refresh Tokens",
  "Audit Logs",
  "API Keys",
  "Secure Cookies",
  "Password Hashing",
  "Email Verification",
  "Rate Limiting",
  "HTTPS Ready",
  "Multi-Tenant Ready",
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What is Aegis?",
    answer:
      "Aegis is a hosted identity platform that gives your application authentication, organizations, role-based access control, sessions, API keys, and audit logging out of the box — so you don't have to build identity infrastructure from scratch.",
  },
  {
    question: "How does authentication work?",
    answer:
      "Aegis issues short-lived access tokens alongside rotating refresh tokens, delivered as httpOnly cookies for web apps or as bearer tokens for the SDK. Token refresh is handled automatically by the SDK's interceptor.",
  },
  {
    question: "Can I self-host?",
    answer:
      "Aegis ships as a standard Node.js/Express service with a Docker Compose setup for local development and a production Docker profile, so you can run it on your own infrastructure.",
  },
  {
    question: "How do Organizations work?",
    answer:
      "Every organization is fully isolated — applications, roles, memberships, invitations, and audit logs each belong to exactly one organization. Any authenticated user can create an organization and automatically becomes its Owner.",
  },
  {
    question: "How does RBAC work?",
    answer:
      "RBAC is split into two layers: a fixed platform role on each user, and fully customizable organization Roles built from a global permission catalog. A user's effective permissions are the union of both.",
  },
  {
    question: "How do SDKs work?",
    answer:
      "The TypeScript SDK wraps the REST API with typed methods, automatic token refresh and retry, and React-friendly hooks — so you can call things like aegis.auth.login() without hand-rolling HTTP requests.",
  },
  {
    question: "How do API Keys work?",
    answer:
      "API keys belong to a specific application and are shown in full exactly once at creation. After that, only a prefix is ever displayed — the full key is never stored or retrievable again.",
  },
  {
    question: "How do Sessions work?",
    answer:
      "Aegis tracks sessions per device using opaque, hashed, rotating tokens rather than storing refresh tokens on the user record — so you can view and revoke individual devices, or sign out everywhere at once.",
  },
];