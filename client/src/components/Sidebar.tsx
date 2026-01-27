import { cn } from "@/lib/utils";
import { Briefcase, LayoutDashboard, MessageSquare, Settings, Users } from "lucide-react";
import { Link, useLocation } from "wouter";

const menuItems = [
  { icon: LayoutDashboard, label: "仪表盘", href: "/" },
  { icon: Users, label: "候选人", href: "/candidates" },
  { icon: Briefcase, label: "职位管理", href: "/jobs" },
  { icon: MessageSquare, label: "消息", href: "/messages" },
  { icon: Settings, label: "设置", href: "/settings" },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="h-screen w-64 bg-sidebar text-sidebar-foreground flex flex-col fixed left-0 top-0 border-r border-sidebar-border">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <span className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center text-sidebar-primary-foreground">HR</span>
          Recruit
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer group",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/70 group-hover:text-sidebar-accent-foreground")} />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
            <span className="font-bold">HR</span>
          </div>
          <div>
            <p className="text-sm font-medium">招聘经理</p>
            <p className="text-xs text-sidebar-foreground/60">online</p>
          </div>
        </div>
      </div>
    </div>
  );
}
