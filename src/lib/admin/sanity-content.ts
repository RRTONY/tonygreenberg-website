import "server-only";
import { randomUUID } from "crypto";
import { writeClient } from "@/lib/sanity/write-client";
import { isSanityTypeAllowed } from "@/lib/admin/guardrails";

const DRAFT_PREFIX = "drafts.";

function toDraftId(id: string): string {
  return id.startsWith(DRAFT_PREFIX) ? id : `${DRAFT_PREFIX}${id}`;
}

function toPublishedId(id: string): string {
  return id.startsWith(DRAFT_PREFIX) ? id.slice(DRAFT_PREFIX.length) : id;
}

// Reads whichever exists — the draft if one's in progress, else the published
// doc — so the agent always sees the latest version before proposing a patch.
export async function getDocumentForEditing(id: string) {
  const draftId = toDraftId(id);
  const publishedId = toPublishedId(id);
  const draft = await writeClient.getDocument(draftId);
  if (draft) return draft;
  return writeClient.getDocument(publishedId);
}

export async function patchDraft(id: string, patch: Record<string, unknown>) {
  const draftId = toDraftId(id);
  const publishedId = toPublishedId(id);
  const base = await writeClient.getDocument(publishedId);
  if (base) {
    // Ensure a draft exists before patching it — createIfNotExists is a
    // no-op if a draft is already in progress.
    await writeClient.createIfNotExists({ ...base, _id: draftId });
  }
  return writeClient.patch(draftId).set(patch).commit();
}

export async function createDraft(
  type: string,
  fields: Record<string, unknown>,
) {
  if (!isSanityTypeAllowed(type)) {
    throw new Error(
      `Sanity type "${type}" is not in the admin-editable allowlist`,
    );
  }
  const draftId = `${DRAFT_PREFIX}${randomUUID()}`;
  return writeClient.create({ ...fields, _id: draftId, _type: type });
}

// Only ever a draft (drafts.<id>), never a published document.
export async function deleteDraft(id: string) {
  await writeClient.delete(toDraftId(id));
}

export interface PendingDraft {
  id: string;
  publishedId: string;
  type: string;
  title: string;
}

export async function listPendingDrafts(): Promise<PendingDraft[]> {
  const drafts = await writeClient.fetch<
    Array<{ _id: string; _type: string; title?: string; name?: string }>
  >(`*[_id in path("drafts.**")]{_id, _type, title, name}`);
  return drafts.map((d) => ({
    id: d._id,
    publishedId: toPublishedId(d._id),
    type: d._type,
    title: d.title || d.name || d._id,
  }));
}

export async function publishDraft(id: string) {
  const draftId = toDraftId(id);
  const publishedId = toPublishedId(id);
  const draft = await writeClient.getDocument(draftId);
  if (!draft) throw new Error(`No draft found for ${id}`);
  await writeClient
    .transaction()
    .createOrReplace({ ...draft, _id: publishedId })
    .delete(draftId)
    .commit();
  return publishedId;
}
