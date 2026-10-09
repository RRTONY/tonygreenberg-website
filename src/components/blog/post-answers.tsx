// The optional "Short answer" box near the top of an essay and the visible
// questions-and-answers section after it, from the Sanity post's
// `shortAnswer` and `faq` fields (SEO pack section 3, owner's yes
// 2026-10-10; first used on five-cups). Plain server HTML, no FAQPage schema
// on purpose: Google limits FAQ rich results to a few health and government
// sites, so the section is for readers.

export type PostFaqItem = { _key?: string; question: string; answer: string };

export const POST_FAQ_ID = "questions-and-answers";
export const POST_FAQ_TITLE = "Questions and Answers";

export function ShortAnswer({ text }: { text?: string }) {
  if (!text?.trim()) return null;
  return (
    <aside aria-label="Short answer" className="mb-6 max-w-170 rounded-r-sm border-l-[3px] border-brand-gold bg-brand-gold/5 px-5 py-4">
      <p className="mb-1.5 font-mono text-xs tracking-[0.15em] text-brand-gold uppercase dark:text-brand-gold-light">Short answer</p>
      <p className="font-essay text-base leading-[1.75] text-essay-ink">{text}</p>
    </aside>
  );
}

export function PostFaq({ items }: { items?: PostFaqItem[] }) {
  const faq = (items ?? []).filter((q) => q.question?.trim() && q.answer?.trim());
  if (faq.length === 0) return null;
  return (
    <section aria-labelledby={POST_FAQ_ID} className="mt-12">
      <h2
        id={POST_FAQ_ID}
        className="mb-4 scroll-mt-28 border-b border-border pb-2 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase"
      >
        {POST_FAQ_TITLE}
      </h2>
      <dl className="space-y-5">
        {faq.map((q) => (
          <div key={q._key ?? q.question}>
            <dt className="mb-1 font-heading text-lg leading-snug font-semibold text-foreground">{q.question}</dt>
            <dd className="font-essay text-base leading-[1.75] text-essay-ink/90">{q.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
