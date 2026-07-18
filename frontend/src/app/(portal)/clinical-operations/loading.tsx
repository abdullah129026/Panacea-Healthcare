import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui";

export default function ClinicalOperationsLoading() {
  return (
    <div className="flex flex-col">
      <Header breadcrumbs={[{ label: "Clinical Operations" }]} />

      <div className="p-6 space-y-6">
        {/* Page Title Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <div className="w-48 h-7 bg-accent rounded-lg mb-2" />
            <div className="w-96 h-4 bg-accent rounded-lg" />
          </div>
        </div>

        {/* Stat Cards Skeletons */}
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-accent" />
              <div className="flex-1">
                <div className="w-16 h-6 bg-accent rounded mb-1" />
                <div className="w-24 h-3 bg-accent rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row Skeleton */}
        <div className="grid grid-cols-3 gap-6">
          {/* Bed Occupancy Skeleton */}
          <Card className="col-span-2 p-6 space-y-4">
            <div className="w-40 h-5 bg-accent rounded" />
            <div className="h-[250px] bg-accent rounded" />
          </Card>

          {/* Procedures Pie Skeleton */}
          <Card className="p-6 space-y-4">
            <div className="w-32 h-5 bg-accent rounded" />
            <div className="h-[200px] bg-accent rounded-full" />
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-3 bg-accent rounded" />
              ))}
            </div>
          </Card>
        </div>

        {/* Procedures Table Skeleton */}
        <Card className="p-0 overflow-hidden">
          <div className="p-4 border-b border-border space-y-2">
            <div className="w-48 h-5 bg-accent rounded" />
            <div className="w-96 h-3 bg-accent rounded" />
          </div>

          <div className="border-b border-border bg-accent/30 p-4 grid grid-cols-7 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="w-20 h-4 bg-accent rounded" />
            ))}
          </div>

          <div className="divide-y divide-border/50">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4 grid grid-cols-7 gap-4">
                {Array.from({ length: 7 }).map((_, j) => (
                  <div key={j} className="w-full h-4 bg-accent rounded" />
                ))}
              </div>
            ))}
          </div>
        </Card>

        {/* Staff On Duty Skeleton */}
        <Card className="p-6 space-y-4">
          <div>
            <div className="w-40 h-5 bg-accent rounded mb-1" />
            <div className="w-48 h-3 bg-accent rounded" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl bg-accent/40"
              >
                <div className="w-9 h-9 rounded-full bg-accent" />
                <div className="flex-1">
                  <div className="w-24 h-3 bg-accent rounded mb-1" />
                  <div className="w-32 h-2 bg-accent rounded" />
                </div>
                <div className="w-12 h-5 bg-accent rounded" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
