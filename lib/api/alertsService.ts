import type {
  Alert,
  AlertSeverity,
  AlertType,
  Sector,
  WeatherBulletin,
  ClimateIndex,
  APIResponse,
} from "@/lib/types";

// Mock alerts data
const mockAlerts: Alert[] = [
  {
    id: "alert-1",
    type: "HIGH_WAVE",
    severity: "medium",
    title: "High Wave Alert - Bay of Bengal",
    message: "Wave heights of 2.5-3.5m expected along the Tamil Nadu and Andhra Pradesh coast.",
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    affectedSectors: ["TAMIL_NADU", "ANDHRA_PRADESH"],
    actionRequired: "Fishermen are advised not to venture into deep sea areas.",
    source: "INCOIS",
    isRead: false,
    isDismissed: false,
  },
  {
    id: "alert-2",
    type: "WEATHER",
    severity: "low",
    title: "Weather Advisory - Kerala Coast",
    message: "Light to moderate rainfall expected along the Kerala coast. Sea conditions favorable for fishing.",
    issuedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    affectedSectors: ["KERALA"],
    source: "INCOIS",
    isRead: true,
    isDismissed: false,
  },
  {
    id: "alert-3",
    type: "ALGAL_BLOOM",
    severity: "info",
    title: "Algal Bloom Detection - Gujarat",
    message: "Moderate algal bloom detected off the Gujarat coast. No immediate threat to marine life.",
    issuedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    affectedSectors: ["GUJARAT"],
    coordinates: { latitude: 21.5, longitude: 69.5 },
    source: "INCOIS",
    isRead: false,
    isDismissed: false,
  },
];

const mockWeatherBulletins: WeatherBulletin[] = [
  {
    id: "wb-1",
    region: "KERALA",
    alertType: "WEATHER",
    severity: "low",
    title: "Daily Weather Bulletin - Kerala",
    description: "Fair weather conditions expected. Light winds from southwest.",
    issuedAt: new Date().toISOString(),
    validFrom: new Date().toISOString(),
    validUpto: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    affectedAreas: ["Thiruvananthapuram", "Kollam", "Alappuzha", "Kochi", "Kozhikode"],
    advisoryText: "Favorable conditions for fishing activities. Small craft advisory in effect.",
    dataSource: "INCOIS",
    language: "en",
  },
  {
    id: "wb-2",
    region: "TAMIL_NADU",
    alertType: "HIGH_WAVE",
    severity: "medium",
    title: "Sea State Warning - Tamil Nadu",
    description: "Rough sea conditions expected. Wave heights 2-3 meters.",
    issuedAt: new Date().toISOString(),
    validFrom: new Date().toISOString(),
    validUpto: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(),
    affectedAreas: ["Chennai", "Cuddalore", "Nagapattinam", "Rameswaram"],
    advisoryText: "Fishermen are advised to exercise caution. Avoid deep sea fishing.",
    dataSource: "INCOIS",
    language: "en",
  },
];

const mockClimateIndices: ClimateIndex[] = [
  {
    name: "El Niño Index (ENSO)",
    value: 0.8,
    anomaly: 0.3,
    status: "watch",
    timestamp: new Date().toISOString(),
    description: "Weak El Niño conditions developing",
  },
  {
    name: "Indian Ocean Dipole (IOD)",
    value: -0.2,
    anomaly: -0.1,
    status: "normal",
    timestamp: new Date().toISOString(),
    description: "Neutral IOD conditions",
  },
  {
    name: "SST Anomaly (Bay of Bengal)",
    value: 0.5,
    status: "normal",
    timestamp: new Date().toISOString(),
    description: "Slightly warmer than normal",
  },
  {
    name: "SST Anomaly (Arabian Sea)",
    value: 0.3,
    status: "normal",
    timestamp: new Date().toISOString(),
    description: "Near normal conditions",
  },
];

export async function fetchAlerts(params?: {
  severity?: AlertSeverity;
  type?: AlertType;
  sector?: Sector;
}): Promise<APIResponse<Alert[]>> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    let alerts = [...mockAlerts];
    
    if (params?.severity) {
      alerts = alerts.filter((a) => a.severity === params.severity);
    }
    if (params?.type) {
      alerts = alerts.filter((a) => a.type === params.type);
    }
    if (params?.sector) {
      alerts = alerts.filter((a) => a.affectedSectors.includes(params.sector!));
    }
    
    return {
      success: true,
      data: alerts,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return {
      success: false,
      data: [],
      message: "Failed to fetch alerts",
      timestamp: new Date().toISOString(),
    };
  }
}

export async function fetchWeatherBulletins(params?: {
  region?: Sector;
}): Promise<APIResponse<WeatherBulletin[]>> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    let bulletins = [...mockWeatherBulletins];
    
    if (params?.region) {
      bulletins = bulletins.filter((b) => b.region === params.region);
    }
    
    return {
      success: true,
      data: bulletins,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching weather bulletins:", error);
    return {
      success: false,
      data: [],
      message: "Failed to fetch weather bulletins",
      timestamp: new Date().toISOString(),
    };
  }
}

export async function fetchClimateIndices(): Promise<APIResponse<ClimateIndex[]>> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 200));
    
    return {
      success: true,
      data: mockClimateIndices,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching climate indices:", error);
    return {
      success: false,
      data: [],
      message: "Failed to fetch climate indices",
      timestamp: new Date().toISOString(),
    };
  }
}

export function getActiveAlertCount(): number {
  return mockAlerts.filter((a) => !a.isDismissed).length;
}

export function getCriticalAlerts(): Alert[] {
  return mockAlerts.filter((a) => a.severity === "critical" || a.severity === "high");
}
