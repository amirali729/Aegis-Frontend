import type { PropsWithChildren } from "react";

import { AppErrorBoundary } from "@/providers/app-error-boundary";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { ToastProvider } from "@/providers/toast-provider";

/**
 * Composes every global provider in the order they need to nest.
 * `App` should render nothing but <AppProviders><RouterProvider /></AppProviders>.
 */
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <AppErrorBoundary>
      <QueryProvider>
        <ThemeProvider>
          {children}
          <ToastProvider />
        </ThemeProvider>
      </QueryProvider>
    </AppErrorBoundary>
  );
}