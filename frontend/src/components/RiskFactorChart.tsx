"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface RiskFactor {
  label: string;
  score: number;
}

interface RiskFactorChartProps {
  data: RiskFactor[];
}

export function RiskFactorChart({ data }: RiskFactorChartProps) {
  return (
    <div className="h-[300px] -ml-6">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid strokeDasharray="3 3" stroke="#E0E0E0" />
          <PolarAngleAxis dataKey="label" tick={{ fontSize: 12 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} />
          <Radar
            name="Risk Score"
            dataKey="score"
            stroke="var(--primary)"
            fill="var(--primary)"
            fillOpacity={0.2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
