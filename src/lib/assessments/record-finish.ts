import { recordAssessmentResult } from "@/app/assessments/actions";

// Client-only. One quiz finish usually reaches two helpers a moment apart
// (journey-tracker.tsx's markComplete, then result-actions.tsx via
// result-log.ts with the result text). Each server call takes a couple of
// seconds and the browser runs them one after another, so a visitor who
// left quickly lost the second (the one with the result). This merges
// everything said about the same quiz within a short window into ONE call.
const MERGE_WINDOW_MS = 1500;

type Finish = { assessment: string; journeyId?: string; summary?: string; score?: number };

const pending = new Map<string, { finish: Finish; timer: ReturnType<typeof setTimeout> }>();

export function recordFinish(input: Finish): void {
  const existing = pending.get(input.assessment);
  if (existing) clearTimeout(existing.timer);
  const prev = existing?.finish;
  const finish: Finish = {
    assessment: input.assessment,
    journeyId: input.journeyId ?? prev?.journeyId,
    summary: input.summary ?? prev?.summary,
    score: input.score ?? prev?.score,
  };
  const timer = setTimeout(() => {
    pending.delete(input.assessment);
    void recordAssessmentResult(finish);
  }, MERGE_WINDOW_MS);
  pending.set(input.assessment, { finish, timer });
}
