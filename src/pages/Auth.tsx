import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isRegister, setIsRegister] = useState(searchParams.get("mode") === "register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await register(email, password, fullName);
        toast({ title: "Account created!", description: "Please log in." });
        setIsRegister(false);
      } else {
        await login(email, password);
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-15" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-primary/6 blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-accent/4 blur-[150px]" />

      {/* Left branding panel — hidden on mobile */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 relative">
        <div className="max-w-md">
          <Link to="/" className="flex items-center gap-2.5 mb-10">
            <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-display font-bold tracking-tight">Reflecta</span>
          </Link>
          <h2 className="text-3xl font-display font-bold mb-4 leading-tight">
            AI that's <span className="gradient-text">accountable</span>,
            <br />not just intelligent
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Track your daily habits, get AI-driven insights with full transparency,
            and watch as the system validates its own advice.
          </p>
          <div className="space-y-3">
            {["Explainable AI recommendations", "Self-validating predictions", "Deep monthly analytics"].map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="relative z-10 flex flex-1 items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 justify-center lg:hidden">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <Activity className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold">Reflecta</span>
          </Link>

          <div className="glass-card-elevated p-7 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={isRegister ? "register" : "login"}
                initial={{ opacity: 0, x: isRegister ? 15 : -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRegister ? -15 : 15 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="text-xl font-display font-bold mb-1">
                  {isRegister ? "Create your account" : "Welcome back"}
                </h1>
                <p className="text-sm text-muted-foreground mb-6">
                  {isRegister
                    ? "Start your AI-powered tracking journey"
                    : "Log in to your Reflecta dashboard"}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {isRegister && (
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-xs font-medium">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          placeholder="Your name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pl-10 bg-secondary/40 border-border/40 h-11"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-medium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-secondary/40 border-border/40 h-11"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 bg-secondary/40 border-border/40 h-11"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full gradient-primary glow h-11 font-medium"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    ) : (
                      <>
                        {isRegister ? "Create Account" : "Sign In"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-primary hover:underline font-medium"
              >
                {isRegister ? "Sign in" : "Sign up"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
