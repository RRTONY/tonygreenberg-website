import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { getUser, isAdmin } from "@/lib/auth";
import { getPriResearch } from "@/lib/pri-research";
import { formatPostDate } from "@/lib/format-post-date";

// Admin-only PRI research dashboard, ported from legacy
// client/src/pages/pri/PriResearch.tsx. Admins are the emails in
// ADMIN_EMAILS; everyone else sees live's "Access Denied" screen. Data comes
// from /pri-calibration (anonymous; opt-ins listed here).
export const metadata: Metadata = {
  title: "PRI Research Data",
  robots: { index: false, follow: false },
  alternates: { canonical: "/pri-research" },
};

export default async function PriResearchPage() {
  const user = await getUser();

  if (!user || !isAdmin(user.email)) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#0A0A10] px-6 text-center text-[#F4F0E8]">
        <h1 className="font-heading text-3xl">Access Denied</h1>
        <p className="text-[#F4F0E8]/60">This page requires admin access.</p>
        {!user && (
          <Link href="/login?next=/pri-research" className="font-mono text-sm text-[#C084FC] underline underline-offset-4">
            Sign in
          </Link>
        )}
        <Link href="/pri-efficacy" className="inline-flex items-center gap-1.5 text-[#C084FC]">
          <ArrowLeft aria-hidden="true" className="size-4" />
          View Public Efficacy Report
        </Link>
      </div>
    );
  }

  const { total, optIn, rows } = await getPriResearch();
  const stat = "rounded-lg border border-[#6B21A8]/25 bg-[#6B21A8]/8 p-4 text-center";

  return (
    <div className="min-h-screen bg-[#0A0A10] px-6 py-8 text-[#F4F0E8]">
      <div className="mx-auto max-w-250">
        <header className="mb-8">
          <p className="mb-2 text-[.7rem] tracking-[.15em] text-[#C084FC] uppercase">Admin · Research Dashboard</p>
          <h1 className="font-heading text-[2rem]">PRI Research Data</h1>
          <p className="mt-2 text-[#F4F0E8]/60">
            Anonymized calibration data from opt-in participants. {total} total calibrations, {optIn} research opt-ins.
          </p>
        </header>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className={stat}>
            <p className="text-[2rem] font-extrabold text-[#C084FC]">{total}</p>
            <p className="text-xs text-[#F4F0E8]/60">Total Calibrations</p>
          </div>
          <div className={stat}>
            <p className="text-[2rem] font-extrabold text-[#10B981]">{optIn}</p>
            <p className="text-xs text-[#F4F0E8]/60">Research Opt-Ins</p>
          </div>
          <div className={stat}>
            <p className="text-[2rem] font-extrabold text-[#F59E0B]">{total ? `${Math.round((optIn / total) * 100)}%` : "—"}</p>
            <p className="text-xs text-[#F4F0E8]/60">Opt-In Rate</p>
          </div>
        </div>

        <section className="rounded-xl border border-[#F4F0E8]/8 bg-[#F4F0E8]/3 p-6">
          <h2 className="mb-4 font-heading text-xl">Anonymized Research Entries</h2>
          {rows.length === 0 ? (
            <p className="text-[#F4F0E8]/60">No research opt-in data available yet.</p>
          ) : (
            <div className="relative overflow-x-auto" tabIndex={0} role="region" aria-label="Table (scrolls sideways)">
              <table className="w-full border-collapse text-[.8rem]">
                <thead>
                  <tr className="border-b border-[#F4F0E8]/15 text-left text-[#F4F0E8]/60">
                    <th scope="col" className="p-2">ID</th>
                    <th scope="col" className="p-2">Date</th>
                    <th scope="col" className="p-2">Rankings</th>
                    <th scope="col" className="p-2">Dim Scores</th>
                    <th scope="col" className="p-2">Pairwise Choices</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-b border-[#F4F0E8]/5 text-[#F4F0E8]/70">
                      <td className="p-2">#{r.id}</td>
                      <td className="p-2 whitespace-nowrap">{formatPostDate(r.created_at, "short")}</td>
                      <td className="p-2">{r.rankings.join(" > ")}</td>
                      <td className="p-2">{Object.entries(r.dim_scores).map(([k, v]) => `${k}:${v}`).join(", ")}</td>
                      <td className="p-2">{r.pairwise_choices.length} pairs</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="mt-6 flex items-center justify-between">
          <Link href="/pri-efficacy" className="inline-flex items-center gap-1.5 text-sm text-[#C084FC]">
            <ArrowLeft aria-hidden="true" className="size-4" />
            Public Efficacy Report
          </Link>
          <a href="/pri-research/export" className="inline-flex min-h-10 items-center gap-2 rounded-md bg-[#6B21A8] px-4 text-sm">
            <Download aria-hidden="true" className="size-4" />
            Export CSV
          </a>
        </div>
      </div>
    </div>
  );
}
