import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui";

export default function ReportsLoading() {
  return (
    <>
      <Header
        breadcrumbs={[
          { label: "Analytics", href: "#" },
          { label: "Reports & Analytics" },
        ]}
      />

      <div className="p-6 space-y-6">
        {/* Title Row Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="w-48 h-7 bg-accent rounded-lg mb-2" />
            <div className="w-96 h-4 bg-accent rounded-lg" />
          </div>
          <div className="w-32 h-10 bg-accent rounded-lg" />
        </div>

        {/* Stat Cards Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-accent" />
              <div className="flex-1">
                <div className="w-20 h-6 bg-accent rounded mb-1" />
                <div className="w-24 h-3 bg-accent rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Middle Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Outcomes Chart Skeleton */}
          <Card className="lg:col-span-2 p-6 space-y-4">
            <div>
              <div className="w-48 h-5 bg-accent rounded mb-1" />
              <div className="w-80 h-3 bg-accent rounded" />
            </div>
            <div className="h-[260px] bg-accent rounded" />
          </Card>

          {/* AI Summary Skeleton */}
          <Card className="p-6 space-y-4">
            <div className="w-40 h-5 bg-accent rounded" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="w-24 h-3 bg-accent rounded" />
                    <div className="w-12 h-3 bg-accent rounded" />
                  </div>
                  <div className="h-2 bg-accent rounded-full" />
                </div>
              ))}
            </div>
            <div className="h-16 bg-accent rounded-xl" />
            <div className="h-9 bg-accent rounded-lg" />
          </Card>
        </div>

        {/* Performance Matrix Skeleton */}
        <Card className="p-0 overflow-hidden">
          <div className="p-6 space-y-2">
            <div className="w-56 h-5 bg-accent rounded" />
            <div className="w-80 h-3 bg-accent rounded" />
          </div>

          <div className="border-t border-border">
            <div className="border-b border-border bg-accent/30 px-6 py-4">
              <div className="grid grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="w-16 h-3 bg-accent rounded" />
                ))}
              </div>
            </div>

            <div className="divide-y divide-border/50">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-6 py-4 grid grid-cols-6 gap-4">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <div key={j} className="h-3 bg-accent rounded" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
