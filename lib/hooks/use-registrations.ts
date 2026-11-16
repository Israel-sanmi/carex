import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminRegistrationsApi,
  ResidentOnboardingStatus,
  AdmitResidentPayload,
  RejectResidentPayload,
} from "../api-registrations";
import { ApiError } from "../api-auth";
import { toast } from "@/components/ui/toast";

export const REGISTRATIONS_QUERY_KEY = ["admin", "resident-registrations"];

export function useResidentRegistrations(
  status: ResidentOnboardingStatus = "PENDING_VERIFICATION",
  page = 0,
  size = 20
) {
  return useQuery({
    queryKey: [...REGISTRATIONS_QUERY_KEY, status, page, size],
    queryFn: () => adminRegistrationsApi.getRegistrations({ status, page, size }),
  });
}

export function useAdmitResidentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      residentPublicId,
      payload,
    }: {
      residentPublicId: string;
      payload: AdmitResidentPayload;
    }) => adminRegistrationsApi.admitResident(residentPublicId, payload),
    onSuccess: (data) => {
      const name = `${data.firstName || ""} ${data.lastName || ""}`.trim() || "Resident";
      toast.success(`${name} admitted successfully`);
      queryClient.invalidateQueries({ queryKey: REGISTRATIONS_QUERY_KEY });
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Failed to admit resident");
    },
  });
}

export function useRejectResidentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      residentPublicId,
      payload,
    }: {
      residentPublicId: string;
      payload: RejectResidentPayload;
    }) => adminRegistrationsApi.rejectResident(residentPublicId, payload),
    onSuccess: (data) => {
      const name = `${data.firstName || ""} ${data.lastName || ""}`.trim() || "Resident";
      toast.info(`Registration for ${name} declined`);
      queryClient.invalidateQueries({ queryKey: REGISTRATIONS_QUERY_KEY });
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Failed to reject registration");
    },
  });
}
