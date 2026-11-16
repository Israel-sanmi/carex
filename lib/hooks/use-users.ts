import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  usersApi,
  UserItem,
  UsersPageData,
  UserUpdatePayload,
  UserRoleAssignment,
  AssignRolePayload,
  UpdateRoleStatusPayload,
} from "../api-users";
import { ApiError } from "../api-auth";
import { toast } from "@/components/ui/toast";

export const USERS_QUERY_KEY = ["users"];
export const USER_ROLES_QUERY_KEY = ["user-roles"];

export function useUsers(
  params: {
    search?: string;
    status?: string;
    role?: string;
    page?: number;
    size?: number;
  } = {},
  options?: { enabled?: boolean }
) {
  return useQuery<UsersPageData>({
    queryKey: [
      ...USERS_QUERY_KEY,
      params.page ?? 0,
      params.size ?? 20,
      params.search ?? "",
      params.status ?? "",
      params.role ?? "",
    ],
    queryFn: () => usersApi.getUsers(params),
    enabled: options?.enabled ?? true,
  });
}

export function useUser(
  publicId?: string | null,
  options?: { enabled?: boolean }
) {
  return useQuery<UserItem>({
    queryKey: [...USERS_QUERY_KEY, "detail", publicId],
    queryFn: () => usersApi.getUser(publicId!),
    enabled: !!publicId && (options?.enabled ?? true),
  });
}

export function useUserRoles(
  publicId?: string | null,
  options?: { enabled?: boolean }
) {
  return useQuery<UserRoleAssignment[]>({
    queryKey: [...USER_ROLES_QUERY_KEY, publicId],
    queryFn: () => usersApi.getUserRoles(publicId!),
    enabled: !!publicId && (options?.enabled ?? true),
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      publicId,
      payload,
    }: {
      publicId: string;
      payload: UserUpdatePayload;
    }) => usersApi.updateUser(publicId, payload),
    onSuccess: (data) => {
      const name = data?.firstName
        ? `${data.firstName} ${data.lastName}`
        : "User";
      toast.success(`${name}'s profile updated successfully`);
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
    onError: (err: ApiError) => {
      toast.error(err?.message || "Failed to update user profile");
    },
  });
}

export function useAssignRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      publicId,
      payload,
    }: {
      publicId: string;
      payload: AssignRolePayload;
    }) => usersApi.assignUserRole(publicId, payload),
    onSuccess: () => {
      toast.success("Role assignment granted successfully");
      queryClient.invalidateQueries({ queryKey: USER_ROLES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
    onError: (err: ApiError) => {
      toast.error(err?.message || "Failed to assign role");
    },
  });
}

export function useRevokeRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      publicId,
      assignmentPublicId,
    }: {
      publicId: string;
      assignmentPublicId: string;
    }) => usersApi.revokeUserRole(publicId, assignmentPublicId),
    onSuccess: () => {
      toast.info("Role assignment revoked");
      queryClient.invalidateQueries({ queryKey: USER_ROLES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
    onError: (err: ApiError) => {
      toast.error(err?.message || "Failed to revoke role assignment");
    },
  });
}

export function useUpdateRoleStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      publicId,
      assignmentPublicId,
      payload,
    }: {
      publicId: string;
      assignmentPublicId: string;
      payload: UpdateRoleStatusPayload;
    }) =>
      usersApi.updateUserRoleStatus(publicId, assignmentPublicId, payload),
    onSuccess: () => {
      toast.success("User status updated successfully");
      queryClient.invalidateQueries({ queryKey: USER_ROLES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
    onError: (err: ApiError) => {
      toast.error(err?.message || "Failed to update role status");
    },
  });
}
