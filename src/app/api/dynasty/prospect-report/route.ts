import { NextRequest, NextResponse } from "next/server";
import { prospectReports, ProspectReport } from "@/data/prospect-reports";

// GET prospect report by name
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const draftYear = searchParams.get("year");

  if (name) {
    // Find by name (fuzzy match)
    const normalizedSearch = name.toLowerCase().trim();
    const report = prospectReports.find(
      (r) => r.name.toLowerCase().includes(normalizedSearch) || normalizedSearch.includes(r.name.toLowerCase())
    );
    
    if (report) {
      return NextResponse.json({ report });
    }
    return NextResponse.json({ report: null, message: "Prospect not found" });
  }

  if (draftYear) {
    const year = parseInt(draftYear);
    const reports = prospectReports.filter((r) => r.draftYear === year);
    return NextResponse.json({ reports });
  }

  // Return all
  return NextResponse.json({ reports: prospectReports });
}
