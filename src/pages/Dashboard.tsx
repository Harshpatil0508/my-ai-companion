import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Moon, Brain, Briefcase, Target, Sparkles, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardLayout } from "@/components/DashboardLayout";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { useCountUp } from "@/hooks/use-count-up";
import { useTodayLog, useWeeklyLogs } from "@/hooks/use-daily-logs";

const statIcons = [
  { key: "mood_score", label: "Mood", icon: Sparkles, suffix: "/10", color: "text-primary" },
  { key: "sleep_hours", label: "Sleep", icon: Moon, suffix: "h", color: "text-accent" },
  { key: "work_hours", label: "Work", icon: Briefcase, suffix: "h", color: "text-primary" },
  { key: "goal_completed_percentage", label: "Goals", icon: Target, suffix: "%", color: "text-accent" },
];

export default function Dashboard() {
  const { data: todayLog, isLoading: loadingToday } = useTodayLog();
  const { data: weekly } = useWeeklyLogs();

  const logs = weekly?.data ?? [];
  const hasLogToday = !!todayLog;

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold">Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {!hasLogToday && !loadingToday && (
            <Button className="gradient-primary glow" asChild>
              <Link to="/log">
                <BookOpen className="mr-2 h-4 w-4" /> Log Today
              </Link>
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statIcons.map((stat) => {
            const raw = Number(todayLog?.[stat.key] ?? 0);
            const countUp = useCountUp(raw, 1200, hasLogToday);

            return (
              <div key={stat.key} className="glass-card p-5" ref={countUp.ref}>
                {loadingToday ? (
                  <Skeleton className="h-16 w-full" />
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">
                        {stat.label}
                      </span>
                    </div>

                    <p className="text-2xl font-display font-bold">
                      {hasLogToday ? `${countUp.value}${stat.suffix}` : "—"}
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* AI */}
          <div className="glass-card p-6 glow-accent">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-5 w-5 text-accent" />
              <h2 className="font-display font-semibold">AI Insight</h2>
            </div>

            <p className="text-sm text-muted-foreground">
              {hasLogToday
                ? "Consistency beats motivation. You’re building momentum."
                : "Log today to unlock personalized insights."}
            </p>

            <Button variant="ghost" size="sm" className="mt-4 text-primary" asChild>
              <Link to="/insights">
                View All Insights <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>

          {/* Trend */}
          <div className="glass-card p-6">
            <h2 className="font-display font-semibold mb-3">7-Day Mood Trend</h2>

            {logs.length > 1 ? (
              <ResponsiveContainer width="100%" height={100}>
                <LineChart
                  data={[...logs].sort(
                    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
                  )}
                >
                  <Line type="monotone" dataKey="mood_score" strokeWidth={2} dot={{ r: 3 }} />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground">Not enough data yet.</p>
            )}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
