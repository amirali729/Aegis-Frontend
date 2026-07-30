import { z } from "zod";

import { emailSchema } from "@/shared/validators/auth-fields";

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be at most 100 characters."),
  slug: z
    .string()
    .regex(/^[a-z0-9-]*$/, "Lowercase letters, numbers, and hyphens only.")
    .optional()
    .or(z.literal("")),
  plan: z.enum(["free", "pro", "enterprise"]).optional(),
});
export type CreateOrganizationFormValues = z.infer<typeof createOrganizationSchema>;

export const updateOrganizationSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  status: z.enum(["active", "suspended"]).optional(),
  plan: z.enum(["free", "pro", "enterprise"]).optional(),
});
export type UpdateOrganizationFormValues = z.infer<typeof updateOrganizationSchema>;

export const inviteMemberSchema = z.object({
  email: emailSchema,
});
export type InviteMemberFormValues = z.infer<typeof inviteMemberSchema>;