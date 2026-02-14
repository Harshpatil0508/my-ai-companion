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

const mockData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  mood: Math.floor(Math.random() * 4 + 5),
  sleep: +(Math.random() * 3 + 5.5).toFixed(1),
  work: +(Math.random() * 4 + 4).toFixed(1),
  goals: Math.floor(Math.random() * 40 + 50),
}));

const chartTooltipStyle = {
  contentStyle: { background: "hsl(222, 47%, 9%)", border: "1px solid hsl(222, 30%, 18%)", borderRadius: 8, fontSize: 12 },
  labelStyle: { color: "hsl(215, 20%, 55%)" },
};

const Analytics = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnalytics().then(setAnalytics).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const data = analytics?.daily_data || mockData;

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-display font-bold">Analytics</h1>
        </div>

        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Mood & Sleep chart */}
            <div className="glass-card p-6">
              <h2 className="font-display font-semibold mb-4">Mood & Sleep Trends</h2>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(260, 80%, 62%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(260, 80%, 62%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                  <XAxis dataKey="day" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
                  <Tooltip {...chartTooltipStyle} />
                  <Area type="monotone" dataKey="mood" stroke="hsl(217, 91%, 60%)" fill="url(#moodGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="sleep" stroke="hsl(260, 80%, 62%)" fill="url(#sleepGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Work & Goals */}
            <div className="glass-card p-6">
              <h2 className="font-display font-semibold mb-4">Work Hours & Goal Completion</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                  <XAxis dataKey="day" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
                  <Tooltip {...chartTooltipStyle} />
                  <Bar dataKey="work" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} opacity={0.8} />
                  <Bar dataKey="goals" fill="hsl(260, 80%, 62%)" radius={[4, 4, 0, 0]} opacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Summary */}
            {analytics?.summary && (
              <div className="glass-card p-6">
                <h2 className="font-display font-semibold mb-4">Monthly Summary</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(analytics.summary).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <p className="text-xs text-muted-foreground uppercase">{key.replace("_", " ")}</p>
                      <p className="text-xl font-bold mt-1">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default Analytics;
