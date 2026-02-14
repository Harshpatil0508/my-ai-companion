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

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${this.baseUrl}${endpoint}`, { ...options, headers });

    if (res.status === 401) {
      this.clearTokens();
      window.location.href = "/auth";
      throw new Error("Unauthorized");
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Request failed" }));
      throw new Error(err.detail || "Request failed");
    }

    return res.json();
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request<{ access_token: string; refresh_token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    this.setTokens(data.access_token, data.refresh_token);
    return data;
  }

  async register(email: string, password: string, full_name: string) {
    return this.request<{ message: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, full_name }),
    });
  }

  // Daily Logs
  async createLog(log: {
    work_hours: number;
    study_hours: number;
    sleep_hours: number;
    mood: number;
    goal_completion: number;
    notes?: string;
  }) {
    return this.request("/logs/", { method: "POST", body: JSON.stringify(log) });
  }

  async getLogs(skip = 0, limit = 10) {
    return this.request<any[]>(`/logs/?skip=${skip}&limit=${limit}`);
  }

  async getLogById(id: string) {
    return this.request<any>(`/logs/${id}`);
  }

  async updateLog(id: string, log: any) {
    return this.request(`/logs/${id}`, { method: "PUT", body: JSON.stringify(log) });
  }

  async deleteLog(id: string) {
    return this.request(`/logs/${id}`, { method: "DELETE" });
  }

  // Analytics
  async getAnalytics(month?: number, year?: number) {
    const params = new URLSearchParams();
    if (month) params.set("month", String(month));
    if (year) params.set("year", String(year));
    return this.request<any>(`/analytics/monthly?${params}`);
  }

  // AI
  async submitFeedback(motivationId: string, helpful: boolean) {
    return this.request("/ai/feedback", {
      method: "POST",
      body: JSON.stringify({ motivation_id: motivationId, helpful }),
    });
  }

  async getValidation() {
    return this.request<any>("/ai/validate");
  }
}

export const api = new ApiClient(API_BASE_URL);
