"use client";

import { useState } from "react";
import { Modal, Button, Select } from "@/components/ui";
import { Download, FileText, FileSpreadsheet, FileJson } from "lucide-react";

const formats = [
  { icon: FileText, label: "PDF Report", desc: "Formatted summary" },
  { icon: FileSpreadsheet, label: "CSV / Excel", desc: "Raw tabular data" },
  { icon: FileJson, label: "JSON", desc: "For integrations" },
];

export function ExportAnalyticsModal() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Download className="w-4 h-4" /> Export
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Export Analytics & Financials"
        description="Generate a downloadable report from the current analytics view."
        size="md"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={() => setOpen(false)}>Generate Export</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-foreground mb-2">Format</p>
            <div className="grid grid-cols-3 gap-3">
              {formats.map((f, i) => (
                <button
                  key={f.label}
                  onClick={() => setSelected(i)}
                  className={`rounded-xl border p-3 text-left transition-colors ${
                    selected === i ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                  }`}
                >
                  <f.icon className={`w-5 h-5 ${selected === i ? "text-primary" : "text-muted-foreground"}`} />
                  <p className="text-xs font-medium text-foreground mt-2">{f.label}</p>
                  <p className="text-[10px] text-muted-foreground">{f.desc}</p>
                </button>
              ))}
            </div>
          </div>
          <Select label="Date Range" options={[
            { value: "30", label: "Last 30 Days" },
            { value: "quarter", label: "This Quarter" },
            { value: "year", label: "Year to Date" },
          ]} />
          <Select label="Data Scope" options={[
            { value: "all", label: "All Analytics & Financials" },
            { value: "revenue", label: "Revenue Only" },
            { value: "clinical", label: "Clinical Metrics Only" },
          ]} />
        </div>
      </Modal>
    </>
  );
}
