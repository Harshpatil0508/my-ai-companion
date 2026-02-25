import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  Shield,
  Save,
  Eye,
  EyeOff,
  Upload,
  Sun,
  Moon,
  Monitor,
  Palette,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { api } from "@/lib/api";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const API_BASE = import.meta.env.VITE_API_URL;

export default function Settings() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
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

  // =============================
  // LOAD USER DATA
  // =============================
  useEffect(() => {
    api.getMe().then((u) => {
      setFullName(u.name);
      setEmail(u.email);

      if (u.avatar_url) {
        setAvatar(`${API_BASE}${u.avatar_url}?t=${Date.now()}`);
      }

      setDailyReminder(u.daily_reminder);
      setWeeklyDigest(u.weekly_digest);
      setMonthlyReview(u.monthly_review);
      setAiMotivation(u.ai_motivation);
    });
  }, []);

  // =============================
  // PROFILE UPDATE
  // =============================
  const handleSaveProfile = async () => {
    if (!fullName.trim()) return;
    setSaving(true);
    await api.updateProfile(fullName);
    setSaving(false);
    toast({ title: "Profile updated" });
  };

  // =============================
  // PASSWORD UPDATE
  // =============================
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

  // =============================
  // PREFERENCES UPDATE
  // =============================
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

  // =============================
  // AVATAR UPLOAD (FIXED)
  // =============================
  const uploadAvatar = async (file: File) => {
    const res = await api.uploadAvatar(file);

    const fullUrl = `${API_BASE}${res.avatar_url}`;
    const cacheBusted = `${fullUrl}?t=${Date.now()}`;

    setAvatar(cacheBusted);

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
        <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight mb-8">
          Settings
        </h1>

        <Tabs defaultValue="profile">
          <TabsList className="glass-card mb-6 p-1">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-1" /> Profile
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-1" /> Security
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-1" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="h-4 w-4 mr-1" /> Appearance
            </TabsTrigger>
          </TabsList>

          {/* PROFILE */}
          <TabsContent value="profile">
            <div className="glass-card-elevated p-6 space-y-6 max-w-lg">
              <div className="flex items-center gap-5">
                <Avatar className="h-16 w-16">
                  {avatar && (
                    <AvatarImage src={avatar} key={avatar} />
                  )}
                  <AvatarFallback className="gradient-primary text-primary-foreground font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <label className="cursor-pointer text-sm text-primary flex items-center gap-2 font-medium hover:underline">
                  <Upload className="h-4 w-4" />
                  Change avatar
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files &&
                      uploadAvatar(e.target.files[0])
                    }
                  />
                </label>
              </div>

              <Separator />

              <div>
                <Label>Full Name</Label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input value={email} disabled />
              </div>

              <Button
                onClick={handleSaveProfile}
                disabled={saving}
                className="gradient-primary"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </TabsContent>

          {/* SECURITY */}
          <TabsContent value="security">
            <div className="glass-card-elevated p-6 space-y-4 max-w-lg">
              <Input
                type={showPasswords ? "text" : "password"}
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(e.target.value)
                }
              />
              <Input
                type={showPasswords ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input
                type={showPasswords ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />

              <div className="flex justify-between items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setShowPasswords(!showPasswords)
                  }
                >
                  {showPasswords ? (
                    <EyeOff className="h-4 w-4 mr-1" />
                  ) : (
                    <Eye className="h-4 w-4 mr-1" />
                  )}
                  {showPasswords ? "Hide" : "Show"}
                </Button>

                <Button
                  onClick={handleChangePassword}
                  disabled={saving}
                >
                  Update
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* NOTIFICATIONS */}
          <TabsContent value="notifications">
            <div className="glass-card-elevated p-6 space-y-4 max-w-lg">
              {[
                ["Daily Reminder", dailyReminder, setDailyReminder],
                ["Weekly Digest", weeklyDigest, setWeeklyDigest],
                ["Monthly Review", monthlyReview, setMonthlyReview],
                ["AI Motivation", aiMotivation, setAiMotivation],
              ].map(([label, value, set]: any) => (
                <div
                  key={label}
                  className="flex justify-between items-center"
                >
                  <span>{label}</span>
                  <Switch
                    checked={value}
                    onCheckedChange={set}
                  />
                </div>
              ))}

              <Button
                onClick={handleSavePreferences}
                disabled={saving}
              >
                Save Preferences
              </Button>
            </div>
          </TabsContent>

          {/* APPEARANCE */}
          <TabsContent value="appearance">
            <div className="glass-card-elevated p-6 max-w-lg">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "light", icon: Sun },
                  { value: "dark", icon: Moon },
                  { value: "system", icon: Monitor },
                ].map((opt: any) => (
                  <button
                    key={opt.value}
                    onClick={() => setTheme(opt.value)}
                    className={cn(
                      "p-4 rounded-xl border",
                      theme === opt.value
                        ? "border-primary bg-primary/10"
                        : "border-border"
                    )}
                  >
                    <opt.icon className="h-5 w-5 mx-auto" />
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
}