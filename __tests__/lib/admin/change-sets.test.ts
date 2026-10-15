import { beforeEach, describe, expect, it, vi } from "vitest";
import * as gh from "@/lib/admin/github-client";
import { lintChangedFiles } from "@/lib/admin/code-check";
import { listPendingDrafts, publishDraft } from "@/lib/admin/sanity-content";
import { waitForChecks } from "@/lib/admin/tools";
import { reviewToken } from "@/lib/admin/change-describe";
import * as cs from "@/lib/admin/change-sets";
import type { ChangeSet } from "@/lib/admin/change-sets";

// A small in-memory Sanity: documents by id, plus a record of every patch.
const db = vi.hoisted(() => ({ docs: new Map<string, Record<string, unknown>>(), patches: [] as { id: string; set?: object; append?: unknown[] }[] }));
vi.mock("@/lib/sanity/write-client", () => {
  const patch = (id: string) => {
    const p: { id: string; set?: object; append?: unknown[] } = { id };
    const chain = {
      set: (f: object) => ((p.set = f), chain),
      setIfMissing: () => chain,
      append: (_k: string, items: unknown[]) => ((p.append = items), chain),
      commit: async () => {
        db.patches.push(p);
        const doc = db.docs.get(id);
        if (doc && p.set) Object.assign(doc, p.set);
        return {};
      },
    };
    return chain;
  };
  const tx = { delete: () => tx, commit: async () => ({}) };
  return {
    writeClient: {
      getDocument: vi.fn(async (id: string) => db.docs.get(id) ?? null),
      fetch: vi.fn(async () => []),
      create: vi.fn(async (d: Record<string, unknown>) => (db.docs.set(d._id as string, d), d)),
      createOrReplace: vi.fn(async (d: Record<string, unknown>) => (db.docs.set(d._id as string, d), d)),
      delete: vi.fn(async (id: string) => db.docs.delete(id)),
      patch: vi.fn(patch),
      transaction: vi.fn(() => tx),
    },
  };
});
vi.mock("@/lib/admin/github-client", () => ({
  GITHUB_REPO: { owner: "RRTONY", repo: "tonygreenberg-website" },
  compareToDefaultBranch: vi.fn(async () => ({ aheadBy: 1, files: [{ path: "src/app/about/page.tsx", status: "modified", additions: 1, deletions: 1 }] })),
  getPRHeadSha: vi.fn(async () => "head1"),
  getPRCombinedStatus: vi.fn(async () => "success"),
  getPRState: vi.fn(),
  mergePR: vi.fn(async () => ({ merged: true, sha: "merge1" })),
  deleteBranch: vi.fn(async () => {}),
  closePR: vi.fn(async () => {}),
  listOpenAdminPRs: vi.fn(async () => []),
  listBranches: vi.fn(async () => []),
  getCommitFiles: vi.fn(async () => ({ parentSha: "p", files: [{ path: "src/app/about/page.tsx", status: "modified", previousPath: null }] })),
  getFile: vi.fn(async () => ({ content: "x", sha: "s" })),
  errorStatus: vi.fn(() => null),
}));
vi.mock("@/lib/admin/sanity-content", () => ({ listPendingDrafts: vi.fn(async () => []), publishDraft: vi.fn(async () => "") }));
vi.mock("@/lib/admin/tools", () => ({ waitForChecks: vi.fn(async () => ({ status: "success", build: "success", ci: "success", previewUrl: "https://deploy-preview-4--tonygreenberg-website.netlify.app", failingChecks: [] })) }));
vi.mock("@/lib/admin/code-check", () => ({ lintChangedFiles: vi.fn(async () => [{ path: "src/app/about/page.tsx", errors: 0, warnings: 0, couldNotRun: null }]) }));

const user = { name: "Tony", email: "tony@example.com", role: "write" as const };
const KEY = "20261016-abc123";

function seed(over: Partial<ChangeSet> = {}): ChangeSet {
  const c = {
    _id: `adminChange.${KEY}`,
    key: KEY,
    title: "Fix typo",
    request: "Fix the typo on /about",
    requestedBy: { name: "Kim", email: "kim@example.com" },
    status: "ready_for_review",
    createdAt: "2026-10-16T10:00:00Z",
    branch: `admin/mcp-${KEY}`,
    prNumber: 4,
    content: [],
    lint: { headSha: "head1", files: [] },
    ...over,
  } as ChangeSet;
  db.docs.set(c._id, c as never);
  return c;
}

beforeEach(() => {
  db.docs.clear();
  db.patches.length = 0;
});

describe("ids and basics", () => {
  it("record ids are dotted and branches are admin/mcp-<key>", () => {
    expect(cs.changeDocId(KEY)).toBe(`adminChange.${KEY}`);
    expect(cs.branchForChange(KEY)).toBe(`admin/mcp-${KEY}`);
  });

  it("createChangeSet trims fields and waits for an OK when the request is unclear", async () => {
    const c = await cs.createChangeSet({ title: "t".repeat(200), request: "r", user, needsConfirmation: true, appliesTo: "tablet" as never });
    expect(c.title).toHaveLength(120);
    expect(c.status).toBe("awaiting_confirmation");
    expect(c.appliesTo).toBe("both");
    expect(c._id).toBe(`adminChange.${c.key}`);
    expect(db.docs.get(c._id)).toMatchObject({ _type: "adminChange", requestedBy: { name: "Tony", email: "tony@example.com" } });
  });

  it("isOpen covers the three waiting statuses", () => {
    expect(["awaiting_confirmation", "draft", "ready_for_review", "published", "discarded"].map((s) => cs.isOpen({ status: s } as ChangeSet))).toEqual([true, true, true, false, false]);
  });

  it("an edit after review sends the change back to draft", async () => {
    const c = seed();
    await cs.markEdited(c);
    expect(c.status).toBe("draft");
    expect(db.patches[0].set).toMatchObject({ status: "draft", submittedAt: null });
  });
});

describe("confirmChange", () => {
  it("moves an awaiting change to draft with the chosen scope", async () => {
    seed({ status: "awaiting_confirmation" });
    await expect(cs.confirmChange(KEY, "mobile")).resolves.toEqual({ ok: true, changeId: KEY, appliesTo: "mobile" });
    expect(db.patches[0].set).toMatchObject({ status: "draft", appliesTo: "mobile" });
  });

  it("is a no-op for an already-started change and refuses a finished one", async () => {
    seed({ status: "draft", appliesTo: "desktop" });
    await expect(cs.confirmChange(KEY, "mobile")).resolves.toEqual({ ok: true, changeId: KEY, appliesTo: "desktop" });
    seed({ status: "published" });
    await expect(cs.confirmChange(KEY, "both")).resolves.toEqual({ ok: false, error: "This change is already published." });
    await expect(cs.confirmChange("20990101-zzzzzz", "both")).resolves.toMatchObject({ ok: false });
  });
});

describe("claimContent", () => {
  it("refuses content owned by another waiting change", async () => {
    const { writeClient } = await import("@/lib/sanity/write-client");
    vi.mocked(writeClient.fetch).mockResolvedValue([{ key: "20261015-other1", title: "Other", status: "draft", content: [{ id: "p1" }] }] as never);
    const msg = await cs.claimContent(seed({ status: "draft" }), { id: "p1", type: "post", title: "Five Cups", isNew: false });
    expect(msg).toMatch(/already part of another waiting change \("Other", 20261015-other1\)/);
  });

  it("refuses content with unsaved Studio edits", async () => {
    db.docs.set("drafts.p1", { _id: "drafts.p1" });
    expect(await cs.claimContent(seed({ status: "draft" }), { id: "p1", type: "post", title: "Five Cups", isNew: false })).toMatch(/unsaved edits made directly in Sanity Studio/);
  });

  it("records the live version before the first edit, once", async () => {
    db.docs.set("p1", { _id: "p1", _rev: "r1", title: "Five Cups" });
    const c = seed({ status: "draft" });
    await expect(cs.claimContent(c, { id: "p1", type: "post", title: "Five Cups", isNew: false })).resolves.toBeNull();
    expect(c.content![0]).toMatchObject({ id: "p1", action: "save", beforeJson: JSON.stringify({ _id: "p1", _rev: "r1", title: "Five Cups" }) });
    await cs.claimContent(c, { id: "p1", type: "post", title: "Five Cups", isNew: false });
    expect(db.patches.filter((p) => p.append)).toHaveLength(1);
  });
});

describe("submitForReview", () => {
  it("refuses finished, unconfirmed or empty changes", async () => {
    await expect(cs.submitForReview(seed({ status: "published" }), "s", [])).resolves.toMatchObject({ ok: false });
    await expect(cs.submitForReview(seed({ status: "awaiting_confirmation" }), "s", [])).resolves.toMatchObject({ ok: false, error: expect.stringMatching(/hasn't confirmed/) });
    vi.mocked(gh.compareToDefaultBranch).mockResolvedValueOnce({ aheadBy: 0, files: [] });
    await expect(cs.submitForReview(seed({ status: "draft" }), "s", [])).resolves.toMatchObject({ ok: false, error: expect.stringMatching(/Nothing has been changed/) });
  });

  it("lints the exact head and marks the change ready", async () => {
    const r = await cs.submitForReview(seed({ status: "draft" }), "Fixed the typo", [{ label: "Title", before: "Teh", after: "The" }]);
    expect(r).toMatchObject({ ok: true, status: "ready_for_review", lint: { headSha: "head1" } });
    expect(lintChangedFiles).toHaveBeenCalledWith([{ path: "src/app/about/page.tsx", content: "x" }]);
    expect(db.patches.at(-1)!.set).toMatchObject({ status: "ready_for_review", summary: "Fixed the typo", areas: ["/about page"] });
  });
});

describe("buildReview", () => {
  it("is publishable when everything passed, with a token covering the code version", async () => {
    const r = await cs.buildReview(seed(), 0);
    expect(r).toMatchObject({ state: "ready", canPublish: true, blockers: [], headSha: "head1", reviewToken: reviewToken("head1", []) });
    expect(r.previewLinks).toEqual([{ label: "/about page", url: "https://deploy-preview-4--tonygreenberg-website.netlify.app/about" }]);
  });

  it("is blocked while a draft or when a check failed", async () => {
    expect((await cs.buildReview(seed({ status: "draft" }), 0)).canPublish).toBe(false);
    vi.mocked(waitForChecks).mockResolvedValueOnce({ status: "failure", build: "failure", previewUrl: null, failingChecks: [] });
    const r = await cs.buildReview(seed(), 0);
    expect(r.canPublish).toBe(false);
    expect(r.blockers).toContain("Build failed.");
  });
});

describe("publishChange: refusals", () => {
  const token = () => reviewToken("head1", []);

  it("refuses unknown, draft and already-published changes", async () => {
    await expect(cs.publishChange("20990101-zzzzzz", "t", user)).resolves.toMatchObject({ ok: false });
    seed({ status: "draft" });
    await expect(cs.publishChange(KEY, token(), user)).resolves.toMatchObject({ ok: false, error: expect.stringMatching(/still a draft/) });
    seed({ status: "published" });
    await expect(cs.publishChange(KEY, token(), user)).resolves.toMatchObject({ ok: false, error: "This change is already published." });
    expect(gh.mergePR).not.toHaveBeenCalled();
  });

  it("refuses when anything changed after review (token mismatch)", async () => {
    seed();
    await expect(cs.publishChange(KEY, "stale-token", user)).resolves.toMatchObject({ ok: false, error: expect.stringMatching(/updated after it was reviewed/) });
    vi.mocked(gh.getPRHeadSha).mockResolvedValueOnce("head2");
    await expect(cs.publishChange(KEY, token(), user)).resolves.toMatchObject({ ok: false });
    expect(gh.mergePR).not.toHaveBeenCalled();
  });

  it("refuses when lint is stale or couldn't run, or the site check failed or is running", async () => {
    seed({ lint: { headSha: "old", files: [] } });
    await expect(cs.publishChange(KEY, token(), user)).resolves.toMatchObject({ ok: false, error: expect.stringMatching(/Lint hasn't run/) });
    seed({ lint: { headSha: "head1", files: [{ path: "a", errors: 0, warnings: 0, couldNotRun: "boom" }] } });
    await expect(cs.publishChange(KEY, token(), user)).resolves.toMatchObject({ ok: false, error: expect.stringMatching(/Lint could not run \(boom\)/) });
    seed();
    vi.mocked(gh.getPRCombinedStatus).mockResolvedValueOnce("failure");
    await expect(cs.publishChange(KEY, token(), user)).resolves.toMatchObject({ ok: false, error: expect.stringMatching(/site check failed/) });
    vi.mocked(gh.getPRCombinedStatus).mockResolvedValueOnce("pending");
    await expect(cs.publishChange(KEY, token(), user)).resolves.toMatchObject({ ok: false, error: expect.stringMatching(/still running/) });
    expect(gh.mergePR).not.toHaveBeenCalled();
  });

  it("refuses when content was changed by someone else, or its draft is missing", async () => {
    db.docs.set("p1", { _id: "p1", _rev: "r2" });
    db.docs.set("drafts.p1", { _id: "drafts.p1", _rev: "d1" });
    seed({ content: [{ _key: "k", id: "p1", type: "post", title: "Five Cups", action: "save", beforeJson: JSON.stringify({ _rev: "r1" }) }] });
    await expect(cs.publishChange(KEY, reviewToken("head1", [{ id: "p1", rev: "d1" }]), user)).resolves.toMatchObject({ ok: false, error: expect.stringMatching(/changed by someone else/) });
    db.docs.delete("drafts.p1");
    await expect(cs.publishChange(KEY, reviewToken("head1", [{ id: "p1", rev: null }]), user)).resolves.toMatchObject({ ok: false, error: expect.stringMatching(/missing/) });
    expect(publishDraft).not.toHaveBeenCalled();
  });

  it("maps GitHub's 409 and 405 merge refusals to plain words", async () => {
    seed();
    vi.mocked(gh.mergePR).mockRejectedValueOnce(new Error("conflict"));
    vi.mocked(gh.errorStatus).mockReturnValueOnce(409);
    await expect(cs.publishChange(KEY, token(), user)).resolves.toMatchObject({ ok: false, error: expect.stringMatching(/updated after it was reviewed/) });
    vi.mocked(gh.mergePR).mockRejectedValueOnce(new Error("not mergeable"));
    vi.mocked(gh.errorStatus).mockReturnValueOnce(405);
    await expect(cs.publishChange(KEY, token(), user)).resolves.toMatchObject({ ok: false, error: expect.stringMatching(/can't go live as is/) });
  });
});

describe("publishChange: success", () => {
  it("merges the reviewed head, publishes the drafts and records who did it", async () => {
    db.docs.set("p1", { _id: "p1", _rev: "r1" });
    db.docs.set("drafts.p1", { _id: "drafts.p1", _rev: "d1" });
    seed({ undoes: "20261001-orig01", content: [{ _key: "k", id: "p1", type: "post", title: "Five Cups", action: "save", beforeJson: JSON.stringify({ _rev: "r1" }) }] });
    const r = await cs.publishChange(KEY, reviewToken("head1", [{ id: "p1", rev: "d1" }]), user);
    expect(r).toEqual({ ok: true, changeId: KEY, mergeSha: "merge1", published: ["p1"] });
    expect(gh.mergePR).toHaveBeenCalledWith(4, "head1");
    expect(publishDraft).toHaveBeenCalledWith("p1");
    expect(db.patches.find((p) => p.id === `adminChange.${KEY}` && (p.set as { status?: string })?.status === "published")!.set).toMatchObject({ publishedBy: "Tony", mergeSha: "merge1" });
    expect(db.patches.find((p) => p.id === "adminChange.20261001-orig01")!.set).toEqual({ undoneBy: KEY });
  });
});

describe("discardChange", () => {
  it("closes the PR, deletes the branch and drafts, and records who discarded", async () => {
    seed({ status: "draft", content: [{ _key: "k", id: "p1", type: "post", title: "T", action: "save", beforeJson: null }] });
    await expect(cs.discardChange(KEY, user)).resolves.toEqual({ ok: true, changeId: KEY });
    expect(gh.closePR).toHaveBeenCalledWith(4);
    expect(gh.deleteBranch).toHaveBeenCalledWith(`admin/mcp-${KEY}`);
    const { writeClient } = await import("@/lib/sanity/write-client");
    expect(writeClient.delete).toHaveBeenCalledWith("drafts.p1");
    expect(db.patches.at(-1)!.set).toMatchObject({ status: "discarded", discardedBy: "Tony" });
  });

  it("refuses a finished change and closes an older record-less PR", async () => {
    seed({ status: "published" });
    await expect(cs.discardChange(KEY, user)).resolves.toMatchObject({ ok: false });
    vi.mocked(gh.listOpenAdminPRs).mockResolvedValueOnce([{ number: 2, branch: "admin/mcp-20250101-old111", url: "u" }]);
    await expect(cs.discardChange("20250101-old111", user)).resolves.toEqual({ ok: true, changeId: "20250101-old111", olderChange: true });
    expect(gh.closePR).toHaveBeenCalledWith(2);
  });
});

describe("undoChange", () => {
  it("only undoes published, not-yet-undone changes", async () => {
    seed({ status: "draft" });
    await expect(cs.undoChange(KEY, user)).resolves.toMatchObject({ ok: false, error: expect.stringMatching(/Only a published change/) });
    seed({ status: "published", undoneBy: "20261017-xyz999" });
    await expect(cs.undoChange(KEY, user)).resolves.toMatchObject({ ok: false, error: expect.stringMatching(/already undone/) });
  });

  it("refuses when content was edited again after going live", async () => {
    db.docs.set("p1", { _id: "p1", _rev: "later" });
    seed({ status: "published", mergeSha: null, content: [{ _key: "k", id: "p1", type: "post", title: "Five Cups", action: "save", beforeJson: null, publishedRev: "r1" }] });
    await expect(cs.undoChange(KEY, user)).resolves.toMatchObject({ ok: false, error: expect.stringMatching(/Can't undo automatically.*Blog post: Five Cups/) });
  });
});

describe("pending rows and history", () => {
  const rows = () =>
    cs.pendingRows(
      [
        { key: "b", title: "B", request: "rb", status: "draft", createdAt: "2026-10-16T02:00:00Z", prNumber: 5, requestedBy: { name: "Kim" } } as ChangeSet,
        { key: "a", title: "A", request: "ra", status: "ready_for_review", createdAt: "2026-10-16T01:00:00Z", prNumber: null, requestedBy: { name: "Dar" } } as ChangeSet,
        { key: "c", title: "C", request: "rc", status: "published", createdAt: "2026-10-15T01:00:00Z" } as ChangeSet,
      ],
      "x",
    );

  it("pendingRows lists only waiting changes, oldest first", () => {
    expect(rows().map((r) => [r.changeId, r.readyToPublish, r.previewUrl])).toEqual([
      ["a", true, null],
      ["b", false, "https://deploy-preview-5--tonygreenberg-website.netlify.app"],
    ]);
  });

  it("otherPendingText summarises them, or says there are none", () => {
    expect(cs.otherPendingText([])).toBe("No other pending changes.");
    expect(cs.otherPendingText(null)).toMatch(/Couldn't load/);
    expect(cs.otherPendingText(rows())).toMatch(/^- A \(change_id a\): Ready for review\. Asked by Dar/);
  });

  it("changeHistory marks only published, not-undone changes as undoable", async () => {
    const { writeClient } = await import("@/lib/sanity/write-client");
    vi.mocked(writeClient.fetch).mockResolvedValue([
      { key: "a", title: "A", status: "published", createdAt: "t", areas: ["/about page"], content: [{ type: "post", title: "X" }] },
      { key: "b", title: "B", status: "published", undoneBy: "c", createdAt: "t" },
      { key: "c", title: "C", status: "discarded", createdAt: "t" },
    ] as never);
    const h = await cs.changeHistory(10);
    expect(h.map((e) => e.canUndo)).toEqual([true, false, false]);
    expect(h[0].changed).toEqual(["/about page", "Blog post: X"]);
  });

  it("pendingOverview lists PRs and Studio drafts that belong to no change", async () => {
    vi.mocked(gh.listOpenAdminPRs).mockResolvedValueOnce([{ number: 4, branch: `admin/mcp-${KEY}`, url: "u4" }, { number: 9, branch: "admin/mcp-old", url: "u9" }]);
    vi.mocked(listPendingDrafts).mockResolvedValueOnce([{ id: "drafts.p1", publishedId: "p1", type: "post", title: "Mine" }, { id: "drafts.p2", publishedId: "p2", type: "post", title: "Stray" }]);
    const o = await cs.pendingOverview([seed({ content: [{ _key: "k", id: "p1", type: "post", title: "Mine", action: "save", beforeJson: null }] })]);
    expect(o.olderChanges).toEqual([{ changeId: "old", prNumber: 9, prUrl: "u9" }]);
    expect(o.unrelatedDrafts).toEqual([{ id: "drafts.p2", label: "Blog post: Stray" }]);
  });
});

describe("reconcileWithGitHub", () => {
  it("marks merged changes published and closed ones discarded", async () => {
    const merged = seed({ key: "20261016-mrg111", _id: "adminChange.20261016-mrg111", prNumber: 1 });
    const closed = seed({ key: "20261016-cls111", _id: "adminChange.20261016-cls111", prNumber: 2 });
    const open = seed({ key: "20261016-opn111", _id: "adminChange.20261016-opn111", prNumber: 3 });
    vi.mocked(gh.getPRState).mockImplementation((async (n: number) => ({ open: n === 3, merged: n === 1, mergeSha: n === 1 ? "m" : null })) as never);
    const still = await cs.reconcileWithGitHub([merged, closed, open]);
    expect(still.map((c) => c.key)).toEqual(["20261016-opn111"]);
    expect(db.patches.find((p) => p.id === "adminChange.20261016-mrg111")!.set).toMatchObject({ status: "published", publishedBy: "Merged directly in GitHub" });
    expect(db.patches.find((p) => p.id === "adminChange.20261016-cls111")!.set).toMatchObject({ status: "discarded" });
  });
});
