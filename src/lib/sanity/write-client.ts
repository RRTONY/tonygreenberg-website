import "server-only";
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

// Mutation-capable client. Server-only (Route Handlers, Server Actions,
// migration scripts) — never import this from a Client Component, and
// SANITY_API_TOKEN must never be prefixed NEXT_PUBLIC_.
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
  perspective: "raw",
});

export function assertWriteClientConfigured() {
  if (!token) {
    throw new Error(
      "SANITY_API_TOKEN is not set — required for any Sanity write (migration scripts, publish actions).",
    );
  }
}
