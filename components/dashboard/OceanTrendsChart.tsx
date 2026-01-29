"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ChartDataPoint {
  date: string;
  sst: number;
  chlorophyll: number;
  anomaly?: number;
}

const mockChartData: ChartDataPoint[] = [
  { date: "Jan", sst: 27.5, chlorophyll: 0.8, anomaly: 0.2 },
  { date: "Feb", sst: 27.8, chlorophyll: 0.9, anomaly: 0.3 },
  { date: "Mar", sst: 28.2, chlorophyll: 1.1, anomaly: 0.4 },
  { date: "Apr", sst: 28.8, chlorophyll: 1.3, anomaly: 0.6 },
  { date: "May", sst: 29.5, chlorophyll: 1.0, anomaly: 0.8 },
  { date: "Jun", sst: 28.5, chlorophyll: 0.7, anomaly: 0.3 },
  { date: "Jul", sst: 27.8, chlorophyll: 0.6, anomaly: 0.1 },
  { date: "Aug", sst: 27.5, chlorophyll: 0.8, anomaly: 0.0 },
  { date: "Sep", sst: 28.0, chlorophyll: 1.2, anomaly: 0.2 },
  { date: "Oct", sst: 28.5, chlorophyll: 1.5, anomaly: 0.4 },
  { date: "Nov", sst: 28.2, chlorophyll: 1.2, anomaly: 0.3 },
  { date: "Dec", sst: 27.8, chlorophyll: 0.9, anomaly: 0.2 },
];

interface OceanTrendsChartProps {
  data?: ChartDataPoint[];
  isLoading?: boolean;
}

export function OceanTrendsChart({ data = mockChartData, isLoading = false }: OceanTrendsChartProps) {
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
        <CardTitle>Ocean Conditions Trends</CardTitle>
        <CardDescription>
          Monthly SST and Chlorophyll-a concentration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sst" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="sst">Sea Surface Temperature</TabsTrigger>
            <TabsTrigger value="chlorophyll">Chlorophyll-a</TabsTrigger>
            <TabsTrigger value="combined">Combined</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sst">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis domain={[26, 31]} className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sst"
                    stroke="#0066cc"
                    strokeWidth={2}
                    dot={{ fill: "#0066cc", r: 4 }}
                    name="SST (°C)"
                  />
                  <Line
                    type="monotone"
                    dataKey="anomaly"
                    stroke="#ff6b35"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: "#ff6b35", r: 3 }}
                    name="Anomaly (°C)"
                  />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="chlorophyll">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis domain={[0, 2]} className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="chlorophyll"
                    stroke="#00b38c"
                    strokeWidth={2}
                    dot={{ fill: "#00b38c", r: 4 }}
                    name="Chlorophyll-a (mg/m³)"
                  />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="combined">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis yAxisId="left" domain={[26, 31]} className="text-xs" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 2]} className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="sst"
                    stroke="#0066cc"
                    strokeWidth={2}
                    dot={{ fill: "#0066cc", r: 4 }}
                    name="SST (°C)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="chlorophyll"
                    stroke="#00b38c"
                    strokeWidth={2}
                    dot={{ fill: "#00b38c", r: 4 }}
                    name="Chlorophyll-a (mg/m³)"
                  />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
