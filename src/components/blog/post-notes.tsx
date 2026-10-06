// Notes live shows under the byline, before the essay: a dated editor's note
// (Sanity `editorsNote`) and, on first-hand accounts and accusations, the
// standard "Provenance and corrections" note (Sanity `provenanceNote` switch;
// the wording is the same on every post, so it lives here).
export function PostNotes({
  editorsNote,
  provenanceNote,
}: {
  editorsNote?: { label?: string; text?: string; provenance?: string };
  provenanceNote?: boolean;
}) {
  if (!editorsNote?.text && !provenanceNote) return null;
  return (
    <div className="mb-5 max-w-195 space-y-4">
      {editorsNote?.text && (
        <aside className="border-l-[3px] border-essay-red/60 bg-essay-red/4 px-5 py-4">
          <p className="mb-2 font-mono text-xs tracking-[0.14em] text-essay-red uppercase">{editorsNote.label || "Editor's note"}</p>
          <p className="font-essay text-[0.95rem] leading-relaxed text-essay-ink">{editorsNote.text}</p>
          {editorsNote.provenance && (
            <p className="mt-2 font-mono text-[0.7rem] text-muted-foreground">Provenance: {editorsNote.provenance}</p>
          )}
        </aside>
      )}
      {provenanceNote && (
        <aside className="border border-border bg-muted/40 px-5 py-4">
          <p className="mb-2 font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">Provenance and corrections</p>
          <p className="text-sm leading-relaxed text-foreground/80">
            This is an opinionated account that separates Tony&rsquo;s direct experience from linked reporting or documentation
            where available. If a factual detail is wrong, incomplete, or inconsistent with the record, send the source to{" "}
            <a href="mailto:tony@impactsoul.is" className="text-brand-gold underline underline-offset-2">
              tony@impactsoul.is
            </a>
            . Verified corrections are added without changing the stated opinion.
          </p>
        </aside>
      )}
    </div>
  );
}
