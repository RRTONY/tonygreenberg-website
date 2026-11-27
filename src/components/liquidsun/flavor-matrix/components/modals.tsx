"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import { Bell, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button, inputClasses } from "@/components/liquidsun/ui";
import { useLanguage } from "@/components/liquidsun/liquidsun-providers";
import { ModalShell } from "@/components/liquidsun/flavor-matrix/components/modal-shell";
import { quizQuestions, type Bottle } from "@/components/liquidsun/flavor-matrix/flavor-matrix.data";
import { notifySchema } from "@/lib/content/liquidsun/forms";
import { cn } from "@/lib/utils";

// The Flavor Matrix's three modals (quiz, "Get Notified", share card), ported from the app's
// FlavorMatrix.tsx with the same copy and classes.

export function QuizModal({
  open,
  step,
  onAnswer,
  onClose,
}: {
  open: boolean;
  step: number;
  onAnswer: (value: { x: number; y: number }) => void;
  onClose: () => void;
}) {
  const question = quizQuestions[step] ?? quizQuestions[0];
  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="the palate quiz"
      panelClassName="relative w-full max-w-md animate-in rounded-2xl border border-amber-500/30 bg-slate-900 p-8 shadow-2xl duration-300 fade-in zoom-in-90 slide-in-from-bottom-5"
      closingPanelClassName="relative w-full max-w-md animate-out rounded-2xl border border-amber-500/30 bg-slate-900 p-8 shadow-2xl duration-300 fill-mode-forwards zoom-out-90 slide-out-to-bottom-5"
    >
      {(titleId) => (
        <>
          <div className="mb-8 text-center">
            <span className="font-mono text-xs tracking-widest text-amber-500 uppercase">Question {step + 1} of 3</span>
            <h3 id={titleId} className="mt-2 font-serif text-2xl text-white">
              {question.question}
            </h3>
          </div>
          <div className="grid gap-4">
            {question.options.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => onAnswer(option.value)}
                className="group rounded-xl border border-white/10 bg-white/5 p-4 text-left transition-all hover:border-amber-500/50 hover:bg-amber-500/20"
              >
                <span className="font-medium text-slate-200 group-hover:text-amber-100">{option.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </ModalShell>
  );
}

export function NotifyModal({ bottle, open, onClose }: { bottle: Bottle | null; open: boolean; onClose: () => void }) {
  const { language } = useLanguage();
  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="get notified"
      panelClassName="relative w-full max-w-md animate-in rounded-2xl border border-purple-500/30 bg-slate-900 p-8 shadow-2xl duration-300 fade-in zoom-in-90 slide-in-from-bottom-5"
      closingPanelClassName="relative w-full max-w-md animate-out rounded-2xl border border-purple-500/30 bg-slate-900 p-8 shadow-2xl duration-300 fill-mode-forwards zoom-out-90 slide-out-to-bottom-5"
    >
      {(titleId) => (
        <>
          <div className="mb-6 text-center">
            <Bell aria-hidden="true" className="mx-auto mb-4 size-12 text-purple-500" />
            <h3 id={titleId} className="font-serif text-2xl text-white">
              Get Notified
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              We&apos;ll text you the second <strong>{bottle?.brand}</strong> drops.
            </p>
          </div>
          <Formik
            initialValues={{ phone: "" }}
            validationSchema={notifySchema(language)}
            onSubmit={(values, { resetForm }) => {
              // Same as the app: a confirmation only. No number is stored or texted anywhere
              // (owner decision pending, see docs/ai/project_liquidsun_port.md).
              toast.success(`You're on the list! We'll text ${values.phone.trim()} when ${bottle?.brand} drops.`);
              resetForm();
              onClose();
            }}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form noValidate className="space-y-4">
                <label htmlFor="ls-notify-phone" className="sr-only">
                  Phone number
                </label>
                <Field
                  id="ls-notify-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="(555) 555-5555"
                  aria-invalid={Boolean(touched.phone && errors.phone)}
                  aria-describedby={touched.phone && errors.phone ? "ls-notify-phone-error" : undefined}
                  className={cn(inputClasses, "border-white/10 bg-black/50 text-white")}
                />
                <ErrorMessage name="phone">
                  {(message) => (
                    <p id="ls-notify-phone-error" role="alert" className="text-sm text-red-400">
                      {message}
                    </p>
                  )}
                </ErrorMessage>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className="w-full bg-purple-600 font-bold tracking-widest text-white uppercase hover:bg-purple-500"
                >
                  {isSubmitting && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
                  Set Alert
                </Button>
              </Form>
            )}
          </Formik>
        </>
      )}
    </ModalShell>
  );
}

export function ShareModal({
  coordinates,
  open,
  onClose,
}: {
  coordinates: { x: number; y: number } | null;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="share card"
      panelClassName="relative w-full max-w-sm animate-in rounded-2xl border border-amber-500/30 bg-linear-to-br from-slate-900 to-slate-950 p-8 text-center shadow-2xl duration-300 fade-in zoom-in-90 slide-in-from-bottom-5"
      closingPanelClassName="relative w-full max-w-sm animate-out rounded-2xl border border-amber-500/30 bg-linear-to-br from-slate-900 to-slate-950 p-8 text-center shadow-2xl duration-300 fill-mode-forwards zoom-out-90 slide-out-to-bottom-5"
    >
      {(titleId) => (
        <>
          <div className="mb-6 rounded-xl border-4 border-double border-amber-500/20 bg-black/20 p-6">
            <h3 id={titleId} className="mb-2 font-serif text-3xl text-amber-100">
              My Soul Palate
            </h3>
            <div className="mb-4 font-mono text-xs tracking-widest text-amber-500 uppercase">LiquidSun Coordinates</div>
            <div className="mb-2 text-4xl font-bold text-white">
              {coordinates && coordinates.x > 0 ? "Highland" : "Valley"}
              <span className="mx-2 text-slate-500">/</span>
              {coordinates && coordinates.y > 0 ? "Complex" : "Crisp"}
            </div>
            <p className="text-sm text-slate-400 italic">&quot;What enters the mouth must speak to the mind.&quot;</p>
          </div>
          {/* Same as the app: a confirmation only, no image is made or saved. */}
          <Button
            type="button"
            className="w-full bg-amber-600 font-bold tracking-widest text-white uppercase hover:bg-amber-500"
            onClick={() => toast.success("Image saved to gallery!")}
          >
            Download for Instagram
          </Button>
        </>
      )}
    </ModalShell>
  );
}
