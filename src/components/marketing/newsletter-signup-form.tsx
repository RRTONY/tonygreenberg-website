"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CONTACT_EMAIL = "tony@tonygreenberg.com";

// Inline newsletter signup for /subscribe. Same submit path as
// `newsletter-popup.tsx`: POST /api/subscribe (Kit), falling back to a
// prefilled mailto if the service is down, and setting the shared
// `tg_subscribed` flag so the popup stops asking afterwards.
export function NewsletterSignupForm({ source = "subscribe" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState<"api" | "mailto" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || pending) return;
    setPending(true);
    let via: "api" | "mailto" = "api";
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
    } catch {
      const subject = encodeURIComponent("Subscribe me to the newsletter");
      const body = encodeURIComponent(`Please add this address to the list: ${email}`);
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      via = "mailto";
    }
    try {
      localStorage.setItem("tg_subscribed", "true");
    } catch {}
    setPending(false);
    setDone(via);
  };

  if (done) {
    return (
      <p role="status" className="text-center font-heading text-lg text-foreground">
        {done === "api"
          ? "You're in. New essays will arrive in your inbox."
          : "Your mail app should open with the request ready to send."}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
      <label htmlFor="subscribe-email" className="sr-only">
        Email address
      </label>
      <Input
        id="subscribe-email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-11 flex-1"
      />
      <Button type="submit" disabled={pending} className="h-11 font-mono text-xs tracking-wider uppercase">
        {pending && <Loader2 className="size-4 animate-spin" />}
        Subscribe Free
      </Button>
    </form>
  );
}
