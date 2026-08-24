/**
 * CANON PROJECT — Admin Interface
 * Run all three workstreams against any article.
 * View v2 drafts, approve, and publish.
 * Only accessible to admins.
 */
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import blogData from "@/data/blogData.json";
import { Link } from "wouter";

// The Essential Ten from the Canon Spec
const ESSENTIAL_TEN = [
  "when-healing-becomes-extraction",
  "the-molecule-as-mirror-from-substance-to-service",
  "five-cups",
  "heart-protocol-addendum",
  "the-real-cost-of-ai",
  "the-trust-tax",
  "impact-soul",
  "the-corridor",
  "beyond-token",
  "being-token",
];

type Post = { slug: string; title: string; category?: string };
const ALL_POSTS: Post[] = (blogData as any[]).map((p: any) => ({
  slug: p.slug,
  title: p.title,
  category: p.category,
}));

function StatusBadge({ status }: { status?: string | null }) {
  if (!status) return null;
  const colors: Record<string, string> = {
    draft: "bg-yellow-900/40 text-yellow-300 border-yellow-700",
    approved: "bg-green-900/40 text-green-300 border-green-700",
    published: "bg-blue-900/40 text-blue-300 border-blue-700",
    rejected: "bg-red-900/40 text-red-300 border-red-700",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded border font-mono ${colors[status] ?? "bg-zinc-800 text-zinc-400 border-zinc-700"}`}>
      {status}
    </span>
  );
}

function WorkstreamBadge({ workstreams }: { workstreams?: string | null }) {
  if (!workstreams) return <span className="text-xs text-zinc-600">none run</span>;
  const done = workstreams.split(",").filter(Boolean);
  return (
    <span className="flex gap-1 flex-wrap">
      {["edit", "journey", "divergence"].map(w => (
        <span key={w} className={`text-xs px-1.5 py-0.5 rounded font-mono ${done.includes(w) ? "bg-amber-900/50 text-amber-300" : "bg-zinc-800 text-zinc-600"}`}>
          {w}
        </span>
      ))}
    </span>
  );
}

function ScoreCard({ scorecard }: { scorecard?: string | null }) {
  if (!scorecard) return null;
  let parsed: Record<string, number> = {};
  try { parsed = JSON.parse(scorecard); } catch { return null; }
  const axes = ["opening", "momentum", "depthReach", "quotability", "ending"];
  return (
    <div className="grid grid-cols-5 gap-2 mt-2">
      {axes.map(ax => (
        <div key={ax} className="text-center">
          <div className="text-2xl font-bold text-amber-400">{parsed[ax] ?? "?"}</div>
          <div className="text-xs text-zinc-500 capitalize">{ax}</div>
        </div>
      ))}
    </div>
  );
}

function JsonList({ data }: { data?: string | null }) {
  if (!data) return <span className="text-zinc-600 text-sm">—</span>;
  let parsed: string[] = [];
  try { parsed = JSON.parse(data); } catch { return <span className="text-zinc-400 text-sm">{data}</span>; }
  return (
    <ul className="list-disc list-inside space-y-1">
      {parsed.map((item, i) => <li key={i} className="text-sm text-zinc-300">{item}</li>)}
    </ul>
  );
}

export default function AdminCanon() {
  const { user, loading } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [running, setRunning] = useState<string | null>(null);
  const [runError, setRunError] = useState<string | null>(null);

  const drafts = trpc.canon.listDrafts.useQuery(undefined, { enabled: user?.role === "admin" });
  const selectedDraft = trpc.canon.getDraft.useQuery(
    { slug: selectedSlug! },
    { enabled: !!selectedSlug && user?.role === "admin" }
  );

  const runAll = trpc.canon.runAll.useMutation({
    onSuccess: () => {
      drafts.refetch();
      selectedDraft.refetch();
      setRunning(null);
    },
    onError: (e) => { setRunError(e.message); setRunning(null); },
  });
  const runEdit = trpc.canon.runEdit.useMutation({
    onSuccess: () => { drafts.refetch(); selectedDraft.refetch(); setRunning(null); },
    onError: (e) => { setRunError(e.message); setRunning(null); },
  });
  const runJourney = trpc.canon.runJourney.useMutation({
    onSuccess: () => { drafts.refetch(); selectedDraft.refetch(); setRunning(null); },
    onError: (e) => { setRunError(e.message); setRunning(null); },
  });
  const runDivergence = trpc.canon.runDivergence.useMutation({
    onSuccess: () => { drafts.refetch(); selectedDraft.refetch(); setRunning(null); },
    onError: (e) => { setRunError(e.message); setRunning(null); },
  });
  const approveDraft = trpc.canon.approveDraft.useMutation({
    onSuccess: () => { drafts.refetch(); selectedDraft.refetch(); },
  });
  const rejectDraft = trpc.canon.rejectDraft.useMutation({
    onSuccess: () => { drafts.refetch(); selectedDraft.refetch(); },
  });
  const publishDraft = trpc.canon.publishDraft.useMutation({
    onSuccess: (data) => {
      drafts.refetch();
      selectedDraft.refetch();
      // Download v2 content as a text file for the webmaster
      if (data.v2Content) {
        const blob = new Blob([data.v2Content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${selectedSlug}-v2.txt`;
        a.click();
        URL.revokeObjectURL(url);
      }
    },
  });

  const filteredPosts = useMemo(() => {
    const base = showAll ? ALL_POSTS : ALL_POSTS.filter(p => ESSENTIAL_TEN.includes(p.slug));
    if (!search.trim()) return base;
    const q = search.toLowerCase();
    return base.filter(p => p.title.toLowerCase().includes(q) || p.slug.includes(q));
  }, [search, showAll]);

  const selectedPost = ALL_POSTS.find(p => p.slug === selectedSlug);
  const draft = selectedDraft.data;

  const handleRun = (workstream: "all" | "edit" | "journey" | "divergence") => {
    if (!selectedSlug || !selectedPost) return;
    const post = (blogData as any[]).find((p: any) => p.slug === selectedSlug);
    if (!post) return;
    const content = [post.summary, ...(post.updatedContent ?? post.content ?? [])].filter(Boolean).join("\n\n");
    setRunError(null);
    setRunning(workstream);
    const args = { slug: selectedSlug, title: selectedPost.title, content };
    if (workstream === "all") runAll.mutate(args);
    else if (workstream === "edit") runEdit.mutate(args);
    else if (workstream === "journey") runJourney.mutate(args);
    else runDivergence.mutate(args);
  };

  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">Loading...</div>;
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-zinc-400 mb-4">Admin access required.</div>
          <Link href="/"><Button variant="outline">Go Home</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-mono">
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-amber-500 tracking-widest uppercase mb-1">Canon Project</div>
          <h1 className="text-xl font-bold text-zinc-100">Editorial Spine</h1>
        </div>
        <div className="flex gap-3 items-center">
          <span className="text-xs text-zinc-500">{drafts.data?.length ?? 0} drafts in DB</span>
          <Link href="/admin/comments"><Button variant="outline" size="sm">Comments</Button></Link>
          <Link href="/analytics"><Button variant="outline" size="sm">Analytics</Button></Link>
        </div>
      </div>

      <div className="flex h-[calc(100vh-65px)]">
        {/* Left: Article List */}
        <div className="w-80 border-r border-zinc-800 flex flex-col">
          <div className="p-3 border-b border-zinc-800">
            <Input
              placeholder="Search articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-zinc-900 border-zinc-700 text-zinc-200 text-sm h-8"
            />
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => setShowAll(!showAll)}
                className={`text-xs px-2 py-1 rounded transition-colors ${showAll ? "bg-amber-900/50 text-amber-300" : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"}`}
              >
                {showAll ? `All ${ALL_POSTS.length} articles` : "Essential Ten"}
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredPosts.map(post => {
              const draftForPost = drafts.data?.find(d => d.articleSlug === post.slug);
              const isSelected = selectedSlug === post.slug;
              const isEssential = ESSENTIAL_TEN.includes(post.slug);
              return (
                <button
                  key={post.slug}
                  onClick={() => setSelectedSlug(post.slug)}
                  className={`w-full text-left px-3 py-2.5 border-b border-zinc-800/50 transition-colors ${isSelected ? "bg-amber-900/20 border-l-2 border-l-amber-500" : "hover:bg-zinc-900"}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        {isEssential && <span className="text-amber-500 text-xs">✦</span>}
                        <span className="text-xs text-zinc-100 leading-tight line-clamp-2">{post.title}</span>
                      </div>
                      {draftForPost && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <StatusBadge status={draftForPost.status} />
                          <WorkstreamBadge workstreams={draftForPost.completedWorkstreams} />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Draft Viewer */}
        <div className="flex-1 overflow-y-auto">
          {!selectedSlug ? (
            <div className="flex items-center justify-center h-full text-zinc-600">
              <div className="text-center">
                <div className="text-4xl mb-3">✦</div>
                <div className="text-sm">Select an article to begin</div>
                <div className="text-xs mt-1 text-zinc-700">Essential Ten marked with ✦</div>
              </div>
            </div>
          ) : (
            <div className="p-6 max-w-4xl">
              {/* Article Header */}
              <div className="mb-6">
                <div className="text-xs text-zinc-500 mb-1">{selectedSlug}</div>
                <h2 className="text-lg font-bold text-zinc-100 mb-3">{selectedPost?.title}</h2>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    size="sm"
                    onClick={() => handleRun("all")}
                    disabled={!!running}
                    className="bg-amber-700 hover:bg-amber-600 text-white"
                  >
                    {running === "all" ? "Running All..." : "✦ Run All Three"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleRun("edit")} disabled={!!running}>
                    {running === "edit" ? "Running..." : "Edit"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleRun("journey")} disabled={!!running}>
                    {running === "journey" ? "Running..." : "Journey"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleRun("divergence")} disabled={!!running}>
                    {running === "divergence" ? "Running..." : "Divergence"}
                  </Button>
                  <a href={`/blog/${selectedSlug}`} target="_blank" rel="noreferrer">
                    <Button size="sm" variant="outline">View Live ↗</Button>
                  </a>
                </div>

                {running && (
                  <div className="text-xs text-amber-400 animate-pulse mb-3">
                    Running {running} workstream... this takes 15–30 seconds.
                  </div>
                )}
                {runError && (
                  <div className="text-xs text-red-400 mb-3">Error: {runError}</div>
                )}
              </div>

              {/* Draft Content */}
              {selectedDraft.isLoading ? (
                <div className="text-zinc-600 text-sm">Loading draft...</div>
              ) : !draft ? (
                <div className="text-zinc-600 text-sm">No draft yet. Run a workstream to generate one.</div>
              ) : (
                <div>
                  {/* Status + Approve/Reject/Publish */}
                  <div className="flex items-center gap-3 mb-6 p-3 bg-zinc-900 rounded border border-zinc-800">
                    <StatusBadge status={draft.status} />
                    <WorkstreamBadge workstreams={draft.completedWorkstreams} />
                    <div className="flex-1" />
                    {draft.status === "draft" && (
                      <Button size="sm" onClick={() => approveDraft.mutate({ id: draft.id })} className="bg-green-800 hover:bg-green-700 text-white">
                        Approve
                      </Button>
                    )}
                    {draft.status === "draft" && (
                      <Button size="sm" variant="outline" onClick={() => rejectDraft.mutate({ id: draft.id })}>
                        Reject
                      </Button>
                    )}
                    {draft.status === "approved" && (
                      <Button
                        size="sm"
                        onClick={() => publishDraft.mutate({ id: draft.id, slug: selectedSlug })}
                        className="bg-blue-800 hover:bg-blue-700 text-white"
                      >
                        Publish v2 (downloads file)
                      </Button>
                    )}
                  </div>

                  <Tabs defaultValue="edit">
                    <TabsList className="bg-zinc-900 border border-zinc-800 mb-4">
                      <TabsTrigger value="edit">The Edit</TabsTrigger>
                      <TabsTrigger value="journey">Journey</TabsTrigger>
                      <TabsTrigger value="divergence">Divergence</TabsTrigger>
                      <TabsTrigger value="v2">v2 Draft</TabsTrigger>
                    </TabsList>

                    {/* WORKSTREAM ONE */}
                    <TabsContent value="edit">
                      {!draft.centralIdea ? (
                        <div className="text-zinc-600 text-sm">Run "Edit" workstream to see results.</div>
                      ) : (
                        <div className="space-y-5">
                          <div>
                            <div className="text-xs text-amber-500 uppercase tracking-widest mb-1">Central Idea</div>
                            <p className="text-zinc-200">{draft.centralIdea}</p>
                          </div>
                          <div>
                            <div className="text-xs text-amber-500 uppercase tracking-widest mb-1">Soul Sentence</div>
                            <p className="text-zinc-200 italic">{draft.soulSentence}</p>
                          </div>
                          <div>
                            <div className="text-xs text-amber-500 uppercase tracking-widest mb-1">Scorecard</div>
                            <ScoreCard scorecard={draft.scorecard} />
                          </div>
                          <div>
                            <div className="text-xs text-amber-500 uppercase tracking-widest mb-1">Top 5 Improvements</div>
                            <JsonList data={draft.improvements} />
                          </div>
                          <div>
                            <div className="text-xs text-amber-500 uppercase tracking-widest mb-1">Title Options</div>
                            <JsonList data={draft.titleOptions} />
                          </div>
                          <div>
                            <div className="text-xs text-amber-500 uppercase tracking-widest mb-1">Subtitle Options</div>
                            <JsonList data={draft.subtitleOptions} />
                          </div>
                          <div>
                            <div className="text-xs text-amber-500 uppercase tracking-widest mb-1">Pull Quotes</div>
                            <JsonList data={draft.pullQuotes} />
                          </div>
                          <div>
                            <div className="text-xs text-amber-500 uppercase tracking-widest mb-1">Social Excerpts</div>
                            <JsonList data={draft.socialExcerpts} />
                          </div>
                          <div>
                            <div className="text-xs text-amber-500 uppercase tracking-widest mb-1">Illustration Idea</div>
                            <p className="text-zinc-300 text-sm">{draft.illustrationIdea}</p>
                          </div>
                          <div>
                            <div className="text-xs text-amber-500 uppercase tracking-widest mb-1">Change Log</div>
                            <p className="text-zinc-400 text-sm whitespace-pre-wrap">{draft.changeLog}</p>
                          </div>
                          <div>
                            <div className="text-xs text-amber-500 uppercase tracking-widest mb-1">New Prose Table</div>
                            <p className="text-zinc-400 text-sm whitespace-pre-wrap">{draft.newProseTable}</p>
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    {/* WORKSTREAM TWO */}
                    <TabsContent value="journey">
                      {!draft.journeyStage ? (
                        <div className="text-zinc-600 text-sm">Run "Journey" workstream to see results.</div>
                      ) : (
                        <div className="space-y-5">
                          <div>
                            <div className="text-xs text-amber-500 uppercase tracking-widest mb-1">Journey Stage</div>
                            <span className="text-lg font-bold text-amber-300 capitalize">{draft.journeyStage?.replace(/_/g, " ")}</span>
                          </div>
                          <div>
                            <div className="text-xs text-amber-500 uppercase tracking-widest mb-1">Stage Justification</div>
                            <p className="text-zinc-300">{draft.stageJustification}</p>
                          </div>
                          <div>
                            <div className="text-xs text-amber-500 uppercase tracking-widest mb-1">Journey Navigation Line</div>
                            <p className="text-zinc-100 text-lg italic">{draft.journeyLine}</p>
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    {/* WORKSTREAM THREE */}
                    <TabsContent value="divergence">
                      {!draft.divergenceNotes ? (
                        <div className="text-zinc-600 text-sm">Run "Divergence" workstream to see results.</div>
                      ) : (
                        <div className="space-y-5">
                          <div>
                            <div className="text-xs text-amber-500 uppercase tracking-widest mb-1">Divergence Report</div>
                            <p className="text-zinc-300 whitespace-pre-wrap text-sm">{draft.divergenceNotes}</p>
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    {/* V2 DRAFT */}
                    <TabsContent value="v2">
                      {!draft.v2Content ? (
                        <div className="text-zinc-600 text-sm">Run "Edit" workstream to generate v2 content.</div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-xs text-amber-500 uppercase tracking-widest">v2 Draft</div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const blob = new Blob([draft.v2Content!], { type: "text/plain" });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = `${selectedSlug}-v2.txt`;
                                a.click();
                                URL.revokeObjectURL(url);
                              }}
                            >
                              Download v2
                            </Button>
                          </div>
                          <div className="bg-zinc-900 rounded border border-zinc-800 p-4 text-zinc-300 text-sm whitespace-pre-wrap leading-relaxed max-h-[60vh] overflow-y-auto">
                            {draft.v2Content}
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
