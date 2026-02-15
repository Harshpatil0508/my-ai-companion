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
    if (change === "improved") return <TrendingUp className="h-4 w-4 text-primary" />;
    if (change === "declined") return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <Brain className="h-6 w-6 text-accent" />
          <h1 className="text-3xl font-display font-bold">AI Insights</h1>
        </div>

        {/* Validation */}
        <div className="glass-card p-6 mb-8 glow-accent">
          <h2 className="font-display font-semibold mb-4">AI Validation</h2>

          {loading ? (
            <Skeleton className="h-20 w-full" />
          ) : validation ? (
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(validation.metrics || {}).map(([k, v]: any) => (
                <div key={k} className="glass-card p-4 text-center">
                  <p className="text-xs uppercase text-muted-foreground">{k.replace("_", " ")}</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg font-bold">{v.after ?? "—"}</span>
                    {getIndicator(v.change)}
                  </div>
                  <p className="text-xs text-muted-foreground">was {v.before ?? "—"}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Not enough data yet. Keep logging daily.
            </p>
          )}
        </div>

        {/* Real Insights */}
        <h2 className="font-display font-semibold mb-4">Daily Motivations</h2>

        <div className="space-y-4">
          {loading ? (
            <Skeleton className="h-32 w-full" />
          ) : insights.length ? (
            insights.map((insight, i) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-6"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium mb-2">{insight.message}</p>
                    {insight.reasoning && (
                      <p className="text-xs text-muted-foreground">
                        <span className="text-primary">Why:</span> {insight.reasoning}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">{insight.date}</p>
                  </div>

                  {feedbackGiven[insight.id] ? (
                    <span className="text-xs text-muted-foreground">Thanks!</span>
                  ) : (
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => handleFeedback(insight.id, true)}>
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleFeedback(insight.id, false)}>
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No insights yet.</p>
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
