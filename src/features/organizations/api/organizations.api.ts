import { apiDelete, apiGet, apiPatch, apiPost } from "@/shared/api/request";
import type { Organization } from "@/features/organizations/types/organization.types";
import type {
  CreateOrganizationFormValues,
  UpdateOrganizationFormValues,
} from "@/features/organizations/schemas/organization.schemas";

export const organizationsApi = {
  list() {
    return apiGet<Organization[]>("/organizations");
  },

  get(id: string) {
    return apiGet<Organization>(`/organizations/${id}`);
  },

  create(body: CreateOrganizationFormValues) {
    return apiPost<Organization>("/organizations", body);
  },

  update(id: string, body: UpdateOrganizationFormValues) {
    return apiPatch<Organization>(`/organizations/${id}`, body);
  },

  remove(id: string) {
    return apiDelete<{ message: string }>(`/organizations/${id}`);
  },
};