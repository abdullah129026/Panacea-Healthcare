import { Header } from "@/components/layout/Header";
import { SettingsTabs } from "@/components/layout/SettingsTabs";
import { Card, CardTitle, Button, Badge } from "@/components/ui";
import { HeartPulse, CreditCard, Landmark, MapPin, Filter, Download } from "lucide-react";
import { requireRole } from "@/lib/auth/dal";
import { getCurrentUser } from "@/lib/auth/dal";
import { getBillingSettings } from "@/lib/settings";

export default async function BillingSettingsPage() {
  await requireRole(["admin"]);

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error("User not found");
  }

  const billingResult = await getBillingSettings(currentUser.clinicId);

  if (!billingResult.success) {
    return (
      <div className="flex flex-col">
        <Header breadcrumbs={[{ label: "Settings", href: "/settings" }, { label: "Billing Preferences" }]} />
        <div className="p-6">
          <div className="text-center">
            <p className="text-foreground">Failed to load billing information.</p>
            <p className="text-sm text-muted-foreground mt-2">{billingResult.error}</p>
          </div>
        </div>
      </div>
    );
  }

  const billing = billingResult.data;

  return (
    <div className="flex flex-col">
      <Header breadcrumbs={[{ label: "Settings", href: "/settings" }, { label: "Billing Preferences" }]} />
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Financial Management
            </p>
            <h1 className="text-2xl font-bold font-mono text-foreground mt-1">Billing Preferences</h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Configure your clinic's payment methods, subscription plan, and view full transaction history for all
              financial records.
            </p>
          </div>
          <Button variant="primary" size="sm" disabled>
            Add Payment Method
          </Button>
        </div>

        <SettingsTabs />

        <div className="grid grid-cols-3 gap-6">
          <Card className="col-span-2 flex items-start justify-between">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <HeartPulse className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold font-mono text-foreground">{billing.subscription.planName}</h2>
                  <Badge variant={billing.subscription.status === "active" ? "success" : "warning"}>
                    {billing.subscription.status === "active" ? "Active Subscription" : billing.subscription.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground max-w-sm">
                  Full clinical suite including AI CDS, high-priority support, and unlimited records.
                </p>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider pt-1">
                  Next billing date · {new Date(billing.subscription.currentPeriodEnd).toLocaleDateString()}
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <Button variant="outline" size="sm" disabled>
                    Change Plan
                  </Button>
                  <Button variant="ghost" size="sm" disabled>
                    Cancel Subscription
                  </Button>
                </div>
              </div>
            </div>
            <p className="text-xl font-bold font-mono text-foreground">
              ${(billing.subscription.pricePerYear / 12).toFixed(0)}
              <span className="text-sm text-muted-foreground">/mo</span>
            </p>
          </Card>

          <Card className="space-y-3">
            <CardTitle>Usage Summary</CardTitle>
            <p className="text-[11px] text-muted-foreground">
              Current billing period{" "}
              {new Date(billing.usage.billingPeriodStart).toLocaleDateString()} -{" "}
              {new Date(billing.usage.billingPeriodEnd).toLocaleDateString()}
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Base Platform</span>
              <span className="text-foreground font-medium">${billing.usage.basePlatform.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">AI Processing</span>
              <span className="text-foreground font-medium">${billing.usage.aiProcessing.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Cloud Storage</span>
              <span className="text-foreground font-medium">${billing.usage.cloudStorage.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-sm font-medium text-foreground">Current Total</span>
              <span className="text-lg font-bold font-mono text-primary">
                ${(billing.usage.basePlatform + billing.usage.aiProcessing + billing.usage.cloudStorage).toFixed(2)}
              </span>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Card className="space-y-3">
            <CardTitle>Payment Methods</CardTitle>
            {billing.paymentMethods.length > 0 ? (
              <>
                {billing.paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`flex items-center justify-between p-3 rounded-xl border ${
                      method.isDefault ? "border-primary/40 bg-primary/5" : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {method.type === "card" ? (
                        <CreditCard className="w-5 h-5 text-primary" />
                      ) : (
                        <Landmark className="w-5 h-5 text-muted-foreground" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {method.brand || "Bank Account"} ····{method.last4}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {method.type === "card"
                            ? `Expires ${method.expiryMonth}/${method.expiryYear}`
                            : "Business Checking"}
                        </p>
                      </div>
                    </div>
                    {method.isDefault && <Badge variant="success">Default</Badge>}
                  </div>
                ))}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No payment methods on file.</p>
            )}
          </Card>

          <Card className="space-y-3">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Billing Address
            </CardTitle>
            <div className="text-sm text-muted-foreground leading-relaxed">
              <p className="text-foreground font-medium">{billing.billingAddress.street}</p>
              <p>
                {billing.billingAddress.city}, {billing.billingAddress.state} {billing.billingAddress.postalCode}
              </p>
              <p>{billing.billingAddress.country}</p>
              <p className="text-primary mt-2">{billing.billingAddress.email}</p>
            </div>
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Invoice History</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Filter
              </Button>
              <Button variant="outline" size="sm" disabled>
                Export All
              </Button>
            </div>
          </div>
          {billing.invoices.length > 0 ? (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Invoice ID</th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Method</th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {billing.invoices.slice(0, 10).map((inv) => (
                    <tr key={inv.id} className="border-b border-border/50 last:border-0">
                      <td className="py-3 font-mono text-xs text-foreground">{inv.invoiceNumber}</td>
                      <td className="py-3 text-muted-foreground text-xs">
                        {new Date(inv.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-foreground font-medium">${inv.amount.toFixed(2)}</td>
                      <td className="py-3">
                        <Badge variant={inv.status === "paid" ? "success" : inv.status === "overdue" ? "error" : "warning"}>
                          {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3 text-muted-foreground text-xs">{inv.paymentMethod}</td>
                      <td className="py-3">
                        {inv.status === "overdue" ? (
                          <Button variant="primary" size="sm" disabled>
                            Pay Now
                          </Button>
                        ) : (
                          <button className="text-xs text-primary hover:underline" disabled>
                            View
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between pt-4 text-xs text-muted-foreground">
                <span>Showing {Math.min(10, billing.invoices.length)} of {billing.invoices.length} invoices</span>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No invoices on file.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
