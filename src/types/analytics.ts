export interface DailyAnalyticsPoint {
  day: number;
  mood: number;
  sleep: number;
  work: number;
  goals: number;
}

export interface MonthlyAnalytics {
  daily_data: DailyAnalyticsPoint[];
  summary: Record<string, number>;
}
