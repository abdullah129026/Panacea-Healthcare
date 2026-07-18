"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_TABS = ["All", "Confirmed", "Pending", "Completed", "Cancelled"];
const MODE_TABS = ["All", "In-Person", "Virtual"];

export function AppointmentsToolbar({
  search,
  status,
  mode,
}: {
  search: string;
  status: string;
  mode: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(search);

  function apply(next: {
    search?: string;
    status?: string;
    mode?: string;
  }): void {
    const params = new URLSearchParams(searchParams.toString());

    if (next.search !== undefined) {
      if (next.search) params.set("search", next.search);
      else params.delete("search");
    }
    if (next.status !== undefined) {
      if (next.status && next.status !== "All") params.set("status", next.status);
      else params.delete("status");
    }
    if (next.mode !== undefined) {
      if (next.mode && next.mode !== "All") params.set("mode", next.mode);
      else params.delete("mode");
    }
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  }

  const activeStatus = status || "All";
  const activeMode = mode || "All";

  return (
    <div className="flex flex-col gap-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          apply({ search: query.trim() });
        }}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-sm"
      >
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search appointments by patient name or doctor..."
          className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
        />
      </form>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => apply({ status: tab })}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                tab === activeStatus
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-accent"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          {MODE_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => apply({ mode: tab })}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                tab === activeMode
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-accent"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
