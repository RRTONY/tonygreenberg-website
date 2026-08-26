"use client";

import { useState } from "react";

const CONTACT_EMAIL = "tony@tonygreenberg.com";

// Legacy submitted straight to a tRPC subscribe mutation that (among other
// things) forwarded to Kit (ConvertKit). That real Kit forwarding now
// exists at /api/subscribe — submitting tries that first, falling back to
// a pre-filled mailto: only if it fails (no fake success state either way).
export function FirstSipEmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [viaMailto, setViaMailto] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitted) return;
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "first-sip" }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
    } catch {
      const subject = encodeURIComponent("Subscribe me to BrewSoul updates");
      const body = encodeURIComponent(`Please add this address to the list: ${email}`);
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      setViaMailto(true);
    }
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-md border border-[#6F4E37]/20 bg-white px-3.5 py-2.5 text-[#2C1810]"
      />
      <button
        type="submit"
        disabled={submitted || !email}
        className={`rounded-md px-5 py-2.5 font-mono text-xs tracking-wide text-white ${submitted ? "bg-[#2D5A27]" : "bg-[#8B6914]"}`}
      >
        {submitted ? (viaMailto ? "Sent ✓" : "Subscribed ✓") : "Subscribe"}
      </button>
    </form>
  );
}
