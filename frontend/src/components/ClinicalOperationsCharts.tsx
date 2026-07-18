"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface BedOccupancyData {
  department: string;
  occupied: number;
  total: number;
}

interface ProcedureData {
  name: string;
  value: number;
  color: string;
}

export function BedOccupancyChart({ data }: { data: BedOccupancyData[] }) {
  return (
    <div className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="department" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
          <YAxis stroke="var(--muted-foreground)" />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
            }}
          />
          <Bar dataKey="occupied" fill="var(--primary)" name="Occupied" />
          <Bar dataKey="total" fill="var(--muted)" name="Total" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ProcedureDistributionChart({ data }: { data: ProcedureData[] }) {
  return (
    <div className="h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} procedures`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
