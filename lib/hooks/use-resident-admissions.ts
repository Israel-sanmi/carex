import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  residentAdmissionsApi,
  ResidentAdmission,
  ResidentAdmissionsPageResponse,
  RejectAdmissionPayload,
} from "../api-resident-admissions";
import { ApiError } from "../api-auth";
import { toast } from "@/components/ui/toast";

export const RESIDENT_ADMISSIONS_QUERY_KEY = ["resident-admissions"];

export function useResidentAdmissions(
  params: {
    page?: number;
    size?: number;
    status?: string;
  } = {},
  options?: { enabled?: boolean }
) {
  return useQuery<ResidentAdmissionsPageResponse>({
    queryKey: [
      ...RESIDENT_ADMISSIONS_QUERY_KEY,
      params.page ?? 0,
      params.size ?? 20,
      params.status ?? "PENDING",
    ],
    queryFn: () => residentAdmissionsApi.getAdmissions(params),
    enabled: options?.enabled ?? true,
  });
}

export function useResidentAdmission(
  publicId?: string | null,
  options?: { enabled?: boolean }
) {
  return useQuery<ResidentAdmission>({
    queryKey: [...RESIDENT_ADMISSIONS_QUERY_KEY, "detail", publicId],
    queryFn: () => residentAdmissionsApi.getAdmission(publicId!),
    enabled: !!publicId && (options?.enabled ?? true),
  });
}

export function useApproveAdmissionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (publicId: string) =>
      residentAdmissionsApi.approveAdmission(publicId),
    onSuccess: (data) => {
      const residentName = data?.resident
        ? `${data.resident.firstName} ${data.resident.lastName}`
        : "Resident";
      toast.success(`${residentName} admission successfully approved`);
      queryClient.invalidateQueries({ queryKey: RESIDENT_ADMISSIONS_QUERY_KEY });
    },
    onError: (err: ApiError) => {
      toast.error(err?.message || "Failed to approve resident admission");
    },
  });
}

export function useRejectAdmissionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      publicId,
      reason,
    }: {
      publicId: string;
      reason: string;
    }) => residentAdmissionsApi.rejectAdmission(publicId, { reason }),
    onSuccess: (data) => {
      const residentName = data?.resident
        ? `${data.resident.firstName} ${data.resident.lastName}`
        : "Resident";
      toast.info(`${residentName} admission has been rejected`);
      queryClient.invalidateQueries({ queryKey: RESIDENT_ADMISSIONS_QUERY_KEY });
    },
    onError: (err: ApiError) => {
      toast.error(err?.message || "Failed to reject resident admission");
    },
  });
}
