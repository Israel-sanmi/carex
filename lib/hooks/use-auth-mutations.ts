"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authApi,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  VerifyEmailPayload,
  VerifyEmailResponse,
  ResendVerificationPayload,
  ResendVerificationResponse,
  ApiError,
} from "@/lib/api-auth";
import { setAuthCookies, clearAuthCookies, getCookie } from "@/lib/cookies";
import { useRole, RoleType } from "@/lib/role-context";

/**
 * Mutation for user login
 * Saves accessToken, refreshToken, userPublicId, organisationPublicId,
 * roles, roleAssignments to cookies upon success.
 */
export function useLoginMutation() {
  const queryClient = useQueryClient();
  const { setAuthSession } = useRole();

  return useMutation<LoginResponse, ApiError, LoginPayload>({
    mutationFn: async (credentials: LoginPayload) => {
      return await authApi.login(credentials);
    },
    onSuccess: (response) => {
      const data = response.data;
      if (data) {
        // Store in cookies
        setAuthCookies({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          userPublicId: data.userPublicId,
          organisationPublicId: data.organisationPublicId,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          roles: data.roles,
          roleAssignments: data.roleAssignments,
          expiresIn: data.expiresIn,
        });

        // Sync into RoleContext
        setAuthSession(data);

        // Invalidate queries if any
        queryClient.invalidateQueries();
      }
    },
  });
}

/**
 * Mutation for resident self-registration
 */
export function useRegisterMutation() {
  return useMutation<RegisterResponse, ApiError, RegisterPayload>({
    mutationFn: async (payload: RegisterPayload) => {
      return await authApi.register(payload);
    },
  });
}

/**
 * Mutation for forgot password
 */
export function useForgotPasswordMutation() {
  return useMutation<ForgotPasswordResponse, ApiError, ForgotPasswordPayload>({
    mutationFn: async (payload: ForgotPasswordPayload) => {
      return await authApi.forgotPassword(payload);
    },
  });
}

/**
 * Mutation for password reset
 */
export function useResetPasswordMutation() {
  return useMutation<ResetPasswordResponse, ApiError, ResetPasswordPayload>({
    mutationFn: async (payload: ResetPasswordPayload) => {
      return await authApi.resetPassword(payload);
    },
  });
}

/**
 * Mutation for email verification
 */
export function useVerifyEmailMutation() {
  return useMutation<VerifyEmailResponse, ApiError, VerifyEmailPayload>({
    mutationFn: async (payload: VerifyEmailPayload) => {
      return await authApi.verifyEmail(payload);
    },
  });
}

/**
 * Mutation for resending verification email
 */
export function useResendVerificationMutation() {
  return useMutation<
    ResendVerificationResponse,
    ApiError,
    ResendVerificationPayload
  >({
    mutationFn: async (payload: ResendVerificationPayload) => {
      return await authApi.resendVerification(payload);
    },
  });
}

/**
 * Mutation for refreshing session tokens
 */
export function useRefreshTokenMutation() {
  const queryClient = useQueryClient();
  const { setAuthSession } = useRole();

  return useMutation<LoginResponse, ApiError, string | void>({
    mutationFn: async (explicitToken?: string | void) => {
      const token = explicitToken || getCookie("refreshToken");
      if (!token) {
        throw new ApiError("No refresh token available", 401);
      }
      return await authApi.refresh({ refreshToken: token });
    },
    onSuccess: (response) => {
      const data = response.data;
      if (data) {
        setAuthCookies(data);
        setAuthSession(data);
        queryClient.invalidateQueries();
      }
    },
  });
}

/**
 * Mutation for sign out
 */
export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const { clearAuthSession } = useRole();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = getCookie("refreshToken");
      try {
        if (refreshToken) {
          await authApi.logout(refreshToken);
        } else {
          await authApi.logoutAll();
        }
      } catch {
        // Even if server call fails, proceed to clear client cookies
      }
    },
    onSettled: () => {
      clearAuthCookies();
      clearAuthSession();
      queryClient.clear();
    },
  });
}
