import { randomUUID } from "crypto";
import { writeClient } from "@/lib/sanity/write-client";
import * as gh from "@/lib/admin/github-client";
import { ADMIN_BRANCH_PREFIX } from "@/lib/admin/guardrails";
import { listPendingDrafts, publishDraft } from "@/lib/admin/sanity-content";
import { waitForChecks } from "@/lib/admin/tools";
import type { McpUser } from "@/lib/admin/mcp-auth";
import {
  STATUS_LABELS,
  describeContent,
  describeFiles,
  factsLine,
  newChangeKey,
  reviewToken,
  sanityBeforeAfter,
  type AffectedArea,
  type BeforeAfter,
  type ChangeStatus,
} from "@/lib/admin/change-describe";

// One "change set" per request the person makes in ChatGPT/Claude. Each has
// its own GitHub branch + pull request (code) and its own list of Sanity
// drafts (content), so publishing one request never takes another request,
// or someone's half-finished edit in Sanity Studio, live with it.
//
// The record lives in Sanity as an `adminChange` document with a dotted id
// (`adminChange.<key>`). Dotted ids are never readable without a token, even
// on a public dataset, and `adminChange` is not in the agent's editable
// type allowlist, so the agent can't rewrite history. The record keeps a
// copy of each content item as it was before the change, which is what
// "undo" restores, and is the change history (it stays after publish or
// discard).

const DOC_TYPE = "adminChange";
const DRAFT_PREFIX = "drafts.";
const OPEN_STATUSES: ChangeStatus[] = ["draft", "ready_for_review"];

export interface ChangeContentEntry {
  _key: string;
  id: string;
  type: string;
  title: string;
  // "save" publishes this change's draft; "delete" removes the live
  // document (only used when undoing the creation of something new).
  action: "save" | "delete";
  // The live document as it was when this change first touched it (null if
  // it didn't exist yet). Used for before/after, conflict checks and undo.
  beforeJson: string | null;
  publishedRev?: string | null;
}

export interface ChangeSet {
  _id: string;
  key: string;
  title: string;
  request: string;
  requestedBy: { name: string; email: string };
  status: ChangeStatus;
  createdAt: string;
  branch: string | null;
  prNumber: number | null;
  summary?: string | null;
  beforeAfter?: Array<BeforeAfter & { _key: string }>;
  files?: Array<{ _key: string; path: string; status: string }>;
  areas?: string[];
  content?: ChangeContentEntry[];
  submittedAt?: string | null;
  publishedAt?: string | null;
  publishedBy?: string | null;
  mergeSha?: string | null;
  discardedAt?: string | null;
  discardedBy?: string | null;
  undoes?: string | null;
  undoneBy?: string | null;
  publishNote?: string | null;
}

export type Result<T> = ({ ok: true } & T) | { ok: false; error: string };

function fail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}

export function changeDocId(key: string): string {
  return `${DOC_TYPE}.${key}`;
}

export function branchForChange(key: string): string {
  return `${ADMIN_BRANCH_PREFIX}${key}`;
}

function draftId(id: string): string {
  return id.startsWith(DRAFT_PREFIX) ? id : `${DRAFT_PREFIX}${id}`;
}

function arrayKey(): string {
  return randomUUID().replace(/-/g, "").slice(0, 12);
}

function withoutSystemFields(doc: Record<string, unknown>) {
  const rest = { ...doc };
  delete rest._rev;
  delete rest._createdAt;
  delete rest._updatedAt;
  return rest;
}

function parseJson(json: string | null): Record<string, unknown> | null {
  if (!json) return null;
  try {
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function prUrl(prNumber: number): string {
  return `https://github.com/${gh.GITHUB_REPO.owner}/${gh.GITHUB_REPO.repo}/pull/${prNumber}`;
}

export async function getChangeSet(key: string): Promise<ChangeSet | null> {
  return (await writeClient.getDocument(changeDocId(key))) as ChangeSet | null;
}

export async function listChangeSets(opts: {
  statuses?: ChangeStatus[];
  limit?: number;
}): Promise<ChangeSet[]> {
  const limit = Math.min(Math.max(opts.limit ?? 20, 1), 100);
  const filter = opts.statuses?.length ? " && status in $statuses" : "";
  return writeClient.fetch<ChangeSet[]>(
    `*[_type == $type${filter}] | order(createdAt desc)[0...$limit]`,
    { type: DOC_TYPE, statuses: opts.statuses ?? [], limit },
  );
}

export function listOpenChangeSets(): Promise<ChangeSet[]> {
  return listChangeSets({ statuses: OPEN_STATUSES, limit: 100 });
}

export async function patchChangeSet(
  key: string,
  fields: Partial<ChangeSet>,
): Promise<void> {
  await writeClient.patch(changeDocId(key)).set(fields).commit();
}

export async function createChangeSet(input: {
  title: string;
  request: string;
  user: McpUser;
  undoes?: string;
}): Promise<ChangeSet> {
  const key = newChangeKey();
  const doc: ChangeSet = {
    _id: changeDocId(key),
    key,
    title: input.title.slice(0, 120),
    request: input.request.slice(0, 2000),
    requestedBy: { name: input.user.name, email: input.user.email },
    status: "draft",
    createdAt: new Date().toISOString(),
    branch: null,
    prNumber: null,
    content: [],
    undoes: input.undoes ?? null,
  };
  await writeClient.create({ ...doc, _type: DOC_TYPE });
  return doc;
}

export function isOpen(change: ChangeSet): boolean {
  return OPEN_STATUSES.includes(change.status);
}

// Any edit after "Ready for review" sends the change back to Draft, so the
// summary and review always describe the latest version.
export async function markEdited(change: ChangeSet): Promise<void> {
  if (change.status === "ready_for_review") {
    await patchChangeSet(change.key, { status: "draft", submittedAt: null });
    change.status = "draft";
  }
}

// Called before a content edit (and right after a content item is created)
// to tie that Sanity document to this change. Refuses if another waiting
// change already owns it, or if someone has unsaved edits on it in Sanity
// Studio (publishing this change would otherwise take those live too).
export async function claimContent(
  change: ChangeSet,
  item: { id: string; type: string; title: string; isNew: boolean },
): Promise<string | null> {
  const existing = change.content ?? [];
  if (existing.some((c) => c.id === item.id)) return null;

  const owner = (await listOpenChangeSets()).find(
    (c) =>
      c.key !== change.key && (c.content ?? []).some((e) => e.id === item.id),
  );
  if (owner) {
    return `"${item.title}" is already part of another waiting change ("${owner.title}", ${owner.key}). Publish or discard that change first, so the two don't get mixed up.`;
  }

  let beforeJson: string | null = null;
  if (!item.isNew) {
    const [draft, published] = await Promise.all([
      writeClient.getDocument(draftId(item.id)),
      writeClient.getDocument(item.id),
    ]);
    if (draft) {
      return `"${item.title}" has unsaved edits made directly in Sanity Studio. Publish or discard those in Studio first, so they don't go live with this change by accident.`;
    }
    beforeJson = published ? JSON.stringify(published) : null;
  }

  const entry: ChangeContentEntry = {
    _key: arrayKey(),
    id: item.id,
    type: item.type,
    title: item.title,
    action: "save",
    beforeJson,
  };
  await writeClient
    .patch(changeDocId(change.key))
    .setIfMissing({ content: [] })
    .append("content", [entry])
    .commit();
  change.content = [...existing, entry];
  return null;
}

export interface ContentReview {
  id: string;
  label: string;
  action: "save" | "delete";
  rev: string | null;
  missingDraft: boolean;
  beforeAfter: BeforeAfter[];
}

export interface ChangeReview {
  changeId: string;
  title: string;
  status: ChangeStatus;
  statusLabel: string;
  requestedBy: string;
  createdAt: string;
  request: string;
  summary: string | null;
  facts: string;
  areas: AffectedArea[];
  files: Array<{ path: string; status: string }>;
  content: ContentReview[];
  beforeAfter: BeforeAfter[];
  previewUrl: string | null;
  previewLinks: Array<{ label: string; url: string }>;
  checkStatus: string | null;
  checkNote?: string;
  failingChecks: gh.FailingCheck[];
  prUrl: string | null;
  reviewToken: string;
  headSha: string | null;
  canPublish: boolean;
  blockers: string[];
  undoes: string | null;
}

async function reviewContent(change: ChangeSet): Promise<ContentReview[]> {
  return Promise.all(
    (change.content ?? []).map(async (entry) => {
      const before = parseJson(entry.beforeJson);
      const label = describeContent(entry.type, entry.title);
      if (entry.action === "delete") {
        const live = (await writeClient.getDocument(entry.id)) as {
          _rev?: string;
        } | null;
        return {
          id: entry.id,
          label: `${label} (will be removed)`,
          action: entry.action,
          rev: live?._rev ?? null,
          missingDraft: false,
          beforeAfter: sanityBeforeAfter(before, null),
        };
      }
      const draft = (await writeClient.getDocument(
        draftId(entry.id),
      )) as Record<string, unknown> | null;
      return {
        id: entry.id,
        label,
        action: entry.action,
        rev: (draft?._rev as string | undefined) ?? null,
        missingDraft: !draft,
        beforeAfter: draft ? sanityBeforeAfter(before, draft) : [],
      };
    }),
  );
}

// Everything the person needs to decide: what will go live (pages and
// content, in plain words), before/after, the site check, preview links,
// and a fingerprint (reviewToken) that Publish must echo back.
export async function buildReview(
  change: ChangeSet,
  otherPendingCount: number,
): Promise<ChangeReview> {
  let files: Array<{ path: string; status: string }> = [];
  let headSha: string | null = null;
  let checks: (gh.PRChecksDetail & { note?: string }) | null = null;

  if (change.prNumber && isOpen(change)) {
    const [compare, sha, detail] = await Promise.all([
      gh.compareToDefaultBranch(branchForChange(change.key)),
      gh.getPRHeadSha(change.prNumber),
      waitForChecks(change.prNumber),
    ]);
    files = compare.files.map((f) => ({ path: f.path, status: f.status }));
    headSha = sha;
    checks = detail;
  } else if (!isOpen(change)) {
    files = (change.files ?? []).map((f) => ({
      path: f.path,
      status: f.status,
    }));
  }

  const content = isOpen(change) ? await reviewContent(change) : [];
  const areas = describeFiles(files.map((f) => f.path));
  const contentLabels = isOpen(change)
    ? content.map((c) => c.label)
    : (change.content ?? []).map((c) => describeContent(c.type, c.title));
  const previewUrl = checks?.previewUrl ?? null;

  const blockers: string[] = [];
  if (change.status !== "ready_for_review") {
    blockers.push(
      change.status === "draft"
        ? "Still being worked on. The AI needs to finish and submit it for review."
        : `Already ${STATUS_LABELS[change.status].toLowerCase()}.`,
    );
  }
  if (files.length === 0 && content.length === 0 && isOpen(change)) {
    blockers.push("Nothing has been changed yet.");
  }
  if (checks?.status === "failure") blockers.push("The site check failed.");
  if (checks?.status === "pending")
    blockers.push("The site check is still running.");
  if (content.some((c) => c.missingDraft)) {
    blockers.push(
      "Some content edits are missing (they may have been discarded in Sanity Studio).",
    );
  }

  return {
    changeId: change.key,
    title: change.title,
    status: change.status,
    statusLabel: STATUS_LABELS[change.status],
    requestedBy: change.requestedBy?.name ?? "Unknown",
    createdAt: change.createdAt,
    request: change.request,
    summary: change.summary ?? null,
    facts: factsLine({
      areas,
      content: contentLabels,
      checkStatus: checks?.status ?? null,
      otherPendingCount,
    }),
    areas,
    files,
    content,
    beforeAfter: [
      ...(change.beforeAfter ?? []).map(({ label, before, after }) => ({
        label,
        before,
        after,
      })),
      ...content.flatMap((c) =>
        c.beforeAfter.map((b) => ({ ...b, label: `${c.label} › ${b.label}` })),
      ),
    ],
    previewUrl,
    previewLinks: previewUrl
      ? areas
          .filter((a) => a.route)
          .map((a) => ({ label: a.label, url: `${previewUrl}${a.route}` }))
      : [],
    checkStatus: checks?.status ?? null,
    ...(checks?.note ? { checkNote: checks.note } : {}),
    failingChecks: checks?.failingChecks ?? [],
    prUrl: change.prNumber ? prUrl(change.prNumber) : null,
    reviewToken: reviewToken(
      headSha,
      content.map((c) => ({ id: c.id, rev: c.rev })),
    ),
    headSha,
    canPublish: blockers.length === 0,
    blockers,
    undoes: change.undoes ?? null,
  };
}

export interface PendingOverview {
  changes: Array<{
    changeId: string;
    title: string;
    status: ChangeStatus;
    statusLabel: string;
    requestedBy: string;
    createdAt: string;
  }>;
  // Waiting changes from before change sets existed (no record): can be
  // discarded, not published.
  olderChanges: Array<{
    changeId: string | null;
    prNumber: number;
    prUrl: string;
  }>;
  // Drafts in Sanity Studio that belong to no change. Never published by
  // this server; listed so nobody is surprised they exist.
  unrelatedDrafts: Array<{ id: string; label: string }>;
}

export async function pendingOverview(
  open?: ChangeSet[],
): Promise<PendingOverview> {
  const changes = open ?? (await listOpenChangeSets());
  const [prs, drafts] = await Promise.all([
    gh.listOpenAdminPRs(ADMIN_BRANCH_PREFIX),
    listPendingDrafts(),
  ]);
  const ownedPrs = new Set(changes.map((c) => c.prNumber).filter(Boolean));
  const ownedDrafts = new Set(
    changes.flatMap((c) => (c.content ?? []).map((e) => draftId(e.id))),
  );
  return {
    changes: changes.map((c) => ({
      changeId: c.key,
      title: c.title,
      status: c.status,
      statusLabel: STATUS_LABELS[c.status],
      requestedBy: c.requestedBy?.name ?? "Unknown",
      createdAt: c.createdAt,
    })),
    olderChanges: prs
      .filter((pr) => !ownedPrs.has(pr.number))
      .map((pr) => ({
        changeId: pr.branch.slice(ADMIN_BRANCH_PREFIX.length) || null,
        prNumber: pr.number,
        prUrl: pr.url,
      })),
    unrelatedDrafts: drafts
      .filter((d) => !ownedDrafts.has(d.id))
      .map((d) => ({ id: d.id, label: describeContent(d.type, d.title) })),
  };
}

// Keeps records and GitHub in step when someone acts in GitHub directly:
// a change merged there is marked Published, one closed there is marked
// Discarded (its content drafts thrown away, as with Discard), and any
// leftover AI branch with no open pull request and no waiting change is
// deleted. Runs when waiting changes are listed (a person's action), never
// on a timer. Failures are swallowed: tidying must never block a review.
export async function reconcileWithGitHub(
  open: ChangeSet[],
): Promise<ChangeSet[]> {
  const stillOpen: ChangeSet[] = [];
  for (const change of open) {
    if (!change.prNumber) {
      stillOpen.push(change);
      continue;
    }
    try {
      const pr = await gh.getPRState(change.prNumber);
      if (pr.open) {
        stillOpen.push(change);
      } else if (pr.merged) {
        await patchChangeSet(change.key, {
          status: "published",
          publishedAt: new Date().toISOString(),
          publishedBy: "Merged directly in GitHub",
          mergeSha: pr.mergeSha,
          publishNote: (change.content ?? []).length
            ? "The code was merged directly in GitHub, so this change's content edits were not published. Ask again for them."
            : null,
        });
        for (const entry of change.content ?? []) {
          if (entry.action === "save") {
            await writeClient.delete(draftId(entry.id)).catch(() => {});
          }
        }
        await gh.deleteBranch(branchForChange(change.key)).catch(() => {});
      } else {
        for (const entry of change.content ?? []) {
          if (entry.action === "save") {
            await writeClient.delete(draftId(entry.id)).catch(() => {});
          }
        }
        await patchChangeSet(change.key, {
          status: "discarded",
          discardedAt: new Date().toISOString(),
          discardedBy: "Closed directly in GitHub",
        });
        await gh.deleteBranch(branchForChange(change.key)).catch(() => {});
      }
    } catch {
      stillOpen.push(change);
    }
  }

  try {
    const [branches, prs] = await Promise.all([
      gh.listBranches(ADMIN_BRANCH_PREFIX),
      gh.listOpenAdminPRs(ADMIN_BRANCH_PREFIX),
    ]);
    const keep = new Set([
      ...prs.map((p) => p.branch),
      ...stillOpen.map((c) => branchForChange(c.key)),
    ]);
    for (const branch of branches) {
      if (!keep.has(branch)) await gh.deleteBranch(branch).catch(() => {});
    }
  } catch {
    // Listing branches failed; try again next time.
  }
  return stillOpen;
}

export async function submitForReview(
  change: ChangeSet,
  summary: string,
  beforeAfter: BeforeAfter[],
): Promise<Result<{ status: ChangeStatus }>> {
  if (!isOpen(change)) {
    return fail(
      `This change is already ${STATUS_LABELS[change.status].toLowerCase()}.`,
    );
  }
  let files: Array<{ path: string; status: string }> = [];
  if (change.branch) {
    const compare = await gh.compareToDefaultBranch(change.branch);
    files = compare.files.map((f) => ({ path: f.path, status: f.status }));
  }
  if (files.length === 0 && (change.content ?? []).length === 0) {
    return fail(
      "Nothing has been changed in this change yet, so there's nothing to review.",
    );
  }
  await patchChangeSet(change.key, {
    status: "ready_for_review",
    summary: summary.slice(0, 1000),
    beforeAfter: beforeAfter.slice(0, 20).map((b) => ({
      _key: arrayKey(),
      label: b.label.slice(0, 120),
      before: b.before.slice(0, 500),
      after: b.after.slice(0, 500),
    })),
    files: files.map((f) => ({ _key: arrayKey(), ...f })),
    areas: describeFiles(files.map((f) => f.path)).map((a) => a.label),
    submittedAt: new Date().toISOString(),
  });
  return { ok: true, status: "ready_for_review" };
}

function publishedRevMismatch(
  entry: ChangeContentEntry,
  liveRev: string | null,
) {
  const before = parseJson(entry.beforeJson);
  const expected = (before?._rev as string | undefined) ?? null;
  return expected !== liveRev;
}

export async function publishChange(
  key: string,
  token: string,
  user: McpUser,
): Promise<
  Result<{ changeId: string; mergeSha: string | null; published: string[] }>
> {
  const change = await getChangeSet(key);
  if (!change) return fail(`No change found with id ${key}.`);
  if (change.status !== "ready_for_review") {
    return fail(
      change.status === "draft"
        ? "This change is still a draft. The AI must finish it and submit it for review first."
        : `This change is already ${STATUS_LABELS[change.status].toLowerCase()}.`,
    );
  }

  const content = await reviewContent(change);
  const headSha = change.prNumber
    ? await gh.getPRHeadSha(change.prNumber)
    : null;
  const current = reviewToken(
    headSha,
    content.map((c) => ({ id: c.id, rev: c.rev })),
  );
  if (current !== token) {
    return fail(
      "This change was updated after it was reviewed. Review it again (list_pending_changes) before publishing.",
    );
  }
  if (!change.prNumber && content.length === 0) {
    return fail("This change has nothing in it to publish.");
  }
  if (content.some((c) => c.missingDraft)) {
    return fail(
      "Some content edits in this change are missing (perhaps discarded in Sanity Studio). Discard this change and ask again.",
    );
  }

  // Check everything before changing anything, so a refusal never leaves
  // half a change live.
  for (const entry of change.content ?? []) {
    const live = (await writeClient.getDocument(entry.id)) as {
      _rev?: string;
    } | null;
    if (
      entry.beforeJson !== null &&
      publishedRevMismatch(entry, live?._rev ?? null)
    ) {
      return fail(
        `"${entry.title}" was changed by someone else after this change started. Discard this change and ask again so nothing gets overwritten.`,
      );
    }
  }
  if (change.prNumber) {
    const status = await gh.getPRCombinedStatus(change.prNumber);
    if (status === "failure") {
      return fail(
        "The site check failed for this change. It needs a fix before it can go live.",
      );
    }
    if (status === "pending") {
      return fail("The site check is still running. Try again in a minute.");
    }
  }

  let mergeSha: string | null = null;
  if (change.prNumber) {
    try {
      const merged = await gh.mergePR(change.prNumber, headSha ?? undefined);
      if (!merged.merged) return fail("GitHub could not merge this change.");
      mergeSha = merged.sha;
    } catch (err) {
      const status = gh.errorStatus(err);
      if (status === 409) {
        return fail(
          "This change was updated after it was reviewed. Review it again before publishing.",
        );
      }
      if (status === 405) {
        return fail(
          "This change can't go live as is, most likely because another published change edited the same file. Discard it and ask again.",
        );
      }
      throw err;
    }
    try {
      await gh.deleteBranch(branchForChange(change.key));
    } catch {
      // GitHub may already have deleted it on merge.
    }
  }

  const published: string[] = [];
  const contentAfter: ChangeContentEntry[] = [];
  let publishNote: string | null = null;
  try {
    for (const entry of change.content ?? []) {
      if (entry.action === "delete") {
        await writeClient
          .transaction()
          .delete(entry.id)
          .delete(draftId(entry.id))
          .commit();
        contentAfter.push({ ...entry, publishedRev: null });
      } else {
        await publishDraft(entry.id);
        const live = (await writeClient.getDocument(entry.id)) as {
          _rev?: string;
        } | null;
        contentAfter.push({ ...entry, publishedRev: live?._rev ?? null });
      }
      published.push(entry.id);
    }
  } catch (err) {
    publishNote = `Code went live but some content didn't: ${String(err)}`;
  }

  // Snapshot of what actually went live, for history. Falls back to the
  // list saved at review time if GitHub can't be read right now.
  let files = change.files ?? [];
  if (mergeSha) {
    try {
      const merged = await gh.getCommitFiles(mergeSha);
      files = merged.files.map((f) => ({
        _key: arrayKey(),
        path: f.path,
        status: f.status,
      }));
    } catch {
      // keep the review-time list
    }
  }

  await patchChangeSet(change.key, {
    status: "published",
    publishedAt: new Date().toISOString(),
    publishedBy: user.name,
    mergeSha,
    files,
    areas: describeFiles(files.map((f) => f.path)).map((a) => a.label),
    content: [
      ...contentAfter,
      ...(change.content ?? []).filter((e) => !published.includes(e.id)),
    ],
    publishNote,
  });
  if (change.undoes) {
    await patchChangeSet(change.undoes, { undoneBy: change.key });
  }
  if (publishNote) return fail(publishNote);
  return { ok: true, changeId: change.key, mergeSha, published };
}

export async function discardChange(
  key: string,
  user: McpUser,
): Promise<Result<{ changeId: string; olderChange?: boolean }>> {
  const change = await getChangeSet(key);
  if (!change) {
    // A waiting change from before change sets existed: just close it.
    const pr = (await gh.listOpenAdminPRs(ADMIN_BRANCH_PREFIX)).find(
      (p) => p.branch === branchForChange(key),
    );
    if (!pr) return fail(`No waiting change found with id ${key}.`);
    await gh.closePR(pr.number);
    await gh.deleteBranch(pr.branch).catch(() => {});
    return { ok: true, changeId: key, olderChange: true };
  }
  if (!isOpen(change)) {
    return fail(
      `This change is already ${STATUS_LABELS[change.status].toLowerCase()}, so it can't be discarded.`,
    );
  }

  if (change.prNumber) await gh.closePR(change.prNumber);
  if (change.branch) await gh.deleteBranch(change.branch).catch(() => {});
  for (const entry of change.content ?? []) {
    if (entry.action === "save") {
      await writeClient.delete(draftId(entry.id)).catch(() => {});
    }
  }
  await patchChangeSet(change.key, {
    status: "discarded",
    discardedAt: new Date().toISOString(),
    discardedBy: user.name,
  });
  return { ok: true, changeId: change.key };
}

// Undo a published change: builds a NEW change (marked "Undo: ...") that
// puts every file and content item back the way it was before. It goes
// through the same review and Publish as anything else, so nothing changes
// on the live site until someone approves it. Refuses if any of those files
// or items were changed again since, rather than wiping out later work.
export async function undoChange(
  key: string,
  user: McpUser,
): Promise<Result<{ changeId: string; title: string }>> {
  const orig = await getChangeSet(key);
  if (!orig) return fail(`No change found with id ${key}.`);
  if (orig.status !== "published") {
    return fail(
      "Only a published change can be undone. A waiting change can simply be discarded.",
    );
  }
  if (orig.undoneBy) {
    return fail(`This change was already undone by change ${orig.undoneBy}.`);
  }
  const open = await listOpenChangeSets();
  const pendingUndo = open.find((c) => c.undoes === key);
  if (pendingUndo) {
    return fail(
      `An undo for this change is already waiting for review (${pendingUndo.key}).`,
    );
  }

  const conflicts: string[] = [];
  const fileStates: Array<{ path: string; sha: string | null }> = [];
  if (orig.mergeSha) {
    const base = await gh.getDefaultBranch();
    const { parentSha, files } = await gh.getCommitFiles(orig.mergeSha);
    for (const f of files) {
      const paths =
        f.status === "renamed" && f.previousPath
          ? [f.path, f.previousPath]
          : [f.path];
      for (const p of paths) {
        const [now, atMerge] = await Promise.all([
          gh.getFileSha(p, base),
          gh.getFileSha(p, orig.mergeSha),
        ]);
        if (now !== atMerge) conflicts.push(describeFiles([p])[0].label);
      }
      if (f.status === "renamed" && f.previousPath) {
        fileStates.push({ path: f.path, sha: null });
        fileStates.push({
          path: f.previousPath,
          sha: await gh.getFileSha(f.previousPath, parentSha),
        });
      } else {
        fileStates.push({
          path: f.path,
          sha:
            f.status === "added"
              ? null
              : await gh.getFileSha(f.path, parentSha),
        });
      }
    }
  }

  const live = new Map<string, Record<string, unknown> | null>();
  for (const entry of orig.content ?? []) {
    const doc = (await writeClient.getDocument(entry.id)) as Record<
      string,
      unknown
    > | null;
    live.set(entry.id, doc);
    if (
      ((doc?._rev as string | undefined) ?? null) !==
      (entry.publishedRev ?? null)
    ) {
      conflicts.push(describeContent(entry.type, entry.title));
      continue;
    }
    const owner = open.find((c) =>
      (c.content ?? []).some((e) => e.id === entry.id),
    );
    if (owner) {
      return fail(
        `"${entry.title}" is part of a waiting change ("${owner.title}"). Publish or discard that first.`,
      );
    }
    if (await writeClient.getDocument(draftId(entry.id))) {
      return fail(
        `"${entry.title}" has unsaved edits in Sanity Studio. Publish or discard those first.`,
      );
    }
  }

  if (conflicts.length) {
    return fail(
      `Can't undo automatically: these were changed again after this change went live, and undoing would wipe out that later work too: ${[...new Set(conflicts)].join("; ")}. Ask for the specific fix you want instead.`,
    );
  }
  if (fileStates.length === 0 && (orig.content ?? []).length === 0) {
    return fail("This change has nothing recorded that can be undone.");
  }

  const when = orig.publishedAt ? orig.publishedAt.slice(0, 10) : "earlier";
  const change = await createChangeSet({
    title: `Undo: ${orig.title}`.slice(0, 120),
    request: `Put things back the way they were before "${orig.title}" (published ${when}).`,
    user,
    undoes: orig.key,
  });

  let branch: string | null = null;
  let prNumber: number | null = null;
  if (fileStates.length) {
    branch = branchForChange(change.key);
    await gh.createBranchWithFileStates(
      branch,
      fileStates,
      `Undo "${orig.title}" [by ${user.name}]`,
    );
    const pr = await gh.openPR(
      branch,
      change.title,
      `Undo of change ${orig.key} (PR #${orig.prNumber ?? "n/a"}), requested by ${user.name} via the MCP admin server.`,
    );
    prNumber = pr.number;
  }

  const content: ChangeContentEntry[] = [];
  for (const entry of orig.content ?? []) {
    const current = live.get(entry.id) ?? null;
    const restore = parseJson(entry.beforeJson);
    if (!restore && !current) continue;
    if (restore) {
      await writeClient.createOrReplace({
        ...withoutSystemFields(restore),
        _id: draftId(entry.id),
        _type: String(restore._type),
      });
    }
    content.push({
      _key: arrayKey(),
      id: entry.id,
      type: entry.type,
      title: entry.title,
      action: restore ? "save" : "delete",
      beforeJson: current ? JSON.stringify(current) : null,
    });
  }

  const files = fileStates.map((f) => ({
    _key: arrayKey(),
    path: f.path,
    status: f.sha ? "modified" : "removed",
  }));
  const areas = describeFiles(files.map((f) => f.path)).map((a) => a.label);
  await patchChangeSet(change.key, {
    branch,
    prNumber,
    content,
    files,
    areas,
    status: "ready_for_review",
    submittedAt: new Date().toISOString(),
    summary: `Puts things back the way they were before "${orig.title}" (published ${when}).`,
  });
  return { ok: true, changeId: change.key, title: change.title };
}

export interface HistoryEntry {
  changeId: string;
  title: string;
  status: ChangeStatus;
  statusLabel: string;
  requestedBy: string;
  createdAt: string;
  publishedAt: string | null;
  publishedBy: string | null;
  discardedAt: string | null;
  discardedBy: string | null;
  changed: string[];
  summary: string | null;
  undoes: string | null;
  undoneBy: string | null;
  canUndo: boolean;
}

export async function changeHistory(limit: number): Promise<HistoryEntry[]> {
  const records = await listChangeSets({ limit });
  return records.map((c) => ({
    changeId: c.key,
    title: c.title,
    status: c.status,
    statusLabel: STATUS_LABELS[c.status],
    requestedBy: c.requestedBy?.name ?? "Unknown",
    createdAt: c.createdAt,
    publishedAt: c.publishedAt ?? null,
    publishedBy: c.publishedBy ?? null,
    discardedAt: c.discardedAt ?? null,
    discardedBy: c.discardedBy ?? null,
    changed: [
      ...(c.areas ?? []),
      ...(c.content ?? []).map((e) => describeContent(e.type, e.title)),
    ],
    summary: c.summary ?? null,
    undoes: c.undoes ?? null,
    undoneBy: c.undoneBy ?? null,
    canUndo: c.status === "published" && !c.undoneBy,
  }));
}
