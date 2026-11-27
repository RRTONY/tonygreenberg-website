"use client";

import { useCallback, useMemo, useState } from "react";
import { Grid, List, MapPin, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/liquidsun/ui";
import { useLocalStore } from "@/components/soulsmoke/hooks/use-local-store";
import { usePresenceSwap } from "@/components/liquidsun/motion";
import { usePresence } from "@/components/liquidsun/flavor-matrix/components/modal-shell";
import { NotifyModal, QuizModal, ShareModal } from "@/components/liquidsun/flavor-matrix/components/modals";
import { MatrixView } from "@/components/liquidsun/flavor-matrix/components/matrix-view";
import { ListView } from "@/components/liquidsun/flavor-matrix/components/list-view";
import { BOTTLE_TYPES, bottles, quizQuestions, type Bottle, type BottleType } from "@/components/liquidsun/flavor-matrix/flavor-matrix.data";

// The Flavor Matrix (/liquid-sun/quadrant), ported from the LiquidSun app's
// client/src/components/FlavorMatrix.tsx (2026-11-21): same tabs, palate quiz, matrix and list
// views, share card, "Notify Me" and saved tasting notes (browser only, same "tastingNotes" key).
// framer-motion is recreated with CSS (see the view and modal files for each effect).

const NO_NOTES: Record<string, string> = {};
const TAB_EXIT_MS = 200;

export function FlavorMatrix() {
  const [activeTab, setActiveTab] = useState<BottleType>("Blanco");
  const [hoveredBottle, setHoveredBottle] = useState<Bottle | null>(null);
  const [viewMode, setViewMode] = useState<"matrix" | "list">("matrix");
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [userCoordinates, setUserCoordinates] = useState<{ x: number; y: number } | null>(null);
  const [showNotifyModal, setShowNotifyModal] = useState<Bottle | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [tastingNotes, setTastingNotes] = useLocalStore<Record<string, string>>("tastingNotes", NO_NOTES);
  const [editingNote, setEditingNote] = useState<string | null>(null);

  // Old tab's dots shrink out, then the new tab's grow in (AnimatePresence).
  const tab = usePresenceSwap(activeTab, TAB_EXIT_MS);
  const filteredBottles = useMemo(() => bottles.filter((b) => b.type === tab.shown), [tab.shown]);

  const quiz = usePresence(showQuiz ? true : null);
  const notify = usePresence(showNotifyModal);
  const share = usePresence(showShareModal && userCoordinates ? userCoordinates : null);

  const closeQuiz = useCallback(() => setShowQuiz(false), []);
  const closeNotify = useCallback(() => setShowNotifyModal(null), []);
  const closeShare = useCallback(() => setShowShareModal(false), []);

  const handleQuizAnswer = (value: { x: number; y: number }) => {
    setUserCoordinates((prev) => ({ x: (prev?.x || 0) + value.x, y: (prev?.y || 0) + value.y }));
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep((prev) => prev + 1);
    } else {
      setShowQuiz(false);
      setQuizStep(0);
      toast.success("Palate mapped! Look for the 'You Are Here' pin.");
    }
  };

  const handleSaveNote = (bottleId: string, note: string) => {
    setTastingNotes((prev) => ({ ...prev, [bottleId]: note }));
    setEditingNote(null);
    toast.success("Tasting note saved.");
  };

  return (
    <div className="mx-auto w-full max-w-6xl p-4 md:p-8">
      {/* CONTROLS HEADER */}
      <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
        {/* TABS */}
        <div role="group" aria-label="Tequila type" className="flex max-w-full overflow-x-auto rounded-full border border-amber-500/20 bg-slate-900/50 p-1 backdrop-blur-sm">
          {BOTTLE_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={activeTab === t}
              onClick={() => setActiveTab(t)}
              className={
                activeTab === t
                  ? "rounded-full bg-amber-500 px-4 py-2 font-mono text-[10px] font-bold tracking-widest whitespace-nowrap text-black uppercase shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all md:px-6 md:text-xs"
                  : "rounded-full px-4 py-2 font-mono text-[10px] tracking-widest whitespace-nowrap text-slate-400 uppercase transition-all hover:text-amber-200 md:px-6 md:text-xs"
              }
            >
              {t}
            </button>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowQuiz(true);
              setUserCoordinates({ x: 0, y: 0 });
              setQuizStep(0);
            }}
            className="border-amber-500/30 text-xs tracking-widest text-amber-200 uppercase hover:bg-amber-500/10 hover:text-amber-100"
          >
            <MapPin aria-hidden="true" className="mr-2 size-3" /> Find My Palate
          </Button>

          {userCoordinates && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowShareModal(true)}
              className="border-purple-500/30 text-xs tracking-widest text-purple-200 uppercase hover:bg-purple-500/10 hover:text-purple-100"
            >
              <Share2 aria-hidden="true" className="mr-2 size-3" /> Share
            </Button>
          )}

          <div className="flex rounded-lg border border-amber-500/20 bg-slate-900/50 p-1">
            <button
              type="button"
              aria-label="Matrix view"
              aria-pressed={viewMode === "matrix"}
              onClick={() => setViewMode("matrix")}
              className={viewMode === "matrix" ? "rounded bg-amber-500/20 p-2 text-amber-200 transition-all" : "rounded p-2 text-slate-500 transition-all hover:text-slate-300"}
            >
              <Grid aria-hidden="true" className="size-4" />
            </button>
            <button
              type="button"
              aria-label="List view"
              aria-pressed={viewMode === "list"}
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "rounded bg-amber-500/20 p-2 text-amber-200 transition-all" : "rounded p-2 text-slate-500 transition-all hover:text-slate-300"}
            >
              <List aria-hidden="true" className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {quiz.item && <QuizModal open={quiz.open} step={quizStep} onAnswer={handleQuizAnswer} onClose={closeQuiz} />}
      {notify.item && <NotifyModal open={notify.open} bottle={notify.item} onClose={closeNotify} />}
      {share.item && <ShareModal open={share.open} coordinates={share.item} onClose={closeShare} />}

      {/* CONTENT AREA */}
      {viewMode === "matrix" ? (
        <MatrixView
          tab={tab.shown}
          bottles={filteredBottles}
          leaving={tab.leaving}
          hovered={hoveredBottle}
          setHovered={setHoveredBottle}
          userCoordinates={userCoordinates}
        />
      ) : (
        <ListView
          bottles={filteredBottles}
          leaving={tab.leaving}
          notes={tastingNotes}
          editingNote={editingNote}
          setEditingNote={setEditingNote}
          onSaveNote={handleSaveNote}
          onNotify={setShowNotifyModal}
        />
      )}
    </div>
  );
}
