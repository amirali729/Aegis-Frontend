import { apiDelete, apiGet, apiPatch, apiPost } from "@/shared/api/request";
import type { Permission } from "@/features/permissions/types/permission.types";
import type {
  CreatePermissionFormValues,
  UpdatePermissionFormValues,
} from "@/features/permissions/schemas/permission.schemas";

export const permissionsApi = {
  list() {
    return apiGet<Permission[]>("/permissions");
  },

  create(body: CreatePermissionFormValues) {
    return apiPost<Permission>("/permissions", body);
  },

  update(id: string, body: UpdatePermissionFormValues) {
    return apiPatch<Permission>(`/permissions/${id}`, body);
  },

  remove(id: string) {
    return apiDelete<{ message: string }>(`/permissions/${id}`);
  },
};