import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Moon, Brain, Briefcase, Target, Sparkles, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardLayout } from "@/components/DashboardLayout";
import { api } from "@/lib/api";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { useCountUp } from "@/hooks/use-count-up";

const statIcons = [
  { key: "mood", label: "Mood", icon: Sparkles, suffix: "/10", color: "text-primary" },
  { key: "sleep_hours", label: "Sleep", icon: Moon, suffix: "h", color: "text-accent" },
  { key: "work_hours", label: "Work", icon: Briefcase, suffix: "h", color: "text-primary" },
  { key: "goal_completion", label: "Goals", icon: Target, suffix: "%", color: "text-accent" },
];

const Dashboard = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getLogs(0, 7).then(setLogs).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const today = logs[0];
  const hasLogToday = today && new Date(today.created_at).toDateString() === new Date().toDateString();

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold">Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>
          {!hasLogToday && !loading && (
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
            const raw = hasLogToday ? Number(today[stat.key]) : 0;
            const countUp = useCountUp(raw, 1200, hasLogToday && !loading);
            return (
              <div key={stat.key} className="glass-card p-5" ref={countUp.ref}>
                {loading ? (
                  <Skeleton className="h-16 w-full" />
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</span>
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
          {/* AI Insight */}
          <div className="glass-card p-6 glow-accent">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-5 w-5 text-accent" />
              <h2 className="font-display font-semibold">AI Insight</h2>
            </div>
            {loading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {hasLogToday
                  ? "Your mood tends to increase on days with 7+ hours of sleep. Keep the momentum going!"
                  : "Log today's data to receive personalized AI insights."}
              </p>
            )}
            <Button variant="ghost" size="sm" className="mt-4 text-primary" asChild>
              <Link to="/insights">
                View All Insights <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>

          {/* Weekly Trend */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="font-display font-semibold">7-Day Mood Trend</h2>
            </div>
            {loading ? (
              <Skeleton className="h-24 w-full" />
            ) : logs.length > 1 ? (
              <ResponsiveContainer width="100%" height={100}>
                <LineChart data={[...logs].reverse()}>
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="hsl(217, 91%, 60%)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "hsl(217, 91%, 60%)" }}
                  />
                  <Tooltip
                    contentStyle={{ background: "hsl(222, 47%, 9%)", border: "1px solid hsl(222, 30%, 18%)", borderRadius: 8 }}
                    labelStyle={{ display: "none" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground">Not enough data yet. Keep logging daily!</p>
            )}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
