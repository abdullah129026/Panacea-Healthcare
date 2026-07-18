import { Card, Skeleton } from "@/components/ui";
import { Header } from "@/components/layout/Header";
import { SettingsTabs } from "@/components/layout/SettingsTabs";

export default function NotificationsLoading() {
  return (
    <div className="flex flex-col">
      <Header
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Notifications" },
        ]}
      />
      <div className="p-6 space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        <SettingsTabs />

        <div className="grid grid-cols-3 gap-6">
          <Card className="space-y-3">
            <Skeleton className="h-10 w-10 rounded-xl mb-2" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-8 w-32" />
          </Card>

          <Card className="col-span-2 space-y-3">
            <Skeleton className="h-6 w-40 mb-4" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </Card>
        </div>

        <Card className="space-y-4">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-4 w-24" />
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="h-5 w-full" />
                ))}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
