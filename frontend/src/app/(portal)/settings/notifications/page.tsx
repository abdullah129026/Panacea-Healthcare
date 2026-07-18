import { Header } from "@/components/layout/Header";
import { SettingsTabs } from "@/components/layout/SettingsTabs";
import { Card, CardTitle, Badge } from "@/components/ui";
import { Bell } from "lucide-react";
import { requireRole } from "@/lib/auth/dal";
import { getCurrentUser } from "@/lib/auth/dal";
import { getNotificationPreferences } from "@/lib/settings";
import { NotificationsForm } from "./NotificationsForm";

export default async function NotificationSettingsPage() {
  await requireRole(["clinician", "admin", "support", "billing"]);

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error("User not found");
  }

  const preferencesResult = await getNotificationPreferences(currentUser.id);

  if (!preferencesResult.success) {
    return (
      <div className="flex flex-col">
        <Header breadcrumbs={[{ label: "Settings", href: "/settings" }, { label: "Notifications" }]} />
        <div className="p-6">
          <div className="text-center">
            <p className="text-foreground">Failed to load notification preferences.</p>
            <p className="text-sm text-muted-foreground mt-2">{preferencesResult.error}</p>
          </div>
        </div>
      </div>
    );
  }

  const preferences = preferencesResult.data;
  const enabledChannels = preferences
    ? [
        preferences.channels.emailEnabled && "email",
        preferences.channels.smsEnabled && "sms",
        preferences.channels.inAppEnabled && "in-app",
      ].filter(Boolean).length
    : 0;

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
          <h1 className="text-2xl font-bold font-mono text-foreground">Notification Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage how you receive alerts and clinical updates.</p>
        </div>

        <SettingsTabs />

        {preferencesResult.success && preferences ? (
          <>
            <div className="grid grid-cols-3 gap-6">
              <Card className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <CardTitle>Alert Preferences</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Fine-tune channels and triggers for clinical alerts and updates.
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <Badge variant="success">
                    {enabledChannels} Active Channel{enabledChannels !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </Card>

              <NotificationsForm preferences={preferences} />
            </div>
          </>
        ) : (
          <div className="text-center text-foreground">
            <p>Failed to load notification preferences.</p>
          </div>
        )}
      </div>
    </div>
  );
}
