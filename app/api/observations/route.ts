import { NextRequest, NextResponse } from "next/server";
import { fetchOceanObservations, fetchObservationSummaries } from "@/lib/api/observationsService";
import type { Sector } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type") || "observations";
    const sector = searchParams.get("sector") as Sector | null;

    // Parse bounding box if provided
    const north = searchParams.get("north");
    const south = searchParams.get("south");
    const east = searchParams.get("east");
    const west = searchParams.get("west");

    let bounds: { north: number; south: number; east: number; west: number } | undefined;
    if (north && south && east && west) {
      bounds = {
        north: parseFloat(north),
        south: parseFloat(south),
        east: parseFloat(east),
        west: parseFloat(west),
      };
    }

    if (type === "summaries") {
      const response = await fetchObservationSummaries();
      return NextResponse.json(response, {
        headers: {
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
        },
      });
    }

    const response = await fetchOceanObservations({
      sector: sector || undefined,
      bounds,
    });

    if (!response.success) {
      return NextResponse.json(
        { error: response.message || "Failed to fetch observations" },
        { status: 500 }
      );
    }

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("Observations API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
