import { Header } from "@/components/layout/Header";
import { SettingsTabs } from "@/components/layout/SettingsTabs";
import { Card, CardTitle, Button, Input, Select } from "@/components/ui";
import { Sun, Moon, Sparkles, UserRound, Globe } from "lucide-react";
import { requireRole } from "@/lib/auth/dal";
import { getCurrentUser } from "@/lib/auth/dal";
import { getUserProfile } from "@/lib/settings";
import { ProfileForm } from "./ProfileForm";

const interfaceModes = [
  { icon: Sun, title: "Standard Mode", desc: "Clean, high-visibility medical frame.", active: true },
  { icon: Moon, title: "Night Shift", desc: "Reduced blue light for late hours.", active: false },
  { icon: Sparkles, title: "Dynamic UI", desc: "UI adjusts based on context.", active: false },
];

export default async function SettingsProfilePage() {
  await requireRole(["clinician", "admin", "support", "billing"]);

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error("User not found");
  }

  const profileResult = await getUserProfile(currentUser.id);

  if (!profileResult.success) {
    return (
      <div className="flex flex-col">
        <Header breadcrumbs={[{ label: "Settings" }]} />
        <div className="p-6">
          <div className="text-center">
            <p className="text-foreground">Failed to load profile settings.</p>
            <p className="text-sm text-muted-foreground mt-2">{profileResult.error}</p>
          </div>
        </div>
      </div>
    );
  }

  const profile = profileResult.data;
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col">
      <Header breadcrumbs={[{ label: "Settings" }]} />
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-mono text-foreground">Portal Preferences</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your clinical workstation, security protocols, and account identity.
          </p>
        </div>

        <SettingsTabs />

        {/* Profile identity */}
        <Card className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-semibold font-mono">
              {initials}
            </div>
            <div>
              <h2 className="text-lg font-semibold font-mono text-foreground">{profile.name}</h2>
              <p className="text-sm text-muted-foreground">
                {profile.title || "Clinical Staff"} · ID: {currentUser.id.slice(0, 8)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="primary" size="sm" disabled>Change Avatar</Button>
            <Button variant="ghost" size="sm" disabled>Remove Photo</Button>
          </div>
        </Card>

        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
