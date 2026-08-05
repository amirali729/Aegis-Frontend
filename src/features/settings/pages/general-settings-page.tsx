import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  SUPPORTED_LOCALES,
  SUPPORTED_TIMEZONES,
} from "@/shared/constants/localization";
import { usePreferencesStore } from "@/shared/timezone/preferences";
import { useCurrentOrganization } from "@/features/settings/hooks/use-current-organization";
import { useUpdateOrganization } from "@/features/organizations/mutations/use-organization-actions";
import { usePlatformPreferencesStore } from "@/features/settings/store/platform-preferences";
import { PlanCard } from "@/features/settings/components/plan-card";
import { SystemStatusCard } from "@/features/settings/components/system-status-card";
import { QuickLinksCard } from "@/features/settings/components/quick-links-card";
import { ROUTES } from "@/shared/config/routes";
import { toast } from "@/shared/lib/toast";

export default function GeneralSettingsPage() {
  const { organization, isLoading, canListOrganizations } = useCurrentOrganization();
  const updateOrganization = useUpdateOrganization(organization?.id ?? "");

  const { timezone, locale, dateFormat, setTimezone, setLocale, setDateFormat } =
    usePreferencesStore();
  const platform = usePlatformPreferencesStore();

  const [nameDraft, setNameDraft] = useState(organization?.name ?? "");

  useEffect(() => {
    setNameDraft(organization?.name ?? "");
  }, [organization?.name]);

  function handleSaveOrganization() {
    if (!organization) return;
    if (nameDraft.trim().length < 2) {
      toast.error("Organization name must be at least 2 characters.");
      return;
    }
    updateOrganization.mutate({ name: nameDraft.trim() });
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div className="flex flex-col gap-6 xl:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Update your basic account and platform preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {isLoading && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            )}

            {!isLoading && !organization && (
              <EmptyState
                icon={Building2}
                title={
                  canListOrganizations
                    ? "No organization yet"
                    : "No organization visible to you"
                }
                description={
                  canListOrganizations
                    ? "Create an organization to configure org-wide settings."
                    : "Ask a platform administrator for the organization:view permission, or create your own organization."
                }
                action={
                  <Button size="sm" render={<Link to={ROUTES.organizations} />}>
                    Go to Organizations
                  </Button>
                }
              />
            )}

            {!isLoading && organization && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label>Organization Slug</Label>
                  <Input readOnly value={organization.slug} />
                  <p className="text-xs text-muted-foreground">
                    Your organization URL: aegis.dev/{organization.slug}
                  </p>
                </div>
                <div className="grid gap-1.5">
                  <Label>Default Timezone</Label>
                  <Select value={timezone} onValueChange={(v) => v && setTimezone(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_TIMEZONES.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <Label>Language</Label>
                  <Select value={locale} onValueChange={(v) => v && setLocale(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORTED_LOCALES.map((item) => (
                        <SelectItem key={item.code} value={item.code}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5 sm:col-span-2">
                  <Label>Date Format</Label>
                  <Select value={dateFormat} onValueChange={(v) => v && setDateFormat(v)}>
                    <SelectTrigger className="sm:max-w-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MMM d, yyyy">Jul 29, 2026</SelectItem>
                      <SelectItem value="MM/dd/yyyy">07/29/2026</SelectItem>
                      <SelectItem value="dd/MM/yyyy">29/07/2026</SelectItem>
                      <SelectItem value="yyyy-MM-dd">2026-07-29</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {organization && (
              <div>
                <Button
                  onClick={handleSaveOrganization}
                  disabled={updateOrganization.isPending}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Preferences</CardTitle>
            <CardDescription>
              Configure how the platform behaves for your organization.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border">
            <div className="flex items-center justify-between gap-4 py-3 first:pt-0">
              <div>
                <p className="text-sm font-medium">Allow new user registrations</p>
                <p className="text-xs text-muted-foreground">
                  Allow users to sign up and create accounts.
                </p>
              </div>
              <Switch
                checked={platform.allowNewRegistrations}
                onCheckedChange={() => platform.toggle("allowNewRegistrations")}
              />
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="text-sm font-medium">Require email verification</p>
                <p className="text-xs text-muted-foreground">
                  Users must verify their email before accessing the platform.
                </p>
              </div>
              <Switch
                checked={platform.requireEmailVerification}
                onCheckedChange={() => platform.toggle("requireEmailVerification")}
              />
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="text-sm font-medium">Enforce strong passwords</p>
                <p className="text-xs text-muted-foreground">
                  Require strong passwords for all users.
                </p>
              </div>
              <Switch
                checked={platform.enforceStrongPasswords}
                onCheckedChange={() => platform.toggle("enforceStrongPasswords")}
              />
            </div>
            <div className="flex items-center justify-between gap-4 py-3 last:pb-0">
              <div>
                <p className="text-sm font-medium">Session expiration</p>
                <p className="text-xs text-muted-foreground">
                  Automatically log out inactive users after a period of time.
                </p>
              </div>
              <Select
                value={platform.sessionExpirationDays}
                onValueChange={(v) => v && platform.setSessionExpirationDays(v)}
              >
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="pt-3 text-xs text-muted-foreground">
              These preferences are saved to this device — enforcing them
              platform-wide requires backend support that isn&apos;t built
              yet.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <PlanCard plan={organization?.plan} />
        <SystemStatusCard />
        <QuickLinksCard />
      </div>
    </div>
  );
}