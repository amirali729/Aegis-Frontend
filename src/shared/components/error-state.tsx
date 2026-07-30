import { AlertCircle } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { getErrorMessage } from "@/shared/errors/get-error-message";

interface ErrorStateProps {
  error: unknown;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-destructive/30 py-12 text-center">
      <AlertCircle className="size-8 text-destructive" />
      <p className="text-sm font-medium">Something went wrong</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        {getErrorMessage(error)}
      </p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-2" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}