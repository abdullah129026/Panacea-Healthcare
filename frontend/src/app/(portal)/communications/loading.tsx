import { Header } from "@/components/layout/Header";

export default function CommunicationsLoading() {
  return (
    <>
      <Header
        breadcrumbs={[
          { label: "Clinical Operations", href: "#" },
          { label: "Communications" },
        ]}
      />

      <div className="p-6">
        {/* Chat Interface Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-card rounded-2xl border border-border overflow-hidden min-h-[calc(100vh-220px)]">
          {/* Left Panel – Chat List Skeleton */}
          <div className="lg:col-span-4 xl:col-span-3 border-r border-border flex flex-col">
            {/* Search Skeleton */}
            <div className="p-4 border-b border-border">
              <div className="h-9 bg-accent rounded-xl" />
            </div>

            {/* Tabs Skeleton */}
            <div className="flex items-center gap-1 px-4 pt-3 pb-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="w-16 h-6 bg-accent rounded-lg"
                />
              ))}
            </div>

            {/* Chat List Skeleton */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl">
                  <div className="w-10 h-10 bg-accent rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                      <div className="w-24 h-3 bg-accent rounded" />
                      <div className="w-12 h-3 bg-accent rounded" />
                    </div>
                    <div className="w-full h-3 bg-accent rounded" />
                    <div className="w-16 h-2 bg-accent rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel – Chat View Skeleton */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col">
            {/* Chat Header Skeleton */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent rounded-full" />
                <div className="space-y-1">
                  <div className="w-32 h-4 bg-accent rounded" />
                  <div className="w-40 h-3 bg-accent rounded" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="w-9 h-9 bg-accent rounded-lg" />
                ))}
              </div>
            </div>

            {/* Messages Skeleton */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
                >
                  <div className="max-w-[70%] h-16 bg-accent rounded-2xl" />
                </div>
              ))}
            </div>

            {/* Message Input Skeleton */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="w-9 h-9 bg-accent rounded-lg" />
                  ))}
                </div>
                <div className="flex-1 h-10 bg-accent rounded-xl" />
                <div className="w-10 h-10 bg-primary rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
