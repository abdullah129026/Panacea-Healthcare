import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { UserX } from "lucide-react";

export default function PatientNotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-8">
      <Card className="flex max-w-md flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <UserX className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-1.5">
          <h2 className="font-mono text-base font-semibold text-foreground">
            Patient not found
          </h2>
          <p className="text-sm text-muted-foreground">
            This patient record doesn&apos;t exist or isn&apos;t part of your
            clinic.
          </p>
        </div>
        <Link href="/patients">
          <Button>Back to patients</Button>
        </Link>
      </Card>
    </div>
  );
}
