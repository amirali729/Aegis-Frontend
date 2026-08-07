import { useMemo, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";

import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { useNotificationFeed } from "@/features/notifications/hooks/use-notification-feed";
import { useNotificationStore } from "@/features/notifications/store/notification-store";
import { NotificationItem } from "@/features/notifications/components/notification-item";
import type { NotificationCategory } from "@/features/notifications/types/notification.types";

type FilterValue = NotificationCategory | "all";

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "security", label: "Security" },
  { value: "invitation", label: "Invitations" },
  { value: "webhook", label: "Webhooks" },
  { value: "system", label: "System" },
];

export default function NotificationsPage() {
  const { items, unreadCount, isLoading, isError, error, refetch } = useNotificationFeed();
  const markRead = useNotificationStore((state) => state.markRead);
  const markAllRead = useNotificationStore((state) => state.markAllRead);
  const dismiss = useNotificationStore((state) => state.dismiss);
  const [filter, setFilter] = useState<FilterValue>("all");

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((item) => item.category === filter)),
    [items, filter],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Security events, invitations, and webhook activity across your workspace.
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllRead(items.map((item) => item.id))}
          >
            <CheckCheck />
            Mark all read
          </Button>
        )}
      </div>

      <Tabs value={filter} onValueChange={(value) => setFilter(value as FilterValue)}>
        <TabsList>
          {FILTERS.map((option) => (
            <TabsTrigger key={option.value} value={option.value}>
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-1.5">
          {isLoading && (
            <div className="flex flex-col gap-2 p-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          )}

          {!isLoading && isError && (
            <ErrorState error={error} onRetry={refetch} />
          )}

          {!isLoading && !isError && filtered.length === 0 && (
            <EmptyState
              icon={Bell}
              title="No notifications"
              description={
                filter === "all"
                  ? "You're all caught up. Security events and pending invitations will show up here."
                  : "Nothing in this category right now."
              }
            />
          )}

          {!isLoading &&
            !isError &&
            filtered.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkRead={markRead}
                onDismiss={dismiss}
              />
            ))}
        </CardContent>
      </Card>
    </div>
  );
}