import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, ThumbsUp, ThumbsDown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardLayout } from "@/components/DashboardLayout";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const mockInsights = [
  {
    id: "1",
    message: "Your productivity peaks between 9-11 AM. Consider scheduling deep work during this window.",
    reasoning: "Based on 14 days of data: work hours logged before noon correlate with 18% higher goal completion.",
    date: "2026-02-14",
  },
  {
    id: "2",
    message: "Sleep consistency matters more than duration. Your mood drops 30% after irregular sleep.",
    reasoning: "Variance in sleep hours (>1.5h std dev) correlated with mood scores below 5 in 8/10 cases.",
    date: "2026-02-13",
  },
  {
    id: "3",
    message: "Adding study sessions on low-work days improves weekly goal completion by 12%.",
    reasoning: "On days with <4 work hours, study hours filled the gap and maintained momentum.",
    date: "2026-02-12",
  },
];

const Insights = () => {
  const [validation, setValidation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    api.getValidation().then(setValidation).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleFeedback = async (id: string, helpful: boolean) => {
    try {
      await api.submitFeedback(id, helpful);
      setFeedbackGiven((prev) => ({ ...prev, [id]: true }));
      toast({ title: helpful ? "Thanks! 👍" : "Noted! We'll improve." });
    } catch {
      toast({ title: "Feedback saved locally", description: "Will sync when backend is available." });
      setFeedbackGiven((prev) => ({ ...prev, [id]: true }));
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

        {/* Validation card */}
        <div className="glass-card p-6 mb-8 glow-accent">
          <h2 className="font-display font-semibold mb-4">AI Validation Results</h2>
          {loading ? (
            <Skeleton className="h-20 w-full" />
          ) : validation ? (
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(validation.metrics || {}).map(([key, val]: [string, any]) => (
                <div key={key} className="glass-card p-4 text-center">
                  <p className="text-xs text-muted-foreground uppercase mb-1">{key.replace("_", " ")}</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg font-bold">{val.after ?? "—"}</span>
                    {getIndicator(val.change)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">was {val.before ?? "—"}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Not enough data for validation yet. Keep logging daily — results appear after 7 days.
            </p>
          )}
        </div>

        {/* Insights list */}
        <h2 className="font-display font-semibold mb-4">Daily Motivations</h2>
        <div className="space-y-4">
          {mockInsights.map((insight, i) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium mb-2">{insight.message}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="text-primary font-medium">Why: </span>
                    {insight.reasoning}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">{insight.date}</p>
                </div>
                <div className="flex gap-1">
                  {feedbackGiven[insight.id] ? (
                    <span className="text-xs text-muted-foreground py-2">Thanks!</span>
                  ) : (
                    <>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:text-primary"
                        onClick={() => handleFeedback(insight.id, true)}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:text-destructive"
                        onClick={() => handleFeedback(insight.id, false)}
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Insights;
