const BASE_URL = process.env.EXTERNAL_API_URL;

type RequestConfig = RequestInit & {
  params?: Record<string, string | number | boolean>;
};

class ApiClient {
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {},
  ): Promise<T> {
    const { params, headers, ...rest } = config;

    const url = new URL(endpoint, BASE_URL);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const response = await fetch(url.toString(), {
      ...rest,
      // credentials: "same-origin", // Allow sending cookies/credentials for same origin
      //   credentials: "include", // Allow sending cookies/credentials
      credentials: "omit", // Prevent sending cookies/credentials
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message || "Something went wrong!");
    }

    return response.json();
  }

  get<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, { ...config, method: "GET" });
  }

  post<T>(url: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  put<T>(url: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  patch<T>(url: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  delete<T>(url: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, {
      ...config,
      method: "DELETE",
      body: JSON.stringify(body),
    });
  }
}

export const api = new ApiClient();
