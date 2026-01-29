"use client";

import useSWR from "swr";
import { fetchPFZAdvisories, fetchPFZAdvisoryById } from "@/lib/api/pfzService";
import type { PFZAdvisory, Sector, Language } from "@/lib/types";
import { API_CONFIG } from "@/lib/api/config";

const fetcher = async (params: { sector?: Sector; date?: string; language?: Language }) => {
  const response = await fetchPFZAdvisories(params);
  if (!response.success) {
    throw new Error(response.message || "Failed to fetch PFZ data");
  }
  return response.data;
};

export function usePFZAdvisories(params?: {
  sector?: Sector;
  date?: string;
  language?: Language;
}) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    ["pfz-advisories", params],
    () => fetcher(params || {}),
    {
      ...API_CONFIG.swr,
      refreshInterval: API_CONFIG.cache.pfz,
    }
  );

  return {
    advisories: data || [],
    isLoading,
    isValidating,
    isError: !!error,
    error,
    mutate,
  };
}

export function usePFZAdvisory(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? ["pfz-advisory", id] : null,
    async () => {
      if (!id) return null;
      const response = await fetchPFZAdvisoryById(id);
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch PFZ advisory");
      }
      return response.data;
    },
    API_CONFIG.swr
  );

  return {
    advisory: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

export function usePFZStats() {
  const { advisories, isLoading } = usePFZAdvisories();

  const stats = {
    totalActive: advisories.length,
    bySector: advisories.reduce((acc, adv) => {
      acc[adv.sector] = (acc[adv.sector] || 0) + 1;
      return acc;
    }, {} as Record<Sector, number>),
    totalZones: advisories.reduce((sum, adv) => sum + adv.zones.length, 0),
    avgSST:
      advisories.length > 0
        ? advisories.reduce((sum, adv) => {
            const zoneSST = adv.zones.reduce((s, z) => s + (z.sst || 0), 0) / adv.zones.length;
            return sum + zoneSST;
          }, 0) / advisories.length
        : 0,
  };

  return {
    stats,
    isLoading,
  };
}
