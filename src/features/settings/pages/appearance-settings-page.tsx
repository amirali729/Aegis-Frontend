import { useEffect } from "react";
import { Check, Monitor, Moon, Sun } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Switch } from "@/shared/components/ui/switch";
import { cn } from "@/shared/lib/utils";
import { useThemeStore, type Theme } from "@/app/store/theme-store";
import {
  ACCENT_OPTIONS,
  useAppearancePreferencesStore,
  type Density,
} from "@/features/settings/store/appearance-preferences";
import { usePreferences } from "@/features/settings/queries/use-settings";
import { useUpdatePreferences } from "@/features/settings/mutations/use-settings-actions";
import type { FontSizePreference } from "@/features/settings/types/settings.types";

const THEME_OPTIONS: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

const DENSITY_OPTIONS: { value: Density; label: string; description: string }[] = [
  { value: "comfortable", label: "Comfortable", description: "More whitespace, easier scanning." },
  { value: "compact", label: "Compact", description: "Tighter spacing, more on screen." },
];

const FONT_SIZE_OPTIONS: { value: FontSizePreference; label: string }[] = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

export default function AppearanceSettingsPage() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  // `accent` has no backend field (not part of preferences.appearance
  // in Auth_System) — stays a device-only preference, matching how it
  // was before. Density/reduceMotion do have backend fields and are
  // synced below.
  const { accent, density, reduceMotion, setAccent, setDensity, setReduceMotion } =
    useAppearancePreferencesStore();

  const preferencesQuery = usePreferences();
  const updatePreferences = useUpdatePreferences();
  const fontSize = preferencesQuery.data?.appearance.fontSize ?? "medium";

  // Server is the source of truth for theme/density/reduceMotion on
  // load; local stores just make the change feel instant afterward.
  useEffect(() => {
    if (!preferencesQuery.data) return;
    const a = preferencesQuery.data.appearance;
    if (a.theme && a.theme !== theme) setTheme(a.theme);
    if (a.density && a.density !== density) setDensity(a.density);
    if (typeof a.reduceMotion === "boolean" && a.reduceMotion !== reduceMotion) {
      setReduceMotion(a.reduceMotion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferencesQuery.data]);

  function persistAppearance(
    patch: Partial<{
      theme: Theme;
      density: Density;
      fontSize: FontSizePreference;
      reduceMotion: boolean;
    }>,
  ) {
    updatePreferences.mutate({ appearance: patch });
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Choose how Aegis looks on this device.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {THEME_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setTheme(option.value);
                persistAppearance({ theme: option.value });
              }}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border border-border p-4 transition-colors hover:bg-muted",
                theme === option.value && "border-primary bg-accent",
              )}
            >
              <option.icon className="size-5" />
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accent Color</CardTitle>
          <CardDescription>
            Personalize the primary accent used across Aegis on this device.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {ACCENT_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setAccent(option.id)}
              aria-label={option.label}
              className="flex flex-col items-center gap-1.5"
            >
              <span
                className="flex size-9 items-center justify-center rounded-full ring-2 ring-offset-2 ring-offset-background"
                style={{
                  backgroundColor: option.value,
                  ["--tw-ring-color" as string]:
                    accent === option.id ? option.value : "transparent",
                }}
              >
                {accent === option.id && <Check className="size-4 text-white" />}
              </span>
              <span className="text-xs text-muted-foreground">{option.label}</span>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Layout</CardTitle>
          <CardDescription>Fine-tune density, text size, and motion.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {DENSITY_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setDensity(option.value);
                  persistAppearance({ density: option.value });
                }}
                className={cn(
                  "rounded-xl border border-border p-3 text-left transition-colors hover:bg-muted",
                  density === option.value && "border-primary bg-accent",
                )}
              >
                <p className="text-sm font-medium">{option.label}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </button>
            ))}
          </div>

          <div className="grid gap-2 border-t border-border pt-4">
            <p className="text-sm font-medium">Text size</p>
            <div className="grid grid-cols-3 gap-3">
              {FONT_SIZE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => persistAppearance({ fontSize: option.value })}
                  className={cn(
                    "rounded-xl border border-border p-3 text-center text-sm transition-colors hover:bg-muted",
                    fontSize === option.value && "border-primary bg-accent",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
            <div>
              <p className="text-sm font-medium">Reduce motion</p>
              <p className="text-xs text-muted-foreground">
                Minimize animations and transitions.
              </p>
            </div>
            <Switch
              checked={reduceMotion}
              onCheckedChange={(checked) => {
                setReduceMotion(checked);
                persistAppearance({ reduceMotion: checked });
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
