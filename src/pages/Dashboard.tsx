import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Moon,
  Brain,
  Briefcase,
  Target,
  Sparkles,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardLayout } from "@/components/DashboardLayout";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { useCountUp } from "@/hooks/use-count-up";
import { useTodayLog, useWeeklyLogs } from "@/hooks/use-daily-logs";
import { useInsights } from "@/hooks/use-ai"; // ✅ real AI hook

const statIcons = [
  {
    key: "mood_score",
    label: "Mood",
    icon: Sparkles,
    suffix: "/10",
    color: "text-primary",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    key: "sleep_hours",
    label: "Sleep",
    icon: Moon,
    suffix: "h",
    color: "text-accent",
    gradient: "from-accent/20 to-accent/5",
  },
  {
    key: "work_hours",
    label: "Work",
    icon: Briefcase,
    suffix: "h",
    color: "text-primary",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    key: "goal_completed_percentage",
    label: "Goals",
    icon: Target,
    suffix: "%",
    color: "text-accent",
    gradient: "from-accent/20 to-accent/5",
  },
];

export default function Dashboard() {
  const { data: todayLog, isLoading: loadingToday } = useTodayLog();
  const { data: weekly } = useWeeklyLogs();
  const { data: insight, isLoading: loadingInsight } = useInsights(); // ✅ real data

  const logs = weekly?.data ?? [];
  const hasLogToday = !!todayLog;

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">
              Dashboard
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {!hasLogToday && !loadingToday && (
            <Button className="gradient-primary glow font-medium" asChild>
              <Link to="/log">
                <BookOpen className="mr-2 h-4 w-4" /> Log Today
              </Link>
            </Button>
          )}
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {statIcons.map((stat, i) => {
            const raw = Number(todayLog?.[stat.key] ?? 0);
            const countUp = useCountUp(raw, 1200, hasLogToday);

            return (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="glass-card-elevated p-5 relative overflow-hidden"
                ref={countUp.ref}
              >
                {loadingToday ? (
                  <Skeleton className="h-16 w-full" />
                ) : (
                  <>
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50`}
                    />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-3">
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                          {stat.label}
                        </span>
                      </div>
                      <p className="text-2xl sm:text-3xl font-display font-bold">
                        {hasLogToday
                          ? `${countUp.value}${stat.suffix}`
                          : "—"}
                      </p>
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
          {/* AI INSIGHT CARD */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card-elevated p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-[60px]" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-lg bg-accent/15 flex items-center justify-center">
                  <Brain className="h-4 w-4 text-accent" />
                </div>
                <h2 className="font-display font-semibold">AI Insight</h2>
              </div>

              {loadingInsight ? (
                <Skeleton className="h-16 w-full" />
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight?.insight
                    ? insight.insight
                    : hasLogToday
                    ? "No AI insight available yet."
                    : "Log today to unlock personalized insights."}
                </p>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="mt-4 text-primary font-medium -ml-2"
                asChild
              >
                <Link to="/insights">
                  View All Insights <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* 7-DAY TREND */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card-elevated p-6"
          >
            <h2 className="font-display font-semibold mb-4">
              7-Day Mood Trend
            </h2>

            {logs.length > 1 ? (
              <ResponsiveContainer width="100%" height={110}>
                <LineChart
                  data={[...logs].sort(
                    (a, b) =>
                      new Date(a.date).getTime() -
                      new Date(b.date).getTime()
                  )}
                >
                  <Line
                    type="monotone"
                    dataKey="mood_score"
                    stroke="hsl(210, 100%, 56%)"
                    strokeWidth={2.5}
                    dot={{
                      r: 3,
                      fill: "hsl(210, 100%, 56%)",
                      strokeWidth: 0,
                    }}
                    activeDot={{
                      r: 5,
                      fill: "hsl(210, 100%, 56%)",
                      strokeWidth: 2,
                      stroke: "hsl(228, 12%, 4%)",
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(228, 14%, 9%)",
                      border: "1px solid hsl(228, 12%, 18%)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[110px]">
                <p className="text-sm text-muted-foreground">
                  Not enough data yet.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}