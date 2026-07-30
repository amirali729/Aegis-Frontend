import { useMutation, useQueryClient } from "@tanstack/react-query";

import { organizationsApi } from "@/features/organizations/api/organizations.api";
import { queryKeys } from "@/shared/query/query-keys";
import { toast } from "@/shared/lib/toast";
import { getErrorMessage } from "@/shared/errors/get-error-message";
import type {
  CreateOrganizationFormValues,
  UpdateOrganizationFormValues,
} from "@/features/organizations/schemas/organization.schemas";

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateOrganizationFormValues) =>
      organizationsApi.create(body),
    onSuccess: () => {
      toast.success("Organization created.");
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations.list });
    },
  });
}

export function useUpdateOrganization(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateOrganizationFormValues) =>
      organizationsApi.update(id, body),
    onSuccess: () => {
      toast.success("Organization updated.");
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations.list });
      queryClient.invalidateQueries({
        queryKey: queryKeys.organizations.detail(id),
      });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => organizationsApi.remove(id),
    onSuccess: () => {
      toast.success("Organization deleted.");
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations.list });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}