/**
 * useBehavior — localStorage tracking for behavioral architecture.
 * Tracks: firstVisit, archetype, essaysRead, pageviews, assessmentDone.
 */
import { useCallback, useMemo } from "react";
import type { ArchetypeKey } from "@/data/archetypes";

const KEYS = {
  firstVisit: "tg_first_visit",
  archetype: "tg_archetype",
  essaysRead: "tg_essays_read",
  pageviews: "tg_pageviews",
  assessmentDone: "tg_assessment_done",
  scrollModal: "tg_scroll_modal_shown",
} as const;

function getItem(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function setItem(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { /* noop */ }
}

export function useBehavior() {
  const isReturning = useMemo(() => {
    const first = getItem(KEYS.firstVisit);
    if (!first) { setItem(KEYS.firstVisit, new Date().toISOString()); return false; }
    return true;
  }, []);

  const archetype = useMemo(() => getItem(KEYS.archetype) as ArchetypeKey | null, []);
  const assessmentDone = useMemo(() => getItem(KEYS.assessmentDone) === "true", []);
  const pageviews = useMemo(() => parseInt(getItem(KEYS.pageviews) || "0", 10), []);

  const trackPageview = useCallback(() => {
    const current = parseInt(getItem(KEYS.pageviews) || "0", 10);
    setItem(KEYS.pageviews, String(current + 1));
  }, []);

  const trackEssayRead = useCallback((slug: string) => {
    const read = JSON.parse(getItem(KEYS.essaysRead) || "[]") as string[];
    if (!read.includes(slug)) {
      read.push(slug);
      setItem(KEYS.essaysRead, JSON.stringify(read));
    }
  }, []);

  const setArchetype = useCallback((key: ArchetypeKey) => {
    setItem(KEYS.archetype, key);
    setItem(KEYS.assessmentDone, "true");
  }, []);

  const hasSeenScrollModal = useCallback(() => {
    try { return sessionStorage.getItem(KEYS.scrollModal) === "true"; } catch { return false; }
  }, []);

  const markScrollModalShown = useCallback(() => {
    try { sessionStorage.setItem(KEYS.scrollModal, "true"); } catch { /* noop */ }
  }, []);

  return {
    isReturning,
    archetype,
    assessmentDone,
    pageviews,
    trackPageview,
    trackEssayRead,
    setArchetype,
    hasSeenScrollModal,
    markScrollModalShown,
  };
}
