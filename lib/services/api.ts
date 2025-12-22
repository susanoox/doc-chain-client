import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiError } from "@/lib/types";

// Create axios instance
const api = axios.create({
   baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
   timeout: 30000,
   headers: {
      "Content-Type": "application/json",
   },
});

// Request interceptor
api.interceptors.request.use(
   (config) => {
      // Add auth token if available
      const token = localStorage.getItem("token");
      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
   },
   (error) => {
      return Promise.reject(error);
   }
);

// Response interceptor
api.interceptors.response.use(
   (response: AxiosResponse) => {
      return response.data;
   },
   async (error: AxiosError<ApiError>) => {
      // Handle specific error status codes
      if (error.response) {
         const { status, data } = error.response;

         switch (status) {
            case 401:
               // Unauthorized - clear auth and redirect to login
               localStorage.removeItem("token");
               if (typeof window !== "undefined") {
                  window.location.href = "/login";
               }
               break;

            case 403:
               // Forbidden - user doesn't have permission
               console.error("Permission denied");
               break;

            case 404:
               // Not found
               console.error("Resource not found");
               break;

            case 500:
               // Server error
               console.error("Server error occurred");
               break;

            default:
               console.error(
                  "An error occurred:",
                  data?.message || error.message
               );
         }

         // Return formatted error
         const apiError: ApiError = {
            message: data?.message || "An error occurred",
            code: data?.code,
            statusCode: status,
            details: data?.details,
         };

         return Promise.reject(apiError);
      }

      // Network error or no response
      const apiError: ApiError = {
         message: "Network error occurred. Please check your connection.",
         statusCode: 0,
      };

      return Promise.reject(apiError);
   }
);

export default api;

// Typed API methods
export const apiClient = {
   get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
      api.get(url, config),

   post: <T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
   ): Promise<T> => api.post(url, data, config),

   put: <T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
   ): Promise<T> => api.put(url, data, config),

   patch: <T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
   ): Promise<T> => api.patch(url, data, config),

   delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
      api.delete(url, config),
};
