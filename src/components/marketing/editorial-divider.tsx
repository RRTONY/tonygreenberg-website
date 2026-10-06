// The short centered rule live tonygreenberg.com draws between the narrow
// editorial sections of its marketing pages (/invest, /amplifier, ...): a
// ~180px hairline fading in and out of the essay red. Decorative only.
export function EditorialDivider({ className = "my-12" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`mx-auto h-px w-44 bg-linear-to-r from-transparent via-essay-red/70 to-transparent ${className}`}
    />
  );
}
