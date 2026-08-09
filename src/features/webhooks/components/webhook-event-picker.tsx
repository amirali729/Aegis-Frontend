import { Checkbox } from "@/shared/components/ui/checkbox";
import { WEBHOOK_EVENT_CATALOG } from "@/features/webhooks/constants/webhook-events";

const CATEGORIES = Array.from(new Set(WEBHOOK_EVENT_CATALOG.map((event) => event.category)));

export function WebhookEventPicker({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (events: string[]) => void;
}) {
  function toggle(eventName: string) {
    onChange(
      selected.includes(eventName)
        ? selected.filter((name) => name !== eventName)
        : [...selected, eventName],
    );
  }

  return (
    <div className="flex max-h-64 flex-col gap-4 overflow-y-auto rounded-lg border border-border p-3">
      {CATEGORIES.map((category) => (
        <div key={category}>
          <p className="mb-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {category}
          </p>
          <div className="flex flex-col gap-1.5">
            {WEBHOOK_EVENT_CATALOG.filter((event) => event.category === category).map(
              (event) => (
                <label
                  key={event.name}
                  className="flex items-center gap-2 rounded-md px-1.5 py-1 text-sm hover:bg-muted"
                >
                  <Checkbox
                    checked={selected.includes(event.name)}
                    onCheckedChange={() => toggle(event.name)}
                  />
                  <span className="font-mono text-xs">{event.name}</span>
                  <span className="text-xs text-muted-foreground">— {event.description}</span>
                </label>
              ),
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
