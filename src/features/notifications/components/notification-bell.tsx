import { Link } from "react-router-dom";
import { Bell, BellOff, CheckCheck } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { EmptyState } from "@/shared/components/empty-state";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ROUTES } from "@/shared/config/routes";
import { useNotificationFeed } from "@/features/notifications/hooks/use-notification-feed";
import { useNotificationStore } from "@/features/notifications/store/notification-store";
import { NotificationItem } from "@/features/notifications/components/notification-item";

const PANEL_LIMIT = 8;

export function NotificationBell() {
  const { items, unreadCount, isLoading, isError } = useNotificationFeed();
  const markRead = useNotificationStore((state) => state.markRead);
  const markAllRead = useNotificationStore((state) => state.markAllRead);
  const dismiss = useNotificationStore((state) => state.dismiss);

  const visible = items.slice(0, PANEL_LIMIT);

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
            <Bell />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        }
      />
      <PopoverContent className="w-96 p-0">
        <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
          <p className="text-sm font-semibold">Notifications</p>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => markAllRead(items.map((item) => item.id))}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <CheckCheck className="size-3.5" />
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto p-1.5">
          {isLoading && (
            <div className="flex flex-col gap-2 p-2">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          )}

          {!isLoading && isError && (
            <EmptyState
              icon={BellOff}
              title="Couldn't load notifications"
              description="Something went wrong fetching recent activity."
              className="border-none py-8"
            />
          )}

          {!isLoading && !isError && visible.length === 0 && (
            <EmptyState
              icon={Bell}
              title="You're all caught up"
              description="Security events and pending invitations will show up here."
              className="border-none py-8"
            />
          )}

          {!isLoading &&
            !isError &&
            visible.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkRead={markRead}
                onDismiss={dismiss}
              />
            ))}
        </div>

        <div className="border-t border-border p-1.5">
          <Link
            to={ROUTES.notifications}
            className="block rounded-md px-2 py-1.5 text-center text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            View all notifications
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}