import { NextResponse } from "next/server";
import { getUser, isAdmin } from "@/lib/auth";
import { getPriResearch } from "@/lib/pri-research";

// CSV of the opted-in calibrations, admins only (same check as the page).
export async function GET() {
  const user = await getUser();
  if (!user || !isAdmin(user.email)) return new NextResponse("Not found", { status: 404 });

  const { rows } = await getPriResearch();
  const cell = (v: unknown) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [
    "id,date,rankings,dimScores,pairwiseChoices",
    ...rows.map((r) => [r.id, r.created_at, JSON.stringify(r.rankings), JSON.stringify(r.dim_scores), JSON.stringify(r.pairwise_choices)].map(cell).join(",")),
  ].join("\n");
  return new NextResponse(csv, {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="pri-research-data.csv"' },
  });
}
