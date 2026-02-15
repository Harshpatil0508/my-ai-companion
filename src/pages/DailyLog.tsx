import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { DashboardLayout } from "@/components/DashboardLayout";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const DailyLog = () => {
  const [workHours, setWorkHours] = useState(0);
  const [studyHours, setStudyHours] = useState(0);
  const [sleepHours, setSleepHours] = useState(7);
  const [mood, setMood] = useState(5);
  const [goalCompletion, setGoalCompletion] = useState(50);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      work_hours: workHours,
      study_hours: studyHours,
      sleep_hours: sleepHours,
      mood_score: mood,
      goal_completed_percentage: goalCompletion,
      notes: notes || undefined,
    };

    try {
      await api.createLog(payload);

      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err: any) {
      //  If log already exists
      if (err.message?.includes("already exists")) {
        const confirmUpdate = window.confirm(
          "Log for today already exists. Do you want to update it?",
        );

        if (confirmUpdate) {
          try {
            await api.updateTodayLog(payload);

            toast({
              title: "Updated",
              description: "Today's log has been updated.",
            });

            setSuccess(true);
            setTimeout(() => navigate("/dashboard"), 1500);
          } catch (updateErr: any) {
            toast({
              title: "Update Failed",
              description: updateErr.message,
              variant: "destructive",
            });
          }
        }
      } else {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <DashboardLayout>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center min-h-[60vh]"
        >
          <CheckCircle2 className="h-16 w-16 text-primary mb-4" />
          <h2 className="text-2xl font-display font-bold mb-2">Logged!</h2>
          <p className="text-muted-foreground">Redirecting to dashboard...</p>
        </motion.div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-display font-bold">Daily Log</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass-card p-8 max-w-2xl space-y-6"
        >
          {/* Number inputs */}
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: "Work Hours",
                value: workHours,
                set: setWorkHours,
                max: 24,
              },
              {
                label: "Study Hours",
                value: studyHours,
                set: setStudyHours,
                max: 24,
              },
              {
                label: "Sleep Hours",
                value: sleepHours,
                set: setSleepHours,
                max: 24,
              },
            ].map((f) => (
              <div key={f.label} className="space-y-2">
                <Label>{f.label}</Label>
                <Input
                  type="number"
                  min={0}
                  max={f.max}
                  step={0.5}
                  value={f.value}
                  onChange={(e) => f.set(Number(e.target.value))}
                  className="bg-secondary/50 border-border/50"
                />
              </div>
            ))}
          </div>

          {/* Mood slider */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Mood</Label>
              <span className="text-sm font-medium text-primary">
                {mood}/10
              </span>
            </div>
            <Slider
              min={1}
              max={10}
              step={1}
              value={[mood]}
              onValueChange={([v]) => setMood(v)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>😔</span>
              <span>😊</span>
              <span>🤩</span>
            </div>
          </div>

          {/* Goal slider */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Goal Completion</Label>
              <span className="text-sm font-medium text-accent">
                {goalCompletion}%
              </span>
            </div>
            <Slider
              min={0}
              max={100}
              step={5}
              value={[goalCompletion]}
              onValueChange={([v]) => setGoalCompletion(v)}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes (optional)</Label>
            <Textarea
              placeholder="How was your day?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-secondary/50 border-border/50 min-h-[100px]"
            />
          </div>

          <Button
            type="submit"
            className="w-full gradient-primary glow h-11"
            disabled={loading}
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : (
              "Save Today's Log"
            )}
          </Button>
        </form>
      </motion.div>
    </DashboardLayout>
  );
};

export default DailyLog;
