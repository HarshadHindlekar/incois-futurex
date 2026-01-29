"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { OceanObservationSummary } from "@/lib/types";

const sectorShortNames: Record<string, string> = {
  GUJARAT: "GJ",
  MAHARASHTRA: "MH",
  GOA: "GA",
  KARNATAKA: "KA",
  KERALA: "KL",
  TAMIL_NADU: "TN",
  ANDHRA_PRADESH: "AP",
  ODISHA: "OD",
  WEST_BENGAL: "WB",
  ANDAMAN: "AN",
  NICOBAR: "NI",
  LAKSHADWEEP: "LD",
};

const colors = [
  "#0066cc",
  "#3399ff",
  "#00b38c",
  "#ff6b35",
  "#e55a2b",
  "#8b5cf6",
  "#06b6d4",
  "#f59e0b",
];

interface RegionalStatsChartProps {
  data?: OceanObservationSummary[];
  isLoading?: boolean;
}

const mockData: OceanObservationSummary[] = [
  { region: "KERALA", avgSST: 28.5, minSST: 27.8, maxSST: 29.2, avgChlorophyll: 0.85, observationCount: 45, lastUpdated: new Date().toISOString() },
  { region: "TAMIL_NADU", avgSST: 29.2, minSST: 28.5, maxSST: 30.1, avgChlorophyll: 0.72, observationCount: 38, lastUpdated: new Date().toISOString() },
  { region: "ANDHRA_PRADESH", avgSST: 28.8, minSST: 27.5, maxSST: 29.8, avgChlorophyll: 1.1, observationCount: 42, lastUpdated: new Date().toISOString() },
  { region: "GUJARAT", avgSST: 27.5, minSST: 26.2, maxSST: 28.5, avgChlorophyll: 1.5, observationCount: 35, lastUpdated: new Date().toISOString() },
  { region: "MAHARASHTRA", avgSST: 28.0, minSST: 27.0, maxSST: 29.0, avgChlorophyll: 0.95, observationCount: 30, lastUpdated: new Date().toISOString() },
  { region: "ODISHA", avgSST: 28.3, minSST: 27.2, maxSST: 29.5, avgChlorophyll: 1.2, observationCount: 28, lastUpdated: new Date().toISOString() },
  { region: "WEST_BENGAL", avgSST: 28.1, minSST: 27.0, maxSST: 29.3, avgChlorophyll: 1.3, observationCount: 25, lastUpdated: new Date().toISOString() },
  { region: "KARNATAKA", avgSST: 28.7, minSST: 27.5, maxSST: 29.8, avgChlorophyll: 0.88, observationCount: 22, lastUpdated: new Date().toISOString() },
];

export function RegionalStatsChart({ data = mockData, isLoading = false }: RegionalStatsChartProps) {
  const chartData = data.map((item) => ({
    name: sectorShortNames[item.region] || item.region,
    fullName: item.region.replace(/_/g, " "),
    sst: item.avgSST,
    chlorophyll: item.avgChlorophyll,
    observations: item.observationCount,
  }));

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-5 w-40 animate-pulse rounded bg-muted" />
          <div className="h-4 w-60 animate-pulse rounded bg-muted" />
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Regional Ocean Statistics</CardTitle>
        <CardDescription>Average SST by coastal sector</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={true} vertical={false} />
              <XAxis type="number" domain={[25, 31]} className="text-xs" />
              <YAxis dataKey="name" type="category" width={40} className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                formatter={(value, name) => [
                  `${Number(value).toFixed(1)}°C`,
                  name === "sst" ? "Avg SST" : String(name),
                ]}
                labelFormatter={(label) => chartData.find((d) => d.name === label)?.fullName || label}
              />
              <Bar dataKey="sst" radius={[0, 4, 4, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
