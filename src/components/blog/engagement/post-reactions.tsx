"use client";

import { useState } from "react";
import { Loader2, MessageCircle, Minus, Send, ThumbsDown, ThumbsUp, type LucideIcon } from "lucide-react";
import { react, type Reaction } from "@/app/blog/[slug]/engagement-actions";
import { refreshPostEngagement, usePostEngagement } from "./use-post-engagement";

// Legacy PostReactions.tsx: the compact "Did this land?" bar right after the
// essay and the full "What's the verdict?" block further down. One reaction
// per browser per essay; the full block offers an optional short note, and
// shows the split and the latest notes ("Reader takes"). Copy unchanged.

const BUTTONS: { key: Reaction; icon: LucideIcon; label: string; active: string; bar: string }[] = [
  { key: "up", icon: ThumbsUp, label: "This hit", active: "border-emerald-600 bg-emerald-600/5 text-emerald-700 dark:text-emerald-400", bar: "bg-emerald-500" },
  { key: "neutral", icon: Minus, label: "Meh", active: "border-amber-600 bg-amber-600/5 text-amber-700 dark:text-amber-400", bar: "bg-amber-400" },
  { key: "down", icon: ThumbsDown, label: "Nah", active: "border-red-600 bg-red-600/5 text-red-700 dark:text-red-400", bar: "bg-red-400" },
];

function useReaction(slug: string) {
  const data = usePostEngagement(slug);
  const [picked, setPicked] = useState<Reaction | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mine = data?.myReaction ?? null;

  async function save(reaction: Reaction, comment?: string) {
    setSaving(true);
    setError(null);
    const res = await react({ slug, reaction, comment });
    setSaving(false);
    if (!res.ok) return setError(res.error ?? "Something went wrong.");
    refreshPostEngagement(slug);
  }
  return { data, mine, picked, setPicked, saving, error, save };
}

export function QuickReaction({ slug }: { slug: string }) {
  const { data, mine, save, saving } = useReaction(slug);
  const counts = data?.reactions;
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-md bg-brand-gold/4 px-5 py-3">
      <span className="font-heading text-[1.1rem] text-foreground">Did this land?</span>
      <div className="flex items-center gap-1">
        {BUTTONS.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => save(key)}
            disabled={!!mine || saving}
            aria-pressed={mine === key}
            aria-label={label}
            title={label}
            className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-md text-sm transition-colors disabled:cursor-default ${
              mine === key
                ? key === "up"
                  ? "text-emerald-700 dark:text-emerald-400"
                  : key === "neutral"
                    ? "text-amber-700 dark:text-amber-400"
                    : "text-red-700 dark:text-red-400"
                : mine
                  ? "text-muted-foreground/60"
                  : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon aria-hidden="true" className="size-4" />
            {counts && counts[key] > 0 && <span className="font-mono text-xs">{counts[key]}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PostVerdict({ slug }: { slug: string }) {
  const { data, mine, picked, setPicked, saving, error, save } = useReaction(slug);
  const [note, setNote] = useState("");
  const [justSaved, setJustSaved] = useState(false);
  const counts = data?.reactions ?? { up: 0, neutral: 0, down: 0, notes: [] };
  const total = counts.up + counts.neutral + counts.down;
  const selected = mine ?? picked;

  async function submit(withNote: boolean) {
    if (!picked) return;
    await save(picked, withNote ? note.trim() || undefined : undefined);
    setNote("");
    setJustSaved(true);
  }

  return (
    <section aria-labelledby="verdict-title" className="mt-12 border-t border-border pt-8">
      <div className="mb-6 text-center">
        <h2 id="verdict-title" className="mb-1 font-heading text-xl text-foreground">
          {mine ? "You've weighed in." : "What's the verdict?"}
        </h2>
        <p className="font-mono text-sm text-muted-foreground">
          {total > 0 ? `${total} reader${total === 1 ? "" : "s"} reacted` : "Be the first to react"}
        </p>
      </div>

      <div className="mb-6 flex justify-center gap-3 sm:gap-4">
        {BUTTONS.map(({ key, icon: Icon, label, active }) => (
          <button
            key={key}
            type="button"
            onClick={() => setPicked(key)}
            disabled={!!mine}
            aria-pressed={selected === key}
            className={`group flex min-w-20 flex-col items-center gap-2 rounded-xl border-2 px-5 py-4 transition-[transform,color,border-color] duration-200 ${
              selected === key
                ? `${active} scale-105`
                : mine
                  ? "cursor-default border-border text-muted-foreground/50"
                  : "border-border text-muted-foreground hover:scale-105 hover:border-foreground/40 hover:text-foreground"
            }`}
          >
            <Icon aria-hidden="true" className="size-6" />
            <span className="font-mono text-xs tracking-wider uppercase">{label}</span>
            {counts[key] > 0 && <span className="font-mono text-xs opacity-70">{counts[key]}</span>}
          </button>
        ))}
      </div>

      {picked && !mine && (
        <div className="mx-auto max-w-md animate-in rounded-xl border border-border bg-muted/50 p-4 duration-300 slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <MessageCircle aria-hidden="true" className="mt-2.5 size-4 shrink-0 text-muted-foreground" />
            <div className="flex-1">
              <label htmlFor="verdict-note" className="sr-only">
                A quick thought (optional)
              </label>
              <textarea
                id="verdict-note"
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 500))}
                placeholder="Drop a quick thought... (optional)"
                rows={2}
                className="w-full resize-none border-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground">{note.length}/500</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => submit(false)}
                    disabled={saving}
                    className="min-h-11 rounded-md px-3 text-xs text-muted-foreground hover:text-foreground sm:min-h-9"
                  >
                    Skip
                  </button>
                  <button
                    type="button"
                    onClick={() => submit(true)}
                    disabled={saving}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-md bg-foreground px-3 text-xs text-background hover:opacity-85 sm:min-h-9"
                  >
                    {saving ? <Loader2 aria-hidden="true" className="size-3 animate-spin" /> : <Send aria-hidden="true" className="size-3" />}
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="text-center text-sm text-destructive">
          {error}
        </p>
      )}
      {mine && justSaved && (
        <p role="status" className="animate-in text-center font-mono text-sm text-muted-foreground duration-500 fade-in">
          Noted. Your take matters.
        </p>
      )}

      {total > 0 && (
        <div className="mx-auto mt-6 flex h-2 max-w-sm overflow-hidden rounded-full bg-muted" aria-hidden="true">
          {BUTTONS.map(({ key, bar }) =>
            counts[key] > 0 ? <div key={key} className={`${bar} transition-[width] duration-500`} style={{ width: `${(counts[key] / total) * 100}%` }} /> : null,
          )}
        </div>
      )}

      {counts.notes.length > 0 && (
        <div className="mx-auto mt-8 max-w-md">
          <h3 className="mb-3 font-mono text-xs tracking-wider text-muted-foreground uppercase">Reader takes</h3>
          <ul className="space-y-3">
            {counts.notes.map((n, i) => {
              const Icon = n.reaction === "up" ? ThumbsUp : n.reaction === "down" ? ThumbsDown : Minus;
              return (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Icon aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <p className="leading-relaxed text-foreground/80">{n.comment}</p>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
