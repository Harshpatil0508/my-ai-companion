import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Activity, LayoutDashboard, PenSquare, Brain, BarChart3, LogOut, Settings, Menu, X, Sun, Moon, Monitor } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/log", icon: PenSquare, label: "Daily Log" },
  { to: "/insights", icon: Brain, label: "AI Insights" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const themeOptions = [
    { value: "light" as const, icon: Sun },
    { value: "dark" as const, icon: Moon },
    { value: "system" as const, icon: Monitor },
  ];

  const sidebar = (
    <>
      <Link to="/dashboard" className="flex items-center gap-2.5 px-3 py-2 mb-8" onClick={() => setSidebarOpen(false)}>
        <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
          <Activity className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-display font-bold tracking-tight">Reflecta</span>
      </Link>

      <nav className="space-y-0.5 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
              pathname === item.to
                ? "bg-primary/10 text-primary font-medium shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.15)]"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Theme toggle */}
      <div className="pt-4 border-t border-border/30 mb-2">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-3 mb-2">Theme</p>
        <div className="flex items-center gap-1 px-2">
          {themeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTheme(opt.value)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all duration-200",
                theme === opt.value
                  ? "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.2)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <opt.icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-border/30">
        <button
          onClick={() => { logout(); setSidebarOpen(false); }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-all duration-200 w-full"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen w-full bg-background flex">
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30 flex items-center justify-between px-4 py-3">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg gradient-primary flex items-center justify-center">
              <Activity className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">Reflecta</span>
          </Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-foreground p-1.5 rounded-lg hover:bg-secondary/50 transition-colors">
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>
      )}

      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={cn(
          "flex flex-col",
          isMobile
            ? "fixed top-0 left-0 z-50 h-full w-64 p-4 pt-16 transition-transform duration-300 glass border-r border-border/30"
            : "w-60 border-r border-border/30 p-4 sticky top-0 h-screen bg-card/50",
          isMobile && !sidebarOpen && "-translate-x-full"
        )}
      >
        {sidebar}
      </aside>

      <main className={cn("flex-1 p-4 md:p-8 overflow-y-auto w-full", isMobile && "pt-16")}>
        <div className="max-w-5xl mx-auto w-full">{children}</div>
      </main>
    </div>
  );
};