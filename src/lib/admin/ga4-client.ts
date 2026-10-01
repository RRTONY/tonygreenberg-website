import { getGoogleAccessToken } from "@/lib/admin/google-auth";

// Ported from ramprate-ui (2026-10-02). Reads the tonygreenberg.com GA4
// property with the same service account as Search Console (google-auth.ts).

const GA4_API_BASE = "https://analyticsdata.googleapis.com/v1beta";
const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";

interface RunReportResponse {
  dimensionHeaders?: Array<{ name: string }>;
  metricHeaders?: Array<{ name: string }>;
  rows?: Array<{
    dimensionValues?: Array<{ value: string }>;
    metricValues?: Array<{ value: string }>;
  }>;
}

async function runReport(
  propertyId: string,
  body: Record<string, unknown>,
): Promise<RunReportResponse> {
  const accessToken = await getGoogleAccessToken(SCOPE);
  const res = await fetch(
    `${GA4_API_BASE}/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof data?.error?.message === "string"
        ? data.error.message
        : `GA4 Data API error (${res.status})`,
    );
  }
  return data as RunReportResponse;
}

export interface AnalyticsSummary {
  propertyId: string;
  days: number;
  totals: {
    sessions: number;
    activeUsers: number;
    screenPageViews: number;
  };
  topPages: Array<{ path: string; views: number }>;
}

export async function getAnalyticsSummary(days = 7): Promise<AnalyticsSummary> {
  const propertyId = process.env.GA4_PROPERTY_ID_TONYGREENBERG;
  if (!propertyId) {
    throw new Error("GA4_PROPERTY_ID_TONYGREENBERG is not configured");
  }
  const dateRanges = [{ startDate: `${days}daysAgo`, endDate: "today" }];

  const [totalsReport, pagesReport] = await Promise.all([
    runReport(propertyId, {
      dateRanges,
      metrics: [
        { name: "sessions" },
        { name: "activeUsers" },
        { name: "screenPageViews" },
      ],
    }),
    runReport(propertyId, {
      dateRanges,
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: "10",
    }),
  ]);

  const totalsRow = totalsReport.rows?.[0]?.metricValues ?? [];
  const topPages = (pagesReport.rows ?? []).map((row) => ({
    path: row.dimensionValues?.[0]?.value ?? "",
    views: Number(row.metricValues?.[0]?.value ?? 0),
  }));

  return {
    propertyId,
    days,
    totals: {
      sessions: Number(totalsRow[0]?.value ?? 0),
      activeUsers: Number(totalsRow[1]?.value ?? 0),
      screenPageViews: Number(totalsRow[2]?.value ?? 0),
    },
    topPages,
  };
}
