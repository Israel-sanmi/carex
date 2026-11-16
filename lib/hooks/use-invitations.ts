import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  invitationsApi,
  InvitationStatus,
  InvitationRole,
  CreateInvitationPayload,
  AcceptInvitationPayload,
  InvitationItem,
} from "../api-invitations";
import { ApiError } from "../api-auth";
import { toast } from "@/components/ui/toast";

export const INVITATIONS_QUERY_KEY = ["invitations"];

export function useInvitations(
  params: {
    page?: number;
    size?: number;
    status?: InvitationStatus | "";
    role?: InvitationRole | "";
  } = {},
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: [
      ...INVITATIONS_QUERY_KEY,
      params.page ?? 0,
      params.size ?? 20,
      params.status ?? "",
      params.role ?? "",
    ],
    queryFn: () => invitationsApi.getInvitations(params),
    enabled: options?.enabled ?? true,
  });
}

export function useSendInvitationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateInvitationPayload) =>
      invitationsApi.createInvitation(payload),
    onSuccess: (data) => {
      toast.success(
        data.message || `Invitation dispatched successfully to ${data.email}`
      );
      queryClient.invalidateQueries({ queryKey: INVITATIONS_QUERY_KEY });
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Failed to dispatch invitation");
    },
  });
}

export function useRevokeInvitationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationPublicId: string) =>
      invitationsApi.revokeInvitation(invitationPublicId),
    onSuccess: (data) => {
      toast.info(data.message || "Invitation has been revoked");
      queryClient.invalidateQueries({ queryKey: INVITATIONS_QUERY_KEY });
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Failed to revoke invitation");
    },
  });
}

export function useAcceptInvitationMutation() {
  return useMutation({
    mutationFn: (payload: AcceptInvitationPayload) =>
      invitationsApi.acceptInvitation(payload),
    onSuccess: (data) => {
      toast.success(data.message || "Invitation accepted! Account activated.");
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Failed to accept invitation");
    },
  });
}
