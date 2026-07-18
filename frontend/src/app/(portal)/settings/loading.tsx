import { Card, Skeleton } from "@/components/ui";
import { Header } from "@/components/layout/Header";
import { SettingsTabs } from "@/components/layout/SettingsTabs";

export default function SettingsLoading() {
  return (
    <div className="flex flex-col">
      <Header breadcrumbs={[{ label: "Settings" }]} />
      <div className="p-6 space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        <SettingsTabs />

        <Card className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-60" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-6">
          <Card className="space-y-4">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </Card>
          <Card className="space-y-4">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </Card>
        </div>

        <Card className="space-y-4">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
