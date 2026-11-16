import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  organisationsApi,
  OrganisationStatus,
  CreateOrganisationPayload,
  UpdateOrganisationPayload,
  OrganisationItem,
} from "../api-organisations";
import { ApiError } from "../api-auth";
import { toast } from "@/components/ui/toast";

export const ORGANISATIONS_QUERY_KEY = ["organisations"];

export function useOrganisations(
  params: {
    page?: number;
    size?: number;
    search?: string;
    status?: OrganisationStatus | "";
  } = {},
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: [
      ...ORGANISATIONS_QUERY_KEY,
      params.page ?? 0,
      params.size ?? 20,
      params.search ?? "",
      params.status ?? "",
    ],
    queryFn: () => organisationsApi.getOrganisations(params),
    enabled: options?.enabled ?? true,
  });
}

export function useCreateOrganisationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrganisationPayload) =>
      organisationsApi.createOrganisation(payload),
    onSuccess: (data: OrganisationItem) => {
      toast.success(`Organisation "${data.name}" created successfully`);
      queryClient.invalidateQueries({ queryKey: ORGANISATIONS_QUERY_KEY });
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Failed to create organisation");
    },
  });
}

export function useUpdateOrganisationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      publicId,
      payload,
    }: {
      publicId: string;
      payload: UpdateOrganisationPayload;
    }) => organisationsApi.updateOrganisation(publicId, payload),
    onSuccess: (data: OrganisationItem) => {
      toast.success(`Organisation "${data.name}" updated successfully`);
      queryClient.invalidateQueries({ queryKey: ORGANISATIONS_QUERY_KEY });
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Failed to update organisation");
    },
  });
}

export function useUpdateOrganisationStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      publicId,
      status,
    }: {
      publicId: string;
      status: OrganisationStatus;
    }) => organisationsApi.updateOrganisationStatus(publicId, status),
    onSuccess: (data: OrganisationItem) => {
      toast.success(`Organisation status updated to ${data.status}`);
      queryClient.invalidateQueries({ queryKey: ORGANISATIONS_QUERY_KEY });
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Failed to update organisation status");
    },
  });
}
