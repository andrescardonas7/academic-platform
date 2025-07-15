// DRY - Centralized API client configuration

export class ApiClient {
  private static defaultHeaders = {
    'Content-Type': 'application/json',
    'x-api-key': process.env.API_KEY || 'academic-platform-2024-secure-key',
  };

  static async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const config: RequestInit = {
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
