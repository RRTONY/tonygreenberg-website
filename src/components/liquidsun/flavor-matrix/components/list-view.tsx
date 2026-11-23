"use client";

import type { FocusEvent } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { ArrowRight, Bell, Edit3, ExternalLink } from "lucide-react";
import { BottleThumb } from "@/components/liquidsun/flavor-matrix/components/bottle-thumb";
import { isRare, type Bottle } from "@/components/liquidsun/flavor-matrix/flavor-matrix.data";
import { useLanguage } from "@/components/liquidsun/liquidsun-providers";
import { textareaClasses } from "@/components/liquidsun/ui";
import { tastingNoteSchema } from "@/lib/content/liquidsun/forms";
import { getCheapestBuyLink, getProducerById } from "@/lib/content/liquidsun/producers";
import { cn } from "@/lib/utils";

// The Flavor Matrix "list" view, ported from the app's FlavorMatrix.tsx. Buy links show here
// without the sign-in gate, as in the app. "My Notes" is a one-field Formik form (owner,
// 2026-11-21: every LiquidSun form on Formik + Yup) that still saves when the box loses focus.

function NoteEditor({ initial, onSave }: { initial: string; onSave: (note: string) => void }) {
  const { language } = useLanguage();
  return (
    <Formik initialValues={{ note: initial }} validationSchema={tastingNoteSchema(language)} onSubmit={(v) => onSave(v.note)}>
      {({ submitForm, handleBlur, errors }) => (
        <Form noValidate className="space-y-2">
          <Field
            as="textarea"
            name="note"
            aria-label="My notes"
            placeholder="Nose, palate, finish..."
            aria-invalid={Boolean(errors.note)}
            className={cn(textareaClasses, "min-h-[60px] border-white/10 bg-black/50 text-xs")}
            onBlur={(e: FocusEvent<HTMLTextAreaElement>) => {
              handleBlur(e);
              void submitForm();
            }}
          />
          <ErrorMessage name="note">
            {(message) => (
              <p role="alert" className="text-xs text-red-400">
                {message}
              </p>
            )}
          </ErrorMessage>
          <div className="text-right text-[9px] text-slate-500">Click outside to save</div>
        </Form>
      )}
    </Formik>
  );
}

export function ListView({
  bottles,
  leaving,
  notes,
  editingNote,
  setEditingNote,
  onSaveNote,
  onNotify,
}: {
  bottles: Bottle[];
  leaving: boolean;
  notes: Record<string, string>;
  editingNote: string | null;
  setEditingNote: (id: string | null) => void;
  onSaveNote: (id: string, note: string) => void;
  onNotify: (bottle: Bottle) => void;
}) {
  return (
    <div className={leaving ? "grid grid-cols-1 gap-4 opacity-0 transition-opacity duration-200 md:grid-cols-2 lg:grid-cols-3" : "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"}>
      {bottles.map((bottle) => {
        const prod = bottle.producerId ? getProducerById(bottle.producerId) : null;
        const link = prod ? getCheapestBuyLink(prod) : null;
        return (
          <div
            key={bottle.id}
            className="flex flex-col gap-4 rounded-xl border border-white/5 bg-slate-900/40 p-4 transition-all hover:border-amber-500/30"
          >
            <div className="flex gap-4">
              <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-black/20">
                <BottleThumb bottle={bottle} sizes="80px" imageClassName="object-cover" />
                {isRare(bottle) && (
                  <div className="absolute top-1 right-1 size-2 animate-pulse rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="font-serif text-lg leading-none text-white">{bottle.brand}</h3>
                    <span className="font-mono text-sm text-amber-400">${bottle.price}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{bottle.expression}</p>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {bottle.notes
                    .split(", ")
                    .slice(0, 2)
                    .map((note) => (
                      <span key={note} className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] text-slate-400">
                        {note}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            {/* TASTING NOTES SECTION */}
            <div className="rounded-lg border border-white/5 bg-black/20 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-500 uppercase">My Notes</span>
                <button
                  type="button"
                  aria-label={`Edit my notes on ${bottle.brand} ${bottle.expression}`}
                  aria-expanded={editingNote === bottle.id}
                  onClick={() => setEditingNote(editingNote === bottle.id ? null : bottle.id)}
                  className="text-slate-500 hover:text-amber-400"
                >
                  <Edit3 aria-hidden="true" className="size-3" />
                </button>
              </div>
              {editingNote === bottle.id ? (
                <NoteEditor initial={notes[bottle.id] || ""} onSave={(note) => onSaveNote(bottle.id, note)} />
              ) : (
                <p className="min-h-[20px] text-xs text-slate-300 italic">{notes[bottle.id] || "No notes yet..."}</p>
              )}
            </div>

            <div className="mt-auto flex gap-2">
              {isRare(bottle) && (
                <button
                  type="button"
                  onClick={() => onNotify(bottle)}
                  className="flex flex-1 items-center justify-center gap-2 rounded border border-purple-500/30 bg-purple-500/10 py-1.5 text-xs font-bold tracking-widest text-purple-300 uppercase transition-all hover:bg-purple-500/20"
                >
                  <Bell aria-hidden="true" className="size-3" /> Notify Me
                </button>
              )}
              {link ? (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded bg-amber-600/80 py-1.5 text-xs font-bold tracking-widest text-black uppercase transition-all hover:bg-amber-500"
                >
                  Buy ${link.price.toFixed(0)} <ExternalLink aria-hidden="true" className="size-3" />
                </a>
              ) : (
                // Same as the app: no retailer on file, so this button goes nowhere.
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-2 rounded bg-white/5 py-1.5 text-xs font-bold tracking-widest uppercase transition-all hover:bg-amber-500 hover:text-black"
                >
                  Buy Now <ArrowRight aria-hidden="true" className="size-3" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
