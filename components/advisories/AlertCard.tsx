"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Waves,
  CloudLightning,
  Thermometer,
  Info,
  Clock,
  MapPin,
  X,
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import type { Alert, AlertSeverity, AlertType } from "@/lib/types";

interface AlertCardProps {
  alert: Alert;
  onDismiss?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

const severityConfig: Record<AlertSeverity, { variant: "critical" | "high" | "medium" | "low" | "info"; label: string }> = {
  critical: { variant: "critical", label: "Critical" },
  high: { variant: "high", label: "High" },
  medium: { variant: "medium", label: "Medium" },
  low: { variant: "low", label: "Low" },
  info: { variant: "info", label: "Info" },
};

const alertTypeIcons: Record<AlertType, React.ReactNode> = {
  TSUNAMI: <Waves className="h-5 w-5" />,
  STORM_SURGE: <Waves className="h-5 w-5" />,
  CYCLONE: <CloudLightning className="h-5 w-5" />,
  ALGAL_BLOOM: <AlertTriangle className="h-5 w-5" />,
  CORAL_BLEACHING: <Thermometer className="h-5 w-5" />,
  MARINE_HEATWAVE: <Thermometer className="h-5 w-5" />,
  HIGH_WAVE: <Waves className="h-5 w-5" />,
  PFZ: <Info className="h-5 w-5" />,
  WEATHER: <CloudLightning className="h-5 w-5" />,
};

const sectorDisplayNames: Record<string, string> = {
  GUJARAT: "Gujarat",
  MAHARASHTRA: "Maharashtra",
  GOA: "Goa",
  KARNATAKA: "Karnataka",
  KERALA: "Kerala",
  TAMIL_NADU: "Tamil Nadu",
  ANDHRA_PRADESH: "Andhra Pradesh",
  ODISHA: "Odisha",
  WEST_BENGAL: "West Bengal",
  ANDAMAN: "Andaman",
  NICOBAR: "Nicobar",
  LAKSHADWEEP: "Lakshadweep",
};

export function AlertCard({ alert, onDismiss, onViewDetails }: AlertCardProps) {
  const config = severityConfig[alert.severity];
  const icon = alertTypeIcons[alert.type] || <AlertTriangle className="h-5 w-5" />;
  const isExpired = alert.expiresAt && new Date(alert.expiresAt) < new Date();

  return (
    <Card
      className={`relative border-l-4 ${
        alert.severity === "critical"
          ? "border-l-red-600"
          : alert.severity === "high"
          ? "border-l-orange-500"
          : alert.severity === "medium"
          ? "border-l-yellow-500"
          : "border-l-blue-500"
      } ${isExpired ? "opacity-60" : ""}`}
    >
      {onDismiss && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-6 w-6"
          onClick={() => onDismiss(alert.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <div
            className={`rounded-full p-2 ${
              alert.severity === "critical"
                ? "bg-red-100 text-red-600 dark:bg-red-900/30"
                : alert.severity === "high"
                ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30"
                : alert.severity === "medium"
                ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30"
                : "bg-blue-100 text-blue-600 dark:bg-blue-900/30"
            }`}
          >
            {icon}
          </div>
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <Badge variant={config.variant}>{config.label}</Badge>
              {isExpired && <Badge variant="secondary">Expired</Badge>}
            </div>
            <CardTitle className="text-base">{alert.title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-sm text-muted-foreground">{alert.message}</p>

        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" />
            <span>Issued: {formatDateTime(alert.issuedAt)}</span>
          </div>

          {alert.expiresAt && (
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              <span>Expires: {formatDateTime(alert.expiresAt)}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5" />
            <span>
              {alert.affectedSectors.map((s) => sectorDisplayNames[s] || s).join(", ")}
            </span>
          </div>
        </div>

        {alert.actionRequired && (
          <div className="mt-3 rounded-md bg-muted p-2 text-sm">
            <strong>Action Required:</strong> {alert.actionRequired}
          </div>
        )}

        {onViewDetails && (
          <Button
            variant="link"
            size="sm"
            className="mt-2 h-auto p-0"
            onClick={() => onViewDetails(alert.id)}
          >
            View Details →
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
