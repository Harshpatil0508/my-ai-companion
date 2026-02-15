import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Shield, BarChart3, Sparkles, ArrowRight, Activity, Target, MessageSquareHeart, CalendarCheck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Brain,
    title: "Behavior Detection",
    desc: "AI detects patterns in your habits and flags meaningful shifts before you notice them.",
  },
  {
    icon: Shield,
    title: "Explainable AI",
    desc: "Every recommendation comes with clear reasoning — no black-box decisions.",
  },
  {
    icon: Target,
    title: "Validation Loop",
    desc: "AI tracks whether its own advice actually improved your metrics. Accountability built in.",
  },
  {
    icon: BarChart3,
    title: "Deep Analytics",
    desc: "Visualize trends across sleep, mood, productivity, and goals over weeks and months.",
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
    desc: "AI analyzes your patterns and delivers a personalized motivation message every day — with clear reasoning.",
  },
  {
    step: "03",
    icon: BarChart3,
    title: "Monthly Deep Review",
    desc: "At month's end, receive a comprehensive AI review of your progress, trends, and actionable next steps.",
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
    quote: "Reflecta helped me spot a burnout pattern weeks before I felt it. The AI told me exactly why it flagged it — no guesswork.",
    avatar: "AM",
    metric: "+32% productivity",
  },
  {
    name: "Sarah Chen",
    role: "Graduate Student",
    quote: "I love that it validates its own suggestions. Last month it told me to sleep earlier — then showed me proof it actually improved my focus.",
    avatar: "SC",
    metric: "7.8→8.5 mood avg",
  },
  {
    name: "David Okafor",
    role: "Product Designer",
    quote: "The monthly reviews are game-changing. It's like having a personal coach who actually remembers everything you told them.",
    avatar: "DO",
    metric: "45-day streak",
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      {/* Gradient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px] animate-pulse-glow" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Activity className="h-7 w-7 text-primary" />
          <span className="text-xl font-display font-bold tracking-tight">Reflecta</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link to="/auth">Log In</Link>
          </Button>
          <Button className="gradient-primary glow" asChild>
            <Link to="/auth?mode=register">Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-7xl mx-auto px-6">
        <section className="pt-20 pb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              AI-Powered Personal Tracking
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6 max-w-4xl mx-auto">
              AI that's{" "}
              <span className="gradient-text">accountable</span>
              , not just intelligent
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Track your daily habits, get AI-driven insights with full transparency,
              and watch as the system validates its own advice against your real results.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Button size="lg" className="gradient-primary glow text-base px-8 h-12" asChild>
                <Link to="/auth?mode=register">
                  Start Tracking <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 h-12 border-border/50" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            </div>
          </motion.div>

          {/* Dashboard preview mockup */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 max-w-4xl mx-auto"
          >
            <div className="glass-card p-1 glow">
              <div className="rounded-lg bg-card p-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-3 w-3 rounded-full bg-destructive/70" />
                  <div className="h-3 w-3 rounded-full bg-accent/70" />
                  <div className="h-3 w-3 rounded-full bg-primary/70" />
                  <span className="ml-2 text-xs text-muted-foreground">reflecta — dashboard</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {["Mood: 8/10", "Sleep: 7.5h", "Work: 6h", "Goals: 85%"].map((stat) => (
                    <div key={stat} className="glass-card p-4 text-center">
                      <p className="text-sm text-muted-foreground">{stat.split(":")[0]}</p>
                      <p className="text-lg font-bold text-primary mt-1">{stat.split(": ")[1]}</p>
                    </div>
                  ))}
                </div>
                <div className="glass-card p-4">
                  <p className="text-sm text-muted-foreground mb-1">AI Insight</p>
                  <p className="text-sm text-foreground">
                    "Your mood improves 23% on days you sleep 7+ hours. Prioritize sleep tonight."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Stats Counter */}
        <section className="pb-32">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { value: "10K+", label: "Active Users" },
              { value: "1M+", label: "Logs Tracked" },
              { value: "95%", label: "AI Accuracy" },
              { value: "4.9★", label: "User Rating" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="text-center p-6"
              >
                <p className="text-3xl md:text-4xl font-display font-bold gradient-text mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="pb-32">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              What makes Reflecta <span className="gradient-text">different</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Most trackers just collect data. Reflecta's AI learns, explains, and proves its value.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 hover:glow transition-shadow duration-300"
              >
                <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-display font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works — Workflow */}
        <section className="pb-32">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              How <span className="gradient-text">Reflecta</span> works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Four simple steps to a smarter, more accountable you.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto relative">
            {/* Connecting line */}
            <div className="absolute left-8 md:left-10 top-0 bottom-0 w-px bg-gradient-to-b from-primary/60 via-accent/40 to-transparent hidden md:block" />

            {workflow.map((w, i) => (
              <motion.div
                key={w.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="flex gap-5 md:gap-8 mb-10 last:mb-0 group"
              >
                <div className="relative z-10 flex-shrink-0">
                  <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl gradient-primary flex items-center justify-center glow group-hover:scale-110 transition-transform duration-300">
                    <w.icon className="h-7 w-7 md:h-8 md:w-8 text-primary-foreground" />
                  </div>
                </div>
                <div className="pt-2">
                  <span className="text-xs font-mono text-primary/70 tracking-widest">STEP {w.step}</span>
                  <h3 className="text-xl font-display font-semibold mt-1 mb-2">{w.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-md">{w.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Daily Motivation & Monthly Review highlight */}
        <section className="pb-32">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 relative overflow-hidden group hover:glow transition-shadow duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] group-hover:bg-primary/10 transition-colors" />
              <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mb-5">
                <MessageSquareHeart className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Daily AI Motivation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Wake up to a personalized insight based on your recent data. Not generic quotes — real, data-driven advice tailored to your patterns.
              </p>
              <div className="glass-card p-4 text-sm italic text-foreground/80">
                <Sparkles className="h-4 w-4 text-primary inline mr-2" />
                "You slept 1.5h more last night and your mood jumped 30%. Keep this bedtime — it's working."
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-card p-8 relative overflow-hidden group hover:glow-accent transition-shadow duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-[60px] group-hover:bg-accent/10 transition-colors" />
              <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center mb-5">
                <CalendarCheck className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3">Monthly Deep Review</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Every month, get a comprehensive AI-generated report analyzing your trends, breakthroughs, and areas that need attention.
              </p>
              <div className="flex items-center gap-3 text-sm">
                {["Mood Trends", "Sleep Analysis", "Goal Progress"].map((tag) => (
                  <span key={tag} className="glass-card px-3 py-1 text-xs text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Social Proof / Testimonials */}
        <section className="pb-32">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Trusted by people who <span className="gradient-text">take action</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Real users, real results — powered by AI that proves its own value.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="glass-card p-6 flex flex-col justify-between hover:glow transition-shadow duration-300"
              >
                <p className="text-sm text-foreground/80 leading-relaxed mb-5 italic">
                  "{t.quote}"
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-primary">{t.metric}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="pb-32 text-center">
          <div className="glass-card p-12 max-w-3xl mx-auto glow-accent">
            <h2 className="text-3xl font-display font-bold mb-4">
              Ready to track smarter?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Join Reflecta and start building a data-driven understanding of your daily life — powered by AI that explains itself.
            </p>
            <Button size="lg" className="gradient-primary glow text-base px-10 h-12" asChild>
              <Link to="/auth?mode=register">
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 Reflecta. AI-powered personal accountability.</p>
      </footer>
    </div>
  );
};

export default Landing;
