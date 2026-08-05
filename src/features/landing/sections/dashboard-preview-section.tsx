import { Link } from "react-router-dom";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { ROUTES } from "@/shared/config/routes";

const CHECKLIST = [
  "Real-time analytics and insights",
  "Advanced search and filtering",
  "Export data and reports",
  "Team and access management",
];

const MOCK_USERS = [
  { name: "Amir Khan", email: "amir@example.com", status: "Active", role: "Admin" },
  { name: "Sarah Johnson", email: "sarah@example.com", status: "Active", role: "Member" },
  { name: "John Doe", email: "john@example.com", status: "Active", role: "Member" },
  { name: "Mike Smith", email: "mike@example.com", status: "Invited", role: "Member" },
  { name: "Emily Davis", email: "emily@example.com", status: "Suspended", role: "Member" },
];

const STATUS_VARIANT: Record<string, "success" | "secondary" | "destructive"> = {
  Active: "success",
  Invited: "secondary",
  Suspended: "destructive",
};

export function DashboardPreviewSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <span className="text-xs font-semibold tracking-wider text-primary uppercase">
            Manage Everything
          </span>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Manage Everything From One Dashboard
          </h2>
          <p className="mt-3 text-muted-foreground">
            A powerful dashboard to manage users, organizations,
            applications, and everything in between — without leaving Aegis.
          </p>

          <div className="mt-6 flex flex-col gap-2.5">
            {CHECKLIST.map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-sm">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                  <Check className="size-3" />
                </span>
                {item}
              </div>
            ))}
          </div>

          <Button className="mt-8" render={<Link to={ROUTES.signup} />}>
            Explore Dashboard
            <ArrowRight />
          </Button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary">
              <ShieldCheck className="size-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">Aegis</span>
            <span className="ml-auto text-xs text-muted-foreground">Users</span>
          </div>

          <div className="overflow-x-auto p-3">
            <table className="w-full min-w-[420px] text-left text-xs">
              <thead>
                <tr className="text-muted-foreground">
                  <th className="pb-2 font-medium">User</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Role</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_USERS.map((user) => (
                  <tr key={user.email} className="border-t border-border">
                    <td className="py-2">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-muted-foreground">{user.email}</p>
                    </td>
                    <td className="py-2">
                      <Badge variant={STATUS_VARIANT[user.status]}>{user.status}</Badge>
                    </td>
                    <td className="py-2 text-muted-foreground">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}