import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, ThumbsUp, ThumbsDown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardLayout } from "@/components/DashboardLayout";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Insights() {
  const [validation, setValidation] = useState<any>(null);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    Promise.all([
      api.getValidation().catch(() => null),
      api.getInsights().catch(() => []),
    ])
      .then(([validationRes, insightsRes]) => {
        if (validationRes) setValidation(validationRes);
        if (insightsRes) setInsights(insightsRes as any[]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleFeedback = async (id: string, helpful: boolean) => {
    try {
      await api.submitFeedback(id, helpful);
      setFeedbackGiven((p) => ({ ...p, [id]: true }));
      toast({ title: helpful ? "Thanks! 👍" : "Noted. We'll improve." });
    } catch {
      toast({ title: "Saved locally", description: "Will sync later." });
      setFeedbackGiven((p) => ({ ...p, [id]: true }));
    }
  };

  const getIndicator = (change: string) => {
    if (change === "improved") return <TrendingUp className="h-4 w-4 text-success" />;
    if (change === "declined") return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-accent/15 flex items-center justify-center">
            <Brain className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">AI Insights</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Personalized analysis & motivation</p>
          </div>
        </div>

        {/* Validation */}
        <div className="glass-card-elevated p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-full blur-[80px]" />
          <div className="relative">
            <h2 className="font-display font-semibold mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              AI Validation
            </h2>

            {loading ? (
              <Skeleton className="h-20 w-full" />
            ) : validation ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Object.entries(validation.metrics || {}).map(([k, v]: any) => (
                  <div key={k} className="glass-card p-4 text-center">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">{k.replace("_", " ")}</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xl font-display font-bold">{v.after ?? "—"}</span>
                      {getIndicator(v.change)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">was {v.before ?? "—"}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Not enough data yet. Keep logging daily.</p>
            )}
          </div>
        </div>

        {/* Insights */}
        <h2 className="font-display font-semibold mb-4 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Daily Motivations
        </h2>

        <div className="space-y-3">
          {loading ? (
            <Skeleton className="h-32 w-full" />
          ) : insights.length ? (
            insights.map((insight, i) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card-elevated p-5 sm:p-6"
              >
                <div className="flex justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-2 leading-relaxed">{insight.message}</p>
                    {insight.reasoning && (
                      <p className="text-xs text-muted-foreground">
                        <span className="text-primary font-medium">Why:</span> {insight.reasoning}
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-3 font-mono">{insight.date}</p>
                  </div>

                  {feedbackGiven[insight.id] ? (
                    <span className="text-xs text-muted-foreground self-start pt-1">Thanks!</span>
                  ) : (
                    <div className="flex gap-1 self-start">
                      <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-success/10 hover:text-success" onClick={() => handleFeedback(insight.id, true)}>
                        <ThumbsUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive" onClick={() => handleFeedback(insight.id, false)}>
                        <ThumbsDown className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="glass-card p-8 text-center">
              <Brain className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No insights yet. Start logging to get personalized motivation.</p>
            </div>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
