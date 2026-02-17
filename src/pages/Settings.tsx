import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield, Save, Eye, EyeOff, Upload } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/lib/api";

export default function Settings() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  const [dailyReminder, setDailyReminder] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [monthlyReview, setMonthlyReview] = useState(true);
  const [aiMotivation, setAiMotivation] = useState(true);

  useEffect(() => {
    api.getMe().then((u) => {
      setFullName(u.name);
      setEmail(u.email);
      setAvatar(u.avatar_url);
      setDailyReminder(u.daily_reminder);
      setWeeklyDigest(u.weekly_digest);
      setMonthlyReview(u.monthly_review);
      setAiMotivation(u.ai_motivation);
    });
  }, []);

  const handleSaveProfile = async () => {
    if (!fullName.trim()) return;
    setSaving(true);
    await api.updateProfile(fullName);
    setSaving(false);
    toast({ title: "Profile updated" });
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setSaving(true);
    await api.changePassword(currentPassword, newPassword);
    setSaving(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast({ title: "Password updated" });
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    await api.updatePreferences({
      daily_reminder: dailyReminder,
      weekly_digest: weeklyDigest,
      monthly_review: monthlyReview,
      ai_motivation: aiMotivation,
    });
    setSaving(false);
    toast({ title: "Preferences saved" });
  };

  const uploadAvatar = async (file: File) => {
    const res = await api.uploadAvatar(file);
    setAvatar(res.avatar_url);
    toast({ title: "Avatar updated" });
  };

  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight mb-8">Settings</h1>

        <Tabs defaultValue="profile">
          <TabsList className="glass-card mb-6 p-1">
            <TabsTrigger value="profile" className="gap-1.5 text-xs sm:text-sm">
              <User className="h-3.5 w-3.5" />Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-1.5 text-xs sm:text-sm">
              <Shield className="h-3.5 w-3.5" />Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-1.5 text-xs sm:text-sm">
              <Bell className="h-3.5 w-3.5" />Notifications
            </TabsTrigger>
          </TabsList>

          {/* PROFILE */}
          <TabsContent value="profile">
            <div className="glass-card-elevated p-6 sm:p-8 space-y-6 max-w-lg">
              <div className="flex items-center gap-5">
                <Avatar className="h-16 w-16 ring-2 ring-border/30 ring-offset-2 ring-offset-background">
                  {avatar && <AvatarImage src={avatar} />}
                  <AvatarFallback className="gradient-primary text-primary-foreground font-display font-bold">{initials}</AvatarFallback>
                </Avatar>
                <label className="cursor-pointer text-sm text-primary flex items-center gap-2 font-medium hover:underline">
                  <Upload className="h-4 w-4" />
                  Change avatar
                  <input hidden type="file" accept="image/*" onChange={(e) => e.target.files && uploadAvatar(e.target.files[0])} />
                </label>
              </div>

              <Separator className="bg-border/30" />

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Full Name</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-secondary/40 border-border/40 h-11" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Email</Label>
                <Input value={email} disabled className="bg-secondary/20 border-border/20 h-11 text-muted-foreground" />
              </div>

              <Button onClick={handleSaveProfile} disabled={saving} className="gradient-primary glow font-medium h-10">
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </div>
          </TabsContent>

          {/* SECURITY */}
          <TabsContent value="security">
            <div className="glass-card-elevated p-6 sm:p-8 space-y-5 max-w-lg">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Current Password</Label>
                <Input type={showPasswords ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="bg-secondary/40 border-border/40 h-11" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">New Password</Label>
                <Input type={showPasswords ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="bg-secondary/40 border-border/40 h-11" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Confirm Password</Label>
                <Input type={showPasswords ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-secondary/40 border-border/40 h-11" />
              </div>

              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => setShowPasswords(!showPasswords)} className="text-xs text-muted-foreground gap-1.5">
                  {showPasswords ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  {showPasswords ? "Hide" : "Show"} passwords
                </Button>
                <Button onClick={handleChangePassword} disabled={saving} className="gradient-primary glow font-medium h-10">
                  <Shield className="h-4 w-4 mr-2" /> Update
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* NOTIFICATIONS */}
          <TabsContent value="notifications">
            <div className="glass-card-elevated p-6 sm:p-8 space-y-1 max-w-lg">
              {([
                ["Daily Reminder", "Get reminded to log your day", dailyReminder, setDailyReminder],
                ["Weekly Digest", "Weekly summary of your progress", weeklyDigest, setWeeklyDigest],
                ["Monthly Review", "In-depth monthly AI analysis", monthlyReview, setMonthlyReview],
                ["AI Motivation", "Daily motivational messages", aiMotivation, setAiMotivation],
              ] as const).map(([label, desc, value, set]: any) => (
                <div key={label} className="flex items-center justify-between py-4 border-b border-border/20 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                  <Switch checked={value} onCheckedChange={set} />
                </div>
              ))}

              <div className="pt-4">
                <Button onClick={handleSavePreferences} disabled={saving} className="gradient-primary glow font-medium h-10">
                  <Save className="h-4 w-4 mr-2" /> Save Preferences
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
}
