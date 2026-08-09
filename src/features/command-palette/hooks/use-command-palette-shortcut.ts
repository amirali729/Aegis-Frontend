import { useEffect } from "react";

import { useCommandPaletteStore } from "@/features/command-palette/store/command-palette-store";

/** Mount once, near the app root — see dashboard-layout.tsx. */
export function useCommandPaletteShortcut() {
  const toggle = useCommandPaletteStore((state) => state.toggle);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (!isShortcut) return;

      event.preventDefault();
      toggle();
    }

    // Cmd/Ctrl+K should open the palette even while focus is inside a
    // text field — it doesn't collide with normal typing the way a bare
    // "/" shortcut would, so no "don't fire while typing" guard is needed.
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggle]);
}
