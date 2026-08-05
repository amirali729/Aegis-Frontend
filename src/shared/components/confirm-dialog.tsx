import type { ReactElement } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { Spinner } from "@/shared/components/ui/spinner";

interface ConfirmDialogProps {
  /**
   * Uncontrolled mode: pass a trigger element and the dialog opens when
   * it's clicked (standard usage — a button rendered inline).
   */
  trigger?: ReactElement;
  /**
   * Controlled mode: omit `trigger` and instead drive open state from the
   * parent (e.g. opening from a dropdown menu item, which can't itself be
   * an AlertDialogTrigger since the menu closes/unmounts on click first).
   */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: "default" | "destructive";
  isPending?: boolean;
  onConfirm: () => void;
}

export function ConfirmDialog({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  variant = "destructive",
  isPending = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger render={trigger} />}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant={variant}
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending && <Spinner className="mr-1" />}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}