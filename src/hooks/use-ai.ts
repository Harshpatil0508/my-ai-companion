import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

// Fetch AI insights
export const useInsights = (page = 0, limit = 5) =>
  useQuery({
    queryKey: ["ai-insights", page],
    queryFn: () => api.getInsights(page, limit),
    placeholderData: (previous) => previous,
  });

// Validation metrics
export const useValidation = () =>
  useQuery({
    queryKey: ["ai-validation"],
    queryFn: () => api.getValidation(),
  });

// Submit feedback
export const useInsightFeedback = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, helpful }: { id: string; helpful: boolean }) =>
      api.submitFeedback(id, helpful),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ai-insights"] });
    },
  });
};
