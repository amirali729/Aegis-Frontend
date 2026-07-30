import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "@/shared/api/request";
import type { Role } from "@/features/roles/types/role.types";
import type {
  CreateRoleFormValues,
  UpdateRoleFormValues,
} from "@/features/roles/schemas/role.schemas";

export const rolesApi = {
  list() {
    return apiGet<Role[]>("/roles");
  },

  create(body: CreateRoleFormValues) {
    return apiPost<Role>("/roles", body);
  },

  update(id: string, body: UpdateRoleFormValues) {
    return apiPatch<Role>(`/roles/${id}`, body);
  },

  replacePermissions(id: string, permissionIds: string[]) {
    return apiPut<Role>(`/roles/${id}/permissions`, { permissionIds });
  },

  remove(id: string) {
    return apiDelete<{ message: string }>(`/roles/${id}`);
  },
};