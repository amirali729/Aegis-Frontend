import { Link } from "react-router-dom";
import { ShieldCheck, ShieldQuestion, KeyRound, Fingerprint, Monitor, ChevronRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useSessions } from "@/features/sessions/queries/use-sessions";
import { useProfilePreferencesStore } from "@/features/settings/store/profile-preferences";
import { useFormattedDateTime } from "@/shared/timezone/format";
import { ROUTES } from "@/shared/config/routes";
import { cn } from "@/shared/lib/utils";

function Row({
  icon: Icon,
  title,
  subtitle,
  ok,
}: {
  icon: typeof KeyRound;
  title: string;
  subtitle: string;
  ok: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <Icon className="size-4 shrink-0 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <span
        className={cn(
          "size-2 shrink-0 rounded-full",
          ok ? "bg-success" : "bg-warning",
        )}
      />
    </div>
  );
}

export function SecurityOverviewCard() {
  const sessions = useSessions();
  const twoFactorEnabled = useProfilePreferencesStore((s) => s.twoFactorEnabled);
  const lastPasswordChangeAt = useProfilePreferencesStore(
    (s) => s.lastPasswordChangeAt,
  );
  const changed = useFormattedDateTime(lastPasswordChangeAt ?? undefined);

  const sessionCount = sessions.data?.length ?? 0;
  const strong = twoFactorEnabled && Boolean(lastPasswordChangeAt);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Overview</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg p-3",
            strong ? "bg-success/10" : "bg-warning/10",
          )}
        >
          {strong ? (
            <ShieldCheck className="size-6 shrink-0 text-success" />
          ) : (
            <ShieldQuestion className="size-6 shrink-0 text-warning" />
          )}
          <div>
            <p
              className={cn(
                "text-sm font-semibold",
                strong ? "text-success" : "text-warning",
              )}
            >
              {strong ? "Strong" : "Needs attention"}
            </p>
            <p className="text-xs text-muted-foreground">
              {strong
                ? "Your account is well protected"
                : "Enable 2FA and set a password to improve this"}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Row
            icon={KeyRound}
            title="Password"
            subtitle={
              lastPasswordChangeAt
                ? `Last changed ${changed.date}`
                : "Not changed from this device yet"
            }
            ok={Boolean(lastPasswordChangeAt)}
          />
          <Row
            icon={Fingerprint}
            title="Two-Factor Authentication"
            subtitle={twoFactorEnabled ? "Enabled" : "Not enabled"}
            ok={twoFactorEnabled}
          />
          <Row
            icon={Monitor}
            title="Active Sessions"
            subtitle={`${sessionCount} active session${sessionCount === 1 ? "" : "s"}`}
            ok
          />
        </div>

        <Link
          to={ROUTES.settingsSecurity}
          className="flex items-center justify-between rounded-lg px-1 py-1 text-sm font-medium text-primary hover:underline"
        >
          View Security Settings
          <ChevronRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}