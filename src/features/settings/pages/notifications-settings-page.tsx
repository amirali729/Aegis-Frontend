import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Switch } from "@/shared/components/ui/switch";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { usePreferences } from "@/features/settings/queries/use-settings";
import { useUpdatePreferences } from "@/features/settings/mutations/use-settings-actions";
import { useNotificationPreferencesStore } from "@/features/settings/store/notification-preferences";
import type { NotificationPreferences } from "@/features/settings/types/settings.types";

function ToggleRow({
  title,
  description,
  checked,
  disabled,
  onCheckedChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} disabled={disabled} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export default function NotificationsSettingsPage() {
  const preferencesQuery = usePreferences();
  const updatePreferences = useUpdatePreferences();
  const legacy = useNotificationPreferencesStore();

  const notifications = preferencesQuery.data?.notifications;

  function persist(patch: Partial<NotificationPreferences>) {
    updatePreferences.mutate({ notifications: patch });
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Choose which emails Aegis sends you. Synced to your account —
            these follow you across devices.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col divide-y divide-border">
          {preferencesQuery.isLoading || !notifications ? (
            <div className="flex flex-col gap-3 py-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <>
              <ToggleRow
                title="Email notifications"
                description="Master switch for every email below."
                checked={notifications.emailEnabled}
                onCheckedChange={(checked) => persist({ emailEnabled: checked })}
              />
              <ToggleRow
                title="Security alerts"
                description="New sign-ins, password changes, and suspicious activity."
                checked={notifications.securityAlerts}
                disabled={!notifications.emailEnabled}
                onCheckedChange={(checked) => persist({ securityAlerts: checked })}
              />
              <ToggleRow
                title="Product updates"
                description="News about new Aegis features and improvements."
                checked={notifications.productUpdates}
                disabled={!notifications.emailEnabled}
                onCheckedChange={(checked) => persist({ productUpdates: checked })}
              />
              <ToggleRow
                title="Marketing emails"
                description="Occasional offers and announcements."
                checked={notifications.marketingEmails}
                disabled={!notifications.emailEnabled}
                onCheckedChange={(checked) => persist({ marketingEmails: checked })}
              />
              <ToggleRow
                title="Weekly digest"
                description="A weekly summary of activity across your organizations."
                checked={notifications.weeklyDigest}
                disabled={!notifications.emailEnabled}
                onCheckedChange={(checked) => persist({ weeklyDigest: checked })}
              />
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>Synced to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          {preferencesQuery.isLoading || !notifications ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            <ToggleRow
              title="Push notifications"
              description="Enable push notifications for this account."
              checked={notifications.pushEnabled}
              onCheckedChange={(checked) => persist({ pushEnabled: checked })}
            />
          )}
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
            checked={legacy.inAppMentions}
            onCheckedChange={() => legacy.toggle("inAppMentions")}
          />
          <ToggleRow
            title="Audit alerts"
            description="High-risk actions detected in your organizations."
            checked={legacy.inAppAuditAlerts}
            onCheckedChange={() => legacy.toggle("inAppAuditAlerts")}
          />
          <ToggleRow
            title="Invitations"
            description="When you're invited to join an organization."
            checked={legacy.emailInvitations}
            onCheckedChange={() => legacy.toggle("emailInvitations")}
          />
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Mentions, audit alerts, and invitation notices aren&apos;t part of
        the backend&apos;s notification preferences yet — those three are
        still saved to this device only. Everything above them is synced
        to your account.
      </p>
    </div>
  );
}
