import { DownloadCloud, FileJson, ShieldOff } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { toast } from "@/shared/lib/toast";
import { usePreferences } from "@/features/settings/queries/use-settings";
import { useUpdatePreferences } from "@/features/settings/mutations/use-settings-actions";
import type { PrivacyPreferences } from "@/features/settings/types/settings.types";

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
  const preferencesQuery = usePreferences();
  const updatePreferences = useUpdatePreferences();
  const privacy = preferencesQuery.data?.privacy;

  function persist(patch: Partial<PrivacyPreferences>) {
    updatePreferences.mutate({ privacy: patch });
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Privacy Preferences</CardTitle>
          <CardDescription>
            Synced to your account — these follow you across devices.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col divide-y divide-border">
          {preferencesQuery.isLoading || !privacy ? (
            <div className="flex flex-col gap-3 py-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-4 py-3 first:pt-0">
                <div>
                  <p className="text-sm font-medium">Profile visibility</p>
                  <p className="text-xs text-muted-foreground">
                    Who can see your profile details.
                  </p>
                </div>
                <Select
                  value={privacy.profileVisibility}
                  onValueChange={(v) =>
                    v && persist({ profileVisibility: v as PrivacyPreferences["profileVisibility"] })
                  }
                >
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="organization">Organization only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="text-sm font-medium">Show email on profile</p>
                  <p className="text-xs text-muted-foreground">
                    Let others in your organizations see your email address.
                  </p>
                </div>
                <Switch
                  checked={privacy.showEmail}
                  onCheckedChange={(checked) => persist({ showEmail: checked })}
                />
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="text-sm font-medium">Show activity</p>
                  <p className="text-xs text-muted-foreground">
                    Let others see your recent activity in shared organizations.
                  </p>
                </div>
                <Switch
                  checked={privacy.showActivity}
                  onCheckedChange={(checked) => persist({ showActivity: checked })}
                />
              </div>
              <div className="flex items-center justify-between gap-4 py-3 last:pb-0">
                <div>
                  <p className="text-sm font-medium">Allow search indexing</p>
                  <p className="text-xs text-muted-foreground">
                    Allow your public profile to be indexed by search engines.
                  </p>
                </div>
                <Switch
                  checked={privacy.allowIndexing}
                  onCheckedChange={(checked) => persist({ allowIndexing: checked })}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

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