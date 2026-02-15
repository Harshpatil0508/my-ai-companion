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

  // User
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  // Preferences
  const [dailyReminder, setDailyReminder] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [monthlyReview, setMonthlyReview] = useState(true);
  const [aiMotivation, setAiMotivation] = useState(true);

  // Load user on mount
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

  // Profile
  const handleSaveProfile = async () => {
    if (!fullName.trim()) return;

    setSaving(true);
    await api.updateProfile(fullName);
    setSaving(false);

    toast({ title: "Profile updated" });
  };

  // Password
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

  // Preferences
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

  // Avatar
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
        <h1 className="text-3xl font-display font-bold mb-8">Settings</h1>

        <Tabs defaultValue="profile">
          <TabsList className="glass-card mb-6">
            <TabsTrigger value="profile"><User className="h-4 w-4 mr-1" />Profile</TabsTrigger>
            <TabsTrigger value="security"><Shield className="h-4 w-4 mr-1" />Security</TabsTrigger>
            <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-1" />Notifications</TabsTrigger>
          </TabsList>

          {/* PROFILE */}
          <TabsContent value="profile">
            <div className="glass-card p-6 space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  {avatar && <AvatarImage src={avatar} />}
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>

                <label className="cursor-pointer text-sm text-primary flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Change avatar
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && uploadAvatar(e.target.files[0])}
                  />
                </label>
              </div>

              <Separator />

              <Label>Full Name</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />

              <Label>Email</Label>
              <Input value={email} disabled />

              <Button onClick={handleSaveProfile} disabled={saving}>
                <Save className="h-4 w-4 mr-2" /> Save
              </Button>
            </div>
          </TabsContent>

          {/* SECURITY */}
          <TabsContent value="security">
            <div className="glass-card p-6 space-y-4 max-w-md">
              <Label>Current Password</Label>
              <Input type={showPasswords ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />

              <Label>New Password</Label>
              <Input type={showPasswords ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

              <Label>Confirm Password</Label>
              <Input type={showPasswords ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

              <Button variant="ghost" onClick={() => setShowPasswords(!showPasswords)}>
                {showPasswords ? <EyeOff /> : <Eye />}
              </Button>

              <Button onClick={handleChangePassword} disabled={saving}>
                <Shield className="h-4 w-4 mr-2" /> Update Password
              </Button>
            </div>
          </TabsContent>

          {/* NOTIFICATIONS */}
          <TabsContent value="notifications">
            <div className="glass-card p-6 space-y-4 max-w-md">
              {[
                ["Daily Reminder", dailyReminder, setDailyReminder],
                ["Weekly Digest", weeklyDigest, setWeeklyDigest],
                ["Monthly Review", monthlyReview, setMonthlyReview],
                ["AI Motivation", aiMotivation, setAiMotivation],
              ].map(([label, value, set]: any) => (
                <div key={label} className="flex justify-between">
                  <span>{label}</span>
                  <Switch checked={value} onCheckedChange={set} />
                </div>
              ))}

              <Button onClick={handleSavePreferences} disabled={saving}>
                <Save className="h-4 w-4 mr-2" /> Save Preferences
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
}
