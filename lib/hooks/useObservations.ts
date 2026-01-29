"use client";

import useSWR from "swr";
import {
  fetchOceanObservations,
  fetchObservationSummaries,
  fetchSSTData,
  fetchChlorophyllData,
} from "@/lib/api/observationsService";
import type { Sector } from "@/lib/types";
import { API_CONFIG } from "@/lib/api/config";

export function useOceanObservations(params?: {
  sector?: Sector;
  bounds?: { north: number; south: number; east: number; west: number };
}) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    ["ocean-observations", params],
    async () => {
      const response = await fetchOceanObservations(params);
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch observations");
      }
      return response.data;
    },
    {
      ...API_CONFIG.swr,
      refreshInterval: API_CONFIG.cache.observations,
    }
  );

  return {
    observations: data || [],
    isLoading,
    isValidating,
    isError: !!error,
    error,
    mutate,
  };
}

export function useObservationSummaries() {
  const { data, error, isLoading, mutate } = useSWR(
    "observation-summaries",
    async () => {
      const response = await fetchObservationSummaries();
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch summaries");
      }
      return response.data;
    },
    {
      ...API_CONFIG.swr,
      refreshInterval: API_CONFIG.cache.observations,
    }
  );

  return {
    summaries: data || [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

export function useSSTData() {
  const { data, error, isLoading } = useSWR(
    "sst-data",
    async () => {
      const response = await fetchSSTData();
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch SST data");
      }
      return response.data;
    },
    {
      ...API_CONFIG.swr,
      refreshInterval: API_CONFIG.cache.observations,
    }
  );

  return {
    sst: data || { avg: 0, min: 0, max: 0, anomaly: 0 },
    isLoading,
    isError: !!error,
    error,
  };
}

export function useChlorophyllData() {
  const { data, error, isLoading } = useSWR(
    "chlorophyll-data",
    async () => {
      const response = await fetchChlorophyllData();
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch chlorophyll data");
      }
      return response.data;
    },
    {
      ...API_CONFIG.swr,
      refreshInterval: API_CONFIG.cache.observations,
    }
  );

  return {
    chlorophyll: data || { avg: 0, min: 0, max: 0 },
    isLoading,
    isError: !!error,
    error,
  };
}
