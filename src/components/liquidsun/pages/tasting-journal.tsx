"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import { Loader2, Save, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage, useMember } from "@/components/liquidsun/liquidsun-providers";
import { addLogEntry, deleteLogEntry, listLogEntries, type LogEntry } from "@/app/liquid-sun/actions";
import { producers } from "@/lib/content/liquidsun/producers";
import { tastingSchema, type TastingValues } from "@/lib/content/liquidsun/forms";

// Ported from the LiquidSun app's client/src/pages/TastingJournal.tsx ("The Log", 2026-11-21). Same
// layout and copy. The app kept entries only until the page closed. Now (owner, 2026-11-21, like
// SoulSmoke's journal): a signed-in member's entries are saved to Supabase
// (liquidsun_tasting_entries, through the server actions, scoped to that member). A signed-out
// visitor can still log for this visit, as before, with a line inviting them to sign in to keep it.
// Formik + Yup (tastingSchema, re-checked on the server): a spirit from the list, a rating or a
// note. Each new entry slides in from the right (the app's framer-motion x 20 -> 0).

const LOGIN_HREF = "/login?next=/liquid-sun/tasting-journal";
const initialValues: TastingValues = { producerId: producers[0].id, rating: 0, notes: "" };

const getProducerName = (id: string) => producers.find((p) => p.id === id)?.brand || "Unknown";

function formatDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString();
}

export function TastingJournal() {
  const { language } = useLanguage();
  const { signedIn, loaded } = useMember();
  const [savedNotes, setSavedNotes] = useState<LogEntry[]>([]);
  const [fetched, setFetched] = useState(false);
  const loading = loaded && signedIn && !fetched;

  useEffect(() => {
    if (!loaded || !signedIn) return;
    let live = true;
    listLogEntries()
      .then((r) => {
        if (!live) return;
        if (r.ok) setSavedNotes(r.data);
        else toast.error(r.error);
      })
      .catch(() => live && toast.error("Couldn't reach the server. Check your connection and try again."))
      .finally(() => live && setFetched(true));
    return () => {
      live = false;
    };
  }, [loaded, signedIn]);

  async function handleSave(values: TastingValues, helpers: FormikHelpers<TastingValues>) {
    try {
      if (signedIn) {
        const result = await addLogEntry(values);
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        setSavedNotes((prev) => [result.data, ...prev]);
      } else {
        const entry: LogEntry = {
          id: `local-${Date.now()}`,
          producerId: values.producerId,
          rating: values.rating,
          notes: values.notes.trim(),
          date: new Date().toISOString(),
        };
        setSavedNotes((prev) => [entry, ...prev]);
      }
      helpers.resetForm({ values: { ...initialValues, producerId: values.producerId } });
    } catch {
      toast.error("Couldn't reach the server. Check your connection and try again.");
    } finally {
      helpers.setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (signedIn && !id.startsWith("local-")) {
      try {
        const result = await deleteLogEntry(id);
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
      } catch {
        toast.error("Couldn't reach the server. Check your connection and try again.");
        return;
      }
    }
    setSavedNotes((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <div className="min-h-screen bg-background px-4 pt-24 pb-12">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <h1 className="mb-4 font-display text-4xl text-primary md:text-6xl">The Log</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">Memory is a glitch. Write it down before the angels take their share.</p>
        </div>

        <div className="grid gap-12 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-8">
            <h2 className="mb-6 font-display text-2xl text-foreground">New Entry</h2>

            <Formik initialValues={initialValues} validationSchema={tastingSchema(language)} onSubmit={handleSave}>
              {({ values, setFieldValue, isSubmitting, errors, touched, submitCount }) => (
                <Form noValidate className="space-y-6">
                  <div>
                    <label htmlFor="log-spirit" className="mb-2 block font-mono text-sm tracking-wider text-muted-foreground uppercase">
                      Spirit
                    </label>
                    <Field
                      as="select"
                      id="log-spirit"
                      name="producerId"
                      className="w-full rounded border border-border bg-background p-3 text-foreground outline-none focus:border-primary"
                    >
                      {producers.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.brand} ({p.nom})
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="producerId">
                      {(m) => (
                        <p role="alert" className="mt-2 text-sm text-red-400">
                          {m}
                        </p>
                      )}
                    </ErrorMessage>
                  </div>

                  <div>
                    <span id="log-rating-label" className="mb-2 block font-mono text-sm tracking-wider text-muted-foreground uppercase">
                      Rating
                    </span>
                    <div className="flex gap-2" role="group" aria-labelledby="log-rating-label">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          aria-label={`${star} of 5`}
                          aria-pressed={values.rating >= star}
                          onClick={() => setFieldValue("rating", star)}
                          className={
                            values.rating >= star
                              ? "text-primary transition-colors"
                              : "text-muted-foreground/30 transition-colors hover:text-primary/50"
                          }
                        >
                          <Star aria-hidden="true" fill={values.rating >= star ? "currentColor" : "none"} size={24} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="log-notes" className="mb-2 block font-mono text-sm tracking-wider text-muted-foreground uppercase">
                      Notes
                    </label>
                    <Field
                      as="textarea"
                      id="log-notes"
                      name="notes"
                      placeholder="Nose, palate, finish. Did it burn? Did it sing?"
                      aria-invalid={Boolean(errors.notes && (touched.notes || submitCount > 0))}
                      aria-describedby={errors.notes ? "log-notes-error" : undefined}
                      className="h-32 w-full resize-none rounded border border-border bg-background p-3 text-foreground outline-none focus:border-primary"
                    />
                    {errors.notes && (touched.notes || submitCount > 0) && (
                      <p id="log-notes-error" role="alert" className="mt-2 text-sm text-red-400">
                        {errors.notes}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded bg-primary py-3 font-bold tracking-widest text-primary-foreground uppercase transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : <Save aria-hidden="true" size={18} />}
                    Log It
                  </button>
                </Form>
              )}
            </Formik>
          </div>

          <div className="space-y-6">
            <h2 className="mb-6 font-display text-2xl text-foreground">History</h2>

            {loaded && !signedIn && (
              <p className="text-sm text-muted-foreground">
                <Link href={LOGIN_HREF} className="text-primary underline-offset-4 hover:underline">
                  Sign in
                </Link>{" "}
                to keep your log. Without an account it&apos;s gone when you close this page.
              </p>
            )}

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 aria-label="Loading your log" className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : savedNotes.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border py-12 text-center">
                <p className="text-muted-foreground italic">The page is blank. Start drinking.</p>
              </div>
            ) : (
              <div className="max-h-[600px] space-y-4 overflow-y-auto pr-2">
                {savedNotes.map((note) => (
                  <div
                    key={note.id}
                    className="group relative animate-in rounded-lg border border-border bg-card/50 p-6 fade-in slide-in-from-right-5"
                  >
                    <button
                      type="button"
                      onClick={() => handleDelete(note.id)}
                      aria-label={`Delete ${getProducerName(note.producerId)} entry`}
                      className="absolute top-4 right-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive focus-visible:opacity-100"
                    >
                      <Trash2 aria-hidden="true" size={16} />
                    </button>

                    <div className="mb-2 flex items-start justify-between pr-6">
                      <h3 className="text-xl font-bold text-foreground">{getProducerName(note.producerId)}</h3>
                      <span className="font-mono text-xs text-muted-foreground">{formatDate(note.date)}</span>
                    </div>

                    <div className="mb-3 flex gap-1 text-primary" aria-label={`${note.rating} of 5 stars`}>
                      {Array.from({ length: note.rating }, (_, i) => (
                        <Star key={i} aria-hidden="true" size={12} fill="currentColor" />
                      ))}
                    </div>

                    <p className="text-sm leading-relaxed text-muted-foreground">{note.notes}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
