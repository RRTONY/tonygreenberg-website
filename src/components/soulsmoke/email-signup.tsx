"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/components/soulsmoke/soulsmoke-providers";

// Ported from the SoulSmoke app's client/src/components/EmailSignup.tsx (hero, compact and
// default variants). The Manus app saved to its own database; this posts to the site's
// /api/subscribe (Kit), tagged by `source` (see kit-source-tags.ts, "soulsmoke-*").
// Fixed from live: on desktop the hero form's email box collapsed to a sliver beside the name
// box, so both fields now share the row evenly (rule 20).

type Status = "idle" | "success" | "error";

export function EmailSignup({
  source = "soulsmoke",
  variant = "default",
  className = "",
}: {
  source?: string;
  variant?: "default" | "compact" | "hero";
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const { language } = useLanguage();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("idle");
    setPending(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName: name || undefined, source }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
      if (res.ok && data.success) {
        setStatus("success");
        setMessage("Successfully subscribed!");
        setEmail("");
        setName("");
      } else {
        setStatus("error");
        setMessage(data.message || "Failed to subscribe. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              type="text"
              aria-label={language === "es" ? "Tu nombre (opcional)" : "Your name (optional)"}
              placeholder={language === "es" ? "Tu nombre (opcional)" : "Your name (optional)"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 border-stone-700 bg-stone-900/80 text-stone-100 placeholder:text-stone-500 sm:flex-1"
            />
            <Input
              type="email"
              aria-label={language === "es" ? "Tu correo electrónico" : "Your email address"}
              placeholder={language === "es" ? "Tu correo electrónico" : "Your email address"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 flex-1 border-stone-700 bg-stone-900/80 text-stone-100 placeholder:text-stone-500"
            />
          </div>
          <Button
            type="submit"
            disabled={pending || !email}
            className="h-12 w-full bg-lime-500 text-lg font-bold text-stone-900 hover:bg-lime-400"
          >
            {pending ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Mail aria-hidden="true" className="mr-2 size-5" />
            )}
            {language === "es" ? "Suscríbete" : "Subscribe to the List"}
          </Button>
        </form>
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
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            aria-label="Your email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-10 border-stone-700 bg-stone-900/80 text-stone-100 placeholder:text-stone-500"
          />
          <Button
            type="submit"
            disabled={pending || !email}
            size="sm"
            className="h-10 bg-lime-500 px-4 font-bold text-stone-900 hover:bg-lime-400"
          >
            {pending && <Loader2 className="size-4 animate-spin" />}
            Join
          </Button>
        </form>
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

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="text"
          aria-label="Your name (optional)"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-stone-600 bg-stone-800/80 text-stone-100 placeholder:text-stone-500"
        />
        <Input
          type="email"
          aria-label="Your email address"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border-stone-600 bg-stone-800/80 text-stone-100 placeholder:text-stone-500"
        />
        <Button
          type="submit"
          disabled={pending || !email}
          className="w-full bg-lime-500 font-bold text-stone-900 hover:bg-lime-400"
        >
          {pending && <Loader2 className="size-4 animate-spin" />}
          Subscribe
        </Button>
      </form>

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
