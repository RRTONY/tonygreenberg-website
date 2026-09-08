// Thin fetch-based wrapper around GitHub's REST API. Deliberately not using
// @octokit/rest — this repo already talks to Sanity's mutate endpoint via
// plain fetch rather than a client library, and this mirrors that. Ported
// from ramprate-ui's admin MCP server (src/lib/admin/github-client.ts),
// retargeted at this repo.
//
// Owner/repo are hardcoded constants, never accepted as a parameter from
// any caller, so a prompt-injected instruction can't redirect a write to a
// different repository.
const OWNER = "RRTONY";
const REPO = "tonygreenberg-website";
const API = "https://api.github.com";

function token(): string {
  const t = process.env.GITHUB_TOKEN;
  if (!t) throw new Error("GITHUB_TOKEN is not set");
  return t;
}

class GitHubApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function gh<T = unknown>(path: string, init: RequestInit = {}): Promise<T | null> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token()}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new GitHubApiError(res.status, `GitHub ${init.method || "GET"} ${path} -> ${res.status}: ${body}`);
  }
  if (res.status === 204) return null;
  return (await res.json()) as T;
}

export function isNotFound(err: unknown): boolean {
  return err instanceof GitHubApiError && err.status === 404;
}

export interface FileContent {
  content: string;
  sha: string;
}

export async function getFile(path: string, ref: string): Promise<FileContent | null> {
  try {
    const data = await gh<{ content: string; sha: string; type: string }>(
      `/repos/${OWNER}/${REPO}/contents/${encodeURI(path)}?ref=${encodeURIComponent(ref)}`,
    );
    if (!data || data.type !== "file") return null;
    return { content: Buffer.from(data.content, "base64").toString("utf-8"), sha: data.sha };
  } catch (err) {
    if (isNotFound(err)) return null;
    throw err;
  }
}

export interface DirEntry {
  path: string;
  type: "file" | "dir";
  size: number;
}

export async function listDir(path: string, ref: string): Promise<DirEntry[]> {
  // An empty path is the repo root: GitHub wants `/contents` with no
  // trailing segment, not `/contents/`.
  const segment = path ? `/${encodeURI(path)}` : "";
  const data = await gh<Array<{ path: string; type: string; size: number }> | { path: string; type: string; size: number }>(
    `/repos/${OWNER}/${REPO}/contents${segment}?ref=${encodeURIComponent(ref)}`,
  );
  const arr = Array.isArray(data) ? data : data ? [data] : [];
  return arr.map((e) => ({ path: e.path, type: e.type === "dir" ? "dir" : "file", size: e.size }));
}

let cachedDefaultBranch: string | null = null;

// Don't assume "main" — resolve and cache the repo's actual default branch.
export async function getDefaultBranch(): Promise<string> {
  if (cachedDefaultBranch) return cachedDefaultBranch;
  const repo = await gh<{ default_branch: string }>(`/repos/${OWNER}/${REPO}`);
  cachedDefaultBranch = repo?.default_branch || "main";
  return cachedDefaultBranch;
}

export async function getDefaultBranchSha(): Promise<string> {
  const base = await getDefaultBranch();
  const ref = await gh<{ object: { sha: string } }>(`/repos/${OWNER}/${REPO}/git/ref/heads/${base}`);
  if (!ref) throw new Error(`Could not resolve ${base} branch HEAD`);
  return ref.object.sha;
}

export async function branchExists(branch: string): Promise<boolean> {
  try {
    await gh(`/repos/${OWNER}/${REPO}/git/ref/heads/${encodeURIComponent(branch)}`);
    return true;
  } catch (err) {
    if (isNotFound(err)) return false;
    throw err;
  }
}

export async function createBranch(branch: string): Promise<void> {
  const sha = await getDefaultBranchSha();
  await gh(`/repos/${OWNER}/${REPO}/git/refs`, {
    method: "POST",
    body: JSON.stringify({ ref: `refs/heads/${branch}`, sha }),
  });
}

export async function putFile(path: string, content: string, message: string, branch: string): Promise<void> {
  const existing = await getFile(path, branch);
  await gh(`/repos/${OWNER}/${REPO}/contents/${encodeURI(path)}`, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf-8").toString("base64"),
      branch,
      ...(existing ? { sha: existing.sha } : {}),
    }),
  });
}

// Like putFile, but takes content that's already base64-encoded (images,
// PDFs, etc.) and passes it straight through — putFile's utf-8 round-trip
// would corrupt binary data.
export async function putFileBase64(path: string, base64Content: string, message: string, branch: string): Promise<void> {
  const existing = await getFile(path, branch);
  await gh(`/repos/${OWNER}/${REPO}/contents/${encodeURI(path)}`, {
    method: "PUT",
    body: JSON.stringify({ message, content: base64Content, branch, ...(existing ? { sha: existing.sha } : {}) }),
  });
}

export async function deleteFile(path: string, message: string, branch: string): Promise<void> {
  const existing = await getFile(path, branch);
  if (!existing) throw new Error(`${path} does not exist on ${branch}, nothing to delete`);
  await gh(`/repos/${OWNER}/${REPO}/contents/${encodeURI(path)}`, {
    method: "DELETE",
    body: JSON.stringify({ message, sha: existing.sha, branch }),
  });
}

export interface OpenPR {
  number: number;
  branch: string;
  url: string;
}

export async function findOpenAdminPR(branchPrefix: string): Promise<OpenPR | null> {
  const base = await getDefaultBranch();
  const prs = await gh<Array<{ number: number; html_url: string; head: { ref: string } }>>(
    `/repos/${OWNER}/${REPO}/pulls?state=open&base=${base}`,
  );
  const match = (prs || []).find((pr) => pr.head.ref.startsWith(branchPrefix));
  return match ? { number: match.number, branch: match.head.ref, url: match.html_url } : null;
}

export async function openPR(branch: string, title: string, body: string): Promise<OpenPR> {
  const base = await getDefaultBranch();
  const pr = await gh<{ number: number; html_url: string }>(`/repos/${OWNER}/${REPO}/pulls`, {
    method: "POST",
    body: JSON.stringify({ title, head: branch, base, body }),
  });
  if (!pr) throw new Error("PR creation returned no data");
  return { number: pr.number, branch, url: pr.html_url };
}

export interface CompareResult {
  files: Array<{ filename: string; status: string; additions: number; deletions: number }>;
}

export async function compareToDefaultBranch(branch: string): Promise<CompareResult> {
  const base = await getDefaultBranch();
  const data = await gh<{ files: Array<{ filename: string; status: string; additions: number; deletions: number }> }>(
    `/repos/${OWNER}/${REPO}/compare/${base}...${encodeURIComponent(branch)}`,
  );
  return { files: (data?.files || []).map((f) => ({ filename: f.filename, status: f.status, additions: f.additions, deletions: f.deletions })) };
}

export type PRCheckState = "success" | "pending" | "failure" | "unknown";

// GitHub has two separate systems for this: the legacy Status API (what
// Netlify's deploy-preview posts, per netlify.toml's @netlify/plugin-nextjs)
// and the newer Checks API (what GitHub Actions workflows post as
// check-runs — this repo has none yet, but the code stays correct if that
// changes). A PR can have either, both, or neither, so both must be
// queried and combined.
export async function getPRCombinedStatus(prNumber: number): Promise<PRCheckState> {
  const pr = await gh<{ head: { sha: string } }>(`/repos/${OWNER}/${REPO}/pulls/${prNumber}`);
  if (!pr) return "unknown";
  try {
    const [status, checkRuns] = await Promise.all([
      gh<{ state: string }>(`/repos/${OWNER}/${REPO}/commits/${pr.head.sha}/status`),
      gh<{ check_runs: Array<{ status: string; conclusion: string | null }> }>(`/repos/${OWNER}/${REPO}/commits/${pr.head.sha}/check-runs`),
    ]);

    const states: PRCheckState[] = [];
    if (status?.state === "success" || status?.state === "failure" || status?.state === "pending") {
      states.push(status.state);
    }
    for (const run of checkRuns?.check_runs || []) {
      if (run.status !== "completed") states.push("pending");
      else if (run.conclusion === "success" || run.conclusion === "neutral" || run.conclusion === "skipped") states.push("success");
      else states.push("failure");
    }

    if (states.length === 0) return "unknown";
    if (states.includes("failure")) return "failure";
    if (states.includes("pending")) return "pending";
    return "success";
  } catch {
    return "unknown";
  }
}

export interface FailingCheck {
  id: number;
  name: string;
  url: string | null;
}

export interface PRChecksDetail {
  status: PRCheckState;
  previewUrl: string | null;
  failingChecks: FailingCheck[];
}

// Richer version of getPRCombinedStatus: also surfaces the Netlify
// deploy-preview URL (scraped from Netlify's own bot comment — GitHub
// doesn't expose it as structured data) and which specific checks are
// failing.
export async function getPRChecksDetail(prNumber: number): Promise<PRChecksDetail> {
  const pr = await gh<{ head: { sha: string } }>(`/repos/${OWNER}/${REPO}/pulls/${prNumber}`);
  if (!pr) return { status: "unknown", previewUrl: null, failingChecks: [] };

  const [statusResult, checkRunsResult, comments] = await Promise.all([
    gh<{ state: string }>(`/repos/${OWNER}/${REPO}/commits/${pr.head.sha}/status`).catch(() => null),
    gh<{ check_runs: Array<{ id: number; name: string; status: string; conclusion: string | null; html_url: string }> }>(
      `/repos/${OWNER}/${REPO}/commits/${pr.head.sha}/check-runs`,
    ).catch(() => null),
    gh<Array<{ body: string }>>(`/repos/${OWNER}/${REPO}/issues/${prNumber}/comments`).catch(() => null),
  ]);

  const states: PRCheckState[] = [];
  const failingChecks: FailingCheck[] = [];

  if (statusResult?.state === "success" || statusResult?.state === "failure" || statusResult?.state === "pending") {
    states.push(statusResult.state);
  }
  for (const run of checkRunsResult?.check_runs || []) {
    if (run.status !== "completed") {
      states.push("pending");
    } else if (run.conclusion === "success" || run.conclusion === "neutral" || run.conclusion === "skipped") {
      states.push("success");
    } else {
      states.push("failure");
      failingChecks.push({ id: run.id, name: run.name, url: run.html_url });
    }
  }

  let previewUrl: string | null = null;
  for (const comment of comments || []) {
    const match = comment.body.match(/https:\/\/deploy-preview-\d+--[\w-]+\.netlify\.app/);
    if (match) {
      previewUrl = match[0];
      break;
    }
  }

  let status: PRCheckState = "unknown";
  if (states.length > 0) {
    if (states.includes("failure")) status = "failure";
    else if (states.includes("pending")) status = "pending";
    else status = "success";
  }

  return { status, previewUrl, failingChecks };
}

// GitHub Actions job logs run to hundreds of KB, but the actual failing
// command's error is almost always in the last screenful of output.
const LOG_TAIL_LINES = 200;
const LOG_TAIL_MAX_CHARS = 8000;

export function truncateLogTail(text: string): string {
  const tail = text.split("\n").slice(-LOG_TAIL_LINES).join("\n");
  return tail.length > LOG_TAIL_MAX_CHARS ? tail.slice(-LOG_TAIL_MAX_CHARS) : tail;
}

// Raw log text for one failed GitHub Actions check run — a check run's
// `id` doubles as its Actions job id. Unlike every other call in this
// file, the response here is plain text (GitHub redirects to a signed log
// URL), not JSON, so it can't go through the gh() helper above.
export async function getFailingCheckLogExcerpt(checkRunId: number): Promise<string> {
  const res = await fetch(`${API}/repos/${OWNER}/${REPO}/actions/jobs/${checkRunId}/logs`, {
    headers: { Authorization: `Bearer ${token()}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
  });
  if (!res.ok) {
    throw new GitHubApiError(res.status, `Failed to fetch log for check run ${checkRunId} (${res.status})`);
  }
  return truncateLogTail(await res.text());
}

export async function mergePR(prNumber: number): Promise<{ merged: boolean; sha: string }> {
  const result = await gh<{ merged: boolean; sha: string }>(`/repos/${OWNER}/${REPO}/pulls/${prNumber}/merge`, {
    method: "PUT",
    body: JSON.stringify({ merge_method: "squash" }),
  });
  if (!result) throw new Error("Merge returned no data");
  return result;
}

export async function deleteBranch(branch: string): Promise<void> {
  await gh(`/repos/${OWNER}/${REPO}/git/refs/heads/${encodeURIComponent(branch)}`, { method: "DELETE" });
}

export const GITHUB_REPO = { owner: OWNER, repo: REPO };
