/// <reference types="vite/client" />
import type { FormData } from "../types";

const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";

function getToken(): string | null {
  return localStorage.getItem("bp_token");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

interface ApiError extends Error {
  status: number;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    const err = new Error((data as { error?: string }).error ?? "Request failed") as ApiError;
    err.status = res.status;
    throw err;
  }

  return data as T;
}

export const api = {
  register: (email: string, password: string) =>
    request<{ token: string; credits: number }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  login: (email: string, password: string) =>
    request<{ token: string; credits: number }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  me: () =>
    request<{ email: string; credits: number; createdAt: string }>("/api/me"),

  startPlan: (formData: FormData) =>
    request<{ planId: string }>("/api/plans", {
      method: "POST",
      body: JSON.stringify({ formData }),
    }),

  generateSection: (planId: string, section: string) =>
    request<{ content: string }>(`/api/plans/${planId}/sections`, {
      method: "POST",
      body: JSON.stringify({ section }),
    }),

  creditHistory: () =>
    request<Array<{ id: string; amount: number; type: string; reason: string; createdAt: string }>>(
      "/api/credits/history"
    ),
};
