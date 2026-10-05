import "server-only";

// Sends one email through Resend's HTTP API (no SDK, no new dependency).
// Needs RESEND_API_KEY and EMAIL_FROM (an address on a domain verified in
// Resend, e.g. "Only Time Buys Trust <trust@tonygreenberg.com>"). Returns
// false instead of throwing, so a mail hiccup never breaks the page.
export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) {
    console.warn("[email] RESEND_API_KEY / EMAIL_FROM not set; email not sent:", subject);
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (!res.ok) console.warn("[email] Resend refused:", res.status, await res.text().catch(() => ""));
    return res.ok;
  } catch (err) {
    console.warn("[email] send failed:", err);
    return false;
  }
}

// Escapes text placed into an email's HTML.
export function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
