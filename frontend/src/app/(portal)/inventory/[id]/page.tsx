"use client";

import { Header } from "@/components/layout/Header";
import { Card, CardTitle, Button, Badge } from "@/components/ui";
import { Package, Pencil, Share2, MapPin, Truck, ChevronLeft } from "lucide-react";
import { ConsumptionChart } from "@/components/InventoryCharts";

const consumption = [
  { week: "W1", boxes: 96 }, { week: "W2", boxes: 88 }, { week: "W3", boxes: 74 },
  { week: "W4", boxes: 80 }, { week: "W5", boxes: 124 }, { week: "W6", boxes: 92 },
  { week: "W7", boxes: 68 }, { week: "W8", boxes: 42 },
];

const location = [
  { label: "Facility", value: "Central Medical Hub" },
  { label: "Wing", value: "Level 2 · Supplies" },
  { label: "Aisle", value: "A-04" },
  { label: "Shelf", value: "S-12" },
];

const vendor = [
  { label: "Contact", value: "Sarah Chen" },
  { label: "Lead Time", value: "3–5 Business Days" },
  { label: "Price / Unit", value: "$12.50 / box" },
];

export default function InventoryItemDetailPage() {
  return (
    <div className="flex flex-col">
      <Header breadcrumbs={[{ label: "Inventory & Supplies", href: "/inventory" }, { label: "Item Detail" }]} />
      <div className="p-6 space-y-6">
        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="w-4 h-4" /> Nitrile Gloves, Blue, Large
        </button>

        <div className="grid grid-cols-3 gap-6">
          {/* Left / main */}
          <div className="col-span-2 space-y-6">
            <Card className="flex gap-6">
              <div className="w-40 h-40 rounded-xl bg-gradient-to-br from-info/40 to-primary/10 flex items-center justify-center shrink-0">
                <Package className="w-10 h-10 text-primary/50" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="error">Low Stock</Badge>
                  <Badge variant="info">PPE Category</Badge>
                </div>
                <h1 className="text-xl font-bold font-mono text-foreground">Nitrile Gloves, Blue, Large</h1>
                <p className="text-sm text-muted-foreground">
                  Professional-grade, powder-free, medical examination gloves with textured fingertips for enhanced grip.
                </p>
                <p className="text-3xl font-bold font-mono text-foreground">42<span className="text-sm text-muted-foreground font-sans ml-2">boxes remaining / Min. 100</span></p>
                <div className="flex items-center gap-3 pt-1">
                  <Button variant="primary" size="sm">Reorder Now</Button>
                  <Button variant="outline" size="sm"><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button variant="outline" size="sm"><Share2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <CardTitle>Consumption Trends</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">Weekly usage over the last 3 months</p>
                </div>
                <Badge variant="outline">Last 90 Days</Badge>
              </div>
              <ConsumptionChart data={consumption} />
            </Card>
          </div>

          {/* Right */}
          <div className="space-y-6">
            <Card className="space-y-3">
              <CardTitle className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Storage Location</CardTitle>
              {location.map((l) => (
                <div key={l.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{l.label}</span>
                  <span className="text-foreground font-medium">{l.value}</span>
                </div>
              ))}
              <div className="h-24 rounded-xl bg-gradient-to-br from-primary/10 to-info/40 mt-2" />
            </Card>

            <Card className="space-y-3">
              <CardTitle className="flex items-center gap-2"><Truck className="w-4 h-4 text-primary" /> Vendor Information</CardTitle>
              <p className="text-sm font-medium text-foreground">MedSupply Logistics Inc.</p>
              {vendor.map((v) => (
                <div key={v.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{v.label}</span>
                  <span className="text-foreground font-medium">{v.value}</span>
                </div>
              ))}
              <Button variant="primary" size="sm" className="w-full">Message Vendor</Button>
            </Card>

            <Card className="space-y-3">
              <CardTitle>Recent Consumption</CardTitle>
              <div className="flex items-start gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                <p className="text-muted-foreground"><span className="text-foreground font-medium">12 boxes</span> removed for Surgery Wing</p>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-info-foreground mt-1.5" />
                <p className="text-muted-foreground"><span className="text-foreground font-medium">6 boxes</span> removed for ER Unit</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
