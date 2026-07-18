"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_TABS = ["All", "Active", "Critical", "Admitted", "Discharged"];

export function PatientsToolbar({
  search,
  status,
}: {
  search: string;
  status: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(search);

  function apply(next: { search?: string; status?: string }): void {
    const params = new URLSearchParams(searchParams.toString());

    if (next.search !== undefined) {
      if (next.search) params.set("search", next.search);
      else params.delete("search");
    }
    if (next.status !== undefined) {
      if (next.status && next.status !== "All") params.set("status", next.status);
      else params.delete("status");
    }
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  }

  const activeStatus = status || "All";

  return (
    <div className="flex items-center gap-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          apply({ search: query.trim() });
        }}
        className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-sm"
      >
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search patients by name, ID, or condition..."
          className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
        />
      </form>
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
    </div>
  );
}
