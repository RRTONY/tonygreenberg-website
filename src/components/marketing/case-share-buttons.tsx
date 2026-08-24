"use client";

// Plain share-intent links (X/Facebook/LinkedIn/email) plus a clipboard
// copy — no backend, no tracking beyond what each platform's own share
// intent URL already does.
export function CaseShareButtons({
  filled = false,
  path,
  shareText,
}: {
  filled?: boolean;
  path: string;
  shareText: string;
}) {
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}${path}`
      : `https://tonygreenberg.com${path}`;

  const links = [
    { label: "X / Twitter", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { label: "Email", href: `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(`${shareText}\n\n${url}`)}` },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target={l.label === "Email" ? undefined : "_blank"}
          rel="noopener noreferrer"
          className={
            filled
              ? "rounded-md bg-red-800 px-4 py-2 font-mono text-xs font-semibold tracking-wide text-white"
              : "rounded-md border border-red-800/30 px-4 py-2 font-mono text-xs font-semibold tracking-wide text-red-800"
          }
        >
          {l.label}
        </a>
      ))}
      <button
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(url);
        }}
        className={
          filled
            ? "rounded-md bg-red-800 px-4 py-2 font-mono text-xs font-semibold tracking-wide text-white"
            : "rounded-md border border-red-800/30 px-4 py-2 font-mono text-xs font-semibold tracking-wide text-red-800"
        }
      >
        Copy Link
      </button>
    </div>
  );
}
