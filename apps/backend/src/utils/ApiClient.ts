// DRY - Centralized API client configuration

// Tipo seguro para las opciones de request
export type ApiRequestOptions = {
  headers?: Record<string, string>;
  method?: string;
  body?: string | FormData | Blob | ArrayBuffer | null;
  // Puedes agregar más propiedades según lo que uses
  [key: string]: unknown;
};

export class ApiClient {
  private static readonly defaultHeaders = {
    'Content-Type': 'application/json',
    'x-api-key': process.env.API_KEY || 'academic-platform-2024-secure-key',
  };

  static async request<T>(
    url: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const config = {
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  static getHeaders() {
    return { ...this.defaultHeaders };
  }
}
