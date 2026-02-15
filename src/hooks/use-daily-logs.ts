import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

// Today log
export const useTodayLog = () =>
  useQuery({
    queryKey: ["today-log"],
    queryFn: () => api.getTodayLog(),
    retry: false,
  });

// Last 7 logs
export const useWeeklyLogs = () =>
  useQuery({
    queryKey: ["weekly-logs"],
    queryFn: () => api.getAllLogs({ limit: 7 }),
  });

// Create / Update log
export const useSaveDailyLog = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.createLog,

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["today-log"] });
      qc.invalidateQueries({ queryKey: ["weekly-logs"] });
    },
  });
};
