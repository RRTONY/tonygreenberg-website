"use client";

import { useId, useState, type ReactNode } from "react";
import { ErrorMessage, Field, Form, Formik, type FormikHelpers, type FormikProps } from "formik";
import * as Yup from "yup";
import { AlertCircle, CheckCircle, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/components/soulsmoke/soulsmoke-providers";

// Ported from the SoulSmoke app's client/src/components/EmailSignup.tsx (hero, compact and
// default variants). The Manus app saved to its own database; this posts to the site's
// /api/subscribe (Kit), tagged by `source` (see kit-source-tags.ts, "soulsmoke-*").
// Fixed from live: on desktop the hero form's email box collapsed to a sliver beside the name
// box, so both fields now share the row evenly (rule 20).
// Formik + Yup at the owner's request (2026-11-14), even though it's only two fields. The
// name is optional, so an empty one passes (rule 17). Only the hero variant has Spanish copy,
// so only it gets Spanish error messages.

type Status = "idle" | "success" | "error";

function signupSchema(es: boolean) {
  return Yup.object({
    name: Yup.string().trim().max(256),
    email: Yup.string()
      .trim()
      .email(es ? "Ese correo no parece correcto." : "That email address doesn't look right.")
      .max(320)
      .required(es ? "Añade tu correo." : "Add your email."),
  });
}

type Values = { name: string; email: string };

export function EmailSignup({
  source = "soulsmoke",
  variant = "default",
  className = "",
}: {
  source?: string;
  variant?: "default" | "compact" | "hero";
  className?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const { language } = useLanguage();
  const errorId = useId();
  const schema = signupSchema(variant === "hero" && language === "es");

  async function handleSubmit(values: Values, { resetForm }: FormikHelpers<Values>) {
    setStatus("idle");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email.trim(), firstName: values.name.trim() || undefined, source }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
      if (res.ok && data.success) {
        setStatus("success");
        setMessage("Successfully subscribed!");
        resetForm();
      } else {
        setStatus("error");
        setMessage(data.message || "Failed to subscribe. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  // Formik wrapper shared by all three variants.
  const withFormik = (body: (f: FormikProps<Values>) => ReactNode) => (
    <Formik<Values> initialValues={{ name: "", email: "" }} validationSchema={schema} onSubmit={handleSubmit}>
      {body}
    </Formik>
  );

  // The email box (Formik-wired, labelled for screen readers) used by every variant.
  const emailField = (
    f: FormikProps<Values>,
    { label, placeholder, className: inputClass }: { label: string; placeholder: string; className: string },
  ) => {
    const invalid = Boolean(f.touched.email && f.errors.email);
    return (
      <Field
        as={Input}
        name="email"
        type="email"
        aria-label={label}
        placeholder={placeholder}
        required
        aria-invalid={invalid}
        aria-describedby={invalid ? errorId : undefined}
        className={inputClass}
      />
    );
  };

  const emailError = (errorClass: string) => (
    <ErrorMessage
      name="email"
      render={(msg) => (
        <p id={errorId} role="alert" className={errorClass}>
          {msg}
        </p>
      )}
    />
  );

  if (variant === "hero") {
    return (
      <div className={`mx-auto w-full max-w-xl ${className}`}>
        <div className="mb-6 text-center">
          <h3 className="mb-2 font-display text-2xl text-lime-400">
            {language === "es" ? "Únete a la Cacería" : "Join the Hunt"}
          </h3>
          <p className="text-lg text-stone-400">
            {language === "es"
              ? "Recibe alertas sobre lanzamientos raros, historias de productores, y secretos que no compartimos con cualquiera."
              : "Get alerts about rare drops, producer stories, and secrets we don't share with just anyone."}
          </p>
        </div>
        {withFormik((f) => (
          <Form noValidate className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Field
                as={Input}
                name="name"
                type="text"
                aria-label={language === "es" ? "Tu nombre (opcional)" : "Your name (optional)"}
                placeholder={language === "es" ? "Tu nombre (opcional)" : "Your name (optional)"}
                className="h-12 border-stone-700 bg-stone-900/80 text-stone-100 placeholder:text-stone-500 sm:flex-1"
              />
              {emailField(f, {
                label: language === "es" ? "Tu correo electrónico" : "Your email address",
                placeholder: language === "es" ? "Tu correo electrónico" : "Your email address",
                className: "h-12 flex-1 border-stone-700 bg-stone-900/80 text-stone-100 placeholder:text-stone-500",
              })}
            </div>
            {emailError("text-sm text-red-400")}
            <Button
              type="submit"
              disabled={f.isSubmitting || !f.values.email}
              className="h-12 w-full bg-lime-500 text-lg font-bold text-stone-900 hover:bg-lime-400"
            >
              {f.isSubmitting ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Mail aria-hidden="true" className="mr-2 size-5" />
              )}
              {language === "es" ? "Suscríbete" : "Subscribe to the List"}
            </Button>
          </Form>
        ))}
        {status !== "idle" && (
          <div
            role="status"
            className={
              status === "success"
                ? "mt-4 flex items-center gap-3 rounded-lg border border-green-700 bg-green-900/50 p-4 text-green-300"
                : "mt-4 flex items-center gap-3 rounded-lg border border-red-700 bg-red-900/50 p-4 text-red-300"
            }
          >
            {status === "success" ? (
              <CheckCircle aria-hidden="true" className="size-5 shrink-0" />
            ) : (
              <AlertCircle aria-hidden="true" className="size-5 shrink-0" />
            )}
            <span>{message}</span>
          </div>
        )}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={className}>
        {withFormik((f) => (
          <>
            <Form noValidate className="flex gap-2">
              {emailField(f, {
                label: "Your email",
                placeholder: "Enter your email",
                className: "h-10 border-stone-700 bg-stone-900/80 text-stone-100 placeholder:text-stone-500",
              })}
              <Button
                type="submit"
                disabled={f.isSubmitting || !f.values.email}
                size="sm"
                className="h-10 bg-lime-500 px-4 font-bold text-stone-900 hover:bg-lime-400"
              >
                {f.isSubmitting && <Loader2 className="size-4 animate-spin" />}
                Join
              </Button>
            </Form>
            {emailError("mt-2 text-sm text-red-400")}
          </>
        ))}
        {status !== "idle" && (
          <p role="status" className={status === "success" ? "mt-2 text-sm text-green-400" : "mt-2 text-sm text-red-400"}>
            {message}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-stone-700 bg-stone-900/60 p-6 ${className}`}>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-lime-500/20">
          <Mail aria-hidden="true" className="size-5 text-lime-400" />
        </div>
        <div>
          <h4 className="font-display text-lg text-stone-100">Stay in the Loop</h4>
          <p className="text-sm text-stone-400">Rare drops, producer stories, insider tips</p>
        </div>
      </div>

      {withFormik((f) => (
        <Form noValidate className="space-y-3">
          <Field
            as={Input}
            name="name"
            type="text"
            aria-label="Your name (optional)"
            placeholder="Your name (optional)"
            className="border-stone-600 bg-stone-800/80 text-stone-100 placeholder:text-stone-500"
          />
          {emailField(f, {
            label: "Your email address",
            placeholder: "Your email address",
            className: "border-stone-600 bg-stone-800/80 text-stone-100 placeholder:text-stone-500",
          })}
          {emailError("text-sm text-red-400")}
          <Button
            type="submit"
            disabled={f.isSubmitting || !f.values.email}
            className="w-full bg-lime-500 font-bold text-stone-900 hover:bg-lime-400"
          >
            {f.isSubmitting && <Loader2 className="size-4 animate-spin" />}
            Subscribe
          </Button>
        </Form>
      ))}

      {status !== "idle" && (
        <div
          role="status"
          className={
            status === "success"
              ? "mt-4 flex items-center gap-2 rounded-lg border border-green-700 bg-green-900/50 p-3 text-sm text-green-300"
              : "mt-4 flex items-center gap-2 rounded-lg border border-red-700 bg-red-900/50 p-3 text-sm text-red-300"
          }
        >
          {status === "success" ? (
            <CheckCircle aria-hidden="true" className="size-4 shrink-0" />
          ) : (
            <AlertCircle aria-hidden="true" className="size-4 shrink-0" />
          )}
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}
