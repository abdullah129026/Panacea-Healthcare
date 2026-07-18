import { Header } from "@/components/layout/Header";
import { SettingsTabs } from "@/components/layout/SettingsTabs";
import { Card, CardTitle, Badge } from "@/components/ui";
import { Clock, FileBadge, MapPin } from "lucide-react";
import { requireRole } from "@/lib/auth/dal";
import { getCurrentUser } from "@/lib/auth/dal";
import { getClinicInfo, listClinicMembers } from "@/lib/settings";
import { ClinicInfoForm } from "./ClinicInfoForm";
import { ClinicMembersPageClient } from "./ClinicMembersPageClient";

export default async function ClinicInfoPage() {
  await requireRole(["admin"]);

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error("User not found");
  }

  const clinicResult = await getClinicInfo(currentUser.clinicId);

  if (!clinicResult.success) {
    return (
      <div className="flex flex-col">
        <Header breadcrumbs={[{ label: "Settings", href: "/settings" }, { label: "Clinic Info" }]} />
        <div className="p-6">
          <div className="text-center">
            <p className="text-foreground">Failed to load clinic information.</p>
            <p className="text-sm text-muted-foreground mt-2">{clinicResult.error}</p>
          </div>
        </div>
      </div>
    );
  }

  const clinic = clinicResult.data;

  const membersResult = await listClinicMembers(currentUser.clinicId);
  const members = membersResult.success ? membersResult.data.items : [];

  const licensesCount = clinic.licenses?.length || 0;
  const activeLicenses = clinic.licenses?.filter((l) => l.status === "active").length || 0;

  return (
    <div className="flex flex-col">
      <Header breadcrumbs={[{ label: "Settings", href: "/settings" }, { label: "Clinic Info" }]} />
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold font-mono text-foreground">Clinic Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage clinic information, team members, and compliance details.
            </p>
          </div>
        </div>

        <SettingsTabs />

        <ClinicInfoForm clinic={clinic} />

        <ClinicMembersPageClient members={members} clinicId={currentUser.clinicId} />

        <div className="grid grid-cols-2 gap-6">
          <Card className="space-y-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Standard Operating Hours
              </CardTitle>
              <Badge variant="info">Information</Badge>
            </div>
            {clinic.operatingHours && Object.keys(clinic.operatingHours).length > 0 ? (
              <>
                {Object.entries(clinic.operatingHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center justify-between text-sm">
                    <span className="text-foreground capitalize">{day}</span>
                    <span className="text-muted-foreground">
                      {hours ? `${hours.open} – ${hours.close}` : "Closed"}
                    </span>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                  Contact an administrator to modify operating hours.
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No operating hours configured.</p>
            )}
          </Card>

          <Card className="space-y-3">
            <CardTitle className="flex items-center gap-2">
              <FileBadge className="w-4 h-4 text-primary" /> Licensing & Compliance
            </CardTitle>
            {clinic.licenses && clinic.licenses.length > 0 ? (
              <>
                {clinic.licenses.slice(0, 3).map((license) => (
                  <div key={license.id} className="flex items-center justify-between p-3 rounded-xl border border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">{license.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {license.issuer} · Expires {new Date(license.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={license.status === "active" ? "success" : "warning"}>
                      {license.status === "active" ? "Active" : "Expiring"}
                    </Badge>
                  </div>
                ))}
                {licensesCount > 3 && (
                  <p className="text-xs text-muted-foreground">
                    +{licensesCount - 3} more license{licensesCount - 3 !== 1 ? "s" : ""}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No licenses on file.</p>
            )}
          </Card>
        </div>

        {clinic.serviceArea && (
          <Card className="space-y-3">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Service Area & Geographic Context
            </CardTitle>
            <div className="h-48 rounded-xl bg-gradient-to-br from-primary/10 to-info/40 border border-border flex items-center justify-center">
              <MapPin className="w-8 h-8 text-primary/50" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-accent">
                <p className="text-xs text-muted-foreground">Local Population Health</p>
                <p className="text-sm font-medium text-foreground">{clinic.serviceArea.populationHealth || "N/A"}</p>
              </div>
              <div className="p-3 rounded-xl bg-accent">
                <p className="text-xs text-muted-foreground">Emergency Proximity</p>
                <p className="text-sm font-medium text-foreground">{clinic.serviceArea.emergencyProximity || "N/A"}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
