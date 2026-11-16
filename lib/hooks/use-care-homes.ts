import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  careHomesApi,
  CareHomeStatus,
  CreateCareHomePayload,
  UpdateCareHomePayload,
  CareHomeItem,
} from "../api-care-homes";
import { ApiError } from "../api-auth";
import { toast } from "@/components/ui/toast";

export const CARE_HOMES_QUERY_KEY = ["care-homes"];

export function useCareHomesByOrganisation(
  organisationPublicId: string | null | undefined,
  params: { page?: number; size?: number } = {},
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: [
      ...CARE_HOMES_QUERY_KEY,
      "by-org",
      organisationPublicId,
      params.page ?? 0,
      params.size ?? 20,
    ],
    queryFn: () => {
      if (!organisationPublicId) {
        throw new Error("Organisation ID is required");
      }
      return careHomesApi.getCareHomesByOrganisation(organisationPublicId, params);
    },
    enabled: Boolean(organisationPublicId) && (options?.enabled ?? true),
  });
}

export function useMyCareHomes(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...CARE_HOMES_QUERY_KEY, "me"],
    queryFn: () => careHomesApi.getMyCareHomes(),
    enabled: options?.enabled ?? true,
  });
}

export function useCreateCareHomeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organisationPublicId,
      payload,
    }: {
      organisationPublicId: string;
      payload: CreateCareHomePayload;
    }) => careHomesApi.createCareHome(organisationPublicId, payload),
    onSuccess: (data: CareHomeItem) => {
      toast.success(`Care home "${data.name}" registered successfully`);
      queryClient.invalidateQueries({ queryKey: CARE_HOMES_QUERY_KEY });
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Failed to create care home");
    },
  });
}

export function useUpdateCareHomeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organisationPublicId,
      careHomePublicId,
      payload,
    }: {
      organisationPublicId: string;
      careHomePublicId: string;
      payload: UpdateCareHomePayload;
    }) => careHomesApi.updateCareHome(organisationPublicId, careHomePublicId, payload),
    onSuccess: (data: CareHomeItem) => {
      toast.success(`Care home "${data.name}" updated successfully`);
      queryClient.invalidateQueries({ queryKey: CARE_HOMES_QUERY_KEY });
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Failed to update care home");
    },
  });
}

export function useUpdateCareHomeStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organisationPublicId,
      careHomePublicId,
      status,
    }: {
      organisationPublicId: string;
      careHomePublicId: string;
      status: CareHomeStatus;
    }) => careHomesApi.updateCareHomeStatus(organisationPublicId, careHomePublicId, status),
    onSuccess: (data: CareHomeItem) => {
      toast.success(`Care home status updated to ${data.status}`);
      queryClient.invalidateQueries({ queryKey: CARE_HOMES_QUERY_KEY });
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Failed to update care home status");
    },
  });
}
