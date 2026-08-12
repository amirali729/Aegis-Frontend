import { Link } from "react-router-dom";
import { Code2, BookOpen, KeyRound } from "lucide-react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Switch } from "@/shared/components/ui/switch";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ROUTES } from "@/shared/config/routes";
import { usePreferences } from "@/features/settings/queries/use-settings";
import { useUpdatePreferences } from "@/features/settings/mutations/use-settings-actions";
import type { DeveloperPreferences } from "@/features/settings/types/settings.types";

interface DevPreferencesState {
  showFullTokensInUi: boolean;
  enablePlayground: boolean;
  toggle: (key: "showFullTokensInUi" | "enablePlayground") => void;
}

const useDevPreferencesStore = create<DevPreferencesState>()(
  persist(
    (set) => ({
      showFullTokensInUi: false,
      enablePlayground: true,
      toggle: (key) => set((state) => ({ [key]: !state[key] }) as never),
    }),
    { name: "aegis:dev-preferences" },
  ),
);

const LINKS = [
  { icon: Code2, label: "SDK", description: "Install and configure the Aegis SDK.", href: ROUTES.developerSdk },
  { icon: BookOpen, label: "API Reference", description: "Every endpoint, request, and response shape.", href: ROUTES.developerApiReference },
  { icon: KeyRound, label: "Applications & API Keys", description: "Manage the credentials your apps use.", href: ROUTES.applications },
];

export default function DeveloperSettingsPage() {
  const prefs = useDevPreferencesStore();

  const preferencesQuery = usePreferences();
  const updatePreferences = useUpdatePreferences();
  const developer = preferencesQuery.data?.developer;

  function persist(patch: Partial<DeveloperPreferences>) {
    updatePreferences.mutate({ developer: patch });
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Developer Resources</CardTitle>
          <CardDescription>Jump into the developer portal.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="flex flex-col gap-2 rounded-xl border border-border p-4 transition-colors hover:border-primary/30 hover:shadow-sm"
            >
              <link.icon className="size-5 text-primary" />
              <div>
                <p className="text-sm font-medium">{link.label}</p>
                <p className="text-xs text-muted-foreground">{link.description}</p>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Developer Account Settings</CardTitle>
          <CardDescription>Synced to your account.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col divide-y divide-border">
          {preferencesQuery.isLoading || !developer ? (
            <div className="flex flex-col gap-3 py-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-4 py-3 first:pt-0">
                <div>
                  <p className="text-sm font-medium">API access</p>
                  <p className="text-xs text-muted-foreground">
                    Allow this account to create applications and API keys.
                  </p>
                </div>
                <Switch
                  checked={developer.apiAccessEnabled}
                  onCheckedChange={(checked) => persist({ apiAccessEnabled: checked })}
                />
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="text-sm font-medium">Beta features</p>
                  <p className="text-xs text-muted-foreground">
                    Opt into features that are still being tested.
                  </p>
                </div>
                <Switch
                  checked={developer.betaFeaturesEnabled}
                  onCheckedChange={(checked) => persist({ betaFeaturesEnabled: checked })}
                />
              </div>
              <div className="flex items-center justify-between gap-4 py-3 last:pb-0">
                <div>
                  <p className="text-sm font-medium">Show developer tools</p>
                  <p className="text-xs text-muted-foreground">
                    Surface request IDs and raw responses across the app.
                  </p>
                </div>
                <Switch
                  checked={developer.showDeveloperTools}
                  onCheckedChange={(checked) => persist({ showDeveloperTools: checked })}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Device Preferences</CardTitle>
          <CardDescription>
            These aren&apos;t part of the backend&apos;s developer
            preferences — saved to this device only.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col divide-y divide-border">
          <div className="flex items-center justify-between gap-4 py-3 first:pt-0">
            <div>
              <p className="text-sm font-medium">Show full tokens in the UI</p>
              <p className="text-xs text-muted-foreground">
                Secrets are still shown once at creation regardless — this only
                affects prefix display elsewhere.
              </p>
            </div>
            <Switch
              checked={prefs.showFullTokensInUi}
              onCheckedChange={() => prefs.toggle("showFullTokensInUi")}
            />
          </div>
          <div className="flex items-center justify-between gap-4 py-3 last:pb-0">
            <div>
              <p className="text-sm font-medium">Enable API Playground</p>
              <p className="text-xs text-muted-foreground">
                Show the interactive request tester on the SDK page.
              </p>
            </div>
            <Switch
              checked={prefs.enablePlayground}
              onCheckedChange={() => prefs.toggle("enablePlayground")}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}