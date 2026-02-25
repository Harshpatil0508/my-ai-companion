import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Brain, Shield, BarChart3, Sparkles, ArrowRight, Activity, Target, MessageSquareHeart, CalendarCheck, ChevronRight, Zap, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import BackgroundAnimation from "@/components/BackgroundAnimation";

const features = [
  {
    icon: Brain,
    title: "Behavior Detection",
    desc: "AI detects patterns in your habits and flags meaningful shifts before you notice them.",
    color: "from-primary to-primary/60",
  },
  {
    icon: Shield,
    title: "Explainable AI",
    desc: "Every recommendation comes with clear reasoning — no black-box decisions.",
    color: "from-accent to-accent/60",
  },
  {
    icon: Target,
    title: "Validation Loop",
    desc: "AI tracks whether its own advice actually improved your metrics. Accountability built in.",
    color: "from-success to-success/60",
  },
  {
    icon: BarChart3,
    title: "Deep Analytics",
    desc: "Visualize trends across sleep, mood, productivity, and goals over weeks and months.",
    color: "from-warning to-warning/60",
  },
];

const workflow = [
  {
    step: "01",
    icon: Activity,
    title: "Log Your Day",
    desc: "Spend 2 minutes logging mood, sleep, work hours, and goals. Simple and fast.",
  },
  {
    step: "02",
    icon: Sparkles,
    title: "Get Daily Motivation",
    desc: "AI analyzes your patterns and delivers a personalized motivation message every day.",
  },
  {
    step: "03",
    icon: BarChart3,
    title: "Monthly Deep Review",
    desc: "Receive a comprehensive AI review of your progress, trends, and actionable next steps.",
  },
  {
    step: "04",
    icon: Target,
    title: "AI Validates Itself",
    desc: "Did the advice actually help? Reflecta checks its own predictions against your real data.",
  },
];

const testimonials = [
  {
    name: "Arjun Mehta",
    role: "Startup Founder",
    quote: "Reflecta helped me spot a burnout pattern weeks before I felt it. The AI told me exactly why it flagged it.",
    avatar: "AM",
    metric: "+32% productivity",
  },
  {
    name: "Sarah Chen",
    role: "Graduate Student",
    quote: "I love that it validates its own suggestions. Last month it showed me proof that earlier sleep improved my focus.",
    avatar: "SC",
    metric: "7.8→8.5 mood avg",
  },
  {
    name: "David Okafor",
    role: "Product Designer",
    quote: "The monthly reviews are game-changing. It's like having a personal coach who remembers everything.",
    avatar: "DO",
    metric: "45-day streak",
  },
];

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "1M+", label: "Logs Tracked" },
  { value: "95%", label: "AI Accuracy" },
  { value: "4.9", label: "User Rating", suffix: "★" },
];

const Landing = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background */}
      <BackgroundAnimation />
      <div className="fixed inset-0 grid-pattern opacity-10 pointer-events-none z-[1]" />

      {/* Nav */}
      <nav className="sticky top-0 z-50 glass border-b border-border/30">
        <div className="flex items-center justify-between px-4 sm:px-8 py-3.5 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <Activity className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-display font-bold tracking-tight">Reflecta</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
              <Link to="/auth">Log In</Link>
            </Button>
            <Button size="sm" className="gradient-primary glow font-medium" asChild>
              <Link to="/auth?mode=register">
                Get Started <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10">
        <section ref={heroRef} className="relative">
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-7xl mx-auto px-4 sm:px-8 pt-20 sm:pt-32 pb-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 glass-card px-4 py-1.5 mb-8 text-xs font-medium text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                Now with AI Validation Loop
                <ChevronRight className="h-3 w-3" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.95] mb-6 max-w-5xl mx-auto text-balance"
            >
              AI that's{" "}
              <span className="gradient-text">accountable</span>
              <br className="hidden sm:block" />
              not just intelligent
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
            >
              Track daily habits, get transparent AI insights, and watch the system
              validate its own advice against your real results.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Button size="lg" className="gradient-primary glow text-base px-8 h-12 w-full sm:w-auto font-medium" asChild>
                <Link to="/auth?mode=register">
                  Start Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 h-12 w-full sm:w-auto border-border/40 bg-secondary/30 hover:bg-secondary/50" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
            className="max-w-5xl mx-auto px-4 sm:px-8 pb-32"
          >
            <div className="glass-card-elevated gradient-border p-1 relative">
              <div className="absolute -top-px left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <div className="rounded-[calc(var(--radius)-4px)] bg-card p-4 sm:p-6 space-y-4">
                {/* Window chrome */}
                <div className="flex items-center gap-2 pb-3 border-b border-border/30">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-warning/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-success/60" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="glass-card px-4 py-1 text-[10px] font-mono text-muted-foreground">
                      reflecta.app/dashboard
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {[
                    { label: "Mood", value: "8/10", icon: "✨" },
                    { label: "Sleep", value: "7.5h", icon: "🌙" },
                    { label: "Work", value: "6h", icon: "💼" },
                    { label: "Goals", value: "85%", icon: "🎯" },
                  ].map((stat) => (
                    <div key={stat.label} className="glass-card p-3 text-center group">
                      <p className="text-xs text-muted-foreground mb-1">{stat.icon} {stat.label}</p>
                      <p className="text-lg font-display font-bold text-foreground">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* AI Insight */}
                <div className="glass-card p-4 gradient-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-3.5 w-3.5 text-accent" />
                    <p className="text-xs font-medium text-accent">AI Insight</p>
                  </div>
                  <p className="text-sm text-foreground/80">
                    "Your mood improves 23% on days you sleep 7+ hours. Prioritize sleep tonight."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Stats Counter */}
        <section className="py-16 sm:py-20 border-y border-border/20 bg-secondary/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="text-center"
                >
                  <p className="text-4xl md:text-5xl font-display font-bold gradient-text mb-1">
                    {stat.value}{stat.suffix && <span className="text-warning">{stat.suffix}</span>}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 sm:py-32 max-w-7xl mx-auto px-4 sm:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs font-mono font-medium text-primary uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4 text-balance">
              What makes Reflecta{" "}
              <span className="gradient-text">different</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Most trackers just collect data. Reflecta's AI learns, explains, and proves its value.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 max-w-4xl mx-auto">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="glass-card-elevated p-6 sm:p-7 group"
              >
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-display font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 sm:py-32 border-y border-border/20 bg-secondary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <p className="text-xs font-mono font-medium text-primary uppercase tracking-widest mb-3">How It Works</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
                Four steps to a{" "}
                <span className="gradient-text">smarter you</span>
              </h2>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-6">
              {workflow.map((w, i) => (
                <motion.div
                  key={w.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="glass-card-elevated p-5 sm:p-6 flex gap-5 items-start group"
                >
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <w.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="pt-0.5">
                    <span className="text-[10px] font-mono font-medium text-primary/60 uppercase tracking-[0.2em]">Step {w.step}</span>
                    <h3 className="text-lg font-display font-semibold mt-0.5 mb-1.5">{w.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{w.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Highlight Cards */}
        <section className="py-24 sm:py-32 max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card-elevated p-7 sm:p-8 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/4 rounded-full blur-[80px] group-hover:bg-primary/8 transition-colors duration-500" />
              <div className="h-11 w-11 rounded-xl gradient-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <MessageSquareHeart className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-display font-bold mb-2">Daily AI Motivation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Real, data-driven advice tailored to your patterns — not generic quotes.
              </p>
              <div className="glass-card p-4 text-sm text-foreground/80 italic">
                <Sparkles className="h-3.5 w-3.5 text-primary inline mr-1.5" />
                "You slept 1.5h more last night and your mood jumped 30%. Keep this bedtime."
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-card-elevated p-7 sm:p-8 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-accent/4 rounded-full blur-[80px] group-hover:bg-accent/8 transition-colors duration-500" />
              <div className="h-11 w-11 rounded-xl bg-accent flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <CalendarCheck className="h-5 w-5 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-display font-bold mb-2">Monthly Deep Review</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Comprehensive AI-generated reports analyzing trends, breakthroughs, and attention areas.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Mood Trends", "Sleep Analysis", "Goal Progress"].map((tag) => (
                  <span key={tag} className="glass-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 sm:py-32 border-y border-border/20 bg-secondary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <p className="text-xs font-mono font-medium text-primary uppercase tracking-widest mb-3">Testimonials</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4">
                Trusted by people who{" "}
                <span className="gradient-text">take action</span>
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card-elevated p-6 flex flex-col justify-between"
                >
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-3.5 w-3.5 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed mb-6">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border/20">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                        {t.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-medium text-primary">{t.metric}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 sm:py-32 max-w-7xl mx-auto px-4 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card-elevated p-10 sm:p-16 max-w-3xl mx-auto text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 gradient-primary opacity-[0.03]" />
            <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary/8 rounded-full blur-[100px]" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 glass-card px-3 py-1.5 mb-6 text-xs font-medium text-muted-foreground">
                <Zap className="h-3 w-3 text-warning" />
                Free to get started
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 text-balance">
                Ready to track smarter?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Join Reflecta and build a data-driven understanding of your daily life — powered by transparent AI.
              </p>
              <Button size="lg" className="gradient-primary glow text-base px-10 h-12 font-medium" asChild>
                <Link to="/auth?mode=register">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <div className="flex items-center justify-center gap-4 mt-6 text-xs text-muted-foreground">
                {["No credit card", "2-min setup", "Cancel anytime"].map((t) => (
                  <span key={t} className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-success" /> {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/20 py-8 text-center text-xs text-muted-foreground">
        <p>© 2026 Reflecta. AI-powered personal accountability.</p>
      </footer>
    </div>
  );
};

export default Landing;
