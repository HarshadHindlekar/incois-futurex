import { NextResponse } from "next/server";
import { fetchOceanObservations, fetchObservationSummaries } from "@/lib/api/observationsService";

export const dynamic = "force-static";
export const revalidate = 1800;

export async function GET() {
  try {
    const response = await fetchOceanObservations({ sector: undefined, bounds: undefined });

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
