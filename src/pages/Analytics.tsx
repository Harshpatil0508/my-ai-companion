import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardLayout } from "@/components/DashboardLayout";
import { api } from "@/lib/api";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";
import { MonthlyAnalytics } from "@/types/analytics";

const chartTooltipStyle = {
  contentStyle: {
    background: "hsl(228, 14%, 9%)",
    border: "1px solid hsl(228, 12%, 18%)",
    borderRadius: 8,
    fontSize: 12,
    boxShadow: "0 8px 32px -8px hsl(228 12% 4% / 0.5)",
  },
  labelStyle: { color: "hsl(215, 15%, 50%)" },
};

const Analytics = () => {
  const [analytics, setAnalytics] = useState<MonthlyAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnalytics().then(setAnalytics).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const data = analytics?.daily_data ?? [];

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">Analytics</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Your monthly trends & data</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-5">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        ) : (
          <div className="space-y-5">
            {/* Mood & Sleep chart */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card-elevated p-5 sm:p-6"
            >
              <h2 className="font-display font-semibold mb-5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Mood & Sleep Trends
              </h2>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(210, 100%, 56%)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="hsl(210, 100%, 56%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(270, 70%, 60%)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="hsl(270, 70%, 60%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(228, 12%, 14%)" />
                  <XAxis dataKey="day" tick={{ fill: "hsl(215, 15%, 50%)", fontSize: 11 }} axisLine={{ stroke: "hsl(228, 12%, 14%)" }} />
                  <YAxis tick={{ fill: "hsl(215, 15%, 50%)", fontSize: 11 }} axisLine={{ stroke: "hsl(228, 12%, 14%)" }} />
                  <Tooltip {...chartTooltipStyle} />
                  <Area type="monotone" dataKey="mood" stroke="hsl(210, 100%, 56%)" fill="url(#moodGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="sleep" stroke="hsl(270, 70%, 60%)" fill="url(#sleepGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Work & Goals */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card-elevated p-5 sm:p-6"
            >
              <h2 className="font-display font-semibold mb-5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Work Hours & Goal Completion
              </h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(228, 12%, 14%)" />
                  <XAxis dataKey="day" tick={{ fill: "hsl(215, 15%, 50%)", fontSize: 11 }} axisLine={{ stroke: "hsl(228, 12%, 14%)" }} />
                  <YAxis tick={{ fill: "hsl(215, 15%, 50%)", fontSize: 11 }} axisLine={{ stroke: "hsl(228, 12%, 14%)" }} />
                  <Tooltip {...chartTooltipStyle} />
                  <Bar dataKey="work" fill="hsl(210, 100%, 56%)" radius={[6, 6, 0, 0]} opacity={0.85} />
                  <Bar dataKey="goals" fill="hsl(270, 70%, 60%)" radius={[6, 6, 0, 0]} opacity={0.65} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Summary */}
            {analytics?.summary && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card-elevated p-5 sm:p-6"
              >
                <h2 className="font-display font-semibold mb-5 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Monthly Summary
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(analytics.summary).map(([key, value]) => (
                    <div key={key} className="glass-card p-4 text-center">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">{key.replace("_", " ")}</p>
                      <p className="text-xl font-display font-bold">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default Analytics;
