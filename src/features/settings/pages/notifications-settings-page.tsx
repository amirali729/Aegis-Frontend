import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Switch } from "@/shared/components/ui/switch";
import { useNotificationPreferencesStore } from "@/features/settings/store/notification-preferences";

function ToggleRow({
  title,
  description,
  checked,
  onCheckedChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export default function NotificationsSettingsPage() {
  const prefs = useNotificationPreferencesStore();

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Choose which emails Aegis sends you.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col divide-y divide-border">
          <ToggleRow
            title="Security alerts"
            description="New sign-ins, password changes, and suspicious activity."
            checked={prefs.emailSecurityAlerts}
            onCheckedChange={() => prefs.toggle("emailSecurityAlerts")}
          />
          <ToggleRow
            title="Invitations"
            description="When you're invited to join an organization."
            checked={prefs.emailInvitations}
            onCheckedChange={() => prefs.toggle("emailInvitations")}
          />
          <ToggleRow
            title="Weekly digest"
            description="A weekly summary of activity across your organizations."
            checked={prefs.emailWeeklyDigest}
            onCheckedChange={() => prefs.toggle("emailWeeklyDigest")}
          />
          <ToggleRow
            title="Product updates"
            description="News about new Aegis features and improvements."
            checked={prefs.emailProductUpdates}
            onCheckedChange={() => prefs.toggle("emailProductUpdates")}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>In-App Notifications</CardTitle>
          <CardDescription>
            Control what shows up in your notification bell.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col divide-y divide-border">
          <ToggleRow
            title="Mentions"
            description="When someone mentions you in a comment or note."
            checked={prefs.inAppMentions}
            onCheckedChange={() => prefs.toggle("inAppMentions")}
          />
          <ToggleRow
            title="Audit alerts"
            description="High-risk actions detected in your organizations."
            checked={prefs.inAppAuditAlerts}
            onCheckedChange={() => prefs.toggle("inAppAuditAlerts")}
          />
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Notification delivery isn&apos;t wired up on the backend yet — these
        preferences are saved to this device for now.
      </p>
    </div>
  );
}