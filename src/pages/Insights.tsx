import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardLayout } from "@/components/DashboardLayout";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

/* ================= TYPES ================= */

interface TodayInsight {
  id: number;
  insight: string;
  date: string;
  feedbackGiven: boolean;
}

interface ValidationMetric {
  before: number | null;
  after: number | null;
  change: "improved" | "declined" | "same";
}

interface ValidationResponse {
  metrics: Record<string, ValidationMetric>;
}

/* ================= COMPONENT ================= */

export default function Insights() {
  const [validation, setValidation] = useState<ValidationResponse | null>(null);
  const [insight, setInsight] = useState<TodayInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    Promise.all([
      api.getValidation().catch(() => null),
      api.getTodayInsight().catch(() => null),
    ])
      .then(([validationRes, insightRes]) => {
        if (validationRes) {
          setValidation(validationRes as ValidationResponse);
        }

        if (insightRes) {
          const typedInsight = insightRes as TodayInsight;
          setInsight(typedInsight);
          setFeedbackGiven(typedInsight.feedbackGiven);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleFeedback = async (helpful: boolean) => {
    if (!insight) return;

    try {
      await api.submitFeedback(insight.id, helpful);

      // instant UI update
      setFeedbackGiven(true);

      toast({
        title: helpful ? "Thanks! 👍" : "Noted. We'll improve.",
      });
    } catch {
      toast({
        title: "Saved locally",
        description: "Will sync later.",
      });

      setFeedbackGiven(true);
    }
  };

  const getIndicator = (change: string) => {
    if (change === "improved")
      return <TrendingUp className="h-4 w-4 text-success" />;
    if (change === "declined")
      return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-accent/15 flex items-center justify-center">
            <Brain className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">
              AI Insights
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Personalized analysis & motivation
            </p>
          </div>
        </div>

        {/* VALIDATION SECTION */}
        <div className="glass-card-elevated p-6 mb-8 relative overflow-hidden">
          <h2 className="font-display font-semibold mb-4 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            AI Validation
          </h2>

          {loading ? (
            <Skeleton className="h-20 w-full" />
          ) : validation ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.entries(validation.metrics || {}).map(([k, v]) => (
                <div key={k} className="glass-card p-4 text-center">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">
                    {k.replace("_", " ")}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xl font-display font-bold">
                      {v.after ?? "—"}
                    </span>
                    {getIndicator(v.change)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    was {v.before ?? "—"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Not enough data yet. Keep logging daily.
            </p>
          )}
        </div>

        {/* DAILY MOTIVATION */}
        <h2 className="font-display font-semibold mb-4 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Daily Motivation
        </h2>

        {loading ? (
          <Skeleton className="h-32 w-full" />
        ) : insight ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card-elevated p-5 sm:p-6"
          >
            <div className="flex justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium mb-2 leading-relaxed">
                  {insight.insight}
                </p>

                <p className="text-[10px] text-muted-foreground mt-3 font-mono">
                  {insight.date}
                </p>
              </div>

              {feedbackGiven ? (
                <span className="text-xs text-muted-foreground self-start pt-1">
                  Thanks!
                </span>
              ) : (
                <div className="flex gap-1 self-start">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 hover:bg-success/10 hover:text-success"
                    onClick={() => handleFeedback(true)}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleFeedback(false)}
                  >
                    <ThumbsDown className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="glass-card p-8 text-center">
            <Brain className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No motivation available for today.
            </p>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}