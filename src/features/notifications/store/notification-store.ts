import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * There's no backend notification feed yet (see use-notification-feed.ts),
 * so notifications themselves are recomputed on every load from live
 * queries + placeholders — only which ids the person has read/dismissed
 * needs to persist client-side. Capped so this can't grow forever.
 */
const MAX_TRACKED_IDS = 500;

interface NotificationStoreState {
  readIds: string[];
  dismissedIds: string[];
  markRead: (id: string) => void;
  markAllRead: (ids: string[]) => void;
  markUnread: (id: string) => void;
  dismiss: (id: string) => void;
  isRead: (id: string) => boolean;
}

function pushCapped(list: string[], id: string): string[] {
  if (list.includes(id)) return list;
  const next = [...list, id];
  return next.length > MAX_TRACKED_IDS ? next.slice(next.length - MAX_TRACKED_IDS) : next;
}

export const useNotificationStore = create<NotificationStoreState>()(
  persist(
    (set, get) => ({
      readIds: [],
      dismissedIds: [],

      markRead: (id) => set((state) => ({ readIds: pushCapped(state.readIds, id) })),

      markAllRead: (ids) =>
        set((state) => ({
          readIds: ids.reduce((acc, id) => pushCapped(acc, id), state.readIds),
        })),

      markUnread: (id) =>
        set((state) => ({ readIds: state.readIds.filter((readId) => readId !== id) })),

      dismiss: (id) =>
        set((state) => ({
          dismissedIds: pushCapped(state.dismissedIds, id),
          readIds: pushCapped(state.readIds, id),
        })),

      isRead: (id) => get().readIds.includes(id),
    }),
    { name: "aegis:notifications" },
  ),
);