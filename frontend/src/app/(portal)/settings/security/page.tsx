import { Header } from "@/components/layout/Header";
import { SettingsTabs } from "@/components/layout/SettingsTabs";
import { Card, CardTitle, Button, Badge } from "@/components/ui";
import { Smartphone, Laptop, ShieldAlert, ShieldCheck } from "lucide-react";
import { requireRole } from "@/lib/auth/dal";
import { getCurrentUser } from "@/lib/auth/dal";
import { getSecuritySettings } from "@/lib/settings";
import { PasswordUpdateForm } from "./PasswordUpdateForm";
import { SecurityPageClient } from "./SecurityPageClient";
import type { SecuritySettings } from "@/types";

export default async function SecuritySettingsPage() {
  await requireRole(["clinician", "admin", "support", "billing"]);

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error("User not found");
  }

  const securityResult = await getSecuritySettings(currentUser.id);

  if (!securityResult.success) {
    return (
      <div className="flex flex-col">
        <Header breadcrumbs={[{ label: "Settings", href: "/settings" }, { label: "Security" }]} />
        <div className="p-6">
          <div className="text-center">
            <p className="text-foreground">Failed to load security settings.</p>
            <p className="text-sm text-muted-foreground mt-2">{securityResult.error}</p>
          </div>
        </div>
      </div>
    );
  }

  const security = securityResult.data;
  return (
    <SecurityPageClient
      currentUser={currentUser}
      security={security}
    />
  );
}
