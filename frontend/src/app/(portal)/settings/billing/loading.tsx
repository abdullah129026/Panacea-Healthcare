import { Card, Skeleton } from "@/components/ui";
import { Header } from "@/components/layout/Header";
import { SettingsTabs } from "@/components/layout/SettingsTabs";

export default function BillingLoading() {
  return (
    <div className="flex flex-col">
      <Header breadcrumbs={[{ label: "Settings", href: "/settings" }, { label: "Billing Preferences" }]} />
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        <SettingsTabs />

        <div className="grid grid-cols-3 gap-6">
          <Card className="col-span-2 space-y-4">
            <div className="flex gap-4">
              <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-24" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-40" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-5" />
            ))}
            <Skeleton className="h-8 w-40" />
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Card className="space-y-3">
            <Skeleton className="h-6 w-40 mb-4" />
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </Card>
          <Card className="space-y-3">
            <Skeleton className="h-6 w-40 mb-4" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </Card>
        </div>

        <Card>
          <Skeleton className="h-6 w-40 mb-4" />
          <table className="w-full">
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i}>
                  {[1, 2, 3, 4, 5, 6].map((j) => (
                    <td key={j} className="py-3">
                      <Skeleton className="h-4 w-20" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
