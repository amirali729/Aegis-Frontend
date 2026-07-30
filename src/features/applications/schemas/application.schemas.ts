import { z } from "zod";

const urlListSchema = z
  .string()
  .transform((value) =>
    value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
  )
  .pipe(z.array(z.string().url("Each entry must be a valid URL.")));

const originListSchema = z
  .string()
  .transform((value) =>
    value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
  )
  .pipe(z.array(z.string().min(1)));

export const createApplicationSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be at most 100 characters."),
  allowedOrigins: originListSchema,
  redirectUris: urlListSchema,
  accessTokenTTL: z.string().min(1).default("15m"),
  refreshTokenTTL: z.string().min(1).default("7d"),
});
export type CreateApplicationFormValues = z.input<typeof createApplicationSchema>;
export type CreateApplicationPayload = z.output<typeof createApplicationSchema>;

export const updateApplicationSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  allowedOrigins: originListSchema.optional(),
  redirectUris: urlListSchema.optional(),
  accessTokenTTL: z.string().min(1).optional(),
  refreshTokenTTL: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
});
export type UpdateApplicationFormValues = z.input<typeof updateApplicationSchema>;

export const createApiKeySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be at most 100 characters."),
  expiresInDays: z
    .number({ error: "Must be a number." })
    .int()
    .min(1)
    .max(3650)
    .optional(),
});
export type CreateApiKeyFormValues = z.infer<typeof createApiKeySchema>;