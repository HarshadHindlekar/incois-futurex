import type {
  OceanObservation,
  OceanObservationSummary,
  Sector,
  APIResponse,
} from "@/lib/types";

// Mock ocean observation data for development
const mockObservations: OceanObservation[] = [
  {
    id: "obs-1",
    location: { latitude: 10.0, longitude: 76.0 },
    timestamp: new Date().toISOString(),
    sst: 28.5,
    sstAnomaly: 0.3,
    chlorophyllA: 0.85,
    salinity: 34.5,
    currentSpeed: 0.5,
    currentDirection: 45,
    waveHeight: 1.2,
    wavePeriod: 8,
    windSpeed: 12,
    windDirection: 225,
    dataSource: "INCOIS",
  },
  {
    id: "obs-2",
    location: { latitude: 13.0, longitude: 80.5 },
    timestamp: new Date().toISOString(),
    sst: 29.2,
    sstAnomaly: 0.5,
    chlorophyllA: 0.72,
    salinity: 33.8,
    currentSpeed: 0.4,
    currentDirection: 90,
    waveHeight: 0.8,
    wavePeriod: 6,
    windSpeed: 8,
    windDirection: 180,
    dataSource: "INCOIS",
  },
  {
    id: "obs-3",
    location: { latitude: 16.5, longitude: 82.0 },
    timestamp: new Date().toISOString(),
    sst: 28.8,
    sstAnomaly: 0.2,
    chlorophyllA: 1.1,
    salinity: 34.2,
    currentSpeed: 0.6,
    currentDirection: 60,
    waveHeight: 1.5,
    wavePeriod: 10,
    windSpeed: 15,
    windDirection: 270,
    dataSource: "INCOIS",
  },
  {
    id: "obs-4",
    location: { latitude: 21.0, longitude: 70.0 },
    timestamp: new Date().toISOString(),
    sst: 27.5,
    sstAnomaly: -0.3,
    chlorophyllA: 1.5,
    salinity: 35.0,
    currentSpeed: 0.3,
    currentDirection: 120,
    waveHeight: 1.0,
    wavePeriod: 7,
    windSpeed: 10,
    windDirection: 315,
    dataSource: "INCOIS",
  },
];

const mockSummaries: OceanObservationSummary[] = [
  {
    region: "KERALA",
    avgSST: 28.5,
    minSST: 27.8,
    maxSST: 29.2,
    avgChlorophyll: 0.85,
    observationCount: 45,
    lastUpdated: new Date().toISOString(),
  },
  {
    region: "TAMIL_NADU",
    avgSST: 29.2,
    minSST: 28.5,
    maxSST: 30.1,
    avgChlorophyll: 0.72,
    observationCount: 38,
    lastUpdated: new Date().toISOString(),
  },
  {
    region: "ANDHRA_PRADESH",
    avgSST: 28.8,
    minSST: 27.5,
    maxSST: 29.8,
    avgChlorophyll: 1.1,
    observationCount: 42,
    lastUpdated: new Date().toISOString(),
  },
  {
    region: "GUJARAT",
    avgSST: 27.5,
    minSST: 26.2,
    maxSST: 28.5,
    avgChlorophyll: 1.5,
    observationCount: 35,
    lastUpdated: new Date().toISOString(),
  },
  {
    region: "MAHARASHTRA",
    avgSST: 28.0,
    minSST: 27.0,
    maxSST: 29.0,
    avgChlorophyll: 0.95,
    observationCount: 30,
    lastUpdated: new Date().toISOString(),
  },
  {
    region: "ODISHA",
    avgSST: 28.3,
    minSST: 27.2,
    maxSST: 29.5,
    avgChlorophyll: 1.2,
    observationCount: 28,
    lastUpdated: new Date().toISOString(),
  },
  {
    region: "WEST_BENGAL",
    avgSST: 28.1,
    minSST: 27.0,
    maxSST: 29.3,
    avgChlorophyll: 1.3,
    observationCount: 25,
    lastUpdated: new Date().toISOString(),
  },
  {
    region: "KARNATAKA",
    avgSST: 28.7,
    minSST: 27.5,
    maxSST: 29.8,
    avgChlorophyll: 0.88,
    observationCount: 22,
    lastUpdated: new Date().toISOString(),
  },
];

export async function fetchOceanObservations(params?: {
  sector?: Sector;
  bounds?: { north: number; south: number; east: number; west: number };
}): Promise<APIResponse<OceanObservation[]>> {
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    let observations = [...mockObservations];
    
    if (params?.bounds) {
      observations = observations.filter(
        (obs) =>
          obs.location.latitude >= params.bounds!.south &&
          obs.location.latitude <= params.bounds!.north &&
          obs.location.longitude >= params.bounds!.west &&
          obs.location.longitude <= params.bounds!.east
      );
    }
    
    return {
      success: true,
      data: observations,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching ocean observations:", error);
    return {
      success: false,
      data: [],
      message: "Failed to fetch ocean observations",
      timestamp: new Date().toISOString(),
    };
  }
}

export async function fetchObservationSummaries(): Promise<APIResponse<OceanObservationSummary[]>> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    return {
      success: true,
      data: mockSummaries,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching observation summaries:", error);
    return {
      success: false,
      data: [],
      message: "Failed to fetch observation summaries",
      timestamp: new Date().toISOString(),
    };
  }
}

export async function fetchSSTData(): Promise<APIResponse<{ avg: number; min: number; max: number; anomaly: number }>> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 200));
    
    return {
      success: true,
      data: {
        avg: 28.5,
        min: 26.2,
        max: 30.1,
        anomaly: 0.3,
      },
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching SST data:", error);
    return {
      success: false,
      data: { avg: 0, min: 0, max: 0, anomaly: 0 },
      message: "Failed to fetch SST data",
      timestamp: new Date().toISOString(),
    };
  }
}

export async function fetchChlorophyllData(): Promise<APIResponse<{ avg: number; min: number; max: number }>> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 200));
    
    return {
      success: true,
      data: {
        avg: 1.02,
        min: 0.45,
        max: 2.5,
      },
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching chlorophyll data:", error);
    return {
      success: false,
      data: { avg: 0, min: 0, max: 0 },
      message: "Failed to fetch chlorophyll data",
      timestamp: new Date().toISOString(),
    };
  }
}

export function getAverageSST(): number {
  const total = mockObservations.reduce((sum, obs) => sum + obs.sst, 0);
  return total / mockObservations.length;
}

export function getAverageChlorophyll(): number {
  const total = mockObservations.reduce((sum, obs) => sum + (obs.chlorophyllA || 0), 0);
  return total / mockObservations.length;
}
