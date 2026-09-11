import fs from "node:fs";
import path from "node:path";

const referenceRoot = "/home/ubuntu/tonygreenberg-reference/client/src";
const activeRoot = path.join(process.cwd(), "src");
const outputPath = path.join(process.cwd(), "docs/reference-media-manifest.md");
const imagePattern =
  /(?:https?:\/\/[^\s"'`()<>]+|\/api\/img\/[^\s"'`()<>]+)\.(?:avif|gif|jpe?g|png|svg|webp)(?:\?[^\s"'`()<>]*)?/giu;

function listFiles(root) {
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(root, entry.name);
    return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
  });
}

function collectImageReferences(root) {
  return listFiles(root)
    .filter((filePath) => /\.(?:ts|tsx|js|jsx)$/u.test(filePath))
    .flatMap((filePath) => {
      const source = fs.readFileSync(filePath, "utf8");
      const references = [...source.matchAll(imagePattern)].map((match) => match[0]);
      return references.map((reference) => ({
        filePath: path.relative(root, filePath),
        reference,
      }));
    });
}

function normalizedBasename(reference) {
  const withoutQuery = reference.split("?")[0];
  return path.basename(withoutQuery).toLowerCase();
}

function markdownEscape(value) {
  return value.replaceAll("|", "\\|");
}

const activeSource = listFiles(activeRoot)
  .filter((filePath) => /\.(?:ts|tsx|js|jsx)$/u.test(filePath))
  .map((filePath) => fs.readFileSync(filePath, "utf8"))
  .join("\n");

const referenceEntries = collectImageReferences(referenceRoot);
const distinctEntries = [
  ...new Map(referenceEntries.map((entry) => [entry.reference, entry])).values(),
].sort((a, b) => a.reference.localeCompare(b.reference));

const rows = distinctEntries.map((entry) => {
  const basename = normalizedBasename(entry.reference);
  const presentByExactReference = activeSource.includes(entry.reference);
  const presentByBasename = basename.length > 0 && activeSource.toLowerCase().includes(basename);
  const status = presentByExactReference
    ? "Exact active-source match"
    : presentByBasename
      ? "Active-source basename match"
      : "Reference-only; route decision required";

  return `| \`${markdownEscape(entry.filePath)}\` | \`${markdownEscape(entry.reference)}\` | ${status} |`;
});

const manifest = [
  "# Reference Media Manifest",
  "",
  "Generated from the supplied `RRTONY/tonygreenberg` legacy source. This is an evidence inventory, not a directive to copy legacy code or reproduce restricted, payment, authenticated, supplier, or AI flows.",
  "",
  `- **Distinct reference image declarations:** ${distinctEntries.length}`,
  `- **Reference image occurrences:** ${referenceEntries.length}`,
  "- **Comparison rule:** Exact and basename matches are mechanical leads only. Route-purpose, licence, and public-safety review remain required before reuse.",
  "",
  "| Reference source file | Image declaration | Initial active-source comparison |",
  "| --- | --- | --- |",
  ...rows,
  "",
  "## Decision Rules",
  "",
  "- Preserve verified public visuals through `next/image` and managed storage or explicitly allowed live sources.",
  "- Do not port images solely because they appear in legacy source. Restricted reports, payment, supplier, authenticated, and AI surfaces require separate approved implementations.",
  "- Treat any image with unclear source, licence, or public purpose as unresolved rather than generating a substitute automatically.",
].join("\n");

fs.writeFileSync(outputPath, `${manifest}\n`);
console.log(
  `Wrote ${distinctEntries.length} distinct reference image declarations to ${outputPath}`,
);
