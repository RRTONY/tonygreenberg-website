"use client";

import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Clock, Loader2 } from "lucide-react";
import { CLOCK_KEEPER_MODES, CLOCK_KEEPER_QUESTIONS, type ClockKeeperMode } from "@/lib/content/clock-keeper";
import { submitClockKeeper, type ClockKeeperValues } from "@/app/clock-keeper-part-2/actions";

// Mode picker + response form for /clock-keeper-part-2, ported from legacy
// ClockKeeperPartII.tsx. The modes only change which boxes show: "reframe",
// "meta" and "minimum" use one free-text box ("reframe" keeps the questions
// below it too); "direct" and "jazz" show the five questions.
const EMPTY: ClockKeeperValues = { respondentName: "", respondentEmail: "", q1: "", q2: "", q3: "", q4: "", q5: "", reframe: "" };

const schema = Yup.object({
  respondentEmail: Yup.string().trim().email("That email address doesn't look right."),
});

const NEEDS_CONTENT = "Write a little more in at least one answer before leaving your trace.";
const hasContent = (v: ClockKeeperValues) => [v.q1, v.q2, v.q3, v.q4, v.q5, v.reframe].some((a) => a.trim().length > 10);

const REFRAME_COPY: Record<string, { label: string; placeholder: string }> = {
  reframe: { label: "Reframe — provide the right questions, or answer in your own structure", placeholder: "The questions should have been..." },
  meta: { label: "The pattern itself — describe the model directly", placeholder: "The model looks like this..." },
  minimum: { label: "The one thing. Nothing else.", placeholder: "The one thing..." },
};

const fieldClass =
  "w-full rounded-sm border border-[#E0DCD4] bg-white px-4 py-3 text-base text-[#1A1A1A] outline-none placeholder:text-[#8A8578] focus:border-brand-gold-light focus-visible:ring-2 focus-visible:ring-brand-gold-light/40";

export function ClockKeeperForm() {
  const [mode, setMode] = useState<ClockKeeperMode | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string>();

  const showReframe = mode === "reframe" || mode === "meta" || mode === "minimum";
  const showQuestions = !showReframe || mode === "reframe";

  return (
    <>
      <section className="mx-auto max-w-170 px-6 py-12">
        <p className="mb-6 text-center font-mono text-[0.7rem] tracking-[0.2em] text-brand-gold uppercase">Choose Your Mode</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {CLOCK_KEEPER_MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              aria-pressed={mode === m.id}
              className={
                mode === m.id
                  ? "rounded-sm border-2 border-brand-gold-light bg-brand-gold-light/5 px-5 py-4 text-left"
                  : "rounded-sm border border-[#E0DCD4] bg-white px-5 py-4 text-left hover:border-brand-gold-light/60"
              }
            >
              <span className="block font-mono text-[0.75rem] tracking-[0.12em] text-[#1A1A1A] uppercase">{m.label}</span>
              <span className="mt-1 block text-sm text-[#666]">{m.desc}</span>
            </button>
          ))}
        </div>
      </section>

      <section id="response" className="mx-auto max-w-170 scroll-mt-20 px-6 pb-16">
        {submitted ? (
          <div role="status" className="py-16 text-center">
            <Clock aria-hidden="true" className="mx-auto mb-4 size-12 text-brand-gold-light" strokeWidth={1.5} />
            <h2 className="mb-3 font-heading text-3xl text-[#1A1A1A]">The trace is recorded.</h2>
            <p className="mx-auto max-w-120 text-lg/[1.7] text-[#555]">
              Thank you. Whatever form this took — it now exists outside the conversation. The pattern has a record.
            </p>
          </div>
        ) : (
          <Formik
            initialValues={EMPTY}
            validationSchema={schema}
            validateOnChange={false}
            onSubmit={async (values) => {
              setServerError(undefined);
              if (!hasContent(values)) {
                setServerError(NEEDS_CONTENT);
                return;
              }
              const res = await submitClockKeeper(values);
              if (res.ok) setSubmitted(true);
              else setServerError(res.error);
            }}
          >
            {({ values, errors, isSubmitting }) => {
              const answered = CLOCK_KEEPER_QUESTIONS.filter((q) => values[q.key].trim().length > 10).length;
              const formError = serverError;
              return (
                <Form noValidate>
                  <div className="mb-12 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="respondentName" className="mb-1.5 block font-mono text-[0.7rem] tracking-[0.12em] text-[#555] uppercase">
                        Name (optional)
                      </label>
                      <Field id="respondentName" name="respondentName" placeholder="Anonymous is fine" className={fieldClass} />
                    </div>
                    <div>
                      <label htmlFor="respondentEmail" className="mb-1.5 block font-mono text-[0.7rem] tracking-[0.12em] text-[#555] uppercase">
                        Email (optional)
                      </label>
                      <Field id="respondentEmail" name="respondentEmail" type="email" placeholder="For follow-up only" className={fieldClass} />
                      {errors.respondentEmail && <p className="mt-1 text-sm text-destructive">{errors.respondentEmail}</p>}
                    </div>
                  </div>

                  {showReframe && mode && (
                    <div className="mb-12">
                      <label htmlFor="reframe" className="mb-3 block font-heading text-xl text-[#1A1A1A]">
                        {REFRAME_COPY[mode].label}
                      </label>
                      <Field as="textarea" id="reframe" name="reframe" rows={12} placeholder={REFRAME_COPY[mode].placeholder} className={`${fieldClass} resize-y leading-relaxed`} />
                    </div>
                  )}

                  {showQuestions &&
                    CLOCK_KEEPER_QUESTIONS.map((q, i) => (
                      <div key={q.key} className={i < CLOCK_KEEPER_QUESTIONS.length - 1 ? "mb-12 border-b border-[#E8E4DC] pb-12" : "mb-12"}>
                        <div className="mb-2 flex items-baseline gap-3">
                          <span className="font-mono text-sm text-brand-gold">Q{q.num}</span>
                          <h3 className="font-heading text-2xl text-[#1A1A1A]">{q.title}</h3>
                        </div>
                        <label htmlFor={q.key} className="mb-4 block text-[1.05rem]/[1.7] text-[#444]">
                          {q.prompt}
                        </label>
                        <Field as="textarea" id={q.key} name={q.key} rows={6} placeholder={q.placeholder} className={`${fieldClass} resize-y leading-relaxed`} />
                      </div>
                    ))}

                  <div className="text-center">
                    {answered > 0 && (
                      <p className="mb-3 font-mono text-xs tracking-wide text-brand-gold">
                        {answered} of {CLOCK_KEEPER_QUESTIONS.length} questions answered
                      </p>
                    )}
                    {formError && (
                      <p role="alert" className="mb-3 text-sm text-destructive">
                        {formError}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex min-h-12 items-center gap-2 rounded-sm bg-[#0A0A10] px-10 font-mono text-[0.8rem] tracking-[0.15em] text-[#FAFAF7] uppercase transition-colors hover:bg-[#1A1A20] disabled:cursor-wait"
                    >
                      {isSubmitting && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
                      Leave Your Trace
                    </button>
                    <p className="mx-auto mt-4 max-w-110 text-sm text-[#666]">
                      Answer any number of questions in any order. Partial responses are welcomed and valued.
                    </p>
                  </div>
                </Form>
              );
            }}
          </Formik>
        )}
      </section>
    </>
  );
}
