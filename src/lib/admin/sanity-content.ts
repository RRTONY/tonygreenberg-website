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

// Ensure a draft exists before patching it — createIfNotExists is a no-op if
// a draft is already in progress.
async function ensureDraft(id: string): Promise<string> {
  const draftId = toDraftId(id);
  const base = await writeClient.getDocument(toPublishedId(id));
  if (base) await writeClient.createIfNotExists({ ...base, _id: draftId });
  return draftId;
}

export async function patchDraft(id: string, patch: Record<string, unknown>) {
  const draftId = await ensureDraft(id);
  return writeClient.patch(draftId).set(patch).commit();
}

export interface UploadedImage {
  assetId: string;
  url: string;
  width?: number;
  height?: number;
}

// Uploads into Sanity's asset library only. An asset on its own shows
// nowhere on the site until a document references it, and that reference is
// always written to a draft (attachImageToDraft / patchDraft).
export async function uploadImageAsset(
  bytes: Buffer,
  filename: string,
): Promise<UploadedImage> {
  const asset = await writeClient.assets.upload("image", bytes, { filename });
  const dims = (
    asset as { metadata?: { dimensions?: { width?: number; height?: number } } }
  ).metadata?.dimensions;
  return {
    assetId: asset._id,
    url: asset.url,
    width: dims?.width,
    height: dims?.height,
  };
}

// Where an uploaded picture can be placed on a post. heroImage is a single
// image (replaced); body / updatedBody are the essay's two text versions,
// where the picture becomes an inline image block (alt doubles as the
// caption when there's no caption; see lib/sanity/portable-text.tsx).
export const IMAGE_FIELDS = {
  heroImage: "single",
  body: "inline",
  updatedBody: "inline",
} as const;
export type ImageField = keyof typeof IMAGE_FIELDS;

export function isImageField(field: string): field is ImageField {
  return Object.hasOwn(IMAGE_FIELDS, field);
}

const BLOCK_KEY = /^[A-Za-z0-9_-]{1,64}$/;

export async function attachImageToDraft(
  id: string,
  field: ImageField,
  image: { assetId: string; alt: string; caption?: string },
  afterBlockKey?: string,
): Promise<{ key?: string }> {
  const asset = { _type: "reference", _ref: image.assetId };
  if (IMAGE_FIELDS[field] === "single") {
    const draftId = await ensureDraft(id);
    await writeClient
      .patch(draftId)
      .set({ [field]: { _type: "image", asset } })
      .commit();
    return {};
  }

  if (afterBlockKey !== undefined) {
    const current = (await getDocumentForEditing(id)) as Record<
      string,
      unknown
    > | null;
    const blocks = Array.isArray(current?.[field])
      ? (current[field] as Array<{ _key?: string }>)
      : [];
    if (
      !BLOCK_KEY.test(afterBlockKey) ||
      !blocks.some((b) => b._key === afterBlockKey)
    ) {
      throw new Error(
        `No paragraph with _key "${afterBlockKey}" in ${field}. Read the document with sanity_get_document and use a real _key, or leave afterBlockKey out to add the picture at the end.`,
      );
    }
  }

  const key = randomUUID().replace(/-/g, "").slice(0, 12);
  const block = {
    _type: "image",
    _key: key,
    asset,
    alt: image.alt,
    ...(image.caption ? { caption: image.caption } : {}),
  };
  const draftId = await ensureDraft(id);
  const patch = writeClient.patch(draftId).setIfMissing({ [field]: [] });
  await (
    afterBlockKey
      ? patch.insert("after", `${field}[_key=="${afterBlockKey}"]`, [block])
      : patch.append(field, [block])
  ).commit();
  return { key };
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
