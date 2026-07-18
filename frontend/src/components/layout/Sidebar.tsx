"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BrainCircuit,
  CalendarDays,
  Stethoscope,
  CreditCard,
  FileText,
  Package,
  BarChart3,
  MessageSquare,
  Settings,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { canAccessRoute } from "@/lib/auth/rbac";
import { useSession } from "@/components/providers/SessionProvider";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Patients", href: "/patients", icon: Users },
  { label: "AI CDS", href: "/ai-cds", icon: BrainCircuit },
  { label: "Appointments", href: "/appointments", icon: CalendarDays },
  { label: "Clinical Operations", href: "/clinical-operations", icon: Stethoscope },
  { label: "Billing & Revenue", href: "/billing", icon: CreditCard },
  { label: "MR & Docs", href: "/medical-records", icon: FileText },
  { label: "Inventory & Supplies", href: "/inventory", icon: Package },
  { label: "Reports & Analytics", href: "/reports", icon: BarChart3 },
  { label: "Communications", href: "/communications", icon: MessageSquare },
];

const bottomItems = [
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Support", href: "/support", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useSession();

  const visibleNavItems = navItems.filter((item) =>
    canAccessRoute(role, item.href)
  );
  const visibleBottomItems = bottomItems.filter((item) =>
    canAccessRoute(role, item.href)
  );

  return (
    <aside
      className="fixed left-0 top-0 z-40 h-screen w-[240px] border-r border-sidebar-border bg-sidebar flex flex-col justify-between py-6 shadow-sm"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex flex-col gap-8">
        <div className="px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white text-sm font-bold font-mono">P</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-sidebar-primary font-mono tracking-tight">
                Panacea
              </h1>
              <p className="text-[10px] text-sidebar-foreground">Clinical Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 px-3" aria-label="Primary navigation">
          {visibleNavItems.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon className="w-[18px] h-[18px]" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom items */}
      <div className="flex flex-col gap-1 px-3">
        {visibleBottomItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="w-[18px] h-[18px]" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
