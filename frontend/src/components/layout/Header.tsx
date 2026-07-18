"use client";

import { useState } from "react";
import { Bell, Search, LogOut } from "lucide-react";
import { logout } from "@/app/(portal)/actions";
import { useSession } from "@/components/providers/SessionProvider";
import { RealtimeStatusDot } from "@/components/RealtimeStatus";
import { AlertHistoryModal } from "@/components/modals/AlertHistoryModal";
import { useAlerts } from "@/hooks/useAlerts";

interface HeaderProps {
  breadcrumbs?: { label: string; href?: string }[];
}

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const letters = parts.slice(0, 2).map((p) => p[0]);
  return letters.join("").toUpperCase();
}

const roleLabels: Record<string, string> = {
  admin: "Admin",
  clinician: "Clinician",
  support: "Support",
  billing: "Billing",
};

export function Header({ breadcrumbs }: HeaderProps) {
  const user = useSession();
  const initials = user.avatar ?? initialsFrom(user.name);
  const { unreadCount } = useAlerts({ maxAlerts: 50 });
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 backdrop-blur-md bg-[#f8f9ffcc] border-b border-border flex items-center justify-between px-6" role="banner">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm">
        {breadcrumbs?.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-muted-foreground">/</span>}
            {crumb.href ? (
              <a
                href={crumb.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {crumb.label}
              </a>
            ) : (
              <span className="text-foreground font-medium">{crumb.label}</span>
            )}
          </span>
        ))}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border text-sm text-muted-foreground w-[200px]">
          <Search className="w-4 h-4" />
          <span>Search...</span>
        </div>

        {/* Connection Status */}
        <RealtimeStatusDot />

        {/* Alerts History */}
        <button
          onClick={() => setHistoryOpen(true)}
          className="relative p-2 rounded-lg hover:bg-accent transition-colors"
          title="View alert history"
        >
          <Bell className="w-[18px] h-[18px] text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          )}
        </button>
        <AlertHistoryModal open={historyOpen} onOpenChange={setHistoryOpen} />

        {/* User Avatar */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-semibold text-primary">
              {initials}
            </span>
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-medium">{user.name}</p>
            <p className="text-[10px] text-muted-foreground">
              {roleLabels[user.role] ?? user.role}
            </p>
          </div>
        </div>

        {/* Logout */}
        <form action={logout}>
          <button
            type="submit"
            aria-label="Sign out"
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <LogOut className="w-[18px] h-[18px] text-muted-foreground" />
          </button>
        </form>
      </div>
    </header>
  );
}
