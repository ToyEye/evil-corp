import axios from "axios";

import store from "../store/store";
import { logout } from "../store/auth/auth.slice";
import { queryClient } from "./queryClient";

const baseURL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:3000/api";

const AUTH_ATTEMPT_URLS = ["/auth/login", "/auth/register", "/auth/signup"];

export const isUnauthorizedError = (error: unknown) =>
  axios.isAxiosError(error) && error.response?.status === 401;

const isAuthAttemptRequest = (url = "") =>
  AUTH_ATTEMPT_URLS.some((path) => url.includes(path));

export const http = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isUnauthorizedError(error) && !isAuthAttemptRequest(error.config?.url)) {
      const auth = store.getState().auth;
      const hadSession = Boolean(auth.token || auth.isAuthenticated || auth.user);
      if (hadSession) {
        void queryClient.cancelQueries();
        store.dispatch(logout());
        queryClient.clear();
      }
    }
    return Promise.reject(error);
  },
);

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string | string[] }
      | undefined;
    const message = data?.message;
    if (Array.isArray(message) && message.length > 0) {
      return message.join(", ");
    }
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

export const getApiErrorMessageAsync = async (
  error: unknown,
  fallback: string,
) => {
  if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
    try {
      const payload = JSON.parse(await error.response.data.text()) as {
        message?: string | string[];
      };
      if (Array.isArray(payload.message) && payload.message.length > 0) {
        return payload.message.join(", ");
      }
      if (typeof payload.message === "string" && payload.message.trim()) {
        return payload.message.trim();
      }
    } catch {
      return getApiErrorMessage(error, fallback);
    }
  }

  return getApiErrorMessage(error, fallback);
};
