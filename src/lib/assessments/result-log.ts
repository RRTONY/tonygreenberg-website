import { readVisitorState, writeVisitorState } from "@/lib/visitor-state-client";

// Only assessment identifiers and timestamps are kept in visitor state; the
// server-owned cookie remains an opaque identifier and the self-portrait page
// resolves display content from the typed local catalog.

export interface CompletedAssessment {
  slug: string;
  completedAt: string;
}

export function parseAssessmentResults(raw: unknown): CompletedAssessment[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (entry): entry is CompletedAssessment =>
      typeof entry === "object" &&
      entry !== null &&
      typeof (entry as CompletedAssessment).slug === "string" &&
      typeof (entry as CompletedAssessment).completedAt === "string",
  );
}

// Client-only — call from a "use client" component's effect. A retake
// overwrites its prior entry instead of duplicating it.
export async function saveAssessmentResult(slug: string): Promise<void> {
  const state = await readVisitorState<{ results?: unknown }>("assessment-results");
  const existing = parseAssessmentResults(state?.results);
  const next = [
    ...existing.filter((e) => e.slug !== slug),
    { slug, completedAt: new Date().toISOString() },
  ];
  await writeVisitorState("assessment-results", { results: next });
}
