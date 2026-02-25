import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

/* ================= TYPES ================= */

export interface TodayInsight {
  id: number;
  insight: string;
  date: string;
  feedbackGiven: boolean;
}

export interface ValidationMetric {
  before: number | null;
  after: number | null;
  change: "improved" | "declined" | "same";
}

export interface ValidationResponse {
  metrics: Record<string, ValidationMetric>;
}

/* ================= FETCH INSIGHT ================= */

export const useInsights = () =>
  useQuery<TodayInsight>({
    queryKey: ["ai-insights"],
    queryFn: () => api.getTodayInsight(),
    staleTime: 1000 * 60 * 5, // optional: cache 5 minutes
  });

/* ================= FETCH VALIDATION ================= */

export const useValidation = () =>
  useQuery<ValidationResponse>({
    queryKey: ["ai-validation"],
    queryFn: () => api.getValidation(),
  });

/* ================= SUBMIT FEEDBACK ================= */

export const useInsightFeedback = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, helpful }: { id: number; helpful: boolean }) =>
      api.submitFeedback(id, helpful),

    onSuccess: () => {
      // Refetch today's insight to update feedbackGiven
      qc.invalidateQueries({ queryKey: ["ai-insights"] });
    },
  });
};