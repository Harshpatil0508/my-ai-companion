export interface UserProfile {
  id: number;
  email: string;
  name: string;
  avatar_url?: string;

  daily_reminder: boolean;
  weekly_digest: boolean;
  monthly_review: boolean;
  ai_motivation: boolean;
}
