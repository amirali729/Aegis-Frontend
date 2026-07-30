import { Check, Copy } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { useCopyToClipboard } from "@/shared/hooks/use-copy-to-clipboard";

interface OneTimeSecretDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  label: string;
  secret: string;
  warning: string;
}

/**
 * Shown exactly once, right after the backend returns a raw secret
 * (application client secret, API key). The value is never retrievable
 * again after this dialog closes — see integration guide §4.8/4.9.
 */
export function OneTimeSecretDialog({
  open,
  onOpenChange,
  title,
  label,
  secret,
  warning,
}: OneTimeSecretDialogProps) {
  const { copy, copied } = useCopyToClipboard();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{warning}</DialogDescription>
        </DialogHeader>

        <Alert variant="destructive">
          <AlertDescription>
            This will not be shown again. Store it somewhere safe now.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">{label}</span>
          <div className="flex items-center gap-2">
            <code className="flex-1 overflow-x-auto rounded-lg border border-border bg-muted px-2.5 py-1.5 text-sm">
              {secret}
            </code>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => copy(secret)}
              aria-label="Copy to clipboard"
            >
              {copied ? <Check className="text-emerald-600" /> : <Copy />}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            I&apos;ve copied it, close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}