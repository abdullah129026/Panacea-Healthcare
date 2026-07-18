import { Sidebar } from "@/components/layout/Sidebar";
import { LiveSupportChat } from "@/components/support/LiveSupportChat";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { RealtimeProvider } from "@/components/providers/RealtimeProvider";
import { verifySession } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await verifySession();

  return (
    <SessionProvider user={user}>
      <RealtimeProvider
        enabled={true}
        pollInterval={3000}
        userId={user?.id}
        clinicId={user?.clinicId}
      >
        <div className="flex min-h-screen">
          <Sidebar />
          <main id="main-content" className="flex-1 ml-[240px]">
            {children}
          </main>
          <LiveSupportChat />
        </div>
      </RealtimeProvider>
    </SessionProvider>
  );
}
