import type { Metadata } from "next";
import Link from "next/link";
import { getUser, requestOrigin } from "@/lib/auth";
import { getOrCreateReferralCode } from "@/lib/referrals";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { CopyLink } from "./copy-link";

// "Your Impact": a member's invite link and the people who joined through it.
// Ported from legacy client/src/pages/MyReferrals.tsx; live shows the same
// signed-out copy (checked 2026-10-06). Legacy's depth score added up essays
// read, assessments and chats per referred member; this site doesn't track
// those per member, so depth here is the passages they've saved.
export const metadata: Metadata = {
  title: "Your Impact",
  description: "Your invite link and the people who joined through it.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/my-impact" },
};

const statCard = "rounded-xl border border-[#E8E4DC] bg-white px-5 py-6 text-center";
const statLabel = "mt-1 font-mono text-[0.7rem] tracking-[0.1em] text-[#767676] uppercase";

export default async function MyImpactPage() {
  const user = await getUser();

  if (!user) {
    return (
      <div className="min-h-[70vh] bg-[#FAFAF7] px-6 py-24 text-center">
        <h1 className="font-heading text-[2.2rem] text-[#0A0A10]">Your Impact</h1>
        <p className="mx-auto mt-3 max-w-125 text-base/[1.7] text-[#666]">Sign in to see your referral impact and share your unique link.</p>
        <Link
          href="/login?next=/my-impact"
          className="mt-8 inline-flex min-h-11 items-center rounded-lg bg-[#0A0A10] px-8 font-mono text-[0.8rem] tracking-[0.12em] text-brand-gold-light uppercase"
        >
          Sign in
        </Link>
      </div>
    );
  }

  const db = createServiceRoleClient();
  const [code, origin, { data: referrals }] = await Promise.all([
    getOrCreateReferralCode(user.id),
    requestOrigin(),
    db.from("referrals").select("referred_user_id, created_at").eq("referrer_id", user.id).order("created_at"),
  ]);
  const referred = (referrals ?? []).map((r) => r.referred_user_id as string);
  const { data: hl } = referred.length ? await db.from("highlights").select("user_id").in("user_id", referred) : { data: [] };
  const depthBy = (hl ?? []).reduce<Record<string, number>>((acc, r) => ({ ...acc, [r.user_id]: (acc[r.user_id] ?? 0) + 1 }), {});
  const totalDepth = Object.values(depthBy).reduce((a, b) => a + b, 0);
  const shareUrl = `${origin}/signup?ref=${code}`;

  return (
    <div className="min-h-screen bg-[#FAFAF7] px-6 py-16">
      <div className="mx-auto max-w-175">
        <p className="mb-2 font-mono text-[0.7rem] tracking-[0.2em] text-brand-gold uppercase">Your Impact</p>
        <h1 className="mb-10 font-heading text-[2.2rem] text-[#0A0A10]">Who Came Through Your Door</h1>

        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <div className={statCard}>
            <p className="font-heading text-[2.4rem] font-bold text-[#0A0A10]">{referred.length}</p>
            <p className={statLabel}>People Referred</p>
          </div>
          <div className={statCard}>
            <p className="font-heading text-[2.4rem] font-bold text-brand-gold">{totalDepth}</p>
            <p className={statLabel}>Depth Score</p>
          </div>
          <div className={statCard}>
            <p className="font-heading text-[2.4rem] font-bold text-[#0A0A10]">{referred.length ? Math.round(totalDepth / referred.length) : 0}</p>
            <p className={statLabel}>Avg Depth</p>
          </div>
        </div>

        <div className="mb-10 rounded-2xl bg-[#0A0A10] p-8 text-center">
          <p className="mb-3 font-mono text-[0.72rem] tracking-[0.12em] text-brand-gold-light uppercase">Your Referral Link</p>
          <CopyLink url={shareUrl} />
          <p className="mt-4 text-[0.9rem] text-[#F5F0E6]/60">When someone joins through your link and engages deeply, your depth score grows.</p>
        </div>

        {referred.length > 0 && (
          <section>
            <h2 className="mb-3 font-mono text-[0.72rem] tracking-[0.1em] text-brand-gold uppercase">Your Referrals</h2>
            <ul className="divide-y divide-[#E8E4DC] rounded-xl border border-[#E8E4DC] bg-white">
              {referred.map((id, i) => (
                <li key={id} className="flex items-center justify-between px-5 py-3.5">
                  <span className="text-[#444]">Member {i + 1}</span>
                  <span className="font-mono text-xs text-brand-gold">Depth: {depthBy[id] ?? 0}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
