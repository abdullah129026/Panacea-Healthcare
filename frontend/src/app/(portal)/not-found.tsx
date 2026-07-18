import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { FileQuestion } from "lucide-react";

export default function PortalNotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-8">
      <Card className="flex max-w-md flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <FileQuestion className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-1.5">
          <h2 className="font-mono text-base font-semibold text-foreground">
            Not found
          </h2>
          <p className="text-sm text-muted-foreground">
            The page or record you&apos;re looking for doesn&apos;t exist or may
            have been moved.
          </p>
        </div>
        <Link href="/dashboard">
          <Button>Back to dashboard</Button>
        </Link>
      </Card>
    </div>
  );
}
