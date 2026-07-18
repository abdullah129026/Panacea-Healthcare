import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Header } from "@/components/layout/Header";
import { Card, Badge, Button } from "@/components/ui";
import { CreateSupplyOrderModal } from "@/components/modals/CreateSupplyOrderModal";
import { requireRole } from "@/lib/auth";
import { listInventoryItems } from "@/lib/inventory";
import { pageWindow } from "@/lib/pagination";
import { cn } from "@/lib/utils";
import type { StockStatus, InventoryCategory } from "@/types";
import {
  Package,
  DollarSign,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Search,
} from "lucide-react";

const PAGE_SIZE = 20;

function statusVariant(
  status: StockStatus
): "success" | "warning" | "error" | "info" | "outline" {
  switch (status) {
    case "In Stock":
      return "success";
    case "Low":
      return "warning";
    case "Critical":
      return "error";
    case "Out of Stock":
      return "error";
    default:
      return "outline";
  }
}

function categoryIcon(category: InventoryCategory) {
  switch (category) {
    case "Pharmaceuticals":
      return "💊";
    case "Equipment":
      return "🔧";
    case "Supplies":
      return "📦";
    case "Other":
      return "📋";
    default:
      return "📦";
  }
}

function formatCost(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(iso: string): string {
  try {
    return format(parseISO(iso), "MMM dd, yyyy");
  } catch {
    return "—";
  }
}

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    status?: string;
    page?: string;
  }>;
}) {
  await requireRole(["admin"]);

  const { search = "", category = "", status = "", page: pageParam } =
    await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const result = await listInventoryItems({
    search: search || undefined,
    category: category || undefined,
    status: status || undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  function pageHref(target: number): string {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (status) params.set("status", status);
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    return qs ? `/inventory?${qs}` : "/inventory";
  }

  const items = result.success ? result.data.items : [];
  const total = result.success ? result.data.total : 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  const criticalItems = items.filter((i) => i.status === "Critical");
  const lowItems = items.filter((i) => i.status === "Low");

  return (
    <div className="flex flex-col">
      <Header breadcrumbs={[{ label: "Inventory Management" }]} />

      <div className="p-6 space-y-6">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold font-mono text-foreground">
              Inventory Management
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track stock levels, manage reorders, and control supply chain
            </p>
          </div>
          <div className="flex items-center gap-3">
            <CreateSupplyOrderModal />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-lg font-bold font-mono">{total}</p>
              <p className="text-xs text-muted-foreground">Total Items</p>
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-error-foreground" />
            </div>
            <div>
              <p className="text-lg font-bold font-mono">{criticalItems.length}</p>
              <p className="text-xs text-muted-foreground">Critical Stock</p>
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-warning-foreground" />
            </div>
            <div>
              <p className="text-lg font-bold font-mono">{lowItems.length}</p>
              <p className="text-xs text-muted-foreground">Low Stock</p>
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-info-foreground" />
            </div>
            <div>
              <p className="text-lg font-bold font-mono">
                {formatCost(
                  items.reduce((sum, i) => sum + i.quantity * i.unitCost, 0)
                )}
              </p>
              <p className="text-xs text-muted-foreground">Total Value</p>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <Card className="p-0 overflow-hidden">
          {!result.success ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <AlertCircle className="w-6 h-6 text-destructive" />
              <p className="text-sm text-muted-foreground">
                We couldn&apos;t load inventory right now. Please refresh to try
                again.
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                {search || category || status
                  ? "No items match your search."
                  : "No inventory items yet."}
              </p>
              <CreateSupplyOrderModal />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-accent/30">
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      Item
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      SKU
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      Quantity
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      Reorder Level
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      Unit Cost
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      Vendor
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-border/50 last:border-0 hover:bg-accent/30 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <Link
                          href={`/inventory/${item.id}`}
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          {categoryIcon(item.category)} {item.name}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {item.category}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                        {item.sku}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs font-medium text-foreground">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                        {item.reorderLevel}
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {formatCost(item.unitCost)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={statusVariant(item.status)}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {item.vendor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Showing {rangeStart}-{rangeEnd} of {total.toLocaleString()}{" "}
                  items
                </p>
                <div className="flex items-center gap-1">
                  <Link
                    href={pageHref(Math.max(1, page - 1))}
                    aria-disabled={page <= 1}
                    className={cn(
                      "p-1.5 rounded-lg hover:bg-accent transition-colors",
                      page <= 1 && "pointer-events-none opacity-40"
                    )}
                  >
                    <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                  </Link>
                  {pageWindow(page, totalPages).map((p, i) =>
                    p === "..." ? (
                      <span
                        key={`gap-${i}`}
                        className="w-8 h-8 flex items-center justify-center text-xs text-muted-foreground"
                      >
                        …
                      </span>
                    ) : (
                      <Link
                        key={p}
                        href={pageHref(p)}
                        className={cn(
                          "w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors",
                          p === page
                            ? "bg-foreground text-background"
                            : "text-muted-foreground hover:bg-accent"
                        )}
                      >
                        {p}
                      </Link>
                    )
                  )}
                  <Link
                    href={pageHref(Math.min(totalPages, page + 1))}
                    aria-disabled={page >= totalPages}
                    className={cn(
                      "p-1.5 rounded-lg hover:bg-accent transition-colors",
                      page >= totalPages && "pointer-events-none opacity-40"
                    )}
                  >
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
