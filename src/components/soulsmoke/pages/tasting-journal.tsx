"use client";

import { useEffect, useId, useState, type ElementType } from "react";
import Link from "next/link";
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { ArrowLeft, Calendar, Check, Droplets, Flame, Loader2, Plus, Sparkles, Star, Trash2, Wine, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addTastingEntry, deleteTastingEntry, listTastingEntries } from "@/app/soul-smoke/actions";
import { reach } from "@/lib/content/soulsmoke/reach";
import { ss } from "@/lib/content/soulsmoke/nav";
import { soulsmokeFontVariables } from "@/lib/fonts/soulsmoke-fonts";

// Ported from the SoulSmoke app's client/src/pages/TastingJournal.tsx. Same form, cards and copy.
// As on SoulSmoke, the journal belongs to a signed-in member: it's saved in Supabase
// (soulsmoke_tasting_entries) through src/app/soul-smoke/actions.ts, which replaces
// trpc.tastingJournal (mezcal name required, ratings and levels 1 to 5, newest first). Signed-out
// visitors get the original "Sign In to Start Your Journal" screen, linking to /login.
// The dialog renders in a portal outside the /soul-smoke wrapper, so it carries the wrapper's
// class and font variables to keep SoulSmoke's colors and type.

export type TastingEntry = {
  id: string;
  mezcalName: string;
  producer?: string;
  agaveType?: string;
  region?: string;
  abv?: string;
  rating?: number;
  notes?: string;
  smokeLevel?: number;
  sweetnessLevel?: number;
  complexityLevel?: number;
  wouldBuyAgain: boolean;
  tastedAt: string;
};

const LOGIN_HREF = "/login?next=/soul-smoke/tasting-journal";

// Client-side checks so a member sees what's wrong before anything is sent. The server action
// still validates and clips on its own (src/app/soul-smoke/actions.ts); the length limits here are
// its column limits. Optional fields accept an empty string (rule 17).
const level = (min: number) => Yup.number().integer().min(min).max(5).required();
const tastingSchema = Yup.object({
  mezcalName: Yup.string().trim().max(255, "Keep the name under 255 characters.").required("Mezcal Name is required."),
  producer: Yup.string().trim().max(255, "Keep the producer under 255 characters."),
  agaveType: Yup.string().trim().max(100, "Keep the agave type under 100 characters."),
  region: Yup.string().trim().max(255, "Keep the region under 255 characters."),
  abv: Yup.string().trim().max(10, "Keep the ABV under 10 characters."),
  rating: level(0),
  notes: Yup.string().trim().max(5000, "Keep your notes under 5,000 characters."),
  smokeLevel: level(1),
  sweetnessLevel: level(1),
  complexityLevel: level(1),
  wouldBuyAgain: Yup.boolean().required(),
});

export type TastingForm = Yup.InferType<typeof tastingSchema>;

const emptyForm: TastingForm = {
  mezcalName: "",
  producer: "",
  agaveType: "",
  region: "",
  abv: "",
  rating: 0,
  notes: "",
  smokeLevel: 3,
  sweetnessLevel: 3,
  complexityLevel: 3,
  wouldBuyAgain: true,
};

const oneToFive = (n: number) => (Number.isInteger(n) && n >= 1 && n <= 5 ? n : undefined);
const optional = (s?: string) => s?.trim() || undefined;

/** Mirrors the Manus server's tastingJournal.add input checks. Returns null when invalid. */
export function toTastingEntry(form: TastingForm, now = new Date()): TastingEntry | null {
  const mezcalName = form.mezcalName.trim();
  if (!mezcalName) return null;
  return {
    id: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
    mezcalName,
    producer: optional(form.producer),
    agaveType: optional(form.agaveType),
    region: optional(form.region),
    abv: optional(form.abv),
    rating: oneToFive(form.rating),
    notes: optional(form.notes),
    smokeLevel: oneToFive(form.smokeLevel),
    sweetnessLevel: oneToFive(form.sweetnessLevel),
    complexityLevel: oneToFive(form.complexityLevel),
    wouldBuyAgain: form.wouldBuyAgain,
    tastedAt: now.toISOString(),
  };
}

// A field's Yup message, announced to screen readers when it appears.
const fieldError = (message: string) => (
  <p role="alert" className="text-sm text-red-400">
    {message}
  </p>
);

function StarRating({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  return (
    <div className="space-y-1">
      <span className="text-sm text-gray-300">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            aria-label={`${label}: ${star} of 5`}
            aria-pressed={star <= value}
            onClick={() => onChange(star)}
            className={
              star <= value
                ? "p-1 text-amber-400 transition-colors"
                : "p-1 text-gray-400 transition-colors hover:text-gray-300"
            }
          >
            <Star aria-hidden="true" className="size-5 fill-current" />
          </button>
        ))}
      </div>
    </div>
  );
}

function LevelSlider({
  value,
  onChange,
  label,
  icon: Icon,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
  icon: ElementType;
}) {
  return (
    <div className="space-y-1">
      <span className="flex items-center gap-2 text-sm text-gray-300">
        <Icon aria-hidden="true" className="size-4" />
        {label}
      </span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            type="button"
            aria-label={`${label}: ${level} of 5`}
            aria-pressed={level <= value}
            onClick={() => onChange(level)}
            className={
              level <= value
                ? "h-2 w-8 rounded bg-amber-500 transition-colors"
                : "h-2 w-8 rounded bg-gray-700 transition-colors hover:bg-gray-600"
            }
          />
        ))}
      </div>
    </div>
  );
}

type JournalState = { status: "loading" } | { status: "signedOut" } | { status: "ready"; entries: TastingEntry[] };

export function TastingJournal() {
  const [state, setState] = useState<JournalState>({ status: "loading" });
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const ids = {
    mezcalName: useId(),
    producer: useId(),
    agaveType: useId(),
    region: useId(),
    abv: useId(),
    notes: useId(),
  };

  useEffect(() => {
    let live = true;
    reach(listTastingEntries()).then((result) => {
      if (!live) return;
      if (result.ok) setState({ status: "ready", entries: result.data });
      else if (result.signedOut) setState({ status: "signedOut" });
      else {
        setState({ status: "ready", entries: [] });
        setLoadError(result.error);
      }
    });
    return () => {
      live = false;
    };
  }, []);

  const entries = state.status === "ready" ? state.entries : [];

  // Formik runs this only once the schema passes, and holds isSubmitting until it resolves.
  const handleSubmit = async (values: TastingForm, { resetForm }: FormikHelpers<TastingForm>) => {
    const entry = toTastingEntry(values);
    if (!entry) return; // the schema already requires a non-blank name
    setFormError(null);
    // The server sets the id and the tasting date.
    const input: Omit<TastingEntry, "id" | "tastedAt"> = { ...entry };
    const result = await reach(addTastingEntry(input));
    if (!result.ok) {
      if (result.signedOut) setState({ status: "signedOut" });
      setFormError(result.error);
      return;
    }
    setState({ status: "ready", entries: [result.data, ...entries] });
    setIsAddingEntry(false);
    resetForm();
  };

  const deleteEntry = async (id: string) => {
    setDeletingId(id);
    setLoadError(null);
    const result = await reach(deleteTastingEntry(id));
    setDeletingId(null);
    if (!result.ok) {
      setLoadError(result.error);
      return;
    }
    setState({ status: "ready", entries: entries.filter((entry) => entry.id !== id) });
  };

  // While the account check runs, the intro (with its H1) renders with a spinner in place of the
  // sign-in button, so the server HTML has the page's heading and text.
  if (state.status === "loading" || state.status === "signedOut") {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <section className="relative py-24">
          <div className="container">
            <Link href={ss("/")} className="mb-8 inline-flex items-center gap-2 text-amber-400 hover:text-amber-300">
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back to Home
            </Link>
            <div className="mx-auto max-w-xl py-16 text-center">
              <Wine aria-hidden="true" className="mx-auto mb-6 size-16 text-amber-400" />
              <h1 className="mb-4 font-serif text-4xl text-amber-400">Your Tasting Journal</h1>
              <p className="mb-8 text-gray-300">
                Track every mezcal you taste. Record your notes, ratings, and flavor profiles. Build your personal
                archive of liquid memories.
              </p>
              {state.status === "loading" ? (
                <Loader2 aria-label="Loading your journal" className="mx-auto size-8 animate-spin text-amber-400" />
              ) : (
                <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-500">
                  <Link href={LOGIN_HREF}>Sign In to Start Your Journal</Link>
                </Button>
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }

  const textField = (
    key: "mezcalName" | "producer" | "agaveType" | "region" | "abv",
    label: string,
    placeholder: string,
    required = false,
  ) => (
    <div className="space-y-2">
      <label htmlFor={ids[key]} className="text-sm text-gray-300">
        {label}
      </label>
      <Field
        as={Input}
        id={ids[key]}
        name={key}
        placeholder={placeholder}
        className="border-zinc-700 bg-zinc-800"
        required={required}
      />
      <ErrorMessage name={key} render={fieldError} />
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-linear-to-b from-amber-950/20 to-background" />
        <div className="relative z-10 container">
          <Link href={ss("/")} className="mb-8 inline-flex items-center gap-2 text-amber-400 hover:text-amber-300">
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to Home
          </Link>

          {/* Stacks below sm: on live the Add Entry button squeezed the heading at 375px (rule 20). */}
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="mb-2 font-serif text-5xl text-amber-400">Your Tasting Journal</h1>
              {/* "explorer" is the Manus app's fallback when a member has no name. */}
              <p className="text-gray-300">{entries.length} mezcals tasted • Welcome back, explorer</p>
            </div>

            {/* Formik sits outside the dialog so a cancelled draft is still there when it reopens. */}
            <Formik<TastingForm> initialValues={emptyForm} validationSchema={tastingSchema} onSubmit={handleSubmit}>
              {({ values, setFieldValue, isSubmitting }) => (
                <Dialog open={isAddingEntry} onOpenChange={setIsAddingEntry}>
                  <DialogTrigger asChild>
                    <Button className="shrink-0 gap-2 bg-amber-600 hover:bg-amber-500">
                      <Plus aria-hidden="true" className="size-4" />
                      Add Entry
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className={`${soulsmokeFontVariables} soulsmoke-root max-h-[90vh] overflow-y-auto border-zinc-800 bg-zinc-900 text-white sm:max-w-2xl`}
                  >
                    <DialogHeader>
                      <DialogTitle className="font-serif text-2xl text-amber-400">Log a Tasting</DialogTitle>
                    </DialogHeader>
                    <Form noValidate className="space-y-6 pt-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        {textField("mezcalName", "Mezcal Name *", "e.g., Real Minero Largo", true)}
                        {textField("producer", "Producer", "e.g., Real Minero")}
                        {textField("agaveType", "Agave Type", "e.g., Largo, Espadín, Tobalá")}
                        {textField("region", "Region", "e.g., Santa Catarina Minas, Oaxaca")}
                        {textField("abv", "ABV", "e.g., 48%")}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor={ids.notes} className="text-sm text-gray-300">
                          Tasting Notes
                        </label>
                        <Field
                          as={Textarea}
                          id={ids.notes}
                          name="notes"
                          placeholder="What did you taste? What memories did it evoke?"
                          className="min-h-[100px] border-zinc-700 bg-zinc-800"
                        />
                        <ErrorMessage name="notes" render={fieldError} />
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <StarRating
                          value={values.rating}
                          onChange={(v) => setFieldValue("rating", v)}
                          label="Overall Rating"
                        />
                        <div className="space-y-1">
                          <span className="text-sm text-gray-300">Would Buy Again?</span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              aria-pressed={values.wouldBuyAgain}
                              onClick={() => setFieldValue("wouldBuyAgain", true)}
                              className={
                                values.wouldBuyAgain
                                  ? "rounded bg-emerald-600 px-4 py-2 text-white transition-colors"
                                  : "rounded bg-zinc-800 px-4 py-2 text-gray-300 transition-colors"
                              }
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              aria-pressed={!values.wouldBuyAgain}
                              onClick={() => setFieldValue("wouldBuyAgain", false)}
                              className={
                                !values.wouldBuyAgain
                                  ? "rounded bg-red-600 px-4 py-2 text-white transition-colors"
                                  : "rounded bg-zinc-800 px-4 py-2 text-gray-300 transition-colors"
                              }
                            >
                              No
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-6 md:grid-cols-3">
                        <LevelSlider
                          value={values.smokeLevel}
                          onChange={(v) => setFieldValue("smokeLevel", v)}
                          label="Smoke"
                          icon={Flame}
                        />
                        <LevelSlider
                          value={values.sweetnessLevel}
                          onChange={(v) => setFieldValue("sweetnessLevel", v)}
                          label="Sweetness"
                          icon={Droplets}
                        />
                        <LevelSlider
                          value={values.complexityLevel}
                          onChange={(v) => setFieldValue("complexityLevel", v)}
                          label="Complexity"
                          icon={Sparkles}
                        />
                      </div>

                      {formError && (
                        <p role="alert" className="text-sm text-red-400">
                          {formError}
                        </p>
                      )}

                      <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsAddingEntry(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="gap-2 bg-amber-600 hover:bg-amber-500">
                          {isSubmitting && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
                          Save Entry
                        </Button>
                      </div>
                    </Form>
                  </DialogContent>
                </Dialog>
              )}
            </Formik>
          </div>
        </div>
      </section>

      {/* Entries Grid */}
      <section className="pb-24">
        <div className="container">
          {loadError && (
            <p role="alert" className="mb-6 text-sm text-red-400">
              {loadError}
            </p>
          )}
          {entries.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {entries.map((entry) => (
                <div key={entry.id} className="group relative rounded-xl border border-white/10 bg-white/5 p-6">
                  {/* Live only showed this on hover, so touch screens could never delete; it stays
                      visible where there's no mouse (rule 20). */}
                  <button
                    type="button"
                    aria-label={`Delete ${entry.mezcalName}`}
                    disabled={deletingId === entry.id}
                    onClick={() => deleteEntry(entry.id)}
                    className="absolute top-4 right-4 p-2 text-gray-400 transition-opacity hover:text-red-400 focus-visible:opacity-100 pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100"
                  >
                    {deletingId === entry.id ? (
                      <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                    ) : (
                      <Trash2 aria-hidden="true" className="size-4" />
                    )}
                  </button>

                  <div className="mb-4">
                    <h3 className="mb-1 pr-8 font-serif text-xl text-white">{entry.mezcalName}</h3>
                    {entry.producer && <p className="text-sm text-amber-400">{entry.producer}</p>}
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                      <Calendar aria-hidden="true" className="size-3" />
                      {new Date(entry.tastedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {entry.agaveType && (
                      <span className="rounded bg-amber-900/30 px-2 py-1 text-xs text-amber-400">{entry.agaveType}</span>
                    )}
                    {entry.region && (
                      <span className="rounded bg-white/10 px-2 py-1 text-xs text-gray-300">{entry.region}</span>
                    )}
                    {entry.abv && <span className="rounded bg-white/10 px-2 py-1 text-xs text-gray-300">{entry.abv}</span>}
                  </div>

                  {entry.rating ? (
                    <div className="mb-3 flex gap-0.5" aria-label={`Rated ${entry.rating} of 5`}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          aria-hidden="true"
                          className={
                            star <= (entry.rating ?? 0) ? "size-4 fill-amber-400 text-amber-400" : "size-4 text-gray-400"
                          }
                        />
                      ))}
                    </div>
                  ) : null}

                  {entry.notes && <p className="mb-4 line-clamp-3 text-sm text-gray-300">{entry.notes}</p>}

                  <div className="flex gap-4 text-xs text-gray-400">
                    {entry.smokeLevel ? (
                      <span className="flex items-center gap-1">
                        <Flame aria-label="Smoke" className="size-3" /> {entry.smokeLevel}/5
                      </span>
                    ) : null}
                    {entry.sweetnessLevel ? (
                      <span className="flex items-center gap-1">
                        <Droplets aria-label="Sweetness" className="size-3" /> {entry.sweetnessLevel}/5
                      </span>
                    ) : null}
                    {entry.complexityLevel ? (
                      <span className="flex items-center gap-1">
                        <Sparkles aria-label="Complexity" className="size-3" /> {entry.complexityLevel}/5
                      </span>
                    ) : null}
                  </div>

                  <div
                    className={
                      entry.wouldBuyAgain
                        ? "mt-4 flex items-center gap-1 text-xs text-emerald-400"
                        : "mt-4 flex items-center gap-1 text-xs text-red-400"
                    }
                  >
                    {entry.wouldBuyAgain ? (
                      <>
                        <Check aria-hidden="true" className="size-3" /> Would buy again
                      </>
                    ) : (
                      <>
                        <X aria-hidden="true" className="size-3" /> Would not buy again
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <Wine aria-hidden="true" className="mx-auto mb-4 size-12 text-gray-400" />
              <h3 className="mb-2 text-xl text-gray-300">Your journal is empty</h3>
              <p className="mb-6 text-gray-400">Start logging your mezcal tastings to build your personal archive.</p>
              <Button onClick={() => setIsAddingEntry(true)} className="gap-2 bg-amber-600 hover:bg-amber-500">
                <Plus aria-hidden="true" className="size-4" />
                Add Your First Entry
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
