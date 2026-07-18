"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui";
import { Table, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { ClinicalOutcome } from "@/types";

interface OutcomesViewerProps {
  data: ClinicalOutcome[];
}

export function OutcomesViewer({ data }: OutcomesViewerProps) {
  const [viewMode, setViewMode] = useState<"table" | "chart">("chart");

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div>
          <CardTitle className="text-base">
            Clinical Outcomes Comparison
          </CardTitle>
          <CardDescription>
            Recovery rates by department vs industry benchmarks
          </CardDescription>
        </div>
        <div className="flex items-center gap-1 bg-accent rounded-lg p-0.5">
          <button
            onClick={() => setViewMode("table")}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              viewMode === "table"
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Table className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("chart")}
            className={cn(
              "p-1.5 rounded-md transition-colors",
              viewMode === "chart"
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>
      </CardHeader>

      {viewMode === "chart" ? (
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={4}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#CBCCC9"
                vertical={false}
              />
              <XAxis
                dataKey="department"
                tick={{ fontSize: 11, fill: "#666" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#666" }}
                axisLine={false}
                tickLine={false}
                domain={[70, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                formatter={(value) => `${value}%`}
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #CBCCC9",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11 }}
              />
              <Bar
                dataKey="recovery"
                name="Recovery Rate"
                fill="#006c49"
                radius={[6, 6, 0, 0]}
                barSize={18}
              />
              <Bar
                dataKey="benchmark"
                name="Benchmark"
                fill="#CBCCC9"
                radius={[6, 6, 0, 0]}
                barSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                  Department
                </th>
                <th className="text-right text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                  Recovery Rate
                </th>
                <th className="text-right text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                  Benchmark
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr
                  key={d.department}
                  className="border-b border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <td className="px-6 py-3 font-medium text-foreground">
                    {d.department}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-foreground">
                    {d.recovery}%
                  </td>
                  <td className="px-6 py-3 text-right font-mono text-muted-foreground">
                    {d.benchmark}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
