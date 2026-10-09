import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Mail, Phone } from "lucide-react";
import { urlFor } from "@/lib/sanity/image";
import { DEFAULT_ESSAY_HERO } from "@/lib/content/default-image";
import { postHref } from "@/lib/content/post-redirects";

// The blocks legacy BlogPost.tsx shows after the essay's engagement section,
// in live's order, copy unchanged: the diagnostic-tool and ImpactSoul CTAs,
// "Originally published at", Previous / Next, "Why this matters now", the
// author card, the booking box and the social line. Plus "The thread
// continues" band. Left out: the "Essay compilation $27" button (it opens the
// shop, which is on hold until there's a Stripe account).

const TONY_HEADSHOT =
  "https://cdn.sanity.io/images/a3q1cyqs/production/adce8df75f9f9debc9faeeb90cbcbb5a9e07881a-980x1721.webp";

export function PostCtas() {
  return (
    <>
      <div className="mb-6 rounded-r-sm border-l-[3px] border-brand-gold-light bg-brand-gold/4 px-5 py-6 sm:px-6">
        <h2 className="mb-2 font-heading text-[1.3rem] text-foreground">If this resonated, try a diagnostic tool</h2>
        <p className="mb-5 text-[0.95rem] leading-relaxed text-muted-foreground">
          Turn thinking into action. Assessments that clarify who you are and what you want. Five to ten minutes. Immediate
          insight.
        </p>
        <Link
          href="/find-my"
          className="inline-flex min-h-11 items-center rounded-xs bg-brand-gold px-7 font-mono text-xs tracking-widest text-white uppercase no-underline hover:opacity-90"
        >
          Start Assessment
        </Link>
      </div>
      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-r-md border border-l-[3px] border-brand-gold/15 border-l-brand-gold bg-linear-135 from-[#FEFCF7] to-[#F8F4EC] px-5 py-5 sm:px-6 dark:from-card dark:to-card">
        <div className="min-w-50 flex-1">
          <p className="mb-1.5 font-mono text-[0.72rem] tracking-[0.15em] text-brand-gold uppercase dark:text-brand-gold-light">
            Consciousness-Aligned Capital
          </p>
          <p className="text-[0.95rem] leading-normal text-foreground/80">
            ImpactSoul tokenizes high-value assets to fund regenerative impact. Art, culture, and consciousness — backed by real
            value.
          </p>
        </div>
        <a
          href="https://impactsoul.is"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center rounded-xs bg-brand-gold px-6 font-mono text-xs font-semibold tracking-[0.08em] whitespace-nowrap text-white uppercase no-underline hover:opacity-90"
        >
          Explore ImpactSoul
        </a>
      </div>
    </>
  );
}

type NavPost = { slug: string; title: string } | null;

export function PostClosing({ originalUrl, prev, next }: { originalUrl?: string; prev: NavPost; next: NavPost }) {
  return (
    <>
      {originalUrl && (
        <p className="mb-8 font-mono text-xs tracking-[0.04em] text-muted-foreground">
          Originally published at{" "}
          <a href={originalUrl} className="text-brand-gold underline-offset-2 hover:underline">
            tonygreenberg.com
          </a>
        </p>
      )}

      <div aria-hidden="true" className="mx-auto my-8 h-px w-24 bg-linear-to-r from-transparent via-essay-red/50 to-transparent" />

      {(prev || next) && (
        <nav aria-label="More essays" className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-2">
          {prev ? (
            <Link href={postHref(prev.slug)} className="block no-underline">
              <span className="mb-1.5 inline-flex items-center gap-1.5 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                <ArrowLeft aria-hidden="true" className="size-3" />
                Previous
              </span>
              <span className="block font-heading text-[1.05rem] leading-snug text-brand-gold hover:underline">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={postHref(next.slug)} className="block text-left no-underline sm:text-right">
              <span className="mb-1.5 inline-flex items-center gap-1.5 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                Next
                <ArrowRight aria-hidden="true" className="size-3" />
              </span>
              <span className="block font-heading text-[1.05rem] leading-snug text-brand-gold hover:underline">{next.title}</span>
            </Link>
          )}
        </nav>
      )}

      <div className="mb-6 rounded-r-sm border-l-[3px] border-brand-gold-light bg-brand-gold/4 px-5 py-6 sm:px-6">
        <p className="mb-3 font-mono text-xs tracking-[0.15em] text-brand-gold uppercase">Why this matters now</p>
        <p className="font-essay text-base leading-[1.8] text-essay-ink">
          We are living through the largest transfer of wealth, power, and attention in human history. Every essay on this site is
          a dispatch from the front lines of that fight — naming what&apos;s extractive, building what replaces it. If this one
          landed, it&apos;s because the question it raises hasn&apos;t been answered yet — and probably won&apos;t be by the people
          currently in charge of answering it.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-5 rounded-sm border border-brand-gold/12 bg-card px-5 py-5 sm:px-6">
        <Image
          src={TONY_HEADSHOT}
          alt="Tony Greenberg"
          width={64}
          height={64}
          sizes="64px"
          className="size-16 shrink-0 rounded-full border-2 border-brand-gold/20 object-cover object-top"
        />
        <div>
          <a
            href="https://linkedin.com/in/tonygreenberg"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-1 block font-fell text-lg text-essay-ink italic no-underline hover:underline"
          >
            Tony &quot;WhyNot&quot; Greenberg
          </a>
          <p className="font-mono text-xs tracking-[0.04em] text-muted-foreground">
            Systems thinker. Impact builder. Corporate accountability crusader.
          </p>
          {/* Author box copy from the SEO pack (owner's yes 2026-10-10). */}
          <p className="mt-2 text-[0.95rem] leading-normal text-foreground/85">
            Tony Greenberg is the CEO of RampRate and founder of ImpactSoul.{" "}
            <Link
              href="/about"
              className="inline-flex min-h-11 items-center gap-1 font-mono text-xs tracking-[0.06em] text-brand-gold uppercase no-underline hover:underline md:min-h-6"
            >
              About Tony
              <ArrowRight aria-hidden="true" className="size-3" />
            </Link>
          </p>
        </div>
      </div>

      <p className="mb-5 text-center font-fell text-lg text-essay-ink italic">
        &ldquo;If this made you think differently — share it. If it made you angry — good.&rdquo;
      </p>
      <div className="rounded-md border border-brand-gold/18 bg-linear-135 from-[#FEFCF7] to-[#F5F0E8] px-5 py-6 sm:px-8 dark:from-card dark:to-card">
        <div className="flex flex-col gap-3 text-[0.95rem] text-foreground">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Phone aria-hidden="true" className="size-4 shrink-0 text-brand-gold" />
            <span>
              Book a strategy hour:{" "}
              <Link href="/engage" className="border-b border-brand-gold/40 text-brand-gold no-underline">
                Enter The Gate
              </Link>
            </span>
            <span className="text-sm text-muted-foreground">Engagements begin with a scoping conversation</span>
          </p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Mail aria-hidden="true" className="size-4 shrink-0 text-brand-gold" />
            <span>
              Send preparation doc:{" "}
              <a href="mailto:tony@impactsoul.is" className="border-b border-brand-gold/40 text-brand-gold no-underline">
                tony@impactsoul.is
              </a>
            </span>
          </p>
        </div>
        <p className="mt-4 font-mono text-[0.7rem] tracking-[0.04em] text-muted-foreground">
          Prep doc required 48hrs before session · All sessions recorded via Fireflies · 30-day review gate before Stage 2
        </p>
        <p className="mt-3 text-center font-mono text-[0.72rem] tracking-[0.06em] text-brand-gold">
          2× MONEY-BACK GUARANTEE — Do the work. Document it. Zero results? We refund your fee, times two.
        </p>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <Link
          href="/subscribe"
          className="inline-flex min-h-11 items-center rounded-xs bg-brand-gold px-7 font-mono text-xs tracking-widest text-white uppercase no-underline hover:opacity-90"
        >
          Subscribe free
        </Link>
        <Link
          href="/invest"
          className="inline-flex min-h-11 items-center rounded-xs border border-brand-gold/30 px-7 font-mono text-xs tracking-widest text-brand-gold uppercase no-underline hover:bg-brand-gold/6"
        >
          ABIT waitlist
        </Link>
      </div>

      <p className="mt-8 border-t border-foreground/5 pt-8 text-center font-mono text-xs tracking-[0.06em] text-muted-foreground">
        Follow{" "}
        <a href="https://x.com/ThinkTony" target="_blank" rel="noopener noreferrer" className="text-brand-gold">
          @ThinkTony
        </a>{" "}
        on X ·{" "}
        <a href="https://linkedin.com/in/tonygreenberg" target="_blank" rel="noopener noreferrer" className="text-brand-gold">
          LinkedIn
        </a>{" "}
        · Only Time Buys Trust
      </p>
    </>
  );
}

export type ThreadPost = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  heroImage?: Parameters<typeof urlFor>[0];
  formatTag?: string;
  categoryTitle?: string;
};

// Legacy "Continue Reading: The thread continues." band (full width, under
// the essay and its sidebar), with each pick's editorial reason.
export function ThreadContinues({ posts, reasons }: { posts: ThreadPost[]; reasons: Record<string, string> }) {
  if (posts.length === 0) return null;
  return (
    <section aria-labelledby="thread-title" className="border-t border-brand-gold/12 bg-[#F5F0E8] px-5 py-12 sm:px-12 sm:py-16 dark:bg-card">
      <div className="mx-auto mb-10 max-w-275">
        <p className="mb-2 flex items-center gap-4 font-mono text-[0.72rem] tracking-[0.15em] text-brand-gold uppercase dark:text-brand-gold-light">
          <span aria-hidden="true" className="h-px w-10 bg-brand-gold" />
          Continue Reading
        </p>
        <h2 id="thread-title" className="font-fell text-[1.6rem] text-foreground italic sm:text-[2rem]">
          The thread continues.
        </h2>
      </div>
      <ul className="mx-auto grid max-w-275 grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
        {posts.map((p, i) => {
          const formatTag = p.formatTag;
          const excerpt = p.excerpt ?? "";
          return (
            <li key={p._id}>
              <Link
                href={postHref(p.slug.current)}
                className="group flex h-full flex-col overflow-hidden rounded-md border border-brand-gold/12 bg-[#FEFCF7] no-underline transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-brand-gold/30 hover:shadow-[0_8px_32px_rgba(139,105,20,0.1)] dark:bg-background"
              >
                <div className="relative aspect-[1/0.52] shrink-0 overflow-hidden">
                  <Image
                    src={p.heroImage ? urlFor(p.heroImage).width(720).height(375).url() : DEFAULT_ESSAY_HERO.src}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 360px"
                    className="object-cover brightness-[0.92] saturate-[0.95]"
                  />
                  <span className="absolute top-3 left-3 rounded-xs bg-[#FEFCF7]/92 px-2 py-1 font-mono text-[0.68rem] text-brand-gold">
                    0{i + 1}
                  </span>
                  {formatTag && (
                    <span className="absolute right-3 bottom-3 rounded-xs bg-[#FEFCF7]/90 px-2 py-0.5 font-mono text-[0.62rem] tracking-wide text-brand-gold uppercase">
                      {formatTag}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col px-5 pt-5 pb-6">
                  {reasons[p.slug.current] && (
                    <p className="mb-2.5 font-mono text-[0.68rem] leading-snug tracking-wide text-brand-gold uppercase dark:text-brand-gold-light">
                      {reasons[p.slug.current]}
                    </p>
                  )}
                  <h3 className="mb-3 flex-1 font-fell text-[1.1rem] leading-snug text-essay-ink italic">{p.title}</h3>
                  {excerpt && (
                    <p className="mb-4 font-essay text-[0.83rem] leading-relaxed text-essay-ink/80">
                      {excerpt.length > 100 ? `${excerpt.slice(0, 100)}…` : excerpt}
                    </p>
                  )}
                  {p.categoryTitle && (
                    <span className="font-mono text-[0.65rem] tracking-wide text-brand-gold uppercase dark:text-brand-gold-light">
                      {p.categoryTitle}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
