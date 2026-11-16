import { getCookie, setAuthCookies, clearAuthCookies } from "./cookies";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://155.117.41.131:10106";

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string>;
  raw?: any;

  constructor(message: string, status = 400, errors?: Record<string, string>, raw?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
    this.raw = raw;
  }
}

// Mutex to deduplicate concurrent refresh calls
let refreshPromise: Promise<string> | null = null;

/**
 * Refresh access token using stored refresh token.
 * Deduplicates concurrent calls via a shared promise.
 */
export async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = getCookie("refreshToken");
    if (!refreshToken) {
      clearAuthCookies();
      if (typeof window !== "undefined") {
        window.location.href = "/login?expired=1";
      }
      throw new ApiError("Session expired. Please log in again.", 401);
    }

    try {
      const url = `${API_BASE_URL}/api/v1/auth/refresh`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) {
        clearAuthCookies();
        if (typeof window !== "undefined") {
          window.location.href = "/login?expired=1";
        }
        throw new ApiError("Session expired. Please log in again.", 401);
      }

      const resData = await res.json();
      const authData = resData?.data;
      if (!authData?.accessToken) {
        clearAuthCookies();
        throw new ApiError("Invalid refresh response from server", 401);
      }

      // Persist the refreshed access and refresh tokens into cookies
      setAuthCookies(authData);

      return authData.accessToken as string;
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        err.message || "Failed to refresh session token",
        401
      );
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Universal JSON fetcher with error normalization and automatic token refresh on 401
 */
export async function request<T>(
  path: string,
  options: RequestInit = {},
  isRetry = false
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  // Attach Bearer token from cookies if available
  const token = getCookie("accessToken");
  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Construct URL
  const url = `${API_BASE_URL}${path}`;

  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers,
    });
  } catch (err: any) {
    throw new ApiError(
      err.message || `Network error connecting to server at ${API_BASE_URL}`,
      0
    );
  }

  // Intercept 401 and attempt automatic token refresh
  if (res.status === 401 && !isRetry) {
    const isAuthBypass =
      path.includes("/auth/login") ||
      path.includes("/auth/refresh") ||
      path.includes("/auth/register") ||
      path.includes("/auth/forgot-password") ||
      path.includes("/auth/reset-password") ||
      path.includes("/auth/verify-email");

    if (!isAuthBypass) {
      const storedRefreshToken = getCookie("refreshToken");
      if (storedRefreshToken) {
        try {
          const newAccessToken = await refreshAccessToken();
          const retryHeaders = {
            ...headers,
            Authorization: `Bearer ${newAccessToken}`,
          };
          return request<T>(path, { ...options, headers: retryHeaders }, true);
        } catch {
          // If refresh fails, fall through to error processing
        }
      }
    }
  }

  const contentType = res.headers.get("content-type");
  let data: any = null;

  if (contentType && contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  } else {
    try {
      const text = await res.text();
      data = text ? { message: text } : null;
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    // Extract human-readable error from various backend response formats
    // Prioritize specific embedded error messages over generic status phrases like "Conflict" or "Bad Request"
    let errorMessage =
      data?._embedded?.errors?.[0]?.message ||
      data?.errors?.[0]?.message ||
      data?.message ||
      data?.error ||
      `Request failed with status ${res.status}`;

    if (res.status === 401 && (!data?._embedded?.errors?.[0]?.message)) {
      errorMessage = data?.message || "Invalid credentials or session expired";
    }

    throw new ApiError(errorMessage, res.status, data?.errors, data);
  }

  return data as T;
}

// ---------------------------------------------------------------------------
// Typed Request Payloads & Responses
// ---------------------------------------------------------------------------

export interface RegisterPayload {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string; // "YYYY-MM-DD"
  gender: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    userPublicId: string;
    residentPublicId: string;
    firstName: string;
    lastName: string;
    email: string;
    onboardingStatus: string;
    registrationReference: string;
    message: string;
  };
  errors?: Record<string, string>;
  timestamp: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RoleAssignment {
  role: string;
  organisationPublicId?: string;
  organisationName?: string;
  careHomePublicId?: string;
  careHomeName?: string;
}

export interface LoginResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    expiresAt: string;
    userPublicId: string;
    firstName: string;
    lastName: string;
    email: string;
    organisationPublicId?: string;
    roles: string[];
    refreshToken: string;
    refreshExpiresIn: number;
    refreshExpiresAt: string;
    roleAssignments?: RoleAssignment[];
  };
  errors?: Record<string, string>;
  timestamp: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  success?: boolean;
  status?: number;
  message: string;
  data?: any;
  errors?: any;
  timestamp?: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  success?: boolean;
  status?: number;
  message: string;
  data?: any;
  errors?: any;
  timestamp?: string;
}

export interface VerifyEmailPayload {
  token: string;
}

export interface VerifyEmailResponse {
  success?: boolean;
  message?: string;
  [key: string]: any;
}

export interface ResendVerificationPayload {
  email: string;
}

export interface ResendVerificationResponse {
  message?: string;
  [key: string]: any;
}

// ---------------------------------------------------------------------------
// API Methods
// ---------------------------------------------------------------------------

export const authApi = {
  /**
   * POST /api/v1/auth/register
   */
  register: (payload: RegisterPayload) =>
    request<RegisterResponse>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  /**
   * POST /api/v1/auth/login
   */
  login: (payload: LoginPayload) =>
    request<LoginResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  /**
   * POST /api/v1/auth/refresh
   */
  refresh: async (payload: RefreshTokenPayload) => {
    const res = await request<LoginResponse>("/api/v1/auth/refresh", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (res?.data) {
      setAuthCookies(res.data);
    }
    return res;
  },

  /**
   * POST /api/v1/auth/logout-all
   */
  logoutAll: () =>
    request<{ success: boolean; message: string }>("/api/v1/auth/logout-all", {
      method: "POST",
    }),

  /**
   * POST /api/v1/auth/logout
   */
  logout: (refreshToken: string) =>
    request<{ success: boolean; message: string }>("/api/v1/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }),

  /**
   * POST /api/v1/auth/forgot-password
   */
  forgotPassword: (payload: ForgotPasswordPayload) =>
    request<ForgotPasswordResponse>("/api/v1/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  /**
   * POST /api/v1/auth/reset-password
   */
  resetPassword: (payload: ResetPasswordPayload) =>
    request<ResetPasswordResponse>("/api/v1/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  /**
   * POST /api/v1/auth/verify-email
   */
  verifyEmail: (payload: VerifyEmailPayload) =>
    request<VerifyEmailResponse>("/api/v1/auth/verify-email", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  /**
   * POST /api/v1/auth/resend-verification
   */
  resendVerification: (payload: ResendVerificationPayload) =>
    request<ResendVerificationResponse>("/api/v1/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
