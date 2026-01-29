import type {
  PFZAdvisory,
  Sector,
  Language,
  APIResponse,
  PaginatedResponse,
} from "@/lib/types";
import { API_CONFIG } from "./config";

// Mock data for development - Replace with actual API calls in production
const mockPFZData: PFZAdvisory[] = [
  {
    id: "pfz-kerala-001",
    sector: "KERALA",
    forecastDate: new Date().toISOString(),
    validFrom: new Date().toISOString(),
    validUpto: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    zones: [
      {
        id: "zone-1",
        coordinates: { latitude: 9.5, longitude: 75.8 },
        depth: 50,
        distanceFromShore: 25,
        sst: 28.5,
        chlorophyll: 0.8,
      },
      {
        id: "zone-2",
        coordinates: { latitude: 10.2, longitude: 75.5 },
        depth: 40,
        distanceFromShore: 20,
        sst: 29.0,
        chlorophyll: 1.2,
      },
    ],
    fishSpecies: [
      { name: "Sardine", localName: "ചാള", expectedCatch: "high" },
      { name: "Mackerel", localName: "അയല", expectedCatch: "medium" },
      { name: "Tuna", localName: "ചൂര", expectedCatch: "low" },
    ],
    remarks: "Good fishing conditions expected. Moderate seas.",
    dataSource: "INCOIS",
    lastUpdated: new Date().toISOString(),
    language: "en",
  },
  {
    id: "pfz-tamil-nadu-001",
    sector: "TAMIL_NADU",
    forecastDate: new Date().toISOString(),
    validFrom: new Date().toISOString(),
    validUpto: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    zones: [
      {
        id: "zone-1",
        coordinates: { latitude: 11.5, longitude: 80.2 },
        depth: 60,
        distanceFromShore: 30,
        sst: 29.2,
        chlorophyll: 0.9,
      },
    ],
    fishSpecies: [
      { name: "Pomfret", localName: "வாவல்", expectedCatch: "high" },
      { name: "Seer Fish", localName: "வஞ்சிரம்", expectedCatch: "medium" },
    ],
    remarks: "Favorable conditions for fishing.",
    dataSource: "INCOIS",
    lastUpdated: new Date().toISOString(),
    language: "en",
  },
  {
    id: "pfz-andhra-001",
    sector: "ANDHRA_PRADESH",
    forecastDate: new Date().toISOString(),
    validFrom: new Date().toISOString(),
    validUpto: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    zones: [
      {
        id: "zone-1",
        coordinates: { latitude: 16.5, longitude: 82.5 },
        depth: 45,
        distanceFromShore: 22,
        sst: 28.8,
        chlorophyll: 1.0,
      },
    ],
    fishSpecies: [
      { name: "Ribbon Fish", localName: "సవర", expectedCatch: "high" },
      { name: "Prawns", localName: "రొయ్యలు", expectedCatch: "medium" },
    ],
    remarks: "Good chlorophyll concentration indicates high fish availability.",
    dataSource: "INCOIS",
    lastUpdated: new Date().toISOString(),
    language: "en",
  },
  {
    id: "pfz-gujarat-001",
    sector: "GUJARAT",
    forecastDate: new Date().toISOString(),
    validFrom: new Date().toISOString(),
    validUpto: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    zones: [
      {
        id: "zone-1",
        coordinates: { latitude: 21.2, longitude: 69.8 },
        depth: 35,
        distanceFromShore: 18,
        sst: 27.5,
        chlorophyll: 1.5,
      },
    ],
    fishSpecies: [
      { name: "Bombay Duck", localName: "બોમ્બિલ", expectedCatch: "high" },
      { name: "Pomfret", localName: "પાપલેટ", expectedCatch: "medium" },
    ],
    remarks: "High productivity zone identified.",
    dataSource: "INCOIS",
    lastUpdated: new Date().toISOString(),
    language: "en",
  },
];

export async function fetchPFZAdvisories(params?: {
  sector?: Sector;
  date?: string;
  language?: Language;
}): Promise<APIResponse<PFZAdvisory[]>> {
  try {
    // In production, replace with actual API call:
    // const url = new URL(`${API_CONFIG.INCOIS_BASE_URL}${API_CONFIG.endpoints.pfz}`);
    // if (params?.sector) url.searchParams.set("sector", params.sector);
    // if (params?.date) url.searchParams.set("date", params.date);
    // const response = await fetch(url.toString());
    // const data = await response.json();
    
    // Mock implementation for development
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
    
    let advisories = [...mockPFZData];
    
    if (params?.sector) {
      advisories = advisories.filter((a) => a.sector === params.sector);
    }
    
    return {
      success: true,
      data: advisories,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching PFZ advisories:", error);
    return {
      success: false,
      data: [],
      message: "Failed to fetch PFZ advisories",
      timestamp: new Date().toISOString(),
    };
  }
}

export async function fetchPFZAdvisoryById(id: string): Promise<APIResponse<PFZAdvisory | null>> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const advisory = mockPFZData.find((a) => a.id === id);
    
    return {
      success: !!advisory,
      data: advisory || null,
      message: advisory ? undefined : "Advisory not found",
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching PFZ advisory:", error);
    return {
      success: false,
      data: null,
      message: "Failed to fetch PFZ advisory",
      timestamp: new Date().toISOString(),
    };
  }
}

export async function fetchPFZHistory(params: {
  sector: Sector;
  startDate: string;
  endDate: string;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedResponse<PFZAdvisory>> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const advisories = mockPFZData.filter((a) => a.sector === params.sector);
    
    return {
      success: true,
      data: advisories,
      pagination: {
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        totalItems: advisories.length,
        totalPages: Math.ceil(advisories.length / (params.pageSize || 10)),
      },
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching PFZ history:", error);
    return {
      success: false,
      data: [],
      pagination: {
        page: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 0,
      },
      timestamp: new Date().toISOString(),
    };
  }
}

export function getActivePFZCount(): number {
  return mockPFZData.length;
}

export function getPFZBySector(sector: Sector): PFZAdvisory | undefined {
  return mockPFZData.find((a) => a.sector === sector);
}
