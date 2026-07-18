"use client";

import { useEffect } from "react";
import { Button, Card } from "@/components/ui";
import { AlertTriangle } from "lucide-react";

export default function AuthError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[auth/error]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="flex max-w-md flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error">
          <AlertTriangle className="h-6 w-6 text-error-foreground" />
        </div>
        <div className="space-y-1.5">
          <h2 className="font-mono text-base font-semibold text-foreground">
            Something went wrong
          </h2>
          <p className="text-sm text-muted-foreground">
            We couldn&apos;t complete that request. Please try again.
          </p>
        </div>
        <Button onClick={() => unstable_retry()}>Try again</Button>
      </Card>
    </div>
  );
}
