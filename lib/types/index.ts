// ============================================
// INCOIS Marine Fisheries Platform - Type Definitions
// ============================================

// ============================================
// Enums & Constants
// ============================================

export type Sector =
  | "GUJARAT"
  | "MAHARASHTRA"
  | "GOA"
  | "KARNATAKA"
  | "KERALA"
  | "TAMIL_NADU"
  | "ANDHRA_PRADESH"
  | "ODISHA"
  | "WEST_BENGAL"
  | "ANDAMAN"
  | "NICOBAR"
  | "LAKSHADWEEP";

export type AlertSeverity = "critical" | "high" | "medium" | "low" | "info";

export type AlertType =
  | "TSUNAMI"
  | "STORM_SURGE"
  | "CYCLONE"
  | "ALGAL_BLOOM"
  | "CORAL_BLEACHING"
  | "MARINE_HEATWAVE"
  | "HIGH_WAVE"
  | "PFZ"
  | "WEATHER";

export type Language =
  | "en"
  | "hi"
  | "te"
  | "ta"
  | "kn"
  | "mr"
  | "or"
  | "bn"
  | "ml"
  | "gu";

export type DataSource = "INCOIS" | "IMD" | "ISRO" | "NIOT" | "EXTERNAL";

// ============================================
// Core Data Models
// ============================================

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface GeoJSONFeature {
  type: "Feature";
  geometry: {
    type: "Point" | "Polygon" | "LineString" | "MultiPolygon";
    coordinates: number[] | number[][] | number[][][];
  };
  properties: Record<string, unknown>;
}

// ============================================
// PFZ Advisory
// ============================================

export interface FishSpecies {
  name: string;
  localName?: string;
  scientificName?: string;
  expectedCatch?: "high" | "medium" | "low";
}

export interface PFZZone {
  id: string;
  coordinates: Coordinates;
  boundingBox?: BoundingBox;
  depth?: number;
  distanceFromShore?: number;
  sst?: number;
  chlorophyll?: number;
}

export interface PFZAdvisory {
  id: string;
  sector: Sector;
  forecastDate: string;
  validFrom: string;
  validUpto: string;
  zones: PFZZone[];
  fishSpecies: FishSpecies[];
  remarks?: string;
  dataSource: DataSource;
  lastUpdated: string;
  language: Language;
  imageUrl?: string;
  pdfUrl?: string;
}

// ============================================
// Ocean Observations
// ============================================

export interface OceanObservation {
  id: string;
  location: Coordinates;
  timestamp: string;
  sst: number; // Sea Surface Temperature in °C
  sstAnomaly?: number;
  chlorophyllA?: number; // mg/m³
  salinity?: number; // PSU
  currentSpeed?: number; // m/s
  currentDirection?: number; // degrees
  waveHeight?: number; // meters
  wavePeriod?: number; // seconds
  windSpeed?: number; // m/s
  windDirection?: number; // degrees
  dataSource: DataSource;
}

export interface OceanObservationSummary {
  region: Sector;
  avgSST: number;
  minSST: number;
  maxSST: number;
  avgChlorophyll: number;
  observationCount: number;
  lastUpdated: string;
}

// ============================================
// Weather & Climate
// ============================================

export interface WeatherBulletin {
  id: string;
  region: Sector;
  alertType: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
  issuedAt: string;
  validFrom: string;
  validUpto: string;
  affectedAreas: string[];
  advisoryText: string;
  dataSource: DataSource;
  language: Language;
}

export interface ClimateIndex {
  name: string;
  value: number;
  anomaly?: number;
  status: "normal" | "watch" | "warning" | "alert";
  timestamp: string;
  description?: string;
}

export interface SSTAnomaly {
  region: string;
  value: number;
  threshold: number;
  status: "normal" | "warm" | "hot" | "cold" | "cool";
  timestamp: string;
}

// ============================================
// Alerts & Notifications
// ============================================

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  issuedAt: string;
  expiresAt?: string;
  affectedSectors: Sector[];
  coordinates?: Coordinates;
  boundingBox?: BoundingBox;
  actionRequired?: string;
  source: DataSource;
  isRead?: boolean;
  isDismissed?: boolean;
}

export interface NotificationPreference {
  userId: string;
  sectors: Sector[];
  alertTypes: AlertType[];
  minSeverity: AlertSeverity;
  enablePush: boolean;
  enableEmail: boolean;
  enableSMS: boolean;
  language: Language;
}

// ============================================
// User & Preferences
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user" | "fisherman" | "researcher";
  preferredLanguage: Language;
  preferredSectors: Sector[];
  createdAt: string;
  lastLogin?: string;
}

export interface UserPreferences {
  userId: string;
  theme: "light" | "dark" | "system";
  language: Language;
  defaultSector?: Sector;
  temperatureUnit: "C" | "F";
  mapStyle: "satellite" | "streets" | "ocean";
  showNotifications: boolean;
  autoRefreshInterval: number; // in seconds
}

// ============================================
// API Response Types
// ============================================

export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  timestamp: string;
}

export interface APIError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
}

// ============================================
// Dashboard & Analytics
// ============================================

export interface DashboardMetric {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  change?: number;
  changeType?: "increase" | "decrease" | "neutral";
  trend?: number[];
  icon?: string;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface RegionStats {
  sector: Sector;
  activePFZCount: number;
  activeAlerts: number;
  avgSST: number;
  lastAdvisory: string;
}

// ============================================
// Map Types
// ============================================

export interface MapLayer {
  id: string;
  name: string;
  type: "pfz" | "sst" | "chlorophyll" | "currents" | "alerts" | "boundaries";
  visible: boolean;
  opacity: number;
  data?: GeoJSONFeature[];
}

export interface MapViewport {
  center: Coordinates;
  zoom: number;
  bearing?: number;
  pitch?: number;
}

// ============================================
// Advisory Metadata
// ============================================

export interface AdvisoryMetadata {
  id: string;
  type: "PFZ" | "WEATHER" | "ALERT" | "BULLETIN";
  language: Language;
  region: Sector;
  dataSource: DataSource;
  createdAt: string;
  lastUpdated: string;
  version: number;
  isActive: boolean;
}
