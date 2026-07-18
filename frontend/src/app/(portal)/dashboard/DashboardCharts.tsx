"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

interface DashboardChartsProps {
  patientFlow: any[];
  departmentMetrics: any[];
}

export function DashboardCharts({ patientFlow, departmentMetrics }: DashboardChartsProps) {
  return (
    <>
      {/* Patient Flow Chart */}
      {patientFlow.length > 0 ? (
        <Card className="col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Patient Flow Today</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Inpatient vs outpatient traffic throughout the day
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                Inpatient
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                Outpatient
              </span>
            </div>
          </CardHeader>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={patientFlow}>
                <defs>
                  <linearGradient
                    id="inpatientGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#006c49" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#006c49" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="outpatientGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#CBCCC9"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 11, fill: "#666" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#666" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #CBCCC9",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="inpatient"
                  stroke="#006c49"
                  fill="url(#inpatientGrad)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="outpatient"
                  stroke="#10B981"
                  fill="url(#outpatientGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      ) : null}

      {/* Department Metrics Chart */}
      {departmentMetrics.length > 0 ? (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Department Load</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Patient volume by department
              </p>
            </div>
          </CardHeader>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentMetrics}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#CBCCC9"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#666" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#666" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #CBCCC9",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="patients" fill="#006c49" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      ) : null}
    </>
  );
}
