import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="flex max-w-md flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <FileQuestion className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-1.5">
          <h1 className="font-mono text-2xl font-bold text-foreground">404</h1>
          <p className="text-sm text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has moved.
          </p>
        </div>
        <Link href="/">
          <Button>Back to home</Button>
        </Link>
      </Card>
    </div>
  );
}
