import { Card, Skeleton } from "@/components/ui";
import { Header } from "@/components/layout/Header";
import { SettingsTabs } from "@/components/layout/SettingsTabs";

export default function SecurityLoading() {
  return (
    <div className="flex flex-col">
      <Header breadcrumbs={[{ label: "Settings", href: "/settings" }, { label: "Security" }]} />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        <SettingsTabs />

        <div className="grid grid-cols-2 gap-6">
          <Card className="space-y-4">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
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
              <Skeleton key={i} className="h-16" />
            ))}
          </Card>
          <Card className="space-y-3">
            <Skeleton className="h-6 w-40 mb-4" />
            <table className="w-full">
              <tbody>
                {[1, 2, 3].map((i) => (
                  <tr key={i}>
                    <td className="py-3">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td>
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td>
                      <Skeleton className="h-4 w-16" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  );
}
