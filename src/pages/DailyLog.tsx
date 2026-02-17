import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, Moon, Briefcase, GraduationCap } from "lucide-react";
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
      if (err.message?.includes("already exists")) {
        const confirmUpdate = window.confirm("Log for today already exists. Do you want to update it?");
        if (confirmUpdate) {
          try {
            await api.updateTodayLog(payload);
            toast({ title: "Updated", description: "Today's log has been updated." });
            setSuccess(true);
            setTimeout(() => navigate("/dashboard"), 1500);
          } catch (updateErr: any) {
            toast({ title: "Update Failed", description: updateErr.message, variant: "destructive" });
          }
        }
      } else {
        toast({ title: "Error", description: err.message, variant: "destructive" });
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
          <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mb-4 glow">
            <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-display font-bold mb-2">Logged!</h2>
          <p className="text-muted-foreground text-sm">Redirecting to dashboard...</p>
        </motion.div>
      </DashboardLayout>
    );
  }

  const numberFields = [
    { label: "Work Hours", value: workHours, set: setWorkHours, max: 24, icon: Briefcase, color: "text-primary" },
    { label: "Study Hours", value: studyHours, set: setStudyHours, max: 24, icon: GraduationCap, color: "text-accent" },
    { label: "Sleep Hours", value: sleepHours, set: setSleepHours, max: 24, icon: Moon, color: "text-primary" },
  ];

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">Daily Log</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass-card-elevated p-6 sm:p-8 max-w-2xl space-y-6">
          {/* Number inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {numberFields.map((f) => (
              <div key={f.label} className="space-y-2">
                <Label className="text-xs font-medium flex items-center gap-1.5">
                  <f.icon className={`h-3.5 w-3.5 ${f.color}`} />
                  {f.label}
                </Label>
                <Input
                  type="number"
                  min={0}
                  max={f.max}
                  step={0.5}
                  value={f.value}
                  onChange={(e) => f.set(Number(e.target.value))}
                  className="bg-secondary/40 border-border/40 h-11"
                />
              </div>
            ))}
          </div>

          {/* Mood slider */}
          <div className="glass-card p-5 space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Mood Score</Label>
              <span className="text-sm font-display font-bold text-primary">{mood}/10</span>
            </div>
            <Slider min={1} max={10} step={1} value={[mood]} onValueChange={([v]) => setMood(v)} />
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>😔 Low</span>
              <span>😊 Good</span>
              <span>🤩 Great</span>
            </div>
          </div>

          {/* Goal slider */}
          <div className="glass-card p-5 space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-medium">Goal Completion</Label>
              <span className="text-sm font-display font-bold text-accent">{goalCompletion}%</span>
            </div>
            <Slider min={0} max={100} step={5} value={[goalCompletion]} onValueChange={([v]) => setGoalCompletion(v)} />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">Notes (optional)</Label>
            <Textarea
              placeholder="How was your day? Any highlights or challenges?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-secondary/40 border-border/40 min-h-[100px] resize-none"
            />
          </div>

          <Button type="submit" className="w-full gradient-primary glow h-11 font-medium" disabled={loading}>
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
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
