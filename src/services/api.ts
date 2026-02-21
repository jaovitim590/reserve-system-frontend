import axios from "axios";
import { TOKEN_KEY } from "../lib/token";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

const authInterceptor = (config: import("axios").InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const errorInterceptor = (error: unknown) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    (error as { response?: { status?: number } }).response?.status === 401
  ) {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "/login";
  }
  return Promise.reject(error);
};

api.interceptors.request.use(authInterceptor);
api.interceptors.response.use((r) => r, errorInterceptor);
