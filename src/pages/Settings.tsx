import { useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield, Save, Eye, EyeOff } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Settings = () => {
  const { toast } = useToast();

  // Profile state
  const [fullName, setFullName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [saving, setSaving] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  // Preferences state
  const [dailyReminder, setDailyReminder] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [monthlyReview, setMonthlyReview] = useState(true);
  const [aiMotivation, setAiMotivation] = useState(true);

  const handleSaveProfile = async () => {
    if (!fullName.trim() || fullName.length > 100) {
      toast({ title: "Invalid name", description: "Name must be 1–100 characters.", variant: "destructive" });
      return;
    }
    setSaving(true);
    // Simulated API call — replace with api.updateProfile() when backend is ready
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast({ title: "Profile updated", description: "Your changes have been saved." });
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({ title: "Missing fields", description: "Please fill all password fields.", variant: "destructive" });
      return;
    }
    if (newPassword.length < 8) {
      toast({ title: "Weak password", description: "New password must be at least 8 characters.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Mismatch", description: "New passwords don't match.", variant: "destructive" });
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast({ title: "Password changed", description: "Your password has been updated." });
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast({ title: "Preferences saved", description: "Your notification preferences have been updated." });
  };

  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold mb-1">Settings</h1>
        <p className="text-muted-foreground text-sm mb-8">Manage your account and preferences</p>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="glass-card">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" /> Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" /> Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" /> Notifications
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="glass-card p-6 space-y-6">
              <div className="flex items-center gap-5">
                <Avatar className="h-16 w-16 text-lg">
                  <AvatarFallback className="gradient-primary text-primary-foreground font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-display font-semibold text-lg">{fullName}</p>
                  <p className="text-sm text-muted-foreground">{email}</p>
                </div>
              </div>

              <Separator className="bg-border/50" />

              <div className="grid gap-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    maxLength={100}
                    className="bg-secondary/30 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={email}
                    disabled
                    className="bg-secondary/30 border-border/50 opacity-60 cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">Contact support to change your email.</p>
                </div>
              </div>

              <Button onClick={handleSaveProfile} disabled={saving} className="gradient-primary glow">
                <Save className="mr-2 h-4 w-4" /> {saving ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="glass-card p-6 space-y-6">
              <div>
                <h3 className="font-display font-semibold text-lg mb-1">Change Password</h3>
                <p className="text-sm text-muted-foreground">Update your password to keep your account secure.</p>
              </div>

              <div className="grid gap-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="currentPw">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPw"
                      type={showPasswords ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="bg-secondary/30 border-border/50 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPw">New Password</Label>
                  <Input
                    id="newPw"
                    type={showPasswords ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-secondary/30 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPw">Confirm New Password</Label>
                  <Input
                    id="confirmPw"
                    type={showPasswords ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-secondary/30 border-border/50"
                  />
                </div>
              </div>

              <Button onClick={handleChangePassword} disabled={saving} className="gradient-primary glow">
                <Shield className="mr-2 h-4 w-4" /> {saving ? "Updating…" : "Update Password"}
              </Button>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <div className="glass-card p-6 space-y-6">
              <div>
                <h3 className="font-display font-semibold text-lg mb-1">Notification Preferences</h3>
                <p className="text-sm text-muted-foreground">Choose what updates you'd like to receive.</p>
              </div>

              <div className="space-y-5 max-w-md">
                {[
                  { id: "dailyReminder", label: "Daily Log Reminder", desc: "Get reminded to log your day every evening", value: dailyReminder, set: setDailyReminder },
                  { id: "aiMotivation", label: "AI Daily Motivation", desc: "Receive your personalized AI insight each morning", value: aiMotivation, set: setAiMotivation },
                  { id: "weeklyDigest", label: "Weekly Digest", desc: "Summary of your weekly progress every Sunday", value: weeklyDigest, set: setWeeklyDigest },
                  { id: "monthlyReview", label: "Monthly Review Alert", desc: "Get notified when your monthly AI review is ready", value: monthlyReview, set: setMonthlyReview },
                ].map((pref) => (
                  <div key={pref.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{pref.label}</p>
                      <p className="text-xs text-muted-foreground">{pref.desc}</p>
                    </div>
                    <Switch checked={pref.value} onCheckedChange={pref.set} />
                  </div>
                ))}
              </div>

              <Button onClick={handleSavePreferences} disabled={saving} className="gradient-primary glow">
                <Save className="mr-2 h-4 w-4" /> {saving ? "Saving…" : "Save Preferences"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
};

export default Settings;
