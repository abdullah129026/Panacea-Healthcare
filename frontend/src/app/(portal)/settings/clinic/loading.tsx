import { Card, Skeleton } from "@/components/ui";
import { Header } from "@/components/layout/Header";
import { SettingsTabs } from "@/components/layout/SettingsTabs";

export default function ClinicLoading() {
  return (
    <div className="flex flex-col">
      <Header breadcrumbs={[{ label: "Settings", href: "/settings" }, { label: "Clinic Info" }]} />
      <div className="p-6 space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        <SettingsTabs />

        <div className="grid grid-cols-2 gap-6">
          <Card className="space-y-4">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-20" />
          </Card>
          <Card className="space-y-4">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Card className="space-y-3">
            <Skeleton className="h-6 w-40 mb-4" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </Card>
          <Card className="space-y-3">
            <Skeleton className="h-6 w-40 mb-4" />
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
