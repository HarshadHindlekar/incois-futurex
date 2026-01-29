// INCOIS API Configuration

export const API_CONFIG = {
  // Base URLs
  INCOIS_BASE_URL: process.env.NEXT_PUBLIC_INCOIS_API_URL || "https://incois.gov.in",
  ARCGIS_BASE_URL: process.env.NEXT_PUBLIC_ARCGIS_API_URL || "https://incois.gov.in/gisserver/rest/services",
  
  // Endpoints
  endpoints: {
    pfz: "/api/pfz",
    observations: "/INCOIS/RealtimeOceanObservations_WebGIS/MapServer",
    weather: "/api/weather/bulletin",
    climate: {
      sstAnomaly: "/api/climate/sst-anomaly",
      elNino: "/api/climate/elnino",
      iod: "/api/climate/iod",
    },
    alerts: "/api/alerts",
  },
  
  // Cache durations (in milliseconds)
  cache: {
    pfz: 6 * 60 * 60 * 1000, // 6 hours
    observations: 30 * 60 * 1000, // 30 minutes
    weather: 60 * 60 * 1000, // 1 hour
    climate: 24 * 60 * 60 * 1000, // 24 hours
    alerts: 5 * 60 * 1000, // 5 minutes
  },
  
  // SWR configuration
  swr: {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1 minute
    errorRetryCount: 3,
  },
};

export const SECTOR_COORDINATES: Record<string, { lat: number; lng: number; zoom: number }> = {
  GUJARAT: { lat: 21.5, lng: 70.0, zoom: 7 },
  MAHARASHTRA: { lat: 18.5, lng: 72.8, zoom: 7 },
  GOA: { lat: 15.3, lng: 74.0, zoom: 9 },
  KARNATAKA: { lat: 14.5, lng: 74.5, zoom: 7 },
  KERALA: { lat: 10.0, lng: 76.2, zoom: 7 },
  TAMIL_NADU: { lat: 11.0, lng: 79.5, zoom: 7 },
  ANDHRA_PRADESH: { lat: 16.0, lng: 81.0, zoom: 7 },
  ODISHA: { lat: 20.0, lng: 86.0, zoom: 7 },
  WEST_BENGAL: { lat: 22.0, lng: 88.5, zoom: 7 },
  ANDAMAN: { lat: 12.0, lng: 92.8, zoom: 7 },
  NICOBAR: { lat: 8.0, lng: 93.5, zoom: 8 },
  LAKSHADWEEP: { lat: 10.5, lng: 72.6, zoom: 8 },
};

export const MAP_BOUNDS = {
  india: {
    north: 28.0,
    south: 5.0,
    east: 98.0,
    west: 66.0,
  },
};
