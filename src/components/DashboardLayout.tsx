import { Link, useLocation } from "react-router-dom";
import { Activity, LayoutDashboard, PenSquare, Brain, BarChart3, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
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

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/50 p-4 flex flex-col glass sticky top-0 h-screen">
        <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 mb-8">
          <Activity className="h-6 w-6 text-primary" />
          <span className="text-lg font-display font-bold">Reflecta</span>
        </Link>

        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                pathname === item.to
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
};
