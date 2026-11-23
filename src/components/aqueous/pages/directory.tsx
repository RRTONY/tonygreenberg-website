"use client";

import { useCallback, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  Droplets,
  Search,
  MapPin,
  ArrowLeftRight,
  Skull,
  Zap,
  Sparkles,
  Globe,
  DollarSign,
  BookOpen,
  Compass,
  Shield,
  Eye,
  Scale,
  Heart,
  Users,
  ExternalLink,
  LayoutGrid,
  ArrowRight,
  Copy,
  Check,
  Share2,
  Gift,
  Trophy,
  Medal,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { ShareButton, FloatingShare } from "@/components/aqueous/share-button";
import { useMember, useReferral } from "@/components/aqueous/aqueous-providers";
import { Reveal } from "@/components/aqueous/motion";
import { Button } from "@/components/aqueous/ui";
import {
  createProject,
  deleteProject,
  getReferralLeaderboard,
  listProjects,
  type AqueousProject,
  type LeaderboardRow,
} from "@/app/aqueous/actions";
import { projectSchema, type ProjectValues } from "@/lib/content/aqueous/forms";
import { aq } from "@/lib/content/aqueous/nav";

// Ported from the Aqueous app's client/src/pages/Directory.tsx (2026-11-24): the master hub linking
// to every Aqueous page, the referral tracker and leaderboard, and the owner's "My Projects" list.
// trpc referral.leaderboard / projects.* → server actions; useAuth().user.role === 'admin' →
// useMember().isAdmin; the add form is Formik + Yup (projectSchema, checked again on the server).
// Changes from the app, each commented below:
// - Icon colors were style={{ backgroundColor }}; now precomposed literal classes.
// - The medal emoji (leaderboard) and the typed "✕" / "+" are lucide icons (house rule 18).
// - Project delete asks first (window.confirm), and its button shows on keyboard focus too.
// - The "Add New Project" card was a clickable div; now a real button. Form inputs get labels.
// - The card footer showed "aqueous.app/<path>" (the app's old domain); now the real address.

interface SitePage {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
  /** Was the app's `color` hex, used as style={{ backgroundColor }}. */
  colorClass: string;
  category: "explore" | "learn" | "act";
}

const sitePages: SitePage[] = [
  // EXPLORE
  {
    href: "/",
    title: "Home",
    description: "The front door — QPR pillars, top-rated waters, value revelations, and the mission.",
    icon: <Droplets className="w-5 h-5" />,
    colorClass: "bg-[#0B3D3E]",
    category: "explore",
  },
  {
    href: "/awi",
    title: "AWI Index",
    description: "The Aqueous Water Index — personalized rankings where 1 is perfection. Adjust your profile weights.",
    icon: <Scale className="w-5 h-5" />,
    colorClass: "bg-[#4ECDC4]",
    category: "explore",
  },
  {
    href: "/explore",
    title: "Water Explorer",
    description: "Browse, filter, and search every bottled water and filtration system in our database.",
    icon: <Search className="w-5 h-5" />,
    colorClass: "bg-[#0A8754]",
    category: "explore",
  },
  {
    href: "/tap-water",
    title: "Tap Water Lookup",
    description:
      "Enter your zip code and discover what flows through your pipes — contaminants, violations, and alternatives.",
    icon: <MapPin className="w-5 h-5" />,
    colorClass: "bg-[#3B82F6]",
    category: "explore",
  },
  {
    href: "/compare",
    title: "Compare Waters",
    description: "Side-by-side comparison of any two waters — QPR scores, contaminants, price, and environmental impact.",
    icon: <ArrowLeftRight className="w-5 h-5" />,
    colorClass: "bg-[#8B5CF6]",
    category: "explore",
  },
  {
    href: "/wall-of-shame",
    title: "Wall of Shame",
    description:
      "The inverse correlation between marketing spend and water quality. The bigger the brand, the worse the water.",
    icon: <Skull className="w-5 h-5" />,
    colorClass: "bg-[#9B2335]",
    category: "explore",
  },
  {
    href: "/filter-guide",
    title: "Filter Guide",
    description: "Tested and ranked filtration systems — RO, carbon, UV, gravity. Find the best value for your budget.",
    icon: <Zap className="w-5 h-5" />,
    colorClass: "bg-[#059669]",
    category: "explore",
  },
  // LEARN
  {
    href: "/gem-spark",
    title: "The Gem Spark",
    description:
      "Your customer journey — from water to self-discovery to the Flow Circuit. Where serendipity meets synchronicity.",
    icon: <Sparkles className="w-5 h-5" />,
    colorClass: "bg-[#D97706]",
    category: "learn",
  },
  {
    href: "/manifesto",
    title: "The Manifesto",
    description: "The founding document — why this exists, what we believe, and the world we are building together.",
    icon: <BookOpen className="w-5 h-5" />,
    colorClass: "bg-[#0B3D3E]",
    category: "learn",
  },
  {
    href: "/philosophy",
    title: "Philosophy",
    description: "The Great Simplification, Doughnut Economics, conscious consumption, and the science of enough.",
    icon: <Compass className="w-5 h-5" />,
    colorClass: "bg-[#B87333]",
    category: "learn",
  },
  {
    href: "/methodology",
    title: "QPR Methodology",
    description: "The open-source engine behind every score — Quality, Purity, Resonance. Fully auditable.",
    icon: <Eye className="w-5 h-5" />,
    colorClass: "bg-[#4ECDC4]",
    category: "learn",
  },
  {
    href: "/landscape",
    title: "Collective Consciousness Map",
    description: "The Dharma Quadrant — mapping every player in the water space by intention and impact.",
    icon: <Globe className="w-5 h-5" />,
    colorClass: "bg-[#7C3AED]",
    category: "learn",
  },
  {
    href: "/integrity",
    title: "Integrity Protocol",
    description: "The 15 questions every platform must answer. We go first, then invite every co-creator to the table.",
    icon: <Shield className="w-5 h-5" />,
    colorClass: "bg-[#0A8754]",
    category: "learn",
  },
  // ACT
  {
    href: "/pricing",
    title: "Pricing & Impact",
    description:
      "Free forever cross-reference scores. $20 personalized report. $5/mo Flow State. Every dollar flows to the foundation.",
    icon: <DollarSign className="w-5 h-5" />,
    colorClass: "bg-[#0B3D3E]",
    category: "act",
  },
];

// ── My Projects / External Sites (dynamic, from the database) ──
// Was PROJECT_COLORS (hex, style={{ backgroundColor }}), cycled per card.
const PROJECT_COLOR_CLASSES = [
  "bg-[#0B3D3E]",
  "bg-[#4ECDC4]",
  "bg-[#B87333]",
  "bg-[#0A8754]",
  "bg-[#6366F1]",
  "bg-[#EC4899]",
];

const categoryMeta = {
  explore: {
    label: "Explore & Discover",
    icon: <Search className="w-5 h-5" />,
    description: "Find your water, compare options, and uncover the truth.",
  },
  learn: {
    label: "Learn & Understand",
    icon: <BookOpen className="w-5 h-5" />,
    description: "The philosophy, methodology, and mission behind every score.",
  },
  act: {
    label: "Act & Transform",
    icon: <Heart className="w-5 h-5" />,
    description: "Take the next step — get your report, join the flow, share the ripple.",
  },
};

const SITE_ORIGIN = "https://tonygreenberg.com";
const noSubscribe = () => () => {};

/** window.location.origin in the browser, the live site's origin in the server HTML. */
function useOrigin() {
  return useSyncExternalStore(noSubscribe, () => window.location.origin, () => SITE_ORIGIN);
}

/** The app's motion.div initial={{ width: 0 }} animate={{ width }} bar: a CSS width transition. */
function ProgressFill({ percent, className }: { percent: number; className: string }) {
  return <div className={className} style={{ width: `${percent}%` }} />;
}

/** Was the medal emoji 🥇🥈🥉 (then "#4", "#5"). */
function Rank({ index }: { index: number }) {
  if (index === 0) return <Trophy aria-label="1st" className="size-5 mx-auto text-amber-500" />;
  if (index === 1) return <Medal aria-label="2nd" className="size-5 mx-auto text-slate-400" />;
  if (index === 2) return <Medal aria-label="3rd" className="size-5 mx-auto text-[oklch(0.60_0.12_55)]" />;
  return <>#{index + 1}</>;
}

function LeaderboardWidget() {
  const [leaders, setLeaders] = useState<LeaderboardRow[] | null>(null);

  useEffect(() => {
    let live = true;
    getReferralLeaderboard(5)
      .then((rows) => live && setLeaders(rows))
      .catch(() => live && setLeaders([]));
    return () => {
      live = false;
    };
  }, []);

  if (leaders === null) {
    return (
      <div className="space-y-3" data-testid="leaderboard-loading">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-muted/40" />
            <div className="flex-1 h-4 bg-muted/40 rounded" />
            <div className="w-12 h-4 bg-muted/40 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (leaders.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-muted-foreground">No referrals yet. Be the first!</p>
        <ShareButton variant="card" className="mt-3" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {leaders.map((leader, i) => (
        <div
          key={leader.code}
          className={
            i === 0
              ? "flex items-center gap-3 p-3 rounded-xl transition-colors bg-amber-500/10 border border-amber-500/20"
              : "flex items-center gap-3 p-3 rounded-xl transition-colors bg-muted/20 hover:bg-muted/30"
          }
        >
          <span className="text-lg w-8 text-center">
            <Rank index={i} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{leader.displayName}</p>
            <p className="text-[10px] text-muted-foreground font-mono">{leader.code}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-primary">{leader.signups}</p>
            <p className="text-[10px] text-muted-foreground">referrals</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const inputClass =
  "w-full px-3 py-1.5 text-xs rounded-lg border border-border/50 bg-muted/20 focus:outline-none focus:ring-1 focus:ring-primary/30";
const EMPTY_PROJECT: ProjectValues = { name: "", url: "", description: "", tag: "" };

function AddProjectForm({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
  return (
    <div className="glass-card border border-primary/30 rounded-xl p-5 h-full">
      <h4 className="text-sm font-semibold mb-3">Add Project</h4>
      <Formik
        initialValues={EMPTY_PROJECT}
        validationSchema={projectSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const result = await createProject(values).catch(() => null);
          setSubmitting(false);
          if (!result || !result.ok) {
            toast.error(result?.error ?? "Couldn't add the project. Please try again.");
            return;
          }
          toast.success("Project added!");
          onDone();
        }}
      >
        {({ values, isSubmitting }) => (
          <Form className="space-y-2" noValidate>
            {/* The app's inputs had placeholders only; each now has a screen-reader label. */}
            <Field name="name" type="text" placeholder="Project name" aria-label="Project name" className={inputClass} />
            <ErrorMessage name="name" component="p" className="text-[10px] text-red-600" />
            <Field name="url" type="url" placeholder="https://..." aria-label="Project URL" className={inputClass} />
            <ErrorMessage name="url" component="p" className="text-[10px] text-red-600" />
            <Field
              name="description"
              type="text"
              placeholder="Short description"
              aria-label="Short description"
              className={inputClass}
            />
            <ErrorMessage name="description" component="p" className="text-[10px] text-red-600" />
            <Field
              name="tag"
              type="text"
              placeholder="Tag (e.g. Personal, Inspiration)"
              aria-label="Tag"
              className={inputClass}
            />
            <ErrorMessage name="tag" component="p" className="text-[10px] text-red-600" />
            <div className="flex gap-2 pt-1">
              <Button
                type="submit"
                size="sm"
                className="flex-1 text-xs"
                disabled={!values.name || !values.url || isSubmitting}
              >
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                Add
              </Button>
              <Button type="button" size="sm" variant="outline" className="text-xs" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

function ProjectCard({
  project,
  index,
  isAdmin,
  onDelete,
}: {
  project: AqueousProject;
  index: number;
  isAdmin: boolean;
  onDelete: (project: AqueousProject) => void;
}) {
  const card = (
    <div className="group glass-card border border-border/40 rounded-xl p-5 hover:shadow-lg hover:border-primary/20 transition-all h-full cursor-pointer relative">
      {isAdmin && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(project);
          }}
          className="absolute top-2 right-2 p-1 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
          title="Remove project"
          aria-label={`Remove ${project.name}`}
        >
          {/* was a typed "✕" */}
          <X aria-hidden="true" className="size-3" />
        </button>
      )}
      <div className="flex items-start gap-3.5">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-white ${PROJECT_COLOR_CLASSES[index % PROJECT_COLOR_CLASSES.length]}`}
        >
          <ExternalLink className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{project.name}</h3>
            <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{project.description}</p>
        </div>
      </div>
      <div className="mt-3 pt-2 border-t border-border/20 flex items-center justify-between">
        <span className="text-[10px] font-mono text-muted-foreground/50 tracking-wider">
          {project.url.replace("https://", "").replace("http://", "").replace(/\/$/, "")}
        </span>
        {project.tag && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{project.tag}</span>
        )}
      </div>
    </div>
  );

  // A path starting with "/" is a page on this site (next/link); anything else opens in a new tab.
  return project.url.startsWith("/") ? (
    <Link href={project.url}>{card}</Link>
  ) : (
    <a href={project.url} target="_blank" rel="noopener noreferrer">
      {card}
    </a>
  );
}

export function Directory() {
  const { stats } = useReferral();
  const { isAdmin } = useMember();
  const origin = useOrigin();
  const [copied, setCopied] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [projects, setProjects] = useState<AqueousProject[]>([]);
  const [version, setVersion] = useState(0);
  const refetchProjects = useCallback(() => setVersion((v) => v + 1), []);

  // trpc.projects.list.useQuery()
  useEffect(() => {
    let live = true;
    listProjects()
      .then((rows) => live && setProjects(rows))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [version]);

  const handleDelete = async (project: AqueousProject) => {
    // The app removed on one click; a confirm now guards the owner's delete.
    if (!window.confirm(`Remove "${project.name}" from My Projects?`)) return;
    const result = await deleteProject(project.id).catch(() => null);
    if (!result || !result.ok) {
      toast.error(result?.error ?? "Couldn't remove the project. Please try again.");
      return;
    }
    refetchProjects();
    toast.success("Project removed");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}${aq("/directory")}?ref=${stats?.code ?? ""}`);
    setCopied(true);
    toast.success("Directory link copied with your referral code!");
    setTimeout(() => setCopied(false), 2000);
  };

  const signups = stats?.signups ?? 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="sacred-geo-bg absolute inset-0 opacity-3" />
        <div className="container relative">
          {/* was motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} */}
          <div className="max-w-3xl mx-auto text-center animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <LayoutGrid className="w-4 h-4" />
              Master Directory
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 font-aq-display">
              Every Page. <span className="text-primary">One Place.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              The complete map of the Aqueous ecosystem — every tool, every page, every insight. Share any link and your
              referral code travels with it.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button onClick={handleCopyLink} variant="outline" className="gap-2">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy Directory Link"}
              </Button>
              <ShareButton variant="button" />
            </div>
          </div>
        </div>
      </section>

      {/* Site Pages by Category */}
      {(["explore", "learn", "act"] as const).map((cat, catIdx) => {
        const meta = categoryMeta[cat];
        const pages = sitePages.filter((p) => p.category === cat);
        return (
          <section key={cat} className={catIdx % 2 === 1 ? "py-16 bg-primary/3" : "py-16"}>
            <div className="container">
              {/* was whileInView y: 16 */}
              <Reveal
                enter="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                className="flex items-center gap-3 mb-8"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  {meta.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-aq-display">{meta.label}</h2>
                  <p className="text-sm text-muted-foreground">{meta.description}</p>
                </div>
              </Reveal>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pages.map((page, i) => (
                  // was whileInView y: 12, delay i * 0.05
                  <Reveal
                    key={page.href}
                    enter="animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both"
                    delay={i * 0.05}
                  >
                    <Link href={aq(page.href)}>
                      <div className="group glass-card border border-border/40 rounded-xl p-5 hover:shadow-lg hover:border-primary/20 transition-all h-full cursor-pointer">
                        <div className="flex items-start gap-3.5">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-white ${page.colorClass}`}
                          >
                            {page.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                                {page.title}
                              </h3>
                              <ArrowRight
                                aria-hidden="true"
                                className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{page.description}</p>
                          </div>
                        </div>
                        {/* Share icon on hover */}
                        <div className="mt-3 pt-2 border-t border-border/20 flex items-center justify-between">
                          {/* was `aqueous.app${href}` (the app's old domain); now the page's real address */}
                          <span className="text-[10px] font-mono text-muted-foreground/50 tracking-wider">
                            {`tonygreenberg.com${aq(page.href)}`}
                          </span>
                          <ShareButton
                            variant="icon"
                            text={`${page.title} — ${page.description}`}
                            url={`${origin}${aq(page.href)}`}
                          />
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Referral Tracker */}
      <section className="py-16 bg-primary/3">
        <div className="container">
          <Reveal
            enter="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both"
            className="max-w-2xl mx-auto"
          >
            <div className="glass-card border border-border/40 rounded-2xl p-8 text-center">
              <Gift className="w-8 h-8 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 font-aq-display">Your Referral Dashboard</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Share any page on this site. Your referral code{" "}
                <span className="font-mono font-bold text-primary">{stats?.code}</span> travels with every link.
              </p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-3 rounded-xl bg-muted/30">
                  <p className="text-2xl font-bold text-primary font-aq-display">{stats?.shares ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Shares</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/30">
                  <p className="text-2xl font-bold text-primary font-aq-display">{signups}</p>
                  <p className="text-xs text-muted-foreground">Sign-ups</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/30">
                  <p className="text-2xl font-bold text-primary font-aq-display">${stats?.credits ?? "0.00"}</p>
                  <p className="text-xs text-muted-foreground">Credits</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Progress to free report</span>
                  <span className="font-bold text-foreground">{signups}/10</span>
                </div>
                <div className="w-full h-2.5 bg-muted/30 rounded-full overflow-hidden">
                  {/* was motion.div width 0 → % (duration 1, delay 0.3) */}
                  <ProgressFill
                    percent={Math.min((signups / 10) * 100, 100)}
                    className="h-full bg-primary rounded-full transition-[width] duration-1000 delay-300"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5">
                  Refer 10 people who sign up → unlock a free personalized AWI report
                </p>
              </div>

              <div className="flex items-center gap-3">
                <ShareButton variant="card" className="flex-1" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Referral Leaderboard */}
      <section className="py-12">
        <div className="container">
          <Reveal
            enter="animate-in fade-in slide-in-from-bottom-5 duration-500 fill-mode-both"
            className="max-w-2xl mx-auto"
          >
            <div className="glass-card border border-border/40 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-aq-display">Top Referrers</h3>
                  <p className="text-xs text-muted-foreground">The community&apos;s most active water advocates</p>
                </div>
              </div>
              <LeaderboardWidget />
            </div>
          </Reveal>
        </div>
      </section>

      {/* My Projects / External Sites */}
      <section className="py-16">
        <div className="container">
          <Reveal
            enter="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-aq-display">My Projects</h2>
              <p className="text-sm text-muted-foreground">Other sites and projects in the ecosystem</p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project, i) => (
              <Reveal
                key={project.id}
                enter="animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both"
                delay={i * 0.05}
              >
                <ProjectCard project={project} index={i} isAdmin={isAdmin} onDelete={handleDelete} />
              </Reveal>
            ))}

            {/* Add New Project Card (owner only) or placeholder */}
            {isAdmin ? (
              <Reveal
                enter="animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both"
                delay={projects.length * 0.05}
              >
                {showAddForm ? (
                  <AddProjectForm
                    onDone={() => {
                      refetchProjects();
                      setShowAddForm(false);
                    }}
                    onCancel={() => setShowAddForm(false)}
                  />
                ) : (
                  // Was a clickable div; a real button so it works from the keyboard.
                  <button
                    type="button"
                    className="w-full glass-card border border-dashed border-border/60 rounded-xl p-5 h-full flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/30 hover:bg-primary/2 transition-all min-h-35"
                    onClick={() => setShowAddForm(true)}
                  >
                    <div className="w-10 h-10 rounded-lg bg-muted/30 flex items-center justify-center mb-2 text-muted-foreground">
                      {/* was a typed "+" */}
                      <Plus aria-hidden="true" className="size-5" />
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">Add New Project</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">Every site you build appears here</p>
                  </button>
                )}
              </Reveal>
            ) : projects.length === 0 ? (
              <div className="glass-card border border-dashed border-border/60 rounded-xl p-5 flex flex-col items-center justify-center text-center min-h-35">
                <p className="text-xs text-muted-foreground">Projects coming soon</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 bg-primary/3">
        <div className="container text-center">
          <p className="text-muted-foreground mb-4">Share the entire Aqueous ecosystem with one link.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button onClick={handleCopyLink} className="gap-2">
              <Share2 className="w-4 h-4" />
              {copied ? "Copied!" : "Share This Directory"}
            </Button>
            <Button variant="outline" asChild>
              <Link href={aq("/")}>Back to Home</Link>
            </Button>
          </div>
        </div>
      </section>

      <FloatingShare />
    </div>
  );
}
