import { z } from "zod";

const urlListSchema = z.array(
  z.string().url("Each entry must be a valid URL.")
);

const originListSchema = z.array(
  z.string().url("Each entry must be a valid URL.")
);

export const createApplicationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be at most 100 characters."),

  allowedOrigins: originListSchema,

  redirectUris: urlListSchema,

  accessTokenTTL: z
    .string()
    .trim()
    .min(1, "Access token TTL is required."),

  refreshTokenTTL: z
    .string()
    .trim()
    .min(1, "Refresh token TTL is required."),
});

export type CreateApplicationFormValues = z.infer<
  typeof createApplicationSchema
>;

export type CreateApplicationPayload = z.infer<
  typeof createApplicationSchema
>;

export const updateApplicationSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),

  allowedOrigins: originListSchema.optional(),

  redirectUris: urlListSchema.optional(),

  accessTokenTTL: z.string().trim().min(1).optional(),

  refreshTokenTTL: z.string().trim().min(1).optional(),

  isActive: z.boolean().optional(),
});

export type UpdateApplicationFormValues = z.infer<
  typeof updateApplicationSchema
>;

export const createApiKeySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be at most 100 characters."),

  expiresInDays: z
    .number({
      error: "Must be a number.",
    })
    .int()
    .min(1)
    .max(3650)
    .optional(),
});

export type CreateApiKeyFormValues = z.infer<
  typeof createApiKeySchema
>;

const scopeListSchema = z.array(z.string().trim().min(1));

export const createOAuthClientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be at most 100 characters."),

  redirectUris: urlListSchema.min(1, "At least one redirect URI is required."),

  clientType: z.enum(["confidential", "public"]),

  scopes: scopeListSchema,
});

export type CreateOAuthClientFormValues = z.infer<
  typeof createOAuthClientSchema
>;