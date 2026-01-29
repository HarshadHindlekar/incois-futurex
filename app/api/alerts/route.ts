import { NextRequest, NextResponse } from "next/server";
import { fetchAlerts, fetchClimateIndices } from "@/lib/api/alertsService";
import type { AlertSeverity, AlertType, Sector } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type") || "alerts";
    const severity = searchParams.get("severity") as AlertSeverity | null;
    const alertType = searchParams.get("alertType") as AlertType | null;
    const sector = searchParams.get("sector") as Sector | null;

    if (type === "climate") {
      const response = await fetchClimateIndices();
      return NextResponse.json(response, {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=172800",
        },
      });
    }

    const response = await fetchAlerts({
      severity: severity || undefined,
      type: alertType || undefined,
      sector: sector || undefined,
    });

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
