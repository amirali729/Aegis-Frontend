import { z } from "zod";

import { DOMAIN_EVENT_VALUES } from "@/features/webhooks/constants/webhook-events";

const ALL_EVENTS_WILDCARD = "*";

/** Matches api-guide.md 5.12: subscribedEvents is event-type strings, or "*" for all. */
const eventSchema = z.string().refine(
  (value) => value === ALL_EVENTS_WILDCARD || DOMAIN_EVENT_VALUES.includes(value as never),
  { message: "Unrecognized event type." },
);

export const createWebhookSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be at most 100 characters."),

  url: z
    .string()
    .trim()
    .url("Enter a valid HTTPS URL.")
    .refine((url) => url.startsWith("https://"), {
      message: "Endpoint must use HTTPS.",
    }),

  subscribedEvents: z.array(eventSchema).min(1, "Select at least one event."),
});

export type CreateWebhookFormValues = z.infer<typeof createWebhookSchema>;

export const updateWebhookSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  url: z
    .string()
    .trim()
    .url("Enter a valid HTTPS URL.")
    .refine((url) => url.startsWith("https://"), {
      message: "Endpoint must use HTTPS.",
    })
    .optional(),
  subscribedEvents: z.array(eventSchema).min(1).optional(),
});

export type UpdateWebhookFormValues = z.infer<typeof updateWebhookSchema>;
