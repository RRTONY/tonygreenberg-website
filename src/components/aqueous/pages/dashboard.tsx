"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Loader2,
  CreditCard,
  Users,
  FileText,
  Copy,
  Check,
  Gift,
  TrendingUp,
  Shield,
  Droplets,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { FloatingShare } from "@/components/aqueous/share-button";
import { useMember } from "@/components/aqueous/aqueous-providers";
import { Button } from "@/components/aqueous/ui";
import {
  createReport,
  getDashboard,
  type AqueousDashboard,
  type AqueousPurchase,
  type AqueousReportSummary,
  type ReferralStats,
} from "@/app/aqueous/actions";
import { aq } from "@/lib/content/aqueous/nav";

// Ported from the Aqueous app's client/src/pages/Dashboard.tsx (2026-11-24): the member's overview,
// purchases, referrals and reports. trpc dashboard.overview / reports.generate → getDashboard /
// createReport server actions; useAuth → useMember; getLoginUrl() → /login?next=/aqueous/dashboard.
// Changes from the app:
// - "Generate report" now opens the new report (/aqueous/report/<id>), where it's written live; the
//   app only started it in the background. When none is available, the server's reason is a toast.
// - The app crashed (dashboard!) when the overview failed to load; it now says so with a retry.
// - Pending buttons show the Loader2 spinner, not "Generating..." text.
// - The referral link was `${origin}?ref=CODE`, the app's home; now the Aqueous home (aq("?ref=")).

type TabId = "overview" | "purchases" | "referrals" | "reports";

const tabs: { id: TabId; label: string; icon: ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <TrendingUp className="w-4 h-4" /> },
  { id: "purchases", label: "Purchases", icon: <CreditCard className="w-4 h-4" /> },
  { id: "referrals", label: "Referrals", icon: <Users className="w-4 h-4" /> },
  { id: "reports", label: "Reports", icon: <FileText className="w-4 h-4" /> },
];

const SIGN_IN_HREF = `/login?next=${encodeURIComponent(aq("/dashboard"))}`;

type Loaded = { state: "ok"; data: AqueousDashboard } | { state: "signedOut" } | { state: "error"; message: string };

function SignInBox() {
  return (
    <main className="flex-1 flex items-center justify-center pt-20">
      <div className="text-center space-y-6 p-8">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
          <Shield className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold font-aq-display">Sign In to Access Your Dashboard</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          View your reports, track referrals, manage your subscription, and earn rewards.
        </p>
        <Button asChild size="lg" className="bg-primary text-primary-foreground">
          <a href={SIGN_IN_HREF}>Sign In</a>
        </Button>
      </div>
    </main>
  );
}

export function Dashboard() {
  const router = useRouter();
  const { signedIn, loaded: memberLoaded } = useMember();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<Loaded | null>(null);
  const [version, setVersion] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  // trpc.dashboard.overview.useQuery(undefined, { enabled: isAuthenticated })
  useEffect(() => {
    if (!memberLoaded || !signedIn) return;
    let live = true;
    getDashboard()
      .then((r) => {
        if (!live) return;
        if (r.ok) setResult({ state: "ok", data: r.data });
        else setResult(r.signedOut ? { state: "signedOut" } : { state: "error", message: r.error });
      })
      .catch(() => live && setResult({ state: "error", message: "This couldn't be loaded just now." }));
    return () => {
      live = false;
    };
  }, [memberLoaded, signedIn, version]);

  const onGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const r = await createReport();
      if (r.ok) {
        router.push(aq(`/report/${r.data.reportId}`));
        return;
      }
      toast.error(r.error);
    } catch {
      toast.error("This couldn't be done just now. Please try again in a minute.");
    }
    setIsGenerating(false);
  };

  // Not signed in
  if ((memberLoaded && !signedIn) || result?.state === "signedOut") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SignInBox />
      </div>
    );
  }

  // Loading
  if (!memberLoaded || result === null) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 flex items-center justify-center pt-20">
          <Loader2 aria-label="Loading your dashboard" className="w-8 h-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (result.state === "error") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center space-y-4 p-8">
            <p className="text-muted-foreground">{result.message}</p>
            <Button
              variant="outline"
              onClick={() => {
                setResult(null);
                setVersion((v) => v + 1);
              }}
            >
              Try again
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const d = result.data;
  const creditBalance = d.credit;
  const signupProgress = d.referral ? Math.min((d.referral.signups / 10) * 100, 100) : 0;
  const referralLink = d.referral?.code ? `${window.location.origin}${aq(`?ref=${d.referral.code}`)}` : "";

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-1 font-aq-display">Welcome back, {d.user.name || "Water Guardian"}</h1>
            <p className="text-muted-foreground">{d.user.email}</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard icon={<FileText className="w-5 h-5" />} label="Reports" value={d.reports.length} />
            <StatCard icon={<CreditCard className="w-5 h-5" />} label="Purchases" value={d.purchases.length} />
            <StatCard icon={<Users className="w-5 h-5" />} label="Referrals" value={d.referral?.signups ?? 0} />
            <StatCard icon={<Gift className="w-5 h-5" />} label="Credits" value={`$${creditBalance.toFixed(2)}`} />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                aria-pressed={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={
                  activeTab === tab.id
                    ? "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors bg-primary text-primary-foreground"
                    : "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors text-muted-foreground hover:bg-muted/50"
                }
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content: was motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate (0.2s);
              the key remounts the panel so the enter classes replay on every switch. */}
          <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-2 duration-200 fill-mode-both">
            {activeTab === "overview" && (
              <OverviewTab
                dashboard={d}
                referralLink={referralLink}
                copied={copied}
                onCopyLink={copyReferralLink}
                signupProgress={signupProgress}
                onGenerateReport={onGenerateReport}
                isGenerating={isGenerating}
              />
            )}
            {activeTab === "purchases" && <PurchasesTab purchases={d.purchases} />}
            {activeTab === "referrals" && (
              <ReferralsTab
                referral={d.referral}
                referralLink={referralLink}
                copied={copied}
                onCopyLink={copyReferralLink}
                signupProgress={signupProgress}
              />
            )}
            {activeTab === "reports" && (
              <ReportsTab reports={d.reports} onGenerateReport={onGenerateReport} isGenerating={isGenerating} />
            )}
          </div>
        </div>
      </main>

      <FloatingShare />
    </div>
  );
}

// ─── Stat Card ───
function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

// ─── Overview Tab ───
function OverviewTab({
  dashboard: d,
  referralLink,
  copied,
  onCopyLink,
  signupProgress,
  onGenerateReport,
  isGenerating,
}: {
  dashboard: AqueousDashboard;
  referralLink: string;
  copied: boolean;
  onCopyLink: () => void;
  signupProgress: number;
  onGenerateReport: () => void;
  isGenerating: boolean;
}) {
  return (
    <div className="space-y-6">
      {/* Subscription Status */}
      <div className="rounded-xl border border-border/60 bg-card p-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" /> Subscription
        </h3>
        {d.subscription?.status === "active" ? (
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
              Active — Flow State
            </span>
            <span className="text-sm text-muted-foreground">$5/month</span>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-muted-foreground text-sm">No active subscription</span>
            <Button asChild size="sm" variant="outline">
              <Link href={aq("/pricing")}>Upgrade to Flow State</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Referral Quick Card */}
      {d.referral && (
        <div className="rounded-xl border border-border/60 bg-card p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" /> Referral Progress
          </h3>
          <div className="flex items-center gap-4 mb-3">
            <span className="text-sm text-muted-foreground">{d.referral.signups}/10 sign-ups</span>
            {d.referral.freeReportUnlocked && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                Free Report Unlocked!
              </span>
            )}
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-4">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${signupProgress}%` }} />
          </div>
          {referralLink && (
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-muted rounded-lg text-xs truncate">{referralLink}</code>
              <Button size="sm" variant="outline" onClick={onCopyLink} aria-label="Copy referral link">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={onGenerateReport}
          disabled={isGenerating}
          className="rounded-xl border border-border/60 bg-card p-6 text-left hover:border-primary/40 transition-colors"
        >
          <Droplets className="w-8 h-8 text-primary mb-3" />
          <h4 className="font-semibold mb-1 flex items-center gap-2">
            {isGenerating && <Loader2 className="size-4 animate-spin" />}
            Generate New Report
          </h4>
          <p className="text-sm text-muted-foreground">Create a personalized AWI report based on your water profile.</p>
        </button>
        <Link
          href={aq("/explore")}
          className="rounded-xl border border-border/60 bg-card p-6 text-left hover:border-primary/40 transition-colors block"
        >
          <TrendingUp className="w-8 h-8 text-primary mb-3" />
          <h4 className="font-semibold mb-1">Explore Waters</h4>
          <p className="text-sm text-muted-foreground">Browse and compare bottled waters by AWI score.</p>
        </Link>
      </div>
    </div>
  );
}

// ─── Purchases Tab ───
function PurchasesTab({ purchases }: { purchases: AqueousPurchase[] }) {
  if (purchases.length === 0) {
    return (
      <div className="text-center py-16">
        <CreditCard className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Purchases Yet</h3>
        <p className="text-muted-foreground mb-4">Get your first personalized AWI report.</p>
        <Button asChild>
          <Link href={aq("/pricing")}>View Pricing</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {purchases.map((p) => (
        <div key={p.id} className="rounded-xl border border-border/60 bg-card p-4 flex items-center justify-between">
          <div>
            <span className="font-medium capitalize">{p.productType}</span>
            <span
              className={
                p.status === "completed"
                  ? "ml-3 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700"
                  : "ml-3 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700"
              }
            >
              {p.status}
            </span>
            {p.creditApplied && parseFloat(p.creditApplied) > 0 && (
              <span className="ml-2 text-xs text-muted-foreground">(-${p.creditApplied} credit)</span>
            )}
          </div>
          <span className="text-sm text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Referrals Tab ───
function ReferralsTab({
  referral,
  referralLink,
  copied,
  onCopyLink,
  signupProgress,
}: {
  referral: ReferralStats | null;
  referralLink: string;
  copied: boolean;
  onCopyLink: () => void;
  signupProgress: number;
}) {
  if (!referral) {
    return (
      <div className="text-center py-16">
        <Users className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Start Sharing</h3>
        <p className="text-muted-foreground">Share Aqueous with friends and earn $5 per sign-up.</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border/60 bg-card p-4 text-center">
          <div className="text-2xl font-bold">{referral.shares}</div>
          <div className="text-xs text-muted-foreground mt-1">Shares</div>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-4 text-center">
          <div className="text-2xl font-bold">{referral.signups}</div>
          <div className="text-xs text-muted-foreground mt-1">Sign-ups</div>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-4 text-center">
          <div className="text-2xl font-bold">${referral.credits}</div>
          <div className="text-xs text-muted-foreground mt-1">Earned</div>
        </div>
      </div>

      {/* Progress to free report */}
      <div className="rounded-xl border border-border/60 bg-card p-6">
        <h3 className="font-semibold mb-3">Progress to Free Report</h3>
        <p className="text-sm text-muted-foreground mb-3">Refer 10 friends to unlock a free personalized AWI report.</p>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-2">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${signupProgress}%` }} />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{referral.signups} of 10</span>
          {referral.freeReportUnlocked && <span className="text-amber-600 font-medium">Unlocked!</span>}
        </div>
      </div>

      {/* Share Link */}
      <div className="rounded-xl border border-border/60 bg-card p-6">
        <h3 className="font-semibold mb-3">Your Referral Link</h3>
        <div className="flex items-center gap-2">
          <code className="flex-1 px-3 py-2.5 bg-muted rounded-lg text-sm truncate">{referralLink}</code>
          <Button size="sm" onClick={onCopyLink}>
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-1" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1" /> Copy
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Your code: <strong>{referral.code}</strong> — Each friend gets $5 off, you earn $5 per sign-up.
        </p>
      </div>
    </div>
  );
}

// ─── Reports Tab ───
const REPORT_STATUS_CLASS: Record<string, string> = {
  complete: "ml-3 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700",
  generating: "ml-3 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700",
  failed: "ml-3 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700",
};
const REPORT_STATUS_DEFAULT = "ml-3 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700";

function ReportsTab({
  reports,
  onGenerateReport,
  isGenerating,
}: {
  reports: AqueousReportSummary[];
  onGenerateReport: () => void;
  isGenerating: boolean;
}) {
  if (reports.length === 0) {
    return (
      <div className="text-center py-16">
        <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Reports Yet</h3>
        <p className="text-muted-foreground mb-4">Generate your first personalized AWI report.</p>
        <Button onClick={onGenerateReport} disabled={isGenerating}>
          {isGenerating && <Loader2 className="size-4 animate-spin" />}
          Generate Report
        </Button>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <div className="flex justify-end mb-2">
        <Button size="sm" onClick={onGenerateReport} disabled={isGenerating}>
          {isGenerating && <Loader2 className="size-4 animate-spin" />}
          New Report
        </Button>
      </div>
      {reports.map((r) => (
        <Link
          key={r.id}
          href={aq(`/report/${r.id}`)}
          className="block rounded-xl border border-border/60 bg-card p-4 hover:border-primary/40 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <span className="font-medium">{r.title}</span>
                <span className={REPORT_STATUS_CLASS[r.status] ?? REPORT_STATUS_DEFAULT}>{r.status}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
