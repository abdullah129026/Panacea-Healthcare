import { format, parseISO } from "date-fns";
import { Header } from "@/components/layout/Header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Button,
  StatCard,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  DollarSign,
  CreditCard,
  FileCheck,
  Clock,
  Upload,
  Sparkles,
  MoreHorizontal,
  AlertCircle,
} from "lucide-react";
import { CreateInvoiceModal } from "@/components/modals/CreateInvoiceModal";
import { requireRole } from "@/lib/auth";
import { listInvoices } from "@/lib/invoices";
import { RevenueChart } from "@/components/BillingCharts";

const revenueData = [
  { month: "Aug", reimbursement: 52000, directPay: 18000 },
  { month: "Sep", reimbursement: 58000, directPay: 22000 },
  { month: "Oct", reimbursement: 61000, directPay: 19000 },
  { month: "Nov", reimbursement: 55000, directPay: 24000 },
  { month: "Dec", reimbursement: 68000, directPay: 27000 },
  { month: "Jan", reimbursement: 72000, directPay: 32000 },
];

const claimsDistribution = [
  { payer: "Medicare / Medicaid", percentage: 52, color: "#006c49" },
  { payer: "Blue Cross / Blue Shield", percentage: 28, color: "#004D1A" },
  { payer: "State / Private", percentage: 12, color: "#0000AA" },
  { payer: "Other / Self-insured", percentage: 8, color: "#D93C15" },
];

function statusVariant(
  status: string
): "success" | "error" | "warning" | "info" | "outline" {
  switch (status) {
    case "Paid":
      return "success";
    case "Pending":
      return "warning";
    case "Overdue":
      return "error";
    case "Draft":
      return "outline";
    default:
      return "info";
  }
}

function formatAmount(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(iso: string): string {
  try {
    return format(parseISO(iso), "MMM dd, yyyy");
  } catch {
    return "—";
  }
}

export default async function BillingPage() {
  await requireRole(["admin", "billing"]);

  const result = await listInvoices({ pageSize: 5 });
  const invoices = result.success ? result.data.items : [];

  return (
    <>
      <Header
        breadcrumbs={[
          { label: "Clinical Operations", href: "#" },
          { label: "Billing & Revenue" },
        ]}
      />

      <div className="p-6 space-y-6">
        {/* ---- Title Row ---- */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold font-mono text-foreground">
              Billing &amp; Revenue
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time financial performance, claims tracking and revenue
              analytics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CreateInvoiceModal />
            <Button variant="outline" size="md">
              <Upload className="w-4 h-4" />
              Import / Upload
            </Button>
          </div>
        </div>

        {/* ---- Stat Cards ---- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Revenue YTD"
            value="$428,590.00"
            icon={DollarSign}
            iconColor="text-primary"
            change="+8% vs last year"
            changeType="up"
          />
          <StatCard
            label="Pending Collections"
            value="$64,215.50"
            icon={CreditCard}
            iconColor="text-warning-foreground"
            change="-2.3% this month"
            changeType="down"
          />
          <StatCard
            label="Insurance Claims"
            value="1,420"
            icon={FileCheck}
            iconColor="text-success-foreground"
            subtitle="Applied this period"
          />
          <StatCard
            label="Avg Collection Days"
            value="14 Days"
            icon={Clock}
            iconColor="text-info-foreground"
            change="-1.5 days vs avg"
            changeType="down"
          />
        </div>

        {/* ---- Charts Grid ---- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Growth Trend */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div>
                <CardTitle className="text-base">
                  Revenue Growth Trend
                </CardTitle>
                <CardDescription>
                  Revenue/Reimbursement vs Private/Direct Pay comparison
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-medium transition-colors",
                    "bg-primary text-white"
                  )}
                >
                  Last 6 Months
                </button>
                <button
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-medium transition-colors",
                    "text-muted-foreground hover:text-foreground bg-accent"
                  )}
                >
                  Last Year
                </button>
              </div>
            </CardHeader>

            <RevenueChart data={revenueData} />
          </Card>

          {/* Claims Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Claims Distribution</CardTitle>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </CardHeader>
            <div className="space-y-4">
              {claimsDistribution.map((claim) => (
                <div key={claim.payer} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">
                      {claim.payer}
                    </span>
                    <span className="text-sm font-mono font-semibold text-foreground">
                      {claim.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${claim.percentage}%`,
                        backgroundColor: claim.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* AI Insight */}
            <div className="mt-6 p-3 rounded-xl bg-info border border-info-foreground/10">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-info-foreground shrink-0 mt-0.5" />
                <p className="text-xs text-info-foreground leading-relaxed">
                  Medicare claims have increased by{" "}
                  <span className="font-semibold">12%</span> this quarter.
                  Consider reviewing reimbursement rates for optimal revenue
                  capture.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* ---- Recent Transactions ---- */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle className="text-base">Recent Transactions</CardTitle>
              <CardDescription>
                Latest billing transactions and payment statuses
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardHeader>

          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                    Transaction ID
                  </th>
                  <th className="text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    Patient Name
                  </th>
                  <th className="text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    Date
                  </th>
                  <th className="text-right text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    Amount
                  </th>
                  <th className="text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                    Status
                  </th>
                  <th className="text-right text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {!result.success ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-destructive" />
                        <p className="text-sm text-muted-foreground">
                          Unable to load invoices
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : invoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <p className="text-sm text-muted-foreground">
                        No invoices yet. Create one to get started.
                      </p>
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-b border-border/50 hover:bg-accent/50 transition-colors"
                    >
                      <td className="px-6 py-3.5">
                        <span className="font-mono font-medium text-foreground">
                          {invoice.id}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-foreground">
                        {invoice.patientName}
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">
                        {formatDate(invoice.createdAt)}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono font-medium text-foreground">
                        {formatAmount(invoice.totalAmount)}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge variant={statusVariant(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <Button variant="ghost" size="sm">
                          Details
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}
