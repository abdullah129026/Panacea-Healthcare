"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Profile", href: "/settings" },
  { label: "Security", href: "/settings/security" },
  { label: "Notifications", href: "/settings/notifications" },
  { label: "Clinic Info", href: "/settings/clinic" },
  { label: "Billing Preferences", href: "/settings/billing" },
];

export function SettingsTabs() {
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-1 border-b border-border overflow-x-auto">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors",
              active
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
