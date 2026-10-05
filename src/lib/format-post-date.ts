// One date formatter for every post date on the site. Most migrated
// `publishedAt` values are 18:30 UTC, i.e. midnight IST on the real publish
// date (the migration ran in that zone), so formatting in UTC, or in the
// visitor's own zone, shows the day before. A fixed Asia/Kolkata zone gives
// the dates live shows and keeps server and client renders identical (the
// same essay used to show two different dates on different parts of the site).
const STYLES = {
  long: { month: "long", day: "numeric", year: "numeric" },
  short: { month: "short", day: "numeric", year: "numeric" },
  monthYear: { month: "long", year: "numeric" },
} satisfies Record<string, Intl.DateTimeFormatOptions>;

export function formatPostDate(iso: string | undefined, style: keyof typeof STYLES = "long") {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-US", { ...STYLES[style], timeZone: "Asia/Kolkata" });
}
