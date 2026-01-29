"use client";

import { useState } from "react";
import { AlertCard } from "@/components/advisories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAlerts, useClimateIndices } from "@/lib/hooks/useAlerts";
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Thermometer,
  Waves,
} from "lucide-react";
import type { AlertSeverity } from "@/lib/types";

const severityFilters: { value: AlertSeverity | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Severities" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
  { value: "info", label: "Info" },
];

export default function AlertsPage() {
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | "ALL">("ALL");
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const { alerts, isLoading, mutate } = useAlerts(
    severityFilter !== "ALL" ? { severity: severityFilter } : undefined
  );
  const { indices, isLoading: indicesLoading } = useClimateIndices();

  const activeAlerts = alerts.filter((a) => !dismissedAlerts.includes(a.id));
  const criticalCount = activeAlerts.filter(
    (a) => a.severity === "critical" || a.severity === "high"
  ).length;

  const handleDismiss = (id: string) => {
    setDismissedAlerts((prev) => [...prev, id]);
  };

  const handleClearDismissed = () => {
    setDismissedAlerts([]);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alerts & Warnings</h1>
          <p className="text-muted-foreground">
            Marine weather alerts, warnings, and climate indices
          </p>
        </div>
        <div className="flex items-center gap-4">
          {criticalCount > 0 && (
            <Badge variant="destructive" className="gap-1 px-3 py-1">
              <AlertTriangle className="h-4 w-4" />
              {criticalCount} Critical
            </Badge>
          )}
          <Button variant="outline" onClick={() => mutate()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Climate Indices */}
      <div className="grid gap-4 md:grid-cols-4">
        {indicesLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="py-4">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  <div className="mt-2 h-6 w-16 animate-pulse rounded bg-muted" />
                </CardContent>
              </Card>
            ))
          : indices.map((index) => (
              <Card key={index.name}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{index.name}</p>
                      <p className="text-2xl font-bold">{index.value.toFixed(2)}</p>
                    </div>
                    <div
                      className={`rounded-full p-2 ${
                        index.status === "normal"
                          ? "bg-green-100 text-green-600 dark:bg-green-900/30"
                          : index.status === "watch"
                          ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30"
                          : "bg-red-100 text-red-600 dark:bg-red-900/30"
                      }`}
                    >
                      {index.name.includes("SST") ? (
                        <Thermometer className="h-5 w-5" />
                      ) : (
                        <Waves className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                  <Badge
                    variant={
                      index.status === "normal"
                        ? "success"
                        : index.status === "watch"
                        ? "medium"
                        : "critical"
                    }
                    className="mt-2"
                  >
                    {index.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Alerts Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Active Alerts
            </CardTitle>
            <div className="flex gap-2">
              <Select
                value={severityFilter}
                onValueChange={(v) => setSeverityFilter(v as AlertSeverity | "ALL")}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter by severity" />
                </SelectTrigger>
                <SelectContent>
                  {severityFilters.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {dismissedAlerts.length > 0 && (
                <Button variant="ghost" size="sm" onClick={handleClearDismissed}>
                  Show dismissed ({dismissedAlerts.length})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All ({activeAlerts.length})</TabsTrigger>
              <TabsTrigger value="critical">
                Critical ({activeAlerts.filter((a) => a.severity === "critical").length})
              </TabsTrigger>
              <TabsTrigger value="weather">Weather</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="p-4">
                      <div className="space-y-2">
                        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
                        <div className="h-12 w-full animate-pulse rounded bg-muted" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : activeAlerts.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {activeAlerts.map((alert) => (
                    <AlertCard key={alert.id} alert={alert} onDismiss={handleDismiss} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle className="mb-3 h-12 w-12 text-green-500" />
                  <p className="text-lg font-medium">All Clear</p>
                  <p className="text-sm text-muted-foreground">
                    No active alerts at this time
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="critical" className="mt-4">
              {activeAlerts.filter((a) => a.severity === "critical").length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {activeAlerts
                    .filter((a) => a.severity === "critical")
                    .map((alert) => (
                      <AlertCard key={alert.id} alert={alert} onDismiss={handleDismiss} />
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle className="mb-3 h-12 w-12 text-green-500" />
                  <p className="text-lg font-medium">No Critical Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    All systems operating normally
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="weather" className="mt-4">
              {activeAlerts.filter((a) => a.type === "WEATHER" || a.type === "HIGH_WAVE")
                .length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {activeAlerts
                    .filter((a) => a.type === "WEATHER" || a.type === "HIGH_WAVE")
                    .map((alert) => (
                      <AlertCard key={alert.id} alert={alert} onDismiss={handleDismiss} />
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle className="mb-3 h-12 w-12 text-green-500" />
                  <p className="text-lg font-medium">No Weather Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Fair weather conditions
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
