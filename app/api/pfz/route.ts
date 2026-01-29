import { NextRequest, NextResponse } from "next/server";
import { fetchPFZAdvisories } from "@/lib/api/pfzService";
import type { Sector, Language } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sector = searchParams.get("sector") as Sector | null;
    const date = searchParams.get("date");
    const language = (searchParams.get("lang") || "en") as Language;

    const response = await fetchPFZAdvisories({
      sector: sector || undefined,
      date: date || undefined,
      language,
    });

    if (!response.success) {
      return NextResponse.json(
        { error: response.message || "Failed to fetch PFZ advisories" },
        { status: 500 }
      );
    }

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("PFZ API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
