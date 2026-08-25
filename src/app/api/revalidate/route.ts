import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

// On-demand revalidation for Sanity's publish webhook (Phase 5/11 TODO item
// — SANITY_WEBHOOK_SECRET already reserved for this in .env.local.example).
// `parseBody` verifies the request signature (next-sanity's own helper,
// wrapping @sanity/webhook — no extra dependency needed) and waits out
// Content Lake's eventual-consistency window before we re-fetch. Every
// `sanityFetch()` call across the app tags its cache entry "sanity" (see
// lib/sanity/client.ts), so revalidating that one tag covers every
// Sanity-backed page — no per-document-type path list to keep in sync.
//
// Configure in Sanity's project dashboard (manage.sanity.io → API →
// Webhooks): URL = https://tonygreenberg.com/api/revalidate, trigger on
// create/update/delete, and set the secret to match SANITY_WEBHOOK_SECRET.
export async function POST(request: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(
      request,
      process.env.SANITY_WEBHOOK_SECRET,
    );

    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }
    if (!body?._type) {
      return NextResponse.json({ message: "Bad Request" }, { status: 400 });
    }

    // { expire: 0 } forces immediate expiration — Next.js 16's
    // recommended `profile="max"` (stale-while-revalidate) only refreshes
    // on the *next* visit to a tagged page, but a Sanity publish webhook is
    // exactly the "external system needs it gone now" case the docs call
    // out for the `{ expire: 0 }` form.
    revalidateTag("sanity", { expire: 0 });

    return NextResponse.json({ revalidated: true, type: body._type });
  } catch (err) {
    return NextResponse.json({ message: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
