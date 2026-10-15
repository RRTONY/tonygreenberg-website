import { beforeEach, describe, expect, it, vi } from "vitest";
import { writeClient } from "@/lib/sanity/write-client";
import { createDraft, deleteDraft, getDocumentForEditing, listPendingDrafts, patchDraft, publishDraft } from "@/lib/admin/sanity-content";

// The shared write-client fake has no getDocument/createIfNotExists/transaction,
// so this file brings its own.
const tx = vi.hoisted(() => ({ createOrReplace: vi.fn(), delete: vi.fn(), commit: vi.fn() }));
const patch = vi.hoisted(() => ({ set: vi.fn(), commit: vi.fn() }));
vi.mock("@/lib/sanity/write-client", () => ({
  writeClient: {
    getDocument: vi.fn(),
    createIfNotExists: vi.fn(),
    create: vi.fn(async (d: unknown) => d),
    delete: vi.fn(),
    fetch: vi.fn(),
    patch: vi.fn(() => patch),
    transaction: vi.fn(() => tx),
  },
}));

const docs: Record<string, object> = {};
beforeEach(() => {
  for (const k of Object.keys(docs)) delete docs[k];
  vi.mocked(writeClient.getDocument).mockImplementation((async (id: string) => docs[id]) as never);
  patch.set.mockReturnValue(patch);
  patch.commit.mockResolvedValue({ ok: true });
  tx.createOrReplace.mockReturnValue(tx);
  tx.delete.mockReturnValue(tx);
  tx.commit.mockResolvedValue({});
});

describe("getDocumentForEditing", () => {
  it("prefers the draft, whichever id form is passed", async () => {
    docs["drafts.p1"] = { _id: "drafts.p1", title: "Draft" };
    docs["p1"] = { _id: "p1", title: "Live" };
    await expect(getDocumentForEditing("p1")).resolves.toMatchObject({ title: "Draft" });
    await expect(getDocumentForEditing("drafts.p1")).resolves.toMatchObject({ title: "Draft" });
  });

  it("falls back to the published document", async () => {
    docs["p1"] = { _id: "p1", title: "Live" };
    await expect(getDocumentForEditing("drafts.p1")).resolves.toMatchObject({ title: "Live" });
  });
});

describe("patchDraft", () => {
  it("copies the published doc into a draft first, then patches only the draft", async () => {
    docs["p1"] = { _id: "p1", _type: "post", title: "Live" };
    await patchDraft("p1", { title: "New" });
    expect(writeClient.createIfNotExists).toHaveBeenCalledWith({ _id: "drafts.p1", _type: "post", title: "Live" });
    expect(writeClient.patch).toHaveBeenCalledWith("drafts.p1");
    expect(patch.set).toHaveBeenCalledWith({ title: "New" });
  });

  it("patches an existing draft without creating one when there's no published doc", async () => {
    await patchDraft("drafts.new", { title: "x" });
    expect(writeClient.createIfNotExists).not.toHaveBeenCalled();
    expect(writeClient.patch).toHaveBeenCalledWith("drafts.new");
  });
});

describe("createDraft", () => {
  it("creates a drafts.<uuid> document of an allowed type", async () => {
    const doc = (await createDraft("post", { title: "Hi", _id: "evil", _type: "adminChange" })) as { _id: string; _type: string };
    expect(doc._id).toMatch(/^drafts\.[0-9a-f-]{36}$/);
    expect(doc._type).toBe("post");
  });

  it("refuses types outside the allowlist", async () => {
    await expect(createDraft("adminChange", {})).rejects.toThrow(/not in the admin-editable allowlist/);
    await expect(createDraft("seo", {})).rejects.toThrow();
    expect(writeClient.create).not.toHaveBeenCalled();
  });
});

describe("deleteDraft", () => {
  it("only ever deletes the draft id", async () => {
    await deleteDraft("p1");
    await deleteDraft("drafts.p2");
    expect(vi.mocked(writeClient.delete).mock.calls).toEqual([["drafts.p1"], ["drafts.p2"]]);
  });
});

describe("listPendingDrafts", () => {
  it("lists drafts with a title, name or id", async () => {
    vi.mocked(writeClient.fetch).mockResolvedValue([
      { _id: "drafts.a", _type: "post", title: "Essay" },
      { _id: "drafts.b", _type: "author", name: "Tony" },
      { _id: "drafts.c", _type: "redirect" },
    ] as never);
    await expect(listPendingDrafts()).resolves.toEqual([
      { id: "drafts.a", publishedId: "a", type: "post", title: "Essay" },
      { id: "drafts.b", publishedId: "b", type: "author", title: "Tony" },
      { id: "drafts.c", publishedId: "c", type: "redirect", title: "drafts.c" },
    ]);
  });
});

describe("publishDraft", () => {
  it("replaces the published doc with the draft and deletes the draft in one transaction", async () => {
    docs["drafts.p1"] = { _id: "drafts.p1", title: "New" };
    await expect(publishDraft("p1")).resolves.toBe("p1");
    expect(tx.createOrReplace).toHaveBeenCalledWith({ _id: "p1", title: "New" });
    expect(tx.delete).toHaveBeenCalledWith("drafts.p1");
    expect(tx.commit).toHaveBeenCalledTimes(1);
  });

  it("throws when there's no draft", async () => {
    await expect(publishDraft("p1")).rejects.toThrow("No draft found for p1");
    expect(writeClient.transaction).not.toHaveBeenCalled();
  });
});
