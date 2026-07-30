import { Monitor, Smartphone } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { ConfirmDialog } from "@/shared/components/confirm-dialog";
import { useFormattedDateTime } from "@/shared/timezone/format";
import type { SessionDto } from "@/features/auth/types/auth.types";

function guessIsMobile(userAgent: string): boolean {
  return /mobile|android|iphone/i.test(userAgent);
}

export function SessionRow({
  session,
  onRevoke,
  isRevoking,
}: {
  session: SessionDto;
  onRevoke: (id: string) => void;
  isRevoking: boolean;
}) {
  const Icon = guessIsMobile(session.userAgent) ? Smartphone : Monitor;
  const lastActive = useFormattedDateTime(session.lastActiveAt);

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 size-5 text-muted-foreground" />
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">
              {session.deviceName || "Unknown device"}
            </p>
            {session.isCurrent && (
              <Badge variant="success">This device</Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {session.ipAddress} · Last active {lastActive.dateTime}
          </p>
        </div>
      </div>

      {!session.isCurrent && (
        <ConfirmDialog
          trigger={<Button variant="destructive" size="sm">Revoke</Button>}
          title="Revoke this session?"
          description="This will immediately sign out that device. They'll need to log in again."
          confirmLabel="Revoke"
          isPending={isRevoking}
          onConfirm={() => onRevoke(session.id)}
        />
      )}
    </div>
  );
}