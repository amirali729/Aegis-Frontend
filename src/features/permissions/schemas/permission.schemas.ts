import { z } from "zod";

export const createPermissionSchema = z.object({
  key: z
    .string()
    .min(3, "Key is required.")
    .regex(
      /^[a-z0-9_]+:[a-z0-9_]+$/,
      "Must be in resource:action format, e.g. 'invoice:view'.",
    ),
  description: z.string().max(500).optional(),
});
export type CreatePermissionFormValues = z.infer<typeof createPermissionSchema>;

export const updatePermissionSchema = z.object({
  description: z.string().max(500).optional(),
});
export type UpdatePermissionFormValues = z.infer<typeof updatePermissionSchema>;