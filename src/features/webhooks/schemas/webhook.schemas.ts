import { z } from "zod";

import {
  DOMAIN_EVENT_VALUES,
  type DomainEventType,
} from "@/features/webhooks/constants/webhook-events";

const eventSchema = z
  .string()
  .refine((value): value is DomainEventType => DOMAIN_EVENT_VALUES.includes(value as DomainEventType), {
    message: "Unrecognized event type.",
  });

export const createWebhookSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be at most 100 characters."),

  endpointUrl: z
    .string()
    .trim()
    .url("Enter a valid HTTPS URL.")
    .refine((url) => url.startsWith("https://"), {
      message: "Endpoint must use HTTPS.",
    }),

  events: z.array(eventSchema).min(1, "Select at least one event."),
});

export type CreateWebhookFormValues = z.infer<typeof createWebhookSchema>;

export const updateWebhookSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  endpointUrl: z
    .string()
    .trim()
    .url("Enter a valid HTTPS URL.")
    .refine((url) => url.startsWith("https://"), {
      message: "Endpoint must use HTTPS.",
    })
    .optional(),
  events: z.array(eventSchema).min(1).optional(),
});

export type UpdateWebhookFormValues = z.infer<typeof updateWebhookSchema>;