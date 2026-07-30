import { z } from "zod";

export const createRoleSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name must be at most 50 characters."),
  description: z.string().max(500).optional(),
  permissionIds: z.array(z.string()),
});
export type CreateRoleFormValues = z.infer<typeof createRoleSchema>;

export const updateRoleSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  description: z.string().max(500).optional(),
});
export type UpdateRoleFormValues = z.infer<typeof updateRoleSchema>;