import { DownloadCloud, FileJson, ShieldOff } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { toast } from "@/shared/lib/toast";

const EXPORTS = [
  {
    icon: FileJson,
    title: "Export account data",
    description: "A JSON export of your profile, sessions, and memberships.",
  },
  {
    icon: DownloadCloud,
    title: "Export organization data",
    description: "Users, roles, applications, and audit logs for your organization.",
  },
];

export default function DataPrivacySettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Export</CardTitle>
          <CardDescription>
            Download a copy of your data at any time.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col divide-y divide-border">
          {EXPORTS.map((item) => (
            <div
              key={item.title}
              className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <item.icon className="size-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast.info("Data export isn't available yet — check back soon.")
                }
              >
                Request Export
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy Controls</CardTitle>
          <CardDescription>
            How Aegis handles your personal data.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
          <p>
            Aegis stores your username, email address, and activity metadata
            (IP address, user agent, timestamps) needed to operate
            authentication, sessions, and audit logging.
          </p>
          <p>
            Deleting your account is handled by an administrator today — see{" "}
            <span className="font-medium text-foreground">Danger Zone</span>{" "}
            for the organization-level equivalent.
          </p>
        </CardContent>
      </Card>

      <Card className="border-warning/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldOff className="size-4 text-warning" />
            Third-Party Data Sharing
          </CardTitle>
          <CardDescription>
            Aegis does not sell or share your data with third parties.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}