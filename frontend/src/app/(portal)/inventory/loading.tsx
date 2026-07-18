import { Header } from "@/components/layout/Header";
import { Card, Skeleton } from "@/components/ui";
import { Package, AlertTriangle, DollarSign } from "lucide-react";

export default function InventoryLoading() {
  return (
    <div className="flex flex-col">
      <Header breadcrumbs={[{ label: "Inventory Management" }]} />

      <div className="p-6 space-y-6">
        {/* Page Title Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <div className="w-48 h-7 bg-accent rounded-lg mb-2" />
            <div className="w-72 h-4 bg-accent rounded-lg" />
          </div>
          <div className="w-32 h-10 bg-primary/10 rounded-lg" />
        </div>

        {/* Quick Stats Skeletons */}
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-accent" />
              <div className="flex-1">
                <div className="w-12 h-6 bg-accent rounded mb-1" />
                <div className="w-20 h-3 bg-accent rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <Card className="p-0 overflow-hidden">
          <div className="border-b border-border bg-accent/30 p-4 grid grid-cols-8 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-20 h-4 bg-accent rounded" />
            ))}
          </div>

          <div className="divide-y divide-border/50">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="p-4 grid grid-cols-8 gap-4">
                {Array.from({ length: 8 }).map((_, j) => (
                  <div key={j} className="w-full h-4 bg-accent rounded" />
                ))}
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="flex items-center justify-between p-4 border-t border-border">
            <div className="w-40 h-4 bg-accent rounded" />
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-8 h-8 bg-accent rounded" />
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
