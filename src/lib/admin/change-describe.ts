import { createHash } from "crypto";

// Plain-language helpers for the change review card and change history:
// which pages a file change touches, what changed in a piece of Sanity
// content (before vs after), and a fingerprint of exactly what was reviewed
// so Publish can refuse if anything changed after the person looked at it.
// Pure functions only. Ported from ramprate-ui (2026-10-02).

export type ChangeStatus =
  "draft" | "ready_for_review" | "published" | "discarded";

export const STATUS_LABELS: Record<ChangeStatus, string> = {
  draft: "Draft",
  ready_for_review: "Ready for review",
  published: "Published",
  discarded: "Discarded",
};

export interface AffectedArea {
  label: string;
  // A real page address to open on the preview/live site, when there is one.
  route: string | null;
  shared: boolean;
}

const SHARED_COMPONENTS: Record<string, string> = {
  "src/components/site-header.tsx": "Site header (every page)",
  "src/components/site-footer.tsx": "Site footer (every page)",
  "src/components/site-nav-data.ts": "Site menu and footer links (every page)",
  "src/components/site-chrome.tsx": "Header and footer frame (every page)",
};

function routeFromAppPath(segments: string[]): string {
  const kept = segments.filter(
    (s) => !(s.startsWith("(") && s.endsWith(")")) && !s.startsWith("@"),
  );
  return "/" + kept.join("/");
}

function pageName(route: string): string {
  return route === "/" ? "Home page" : `${route} page`;
}

export function describeFile(path: string): AffectedArea {
  if (SHARED_COMPONENTS[path]) {
    return { label: SHARED_COMPONENTS[path], route: null, shared: true };
  }
  if (path === "src/app/globals.css") {
    return {
      label: "Site-wide styles (every page)",
      route: null,
      shared: true,
    };
  }
  if (path === "src/app/layout.tsx") {
    return { label: "Frame around every page", route: null, shared: true };
  }
  if (path === "next.config.ts" || path === "next.config.js") {
    return { label: "Site settings (redirects)", route: null, shared: true };
  }
  if (path.startsWith("src/lib/content/")) {
    const name = path.slice("src/lib/content/".length).replace(/\.(ts|tsx)$/, "");
    return { label: `Site data "${name}" (quizzes, directories, page text)`, route: null, shared: true };
  }

  const app = path.match(
    /^src\/app\/(?:(.*)\/)?(page|layout)\.(tsx|ts|jsx|js)$/,
  );
  if (app) {
    const segments = (app[1] ?? "").split("/").filter(Boolean);
    const route = routeFromAppPath(segments);
    const dynamic = segments.some((s) => s.startsWith("["));
    if (app[2] === "layout") {
      return {
        label: `Frame around the ${route} pages`,
        route: dynamic ? null : route,
        shared: true,
      };
    }
    return dynamic
      ? { label: `Every ${route} page`, route: null, shared: true }
      : { label: pageName(route), route, shared: false };
  }

  const inPage = path.match(/^src\/app\/(.+)\/[^/]+\.(tsx|ts|jsx|js|css)$/);
  if (inPage && !inPage[1].startsWith("api")) {
    const segments = inPage[1].split("/").filter((s) => !s.startsWith("_"));
    const route = routeFromAppPath(segments);
    const dynamic = segments.some((s) => s.startsWith("["));
    return dynamic
      ? { label: `Every ${route} page`, route: null, shared: true }
      : { label: pageName(route), route, shared: false };
  }

  const component = path.match(/^src\/components\/(.+)\.(tsx|ts|jsx|js)$/);
  if (component) {
    const name = component[1].split("/").pop() ?? component[1];
    return {
      label: `Shared section "${name}" (may appear on several pages)`,
      route: null,
      shared: true,
    };
  }

  if (path.startsWith("public/")) {
    return {
      label: `Image or file: ${path.slice("public/".length)}`,
      route: null,
      shared: false,
    };
  }

  return {
    label: `Behind-the-scenes file: ${path}`,
    route: null,
    shared: false,
  };
}

export function describeFiles(paths: string[]): AffectedArea[] {
  const seen = new Map<string, AffectedArea>();
  for (const p of paths) {
    const area = describeFile(p);
    if (!seen.has(area.label)) seen.set(area.label, area);
  }
  return [...seen.values()];
}

const SANITY_TYPE_LABELS: Record<string, string> = {
  post: "Blog post",
  author: "Author",
  category: "Blog category",
  page: "Page content",
  pageSeo: "Page search settings",
  siteSettings: "Site settings",
  redirect: "Redirect",
};

export function describeContent(type: string, title: string): string {
  return `${SANITY_TYPE_LABELS[type] ?? "Content"}: ${title}`;
}

const MAX_VALUE_CHARS = 280;

function truncate(text: string): string {
  return text.length > MAX_VALUE_CHARS
    ? `${text.slice(0, MAX_VALUE_CHARS - 1)}…`
    : text;
}

// Portable Text (Sanity rich text) is an array of blocks with children
// spans; show its words, not its JSON.
function portableTextToPlain(value: unknown[]): string | null {
  const blocks = value.filter(
    (b): b is { _type: string; children?: Array<{ text?: string }> } =>
      !!b &&
      typeof b === "object" &&
      (b as { _type?: string })._type === "block",
  );
  if (blocks.length === 0) return null;
  return blocks
    .map((b) => (b.children ?? []).map((c) => c.text ?? "").join(""))
    .join("\n");
}

export function valueToPlain(value: unknown): string {
  if (value === undefined || value === null || value === "") return "(empty)";
  if (typeof value === "string") return truncate(value);
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    const text = portableTextToPlain(value);
    if (text !== null) return truncate(text);
  }
  const obj = value as Record<string, unknown>;
  if (obj && typeof obj === "object" && obj._type === "image") {
    return "(an image)";
  }
  if (obj && typeof obj === "object" && obj._type === "slug") {
    return truncate(String(obj.current ?? ""));
  }
  return truncate(JSON.stringify(value));
}

export interface BeforeAfter {
  label: string;
  before: string;
  after: string;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function humanField(path: string): string {
  return path
    .split(".")
    .map((p) =>
      p
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (c) => c.toUpperCase()),
    )
    .join(" › ");
}

// Field-by-field comparison of two versions of one Sanity document. System
// fields (_id, _rev, _updatedAt...) are skipped. Nested plain objects (like
// the `seo` object) are compared one level down so the person sees
// "Seo › Meta Title" rather than a wall of JSON.
export function sanityBeforeAfter(
  before: Record<string, unknown> | null,
  after: Record<string, unknown> | null,
): BeforeAfter[] {
  const out: BeforeAfter[] = [];
  const b = before ?? {};
  const a = after ?? {};

  const compare = (bv: unknown, av: unknown, path: string, depth: number) => {
    if (JSON.stringify(bv) === JSON.stringify(av)) return;
    if (depth === 0 && isPlainObject(bv) && isPlainObject(av)) {
      const isTyped = typeof av._type === "string" && av._type !== "seo";
      if (!isTyped) {
        const keys = new Set([...Object.keys(bv), ...Object.keys(av)]);
        for (const k of keys) {
          if (k.startsWith("_")) continue;
          compare(bv[k], av[k], `${path}.${k}`, depth + 1);
        }
        return;
      }
    }
    out.push({
      label: humanField(path),
      before: before ? valueToPlain(bv) : "(new)",
      after: after ? valueToPlain(av) : "(removed)",
    });
  };

  const keys = new Set([...Object.keys(b), ...Object.keys(a)]);
  for (const k of keys) {
    if (k.startsWith("_")) continue;
    compare(b[k], a[k], k, 0);
  }
  return out;
}

// Fingerprint of exactly what the person reviewed: the code version (the
// pull request's latest commit) plus each content draft's revision. Publish
// requires it and refuses if it no longer matches, so nothing added after
// the review can slip out with it.
export function reviewToken(
  headSha: string | null,
  drafts: Array<{ id: string; rev: string | null }>,
): string {
  const parts = [
    headSha ?? "no-code",
    ...[...drafts]
      .sort((x, y) => x.id.localeCompare(y.id))
      .map((d) => `${d.id}@${d.rev ?? "none"}`),
  ];
  return createHash("sha256")
    .update(parts.join("|"))
    .digest("hex")
    .slice(0, 16);
}

const CHECK_WORDS: Record<string, string> = {
  success: "Site check passed.",
  pending: "Site check is still running.",
  failure: "Site check failed, this needs a fix before it can go live.",
  unknown: "",
};

// Server-written facts that sit under the AI's own summary, so the person
// always sees what is (and is not) included even if the AI's wording is off.
export function factsLine(input: {
  areas: AffectedArea[];
  content: string[];
  checkStatus: string | null;
  otherPendingCount: number;
}): string {
  const changed = [...input.areas.map((a) => a.label), ...input.content];
  const parts: string[] = [];
  parts.push(
    changed.length
      ? `Changes: ${changed.join("; ")}.`
      : "Nothing has been changed yet.",
  );
  parts.push(
    input.otherPendingCount > 0
      ? `${input.otherPendingCount} other waiting change${input.otherPendingCount === 1 ? " is" : "s are"} NOT included.`
      : "No other changes are included.",
  );
  if (input.checkStatus && CHECK_WORDS[input.checkStatus]) {
    parts.push(CHECK_WORDS[input.checkStatus]);
  }
  return parts.join(" ");
}

export function newChangeKey(now = new Date()): string {
  const stamp = now.toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 8).padEnd(6, "0");
  return `${stamp}-${suffix}`;
}

// Accepts "20261002-ab12cd", "adminChange.20261002-ab12cd" or the branch
// name, so an AI passing back any of the forms it was shown still works.
export function normalizeChangeKey(raw: unknown): string | null {
  const s = String(raw ?? "")
    .trim()
    .replace(/^adminChange\./, "")
    .replace(/^admin\/mcp-/, "");
  return /^\d{8}-[a-z0-9]{6}$/.test(s) ? s : null;
}
