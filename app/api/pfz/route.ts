import { NextResponse } from "next/server";
import { fetchPFZAdvisories } from "@/lib/api/pfzService";
import type { Language } from "@/lib/types";

export const dynamic = "force-static";
export const revalidate = 21600;

export async function GET() {
  try {
    const language = "en" as Language;

    const response = await fetchPFZAdvisories({
      sector: undefined,
      date: undefined,
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
