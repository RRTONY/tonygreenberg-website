import { NextResponse, type NextRequest } from "next/server";
import { resolveKitTag } from "@/lib/content/kit-source-tags";

// Real newsletter subscription, forwarded to Kit (ConvertKit) — ported
// from legacy server/routers.ts's `subscribe.add` tRPC procedure. Kit's
// standalone "create a subscriber" endpoint (v3 `/subscribers`, and v4's
// equivalent under a different API-key scheme) both failed live testing —
// v3 `/subscribers` 404s outright, and the on-file credentials aren't
// valid v4 keys ("V4 API Keys are not compatible with V3", per Kit's own
// docs). But v3's *form*-subscribe and tag endpoints are still live and
// were verified end-to-end against the real account (a real test
// subscription was created via `/v3/forms/{id}/subscribe` and
// `/v3/tags/{id}/subscribe`, then cleaned up via `/v3/unsubscribe`) — so
// this uses that confirmed-working v3 path: subscribe via the form (which
// creates the subscriber as a side effect, sidestepping the dead
// standalone endpoint), then tag by source the same way legacy did.
//
// Also dropped from legacy's version, same as before: saving to an
// internal Postgres table (no such DB exists in this app yet) and the
// owner-alert email via Google Apps Script (a separate, smaller
// follow-up, not bundled into this endpoint).
const KIT_API_BASE = "https://api.convertkit.com/v3";

export async function POST(request: NextRequest) {
  let body: { email?: string; source?: string; firstName?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const email = body.email?.trim();
  const source = body.source?.trim() || "footer";
  const firstName = body.firstName?.trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ success: false, message: "A valid email is required" }, { status: 400 });
  }

  const apiSecret = process.env.KIT_API_SECRET;
  const apiKey = process.env.KIT_API_KEY;
  const formId = process.env.KIT_FORM_ID;

  if (!apiSecret && !apiKey) {
    return NextResponse.json({ success: false, message: "Newsletter service is not configured" }, { status: 503 });
  }
  if (!formId) {
    return NextResponse.json({ success: false, message: "No Kit form configured" }, { status: 503 });
  }

  const auth = apiSecret ? { api_secret: apiSecret } : { api_key: apiKey };

  try {
    const subscribeRes = await fetch(`${KIT_API_BASE}/forms/${formId}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...auth, email, first_name: firstName || undefined }),
    });
    if (!subscribeRes.ok) {
      const errBody = await subscribeRes.text();
      throw new Error(`Kit form subscribe failed (${subscribeRes.status}): ${errBody}`);
    }

    // Tag by source for segmentation — only possible with the secret
    // (legacy's own precedent: tagging was gated behind kitApiSecret, not
    // the plain api_key). Idempotent create-or-get, same as legacy. A
    // tagging failure doesn't undo the subscription itself.
    if (apiSecret) {
      try {
        const tagName = resolveKitTag(source);
        const tagRes = await fetch(`${KIT_API_BASE}/tags`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ api_secret: apiSecret, tag: { name: tagName } }),
        });
        const tagData = await tagRes.json();
        const tagId = tagData?.id;
        if (tagId) {
          await fetch(`${KIT_API_BASE}/tags/${tagId}/subscribe`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ api_secret: apiSecret, email }),
          });
        }
      } catch (tagErr) {
        console.error("[api/subscribe] Kit tagging failed (subscription still succeeded):", tagErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/subscribe] Kit API error:", err);
    return NextResponse.json({ success: false, message: "Newsletter service error" }, { status: 502 });
  }
}
