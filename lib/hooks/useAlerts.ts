"use client";

import useSWR from "swr";
import {
  fetchAlerts,
  fetchWeatherBulletins,
  fetchClimateIndices,
} from "@/lib/api/alertsService";
import type { AlertSeverity, AlertType, Sector } from "@/lib/types";
import { API_CONFIG } from "@/lib/api/config";

export function useAlerts(params?: {
  severity?: AlertSeverity;
  type?: AlertType;
  sector?: Sector;
}) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    ["alerts", params],
    async () => {
      const response = await fetchAlerts(params);
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch alerts");
      }
      return response.data;
    },
    {
      ...API_CONFIG.swr,
      refreshInterval: API_CONFIG.cache.alerts,
    }
  );

  return {
    alerts: data || [],
    isLoading,
    isValidating,
    isError: !!error,
    error,
    mutate,
  };
}

export function useWeatherBulletins(region?: Sector) {
  const { data, error, isLoading, mutate } = useSWR(
    ["weather-bulletins", region],
    async () => {
      const response = await fetchWeatherBulletins(region ? { region } : undefined);
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch weather bulletins");
      }
      return response.data;
    },
    {
      ...API_CONFIG.swr,
      refreshInterval: API_CONFIG.cache.weather,
    }
  );

  return {
    bulletins: data || [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

export function useClimateIndices() {
  const { data, error, isLoading } = useSWR(
    "climate-indices",
    async () => {
      const response = await fetchClimateIndices();
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch climate indices");
      }
      return response.data;
    },
    {
      ...API_CONFIG.swr,
      refreshInterval: API_CONFIG.cache.climate,
    }
  );

  return {
    indices: data || [],
    isLoading,
    isError: !!error,
    error,
  };
}

export function useAlertStats() {
  const { alerts, isLoading } = useAlerts();

  const stats = {
    total: alerts.length,
    bySeverity: alerts.reduce((acc, alert) => {
      acc[alert.severity] = (acc[alert.severity] || 0) + 1;
      return acc;
    }, {} as Record<AlertSeverity, number>),
    byType: alerts.reduce((acc, alert) => {
      acc[alert.type] = (acc[alert.type] || 0) + 1;
      return acc;
    }, {} as Record<AlertType, number>),
    unread: alerts.filter((a) => !a.isRead).length,
    critical: alerts.filter((a) => a.severity === "critical" || a.severity === "high").length,
  };

  return {
    stats,
    isLoading,
  };
}
