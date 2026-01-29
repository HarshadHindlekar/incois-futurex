"use client";

import { Fish, Thermometer, Droplets, AlertTriangle, TrendingUp } from "lucide-react";
import { MetricsCard, OceanTrendsChart, RegionalStatsChart } from "@/components/dashboard";
import { AdvisoryCard, AlertCard } from "@/components/advisories";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { usePFZAdvisories, usePFZStats } from "@/lib/hooks/usePFZData";
import { useSSTData, useChlorophyllData, useObservationSummaries } from "@/lib/hooks/useObservations";
import { useAlerts, useAlertStats } from "@/lib/hooks/useAlerts";
import Link from "next/link";

export default function DashboardPage() {
  const { advisories, isLoading: pfzLoading } = usePFZAdvisories();
  const { stats: pfzStats } = usePFZStats();
  const { sst, isLoading: sstLoading } = useSSTData();
  const { chlorophyll, isLoading: chlorophyllLoading } = useChlorophyllData();
  const { summaries, isLoading: summariesLoading } = useObservationSummaries();
  const { alerts, isLoading: alertsLoading } = useAlerts();
  const { stats: alertStats } = useAlertStats();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marine Fisheries Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time ocean observations and fishing advisories
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/advisories">View All Advisories</Link>
          </Button>
          <Button variant="ocean" asChild>
            <Link href="/map">Open Map</Link>
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Active PFZ Zones"
          value={pfzStats.totalActive}
          unit="zones"
          change={12.5}
          changeType="increase"
          icon={Fish}
          iconColor="text-ocean-600"
          description="across all sectors"
          isLoading={pfzLoading}
        />
        <MetricsCard
          title="Ocean Temperature"
          value={sst.avg.toFixed(1)}
          unit="°C"
          change={sst.anomaly}
          changeType={sst.anomaly > 0 ? "increase" : sst.anomaly < 0 ? "decrease" : "neutral"}
          icon={Thermometer}
          iconColor="text-coral-500"
          description="avg SST"
          isLoading={sstLoading}
        />
        <MetricsCard
          title="Chlorophyll-a"
          value={chlorophyll.avg.toFixed(2)}
          unit="mg/m³"
          change={5.2}
          changeType="increase"
          icon={Droplets}
          iconColor="text-sea-600"
          description="productivity indicator"
          isLoading={chlorophyllLoading}
        />
        <MetricsCard
          title="Active Alerts"
          value={alertStats.total}
          change={alertStats.critical > 0 ? alertStats.critical : undefined}
          changeType={alertStats.critical > 0 ? "increase" : "neutral"}
          icon={AlertTriangle}
          iconColor={alertStats.critical > 0 ? "text-red-500" : "text-yellow-500"}
          description={alertStats.critical > 0 ? `${alertStats.critical} critical` : "all low priority"}
          isLoading={alertsLoading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Charts Section - Takes 2 columns */}
        <div className="space-y-6 lg:col-span-2">
          <OceanTrendsChart isLoading={sstLoading} />
          <RegionalStatsChart data={summaries} isLoading={summariesLoading} />
        </div>

        {/* Sidebar - Takes 1 column */}
        <div className="space-y-6">
          {/* Recent Advisories */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Recent Advisories</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/advisories">View all</Link>
                </Button>
              </div>
              <CardDescription>Latest PFZ advisories</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {pfzLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                      </div>
                    ))
                  ) : advisories.length > 0 ? (
                    advisories.slice(0, 4).map((advisory) => (
                      <AdvisoryCard key={advisory.id} advisory={advisory} compact />
                    ))
                  ) : (
                    <p className="text-center text-sm text-muted-foreground">
                      No active advisories
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Active Alerts */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Active Alerts</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/alerts">View all</Link>
                </Button>
              </div>
              <CardDescription>Warnings and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[280px] pr-4">
                <div className="space-y-3">
                  {alertsLoading ? (
                    Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                        <div className="h-3 w-full animate-pulse rounded bg-muted" />
                      </div>
                    ))
                  ) : alerts.length > 0 ? (
                    alerts.slice(0, 3).map((alert) => (
                      <AlertCard key={alert.id} alert={alert} />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <AlertTriangle className="mb-2 h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">No active alerts</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-muted-foreground">Data refreshed every 30 minutes</span>
            </div>
            <div className="flex gap-4 text-muted-foreground">
              <span>
                <strong className="text-foreground">{summaries.length}</strong> coastal sectors
              </span>
              <Separator orientation="vertical" className="h-4" />
              <span>
                <strong className="text-foreground">{pfzStats.totalZones}</strong> fishing zones
              </span>
              <Separator orientation="vertical" className="h-4" />
              <span>Source: INCOIS</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
