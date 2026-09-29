import type { IconType } from "react-icons";
import { RiGrokAiFill, RiOpenaiFill } from "react-icons/ri";
import { SiClaude, SiGooglegemini, SiPerplexity } from "react-icons/si";

// "Request an AI summary" logo tiles, shown at the end of every blog post and
// in the site footer. Each tile opens that assistant with the prompt already
// typed in via its "?q=" prefill link (the de-facto convention these chat
// products share; if one drops it, the link still opens, only the prefill is
// lost). Links always point at the production domain, never
// window.location: an AI tool can't open localhost or a deploy preview.
export const SITE_URL = "https://tonygreenberg.com";

const AI_TOOLS: { label: string; Icon: IconType; iconClass: string; buildHref: (prompt: string) => string }[] = [
  { label: "Claude", Icon: SiClaude, iconClass: "text-[#D97757]", buildHref: (p) => `https://claude.ai/new?q=${encodeURIComponent(p)}` },
  { label: "Gemini", Icon: SiGooglegemini, iconClass: "text-[#8E75B2]", buildHref: (p) => `https://gemini.google.com/app?q=${encodeURIComponent(p)}` },
  { label: "Grok", Icon: RiGrokAiFill, iconClass: "text-black dark:text-white", buildHref: (p) => `https://grok.com/?q=${encodeURIComponent(p)}` },
  { label: "ChatGPT", Icon: RiOpenaiFill, iconClass: "text-black dark:text-white", buildHref: (p) => `https://chatgpt.com/?q=${encodeURIComponent(p)}` },
  { label: "Perplexity", Icon: SiPerplexity, iconClass: "text-[#1FB8CD]", buildHref: (p) => `https://www.perplexity.ai/search?q=${encodeURIComponent(p)}` },
];

export function AiSummaryLinks({ heading, prompt, className = "" }: { heading: string; prompt: string; className?: string }) {
  return (
    <div className={`text-center ${className}`}>
      <p className="mb-5 font-heading text-xl text-foreground sm:text-2xl">{heading}</p>
      <ul className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {AI_TOOLS.map(({ label, Icon, iconClass, buildHref }) => (
          <li key={label}>
            <a
              href={buildHref(prompt)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Summarize with ${label}`}
              title={`Summarize with ${label}`}
              className="flex size-14 items-center justify-center rounded-2xl border border-border bg-white shadow-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:outline-none sm:size-16 dark:bg-white/5"
            >
              <Icon className={`size-7 sm:size-8 ${iconClass}`} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
