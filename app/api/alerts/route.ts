import { NextResponse } from "next/server";
import { fetchAlerts, fetchClimateIndices } from "@/lib/api/alertsService";

export const dynamic = "force-static";
export const revalidate = 300;

export async function GET() {
  try {
    const response = await fetchAlerts();

    if (!response.success) {
      return NextResponse.json(
        { error: response.message || "Failed to fetch alerts" },
        { status: 500 }
      );
    }

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Alerts API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
