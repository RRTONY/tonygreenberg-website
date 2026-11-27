"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Marked } from "marked";
import { Loader2, ArrowLeft, Download } from "lucide-react";
import { FloatingShare } from "@/components/aqueous/share-button";
import { Button } from "@/components/aqueous/ui";
import { getReport, type AqueousReport } from "@/app/aqueous/actions";
import { aq } from "@/lib/content/aqueous/nav";

// Ported from the Aqueous app's client/src/pages/ReportViewer.tsx (2026-11-24): shows a member's
// personalized AWI report. trpc reports.get → getReport. The app wrote reports in the background
// and polled every 3s; here an unfinished report (pending, failed, or a stale "generating") is
// written by POST /api/aqueous/reports/<id>/generate, and the text shows as it streams in. When
// another tab is already writing it (409), the page polls getReport every 3s as the app did.
// Changes from the app:
// - Markdown: the app used `streamdown`, which this site doesn't have; `marked` renders it here, with
//   all HTML in the model's text escaped first and links limited to http(s)/mailto/on-site paths, so
//   no raw model HTML ever reaches the page. The app's `prose` classes did nothing (no typography
//   plugin was loaded); the descendant classes below give streamdown's element styles instead.
// - The app imported Download/Share2 icons but never showed them; there's now a "Download" (.md).
// - Signed out: a sign-in link back to this report (the app said "Report Not Found").

const POLL_MS = 3000;
/** After this many polls (2 min, the server's stale window) try writing the report again. */
const MAX_POLLS = 40;

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const escapeAttr = (s: string) => s.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const SAFE_HREF = /^(https?:\/\/|mailto:|\/(?!\/)|#)/i;

const markdown = new Marked({
  gfm: true,
  async: false,
  renderer: {
    // Never pass raw HTML through (there is none after escapeHtml, but belt and braces).
    html({ text }) {
      return escapeHtml(text);
    },
    link({ href, title, tokens }) {
      const inner = this.parser.parseInline(tokens);
      if (!SAFE_HREF.test(href)) return inner;
      const titleAttr = title ? ` title="${escapeAttr(title)}"` : "";
      const external = /^https?:/i.test(href) ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `<a href="${escapeAttr(href)}"${titleAttr}${external}>${inner}</a>`;
    },
    // No images from model text: show the alt text only.
    image({ text }) {
      return escapeHtml(text);
    },
  },
});

/** The report's markdown as HTML with every tag in the source text escaped. */
export function renderReportMarkdown(text: string) {
  return markdown.parse(escapeHtml(text)) as string;
}

/** Streamdown's element styles (headings, lists, tables...) as descendant classes. */
const ARTICLE_CLASS =
  "max-w-none text-lg leading-relaxed text-foreground/80 [&_h1]:mt-6 [&_h1]:mb-2 [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:font-serif [&_h1]:text-foreground [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:font-serif [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:font-serif [&_h3]:text-foreground [&_h4]:mt-4 [&_h4]:mb-2 [&_h4]:font-semibold [&_h4]:text-foreground [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:ml-4 [&_ul]:list-outside [&_ul]:list-disc [&_ol]:mb-4 [&_ol]:ml-4 [&_ol]:list-outside [&_ol]:list-decimal [&_li]:py-1 [&_strong]:font-semibold [&_strong]:text-foreground [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_hr]:my-6 [&_hr]:border-border [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-muted-foreground/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_table]:text-base [&_th]:border [&_th]:border-border [&_th]:bg-muted/50 [&_th]:px-4 [&_th]:py-2 [&_th]:text-left [&_td]:border [&_td]:border-border [&_td]:px-4 [&_td]:py-2 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:text-sm [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-4";

type Phase = "loading" | "signedOut" | "notFound" | "ready";

export function ReportViewer({ reportId }: { reportId: number }) {
  const [phase, setPhase] = useState<Phase>(reportId > 0 ? "loading" : "notFound");
  const [report, setReport] = useState<AqueousReport | null>(null);
  const [streamText, setStreamText] = useState<string | null>(null);
  const [waiting, setWaiting] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const started = useRef<number | null>(null);
  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (pollTimer.current) clearTimeout(pollTimer.current);
  }, []);

  useEffect(() => {
    // Once per report id (React's dev double-run included): a second POST would only get a 409.
    // The stream isn't aborted on leaving the page, so the report still finishes and is saved.
    if (reportId <= 0 || started.current === reportId) return;
    started.current = reportId;

    const settle = (r: AqueousReport) => {
      setReport(r);
      setStreamText(null);
      setWaiting(false);
      if (r.status === "failed") setFailure((f) => f ?? "Please try generating a new report from your dashboard.");
    };

    const poll = (count: number) => {
      pollTimer.current = setTimeout(async () => {
        const r = await getReport(reportId).catch(() => null);
        if (r?.ok && (r.data.status === "complete" || r.data.status === "failed")) {
          settle(r.data);
          return;
        }
        if (count + 1 >= MAX_POLLS) {
          void write();
          return;
        }
        poll(count + 1);
      }, POLL_MS);
    };

    const write = async () => {
      setFailure(null);
      setStreamText("");
      setWaiting(false);
      let res: Response;
      try {
        res = await fetch(`/api/aqueous/reports/${reportId}/generate`, { method: "POST" });
      } catch {
        setStreamText(null);
        setFailure("The report couldn't be written just now. Please try again.");
        return;
      }
      if (res.status === 409) {
        setStreamText(null);
        setWaiting(true);
        poll(0);
        return;
      }
      if (!res.ok || !res.body) {
        const body = (await res.json().catch(() => null)) as { message?: string } | null;
        setStreamText(null);
        setFailure(body?.message ?? "The report couldn't be written just now. Please try again.");
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value, { stream: true });
          setStreamText(text);
        }
      } catch {
        // Connection dropped: the saved copy (below) is what counts.
      }
      const r = await getReport(reportId).catch(() => null);
      if (r?.ok) settle(r.data);
      else setStreamText(text);
    };

    (async () => {
      const r = await getReport(reportId).catch(() => null);
      if (!r || !r.ok) {
        setPhase(r && !r.ok && r.signedOut ? "signedOut" : "notFound");
        return;
      }
      setReport(r.data);
      setPhase("ready");
      if (r.data.status !== "complete" || !r.data.reportContent) await write();
    })();
  }, [reportId]);

  if (phase === "loading") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your report...</p>
          </div>
        </main>
      </div>
    );
  }

  if (phase === "signedOut") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Sign In to See Your Report</h1>
            <p className="text-muted-foreground mb-4">Reports are private to the member who made them.</p>
            <Button asChild>
              <a href={`/login?next=${encodeURIComponent(aq(`/report/${reportId}`))}`}>Sign In</a>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (phase === "notFound" || !report) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Report Not Found</h1>
            <p className="text-muted-foreground mb-4">This report doesn&apos;t exist or you don&apos;t have access.</p>
            <Button asChild>
              <Link href={aq("/dashboard")}>Back to Dashboard</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const isGenerating = waiting || (streamText !== null && streamText.length === 0);
  const content = streamText ?? (report.status === "complete" ? report.reportContent : null);
  const canDownload = streamText === null && report.status === "complete" && Boolean(report.reportContent);

  const download = () => {
    const blob = new Blob([report.reportContent ?? ""], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aqueous-awi-report-${report.id}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-3xl">
          {/* Back + Actions */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href={aq("/dashboard")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft aria-hidden="true" className="w-4 h-4" /> Back to Dashboard
            </Link>
            <div className="flex items-center gap-2">
              {canDownload && (
                <Button size="sm" variant="outline" onClick={download}>
                  <Download className="w-4 h-4 mr-1" /> Download
                </Button>
              )}
            </div>
          </div>

          <h1 className="sr-only">{report.title}</h1>

          {/* Status Banner */}
          {isGenerating && (
            <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 mb-6 flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600 shrink-0" />
              <div>
                <p className="font-medium text-blue-800">Generating Your Report</p>
                <p className="text-sm text-blue-600">
                  Our Water Intelligence engine is crafting your personalized analysis. This usually takes 15-30
                  seconds.
                </p>
              </div>
            </div>
          )}

          {failure && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 mb-6">
              <p className="font-medium text-red-800">Report Generation Failed</p>
              <p className="text-sm text-red-600">{failure}</p>
            </div>
          )}

          {/* Report Content (markdown, HTML escaped; see renderReportMarkdown) */}
          {content && (
            <article
              className={ARTICLE_CLASS}
              aria-busy={streamText !== null}
              dangerouslySetInnerHTML={{ __html: renderReportMarkdown(content) }}
            />
          )}

          {/* Date */}
          <div className="mt-12 pt-6 border-t border-border/40 text-sm text-muted-foreground text-center">
            Generated on{" "}
            {new Date(report.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
      </main>

      <FloatingShare />
    </div>
  );
}
