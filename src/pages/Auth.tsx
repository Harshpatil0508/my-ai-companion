import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Mail, Lock, User, ArrowRight } from "lucide-react";
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
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-[-30%] right-[-20%] w-[600px] h-[600px] rounded-full bg-primary/8 blur-[120px]" />
      <div className="absolute bottom-[-30%] left-[-20%] w-[500px] h-[500px] rounded-full bg-accent/8 blur-[120px]" />

      <div className="relative z-10 flex flex-1 items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-10 justify-center">
            <Activity className="h-7 w-7 text-primary" />
            <span className="text-xl font-display font-bold">Reflecta</span>
          </Link>

          <div className="glass-card p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={isRegister ? "register" : "login"}
                initial={{ opacity: 0, x: isRegister ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRegister ? -20 : 20 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="text-2xl font-display font-bold mb-1">
                  {isRegister ? "Create your account" : "Welcome back"}
                </h1>
                <p className="text-sm text-muted-foreground mb-6">
                  {isRegister
                    ? "Start your AI-powered tracking journey"
                    : "Log in to your Reflecta dashboard"}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {isRegister && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          placeholder="Your name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pl-10 bg-secondary/50 border-border/50"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-secondary/50 border-border/50"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 bg-secondary/50 border-border/50"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full gradient-primary glow h-11"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
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
