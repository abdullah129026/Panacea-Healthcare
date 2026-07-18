import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col">
      <Header breadcrumbs={[{ label: "Dashboard" }]} />

      <div className="p-6 space-y-6">
        {/* Page Title Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <div className="w-48 h-7 bg-accent rounded-lg mb-2" />
            <div className="w-72 h-4 bg-accent rounded-lg" />
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

        {/* Main Content Grid Skeleton */}
        <div className="grid grid-cols-3 gap-6">
          {/* Patient Flow Chart Skeleton */}
          <Card className="col-span-2 p-6 space-y-4">
            <div>
              <div className="w-40 h-5 bg-accent rounded mb-1" />
              <div className="w-80 h-3 bg-accent rounded" />
            </div>
            <div className="h-[260px] bg-accent rounded" />
          </Card>

          {/* Alerts Skeleton */}
          <Card className="p-6 space-y-3">
            <div className="w-32 h-5 bg-accent rounded mb-2" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-accent rounded-xl" />
            ))}
          </Card>
        </div>

        {/* Bottom Section Skeleton */}
        <div className="grid grid-cols-3 gap-6">
          {/* Recent Patients Skeleton */}
          <Card className="col-span-2 p-0 overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="w-40 h-5 bg-accent rounded" />
            </div>
            <div className="p-4 space-y-2">
              <div className="grid grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-20 h-3 bg-accent rounded" />
                ))}
              </div>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="grid grid-cols-5 gap-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div key={j} className="h-3 bg-accent rounded" />
                  ))}
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Appointments Skeleton */}
          <Card className="p-6 space-y-3">
            <div className="w-48 h-5 bg-accent rounded mb-2" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 bg-accent rounded-xl" />
            ))}
          </Card>
        </div>

        {/* Department Overview Skeleton */}
        <Card className="p-6 space-y-4">
          <div>
            <div className="w-48 h-5 bg-accent rounded mb-1" />
            <div className="w-80 h-3 bg-accent rounded" />
          </div>
          <div className="h-[200px] bg-accent rounded" />
        </Card>
      </div>
    </div>
  );
}
