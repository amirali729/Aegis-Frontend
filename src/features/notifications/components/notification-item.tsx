import { Link } from "react-router-dom";
import { formatDistanceToNowStrict } from "date-fns";
import { Mail, ShieldAlert, Megaphone, Webhook, Circle } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import type { NotificationFeedItem } from "@/features/notifications/hooks/use-notification-feed";
import type { NotificationCategory } from "@/features/notifications/types/notification.types";

const CATEGORY_ICON: Record<NotificationCategory, typeof ShieldAlert> = {
  security: ShieldAlert,
  invitation: Mail,
  webhook: Webhook,
  system: Megaphone,
};

const SEVERITY_ICON_CLASS: Record<NotificationFeedItem["severity"], string> = {
  critical: "text-destructive bg-destructive/10",
  warning: "text-amber-600 bg-amber-500/10 dark:text-amber-400",
  info: "text-primary bg-primary/10",
};

interface NotificationItemProps {
  notification: NotificationFeedItem;
  onMarkRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

export function NotificationItem({
  notification,
  onMarkRead,
  onDismiss,
}: NotificationItemProps) {
  const Icon = CATEGORY_ICON[notification.category];

  const body = (
    <div
      className={cn(
        "group flex w-full gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted",
        !notification.isRead && "bg-primary/[0.03]",
      )}
    >
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full",
          SEVERITY_ICON_CLASS[notification.severity],
        )}
      >
        <Icon className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-foreground">{notification.title}</p>
          {!notification.isRead && (
            <Circle className="mt-1 size-2 shrink-0 fill-primary text-primary" />
          )}
        </div>
        <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
          {notification.message}
        </p>
        <div className="mt-1 flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNowStrict(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </span>
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onDismiss(notification.id);
            }}
            className="text-xs text-muted-foreground opacity-0 underline-offset-2 hover:text-foreground hover:underline group-hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );

  function handleClick() {
    if (!notification.isRead) onMarkRead(notification.id);
  }

  if (notification.href) {
    return (
      <Link to={notification.href} onClick={handleClick} className="block">
        {body}
      </Link>
    );
  }

  return (
    <button type="button" onClick={handleClick} className="block w-full">
      {body}
    </button>
  );
}