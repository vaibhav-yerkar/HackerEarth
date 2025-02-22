import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { useAppStore } from "../store/index";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  timeout: 10000,
});

interface CacheItem {
  data: any;
  timestamp: number;
  expiresIn: number;
}

class ApiService {
  private static CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes default cache expiry

  private static getFromCache(key: string): any | null {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (!cached) return null;

      const { data, timestamp, expiresIn }: CacheItem = JSON.parse(cached);
      const now = Date.now();

      if (now - timestamp > expiresIn) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }

      return data;
    } catch {
      return null;
    }
  }

  private static setCache(
    key: string,
    data: any,
    expiresIn = ApiService.CACHE_EXPIRY
  ): void {
    const cacheItem: CacheItem = {
      data,
      timestamp: Date.now(),
      expiresIn,
    };
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
    } catch (error) {
      console.warn("Cache storage failed:", error);
    }
  }

  private static getCacheKey(config: AxiosRequestConfig): string {
    // Simplified cache key - just method and URL
    return `${config.method}_${config.url}`;
  }

  static async request<T>(
    config: AxiosRequestConfig & { skipCache?: boolean }
  ): Promise<T> {
    const cacheKey = this.getCacheKey(config);
    const setOffline = useAppStore.getState().setIsOffline;

    // Only check cache for GET requests
    const cachedData =
      config.method?.toUpperCase() === "GET"
        ? this.getFromCache(cacheKey)
        : null;

    try {
      const response: AxiosResponse<T> = await api(config);

      if (response.status === 200 && config.method?.toUpperCase() === "GET") {
        // Only cache GET requests
        this.setCache(cacheKey, response.data);
      }

      setOffline(false);
      return response.data;
    } catch (error) {
      setOffline(true);

      // Only use cache for GET requests
      if (cachedData && config.method?.toUpperCase() === "GET") {
        console.log("Serving from cache due to error:", error);
        return cachedData;
      }

      throw error;
    }
  }

  // Convenience methods
  static async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: "GET", url });
  }

  static async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>({ ...config, method: "POST", url, data });
  }

  static async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>({ ...config, method: "PUT", url, data });
  }

  static async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: "DELETE", url });
  }

  // Clear all cached data
  static clearCache(): void {
    Object.keys(localStorage)
      .filter((key) => key.startsWith("cache_"))
      .forEach((key) => localStorage.removeItem(key));
  }
}

export default ApiService;
