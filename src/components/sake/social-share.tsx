"use client";

import { useState } from "react";
import { Check, Link2, Mail, MessageCircle, Share2 } from "lucide-react";
import { FacebookIcon, XIcon } from "@/components/icons/brand-icons";
import { useLanguage } from "@/components/sake/sake-providers";

// The Sake app's SocialShare (client/src/components/SocialShare.tsx): X, Facebook, WhatsApp, Email
// and Copy Link, as a row of icon buttons or (compact) a "Share" button with a small menu. Colors
// follow the look through sake.css's --sk-* variables. lucide-react no longer ships brand icons,
// so X and Facebook use the site's own (src/components/icons/brand-icons.tsx). `url` is the full
// page address; the copy fallback (execCommand) the app had for old browsers isn't needed any more.

const DEFAULT_DESCRIPTION = "Discovered on Sake for Sake's Sake™ — The world's deepest sake guide.";
const DEFAULT_HASHTAGS = ["SakeForSakesSake", "EXV", "Sake", "日本酒"];

export function SocialShare({
  title,
  url,
  description = DEFAULT_DESCRIPTION,
  hashtags = DEFAULT_HASHTAGS,
  className,
  compact = false,
}: {
  title: string;
  url: string;
  description?: string;
  hashtags?: string[];
  className?: string;
  compact?: boolean;
}) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareText = `${title} — ${description}`;
  const shareLinks = [
    {
      name: "X (Twitter)",
      icon: XIcon,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent(hashtags.join(","))}`,
    },
    {
      name: "Facebook",
      icon: FacebookIcon,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(shareText)}`,
    },
    { name: "WhatsApp", icon: MessageCircle, href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${url}`)}` },
    {
      name: "Email",
      icon: Mail,
      href: `mailto:?subject=${encodeURIComponent(`${title} — Sake for Sake's Sake™`)}&body=${encodeURIComponent(`${shareText}\n\n${url}`)}`,
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard blocked: nothing else to do. */
    }
  };

  if (compact) {
    return (
      <div className={className ? `relative inline-block ${className}` : "relative inline-block"}>
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((o) => !o)}
          className="flex items-center gap-1.5 px-3 py-1.5 border rounded-sm text-[10px] tracking-[0.1em] uppercase transition-all duration-300 hover:scale-105 border-(--sk-accent-faint) text-(--sk-share-text)"
        >
          <Share2 aria-hidden="true" size={12} />
          {t("Share", "シェア")}
        </button>
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 p-3 border backdrop-blur-xl z-50 min-w-[180px] bg-(--sk-share-bg) border-(--sk-accent-faint) animate-in fade-in zoom-in-95 slide-in-from-top-1 duration-150">
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-2 py-2 text-[10px] tracking-wider transition-colors hover:opacity-80 text-(--sk-share-text)"
                onClick={() => setIsOpen(false)}
              >
                <link.icon aria-hidden="true" className="size-3.5 text-(--sk-accent)" />
                {link.name}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                void copyLink();
                setIsOpen(false);
              }}
              className="flex items-center gap-2 px-2 py-2 text-[10px] tracking-wider transition-colors hover:opacity-80 w-full text-(--sk-share-text)"
            >
              {copied ? (
                <Check aria-hidden="true" className="size-3.5 text-(--sk-accent)" />
              ) : (
                <Link2 aria-hidden="true" className="size-3.5 text-(--sk-accent)" />
              )}
              {copied ? t("Copied!", "コピー済み") : t("Copy Link", "リンクをコピー")}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={className ? `flex items-center gap-3 ${className}` : "flex items-center gap-3"}>
      <span className="text-[10px] tracking-[0.15em] uppercase text-(--sk-share-text)">{t("Share", "シェア")}</span>
      <div className="flex flex-wrap items-center gap-2">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${link.name}`}
            title={link.name}
            className="flex items-center justify-center p-2 border rounded-sm transition-all duration-300 hover:scale-110 border-(--sk-accent-faint) text-(--sk-share-text)"
          >
            <link.icon aria-hidden="true" className="size-3.5" />
          </a>
        ))}
        <button
          type="button"
          onClick={() => void copyLink()}
          aria-label={copied ? t("Copied!", "コピー済み") : t("Copy Link", "リンクをコピー")}
          title={copied ? "Copied!" : "Copy Link"}
          className="flex items-center justify-center p-2 border rounded-sm transition-all duration-300 hover:scale-110 border-(--sk-accent-faint) text-(--sk-share-text)"
        >
          {copied ? <Check aria-hidden="true" className="size-3.5 text-(--sk-accent)" /> : <Link2 aria-hidden="true" className="size-3.5" />}
        </button>
      </div>
    </div>
  );
}
