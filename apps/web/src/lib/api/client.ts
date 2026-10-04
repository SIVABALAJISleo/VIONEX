/**
 * VIONEX Unified Production API Client Core
 * Connects Next.js Frontend directly to Fastify Backend (http://localhost:4000/api/v1)
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:4000/api/v1'
    : '/api/v1');

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  code?: string;
  message?: string;
  errors?: any[];
  [key: string]: any;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('vionex_auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('vionex_auth_token', token);
      } else {
        localStorage.removeItem('vionex_auth_token');
      }
    }
  }

  getToken(): string | null {
    return this.token;
  }

  async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string>)
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include' // Sends vionex_session cookie
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return {
          success: false,
          code: data.code || `HTTP_${response.status}`,
          message: data.message || `Request failed with status ${response.status}`,
          errors: data.errors
        };
      }

      return {
        success: true,
        ...data
      };
    } catch (error: any) {
      return {
        success: false,
        code: 'NETWORK_ERROR',
        message: error.message || 'Unable to connect to VIONEX API service'
      };
    }
  }

  get<T = any>(endpoint: string, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  post<T = any>(endpoint: string, body?: any, headers?: Record<string, string>) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      headers
    });
  }

  put<T = any>(endpoint: string, body?: any, headers?: Record<string, string>) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      headers
    });
  }

  delete<T = any>(endpoint: string, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }
}

export const api = new ApiClient();
