/**
 * Skillority Centralized API Client
 * 
 * Features:
 * - Dynamic base URL from process.env.NEXT_PUBLIC_API_URL or fallback http://localhost:5000/api
 * - Automatic Authorization: Bearer <accessToken> header attachment
 * - Automatic credentials: 'include' for HttpOnly refresh cookies
 * - 401 Interception with single-flight mutex token refresh
 * - Standardized result format: { data, error, status }
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

/**
 * Custom Error class with status and backend error payload
 */
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Attempts to refresh the access token using HttpOnly cookie or stored refresh token
 */
async function refreshAccessToken() {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!res.ok) {
      // Clear client storage if refresh failed
      if (typeof window !== 'undefined') {
        localStorage.removeItem('skillority_token');
        localStorage.removeItem('skillority_user');
      }
      return null;
    }

    const payload = await res.json();
    const newAccessToken = payload?.data?.accessToken;

    if (newAccessToken && typeof window !== 'undefined') {
      localStorage.setItem('skillority_token', newAccessToken);
      if (payload.data.user) {
        localStorage.setItem('skillority_user', JSON.stringify(payload.data.user));
      }
    }
    return newAccessToken;
  } catch (err) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('skillority_token');
      localStorage.removeItem('skillority_user');
    }
    return null;
  }
}

/**
 * Universal API Request Method
 */
export async function apiRequest(endpoint, options = {}) {
  const {
    method = 'GET',
    headers = {},
    body,
    requiresAuth = true,
    ...customConfig
  } = options;

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Attach token if present
  if (requiresAuth && typeof window !== 'undefined') {
    const token = localStorage.getItem('skillority_token');
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const config = {
    method,
    headers: requestHeaders,
    credentials: 'include',
    ...customConfig,
  };

  if (body) {
    config.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  try {
    let response = await fetch(url, config);

    // If 401 Unauthorized, attempt refresh once
    if (response.status === 401 && requiresAuth) {
      if (!isRefreshing) {
        isRefreshing = true;
        const newToken = await refreshAccessToken();
        isRefreshing = false;

        if (newToken) {
          onRefreshed(newToken);
        } else {
          onRefreshed(null);
          const errorJson = await response.json().catch(() => ({}));
          throw new ApiError(
            errorJson?.error?.message || 'Session expired. Please log in again.',
            401,
            errorJson
          );
        }
      }

      // Wait for the active refresh to complete
      const retryToken = await new Promise((resolve) => {
        subscribeTokenRefresh((token) => resolve(token));
      });

      if (retryToken) {
        config.headers['Authorization'] = `Bearer ${retryToken}`;
        response = await fetch(url, config);
      } else {
        throw new ApiError('Authentication required', 401);
      }
    }

    const contentType = response.headers.get('content-type');
    let data = null;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const message =
        data?.error?.message ||
        data?.message ||
        `HTTP ${response.status}: Request failed`;
      throw new ApiError(message, response.status, data);
    }

    return {
      data: data?.data !== undefined ? data.data : data,
      raw: data,
      status: response.status,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error.message || 'Network request failed',
        status: error.status || 500,
        details: error.data || null,
      },
      status: error.status || 500,
    };
  }
}

/**
 * Convenient HTTP verb shortcuts
 */
export const api = {
  get: (endpoint, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
