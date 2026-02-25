import type { UserProfile } from "@/types/user";
import type { MonthlyAnalytics } from "@/types/analytics";
import { promises } from "dns";
import { TodayInsight } from "@/hooks/use-ai";
const API_BASE_URL = "http://localhost:8000";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    return localStorage.getItem("access_token");
  }

  private setTokens(access: string, refresh: string) {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
  }

  clearTokens() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (res.status === 401) {
      this.clearTokens();
      window.location.href = "/auth";
      throw new Error("Unauthorized");
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Request failed" }));
      throw new Error(err.detail || "Request failed");
    }

    return res.json() as Promise<T>;
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request<{
      access_token: string;
      refresh_token: string;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    this.setTokens(data.access_token, data.refresh_token);
    return data;
  }

  async register(email: string, password: string, name: string) {
    return this.request<{ message: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
  }

  // Daily Logs
  // Daily Logs

  // Create today log
  async createLog(log: {
    work_hours: number;
    study_hours: number;
    sleep_hours: number;
    mood_score: number;
    goal_completed_percentage: number;
    notes?: string;
  }) {
    return this.request<{ message: string; id: number }>("/daily-logs/", {
      method: "POST",
      body: JSON.stringify(log),
    });
  }

  // Get today's log
  async getTodayLog() {
    return this.request<any>("/daily-logs/today");
  }

  // Get log by date (YYYY-MM-DD)
  async getLogByDate(date: string) {
    return this.request<any>(`/daily-logs/by-date/${date}`);
  }

  // Get paginated logs
  async getAllLogs(params?: {
    limit?: number;
    offset?: number;
    start_date?: string;
    end_date?: string;
    sort?: "asc" | "desc";
  }) {
    const query = new URLSearchParams();

    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.offset) query.set("offset", String(params.offset));
    if (params?.start_date) query.set("start_date", params.start_date);
    if (params?.end_date) query.set("end_date", params.end_date);
    if (params?.sort) query.set("sort", params.sort);

    return this.request<any>(`/daily-logs/all-logs?${query}`);
  }

  // Update today's log
  async updateTodayLog(
    payload: Partial<{
      work_hours: number;
      study_hours: number;
      sleep_hours: number;
      mood_score: number;
      goal_completed_percentage: number;
      notes: string;
    }>,
  ) {
    return this.request("/daily-logs/today", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  // Update log by date
  async updateLogByDate(date: string, payload: any) {
    return this.request(`/daily-logs/by-date/${date}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  // Delete today's log
  async deleteTodayLog() {
    return this.request("/daily-logs/today", {
      method: "DELETE",
    });
  }

  // Delete log by date
  async deleteLogByDate(date: string) {
    return this.request(`/daily-logs/by-date/${date}`, {
      method: "DELETE",
    });
  }

  // Delete all logs
  async deleteAllLogs() {
    return this.request("/daily-logs/all-logs", {
      method: "DELETE",
    });
  }

  // Analytics
  getAnalytics(): Promise<MonthlyAnalytics> {
    return this.request("/analytics/monthly");
  }

  // AI

  async getValidation() {
    return this.request<any>("/ai/validate");
  }

  // AI Motivations / Insights

  async getTodayInsight(): Promise<TodayInsight> {
  return this.request<TodayInsight>("/daily-ai-motivation/today");
}
  async submitFeedback(sourceId: number, isHelpful: boolean) {
  return this.request("/ai/feedback", {
    method: "POST",
    body: JSON.stringify({
      source: "daily_motivation", 
      source_id: sourceId,
      is_helpful: isHelpful,
    }),
  });
}

  getMe(): Promise<UserProfile> {
    return this.request("/users/me");
  }

  updateProfile(name: string) {
    return this.request("/users/profile", {
      method: "PATCH",
      body: JSON.stringify({ name }),
    });
  }

  changePassword(current: string, next: string) {
    return this.request("/users/password", {
      method: "PATCH",
      body: JSON.stringify({
        current_password: current,
        new_password: next,
      }),
    });
  }

  updatePreferences(prefs: any) {
    return this.request("/users/preferences", {
      method: "PATCH",
      body: JSON.stringify(prefs),
    });
  }

  uploadAvatar(file: File) {
    const form = new FormData();
    form.append("file", file);

    return fetch(`${this.baseUrl}/users/avatar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
      body: form,
    }).then((r) => r.json());
  }
}

export const api = new ApiClient(API_BASE_URL);
