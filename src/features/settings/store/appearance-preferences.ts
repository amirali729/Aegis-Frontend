import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AccentOption {
  id: string;
  label: string;
  /** oklch value applied to --primary / --ring / --sidebar-primary / --sidebar-ring */
  value: string;
}

export const ACCENT_OPTIONS: AccentOption[] = [
  { id: "violet", label: "Violet", value: "oklch(0.58 0.22 280)" },
  { id: "blue", label: "Blue", value: "oklch(0.58 0.19 250)" },
  { id: "emerald", label: "Emerald", value: "oklch(0.6 0.15 155)" },
  { id: "rose", label: "Rose", value: "oklch(0.6 0.21 15)" },
  { id: "amber", label: "Amber", value: "oklch(0.75 0.16 75)" },
];

export type Density = "comfortable" | "compact";

function applyAccent(accentId: string) {
  const accent =
    ACCENT_OPTIONS.find((option) => option.id === accentId) ??
    ACCENT_OPTIONS[0];
  const root = window.document.documentElement.style;
  root.setProperty("--primary", accent.value);
  root.setProperty("--ring", accent.value);
  root.setProperty("--sidebar-primary", accent.value);
  root.setProperty("--sidebar-ring", accent.value);
}

interface AppearancePreferencesState {
  accent: string;
  density: Density;
  reduceMotion: boolean;
  setAccent: (accent: string) => void;
  setDensity: (density: Density) => void;
  setReduceMotion: (value: boolean) => void;
}

export const useAppearancePreferencesStore =
  create<AppearancePreferencesState>()(
    persist(
      (set) => ({
        accent: "violet",
        density: "comfortable",
        reduceMotion: false,
        setAccent: (accent) => {
          applyAccent(accent);
          set({ accent });
        },
        setDensity: (density) => set({ density }),
        setReduceMotion: (reduceMotion) => set({ reduceMotion }),
      }),
      {
        name: "aegis:appearance-preferences",
        onRehydrateStorage: () => (state) => {
          if (state) applyAccent(state.accent);
        },
      },
    ),
  );