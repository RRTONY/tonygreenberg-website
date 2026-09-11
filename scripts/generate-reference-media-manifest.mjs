import fs from "node:fs";
import path from "node:path";
import prettier from "prettier";

const referenceRoot = "/home/ubuntu/tonygreenberg-reference/client/src";
const activeRoot = path.join(process.cwd(), "src");
const outputPath = path.join(process.cwd(), "docs/reference-media-manifest.md");
const imagePattern =
  /(?:https?:\/\/[^\s"'`()<>]+|\/api\/img\/[^\s"'`()<>]+)\.(?:avif|gif|jpe?g|png|svg|webp)(?:\?[^\s"'`()<>]*)?/giu;

const sourceDispositions = {
  "pages/AkbarEssay.tsx": ["/akbar", "Active equivalent", "Public essay route is already present."],
  "pages/Assessments.tsx": [
    "/assessments",
    "Active equivalent",
    "Current public hub preserves the safe assessment entry points; legacy contact capture is not reused.",
  ],
  "pages/Blog.tsx": [
    "/blog",
    "Active equivalent",
    "Current managed editorial archive replaces legacy blog search integrations.",
  ],
  "pages/BlogPost.tsx": [
    "/blog/[slug]",
    "Active equivalent",
    "Current editorial pages omit legacy paywall, authentication, and AI add-ons.",
  ],
  "pages/CheshireGrin.tsx": [
    "/cheshire-grin",
    "Obsolete or restricted legacy",
    "Legacy report surface remains protected by a redirect.",
  ],
  "pages/ComponentShowcase.tsx": [
    "N/A",
    "Obsolete or restricted legacy",
    "Internal legacy component showcase is not a public parity target.",
  ],
  "pages/ConsciousnessScale.tsx": [
    "/consciousness-scale",
    "Active equivalent",
    "Current public assessment is already implemented.",
  ],
  "pages/FindMyHub.tsx": [
    "/find-my",
    "Active equivalent",
    "Current directory is implemented with active safe destinations.",
  ],
  "pages/FindYourCoffee.tsx": [
    "/find-your-coffee",
    "Active equivalent",
    "Current route excludes the legacy mandatory email gate.",
  ],
  "pages/FindYourMe.tsx": [
    "/find-your-me",
    "Active equivalent",
    "Current cookie-backed assessment is implemented.",
  ],
  "pages/FindYourPeptide.tsx": [
    "/find-your-peptide",
    "Active equivalent",
    "Current route does not reproduce legacy sensitive recommendation capture.",
  ],
  "pages/Home.tsx": [
    "/ and /the-letter",
    "Active equivalent",
    "Current root and Letter routes preserve the approved public identity and editorial visuals.",
  ],
  "pages/ImpactDashboard.tsx": [
    "/impact-dashboard",
    "Active equivalent",
    "Current public dashboard omits unverified investment and waitlist behavior.",
  ],
  "pages/ImpactFuturism.tsx": [
    "/impact-futurism",
    "Active equivalent",
    "Current editorial archive is present.",
  ],
  "pages/Manifesto.tsx": [
    "/living-declaration",
    "Active equivalent",
    "Current route retains safe public manifesto content.",
  ],
  "pages/Nightstand.tsx": [
    "/the-nightstand",
    "Active equivalent",
    "Current editorial route and verified hero are present.",
  ],
  "pages/PeptideHallOfShame.tsx": [
    "/peptide-hall-of-shame",
    "Active equivalent",
    "Current public context removes unsupported ratings and review language.",
  ],
  "pages/PeptideMatrix.tsx": [
    "/peptide-matrix",
    "Active equivalent",
    "Current public matrix removes unsupported review and rating presentation.",
  ],
  "pages/PeptideQuiz25.tsx": [
    "/quiz_25q",
    "Active equivalent",
    "Current public quiz excludes legacy email and supplier capture.",
  ],
  "pages/PeptideSupplyChain.tsx": [
    "/peptide-supply-chain",
    "Active equivalent",
    "Current route does not port supplier intake behavior.",
  ],
  "pages/PeptideWatch.tsx": [
    "/peptide-watch",
    "Active equivalent",
    "Current route excludes legacy reporting and restricted scorecard behavior.",
  ],
  "pages/ProtectingYourBusiness.tsx": [
    "/protecting-your-business",
    "Active equivalent",
    "Current public narrative excludes the legacy story-submission form.",
  ],
  "pages/TheBody.tsx": [
    "/the-body",
    "Active equivalent",
    "Current editorial route omits unsupported health protocol and intake behavior.",
  ],
  "pages/TheWeb.tsx": [
    "/the-web",
    "Active equivalent",
    "Current public ecosystem route and verified hero are present.",
  ],
  "pages/WalkThrough.tsx": [
    "/walk-through",
    "Active equivalent",
    "Current public walkthrough and verified portrait are present.",
  ],
  "pages/brewsoul/GuestShanitaNicholas.tsx": [
    "/brewsoul/guest/shanita-nicholas",
    "Active equivalent",
    "Current public guest route is present.",
  ],
  "pages/humanos/HumanosEcosystem.tsx": [
    "/humanos/ecosystem",
    "Active equivalent",
    "Current public ecosystem route is present.",
  ],
  "pages/humanos/HumanosHome.tsx": [
    "/humanos",
    "Active equivalent",
    "Current Human OS landing route omits restricted assessment capture.",
  ],
  "pages/humanos/HumanosLayout.tsx": [
    "/humanos",
    "Active equivalent",
    "Current Human OS shell is implemented natively.",
  ],
  "pages/humanos/HumanosPhilosophy.tsx": [
    "/humanos/philosophy",
    "Active equivalent",
    "Current public philosophy route is present.",
  ],
  "pages/manifesto/AttentionEconomics.tsx": [
    "/attention-theft",
    "Active equivalent",
    "Related public manifesto content is represented by the active route.",
  ],
  "pages/manifesto/AttentionTheft.tsx": [
    "/attention-theft",
    "Active equivalent",
    "Current public manifesto route is present.",
  ],
  "pages/manifesto/BlockerFinder.tsx": [
    "N/A",
    "Deferred constrained behavior",
    "Legacy flow combines AI output with personal-data collection.",
  ],
  "pages/manifesto/LegalDatabase.tsx": [
    "N/A",
    "Deferred constrained behavior",
    "Legal and enforcement claims require current primary-source validation before a public port.",
  ],
  "pages/manifesto/ReportSpammer.tsx": [
    "N/A",
    "Deferred constrained behavior",
    "Legacy reporting flow collects reporter and target data.",
  ],
  "pages/manifesto/TenWeapons.tsx": [
    "/attention-theft",
    "Active equivalent",
    "Current manifesto route contains the approved public material.",
  ],
  "pages/manifesto/YouveBeenReported.tsx": [
    "N/A",
    "Obsolete or restricted legacy",
    "Legacy notification and reporting surface is intentionally excluded.",
  ],
  "pages/pri/FacilitatorIndex.tsx": [
    "/facilitator-index",
    "Active equivalent",
    "Current route retains safe public content and verified diagrams, not legacy contact capture.",
  ],
  "pages/pri/MescalineDeepDive.tsx": [
    "/peyote-mescaline",
    "Active equivalent",
    "Current educational route retains safety framing without personalized treatment advice.",
  ],
  "pages/pri/PsychedelicReadinessIndex.tsx": [
    "/psychedelic-readiness-index",
    "Active equivalent",
    "Current cookie-backed experience omits legacy testimonial and sensitive capture behavior.",
  ],
  "pages/pri/iboga-module.ts": [
    "/iboga-ibogaine",
    "Active equivalent",
    "Current educational deep-dive route is present.",
  ],
  "pages/pri/medicine-images.ts": [
    "/psychedelic-readiness-index",
    "Active equivalent",
    "Current shared medicine imagery is handled by the active Lucide and media components.",
  ],
};

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
  const disposition = sourceDispositions[entry.filePath] ?? [
    "N/A",
    "Unclassified",
    "Requires parity review.",
  ];
  const status = presentByExactReference
    ? "Exact active-source match"
    : presentByBasename
      ? "Active-source basename match"
      : "Reference-only; route decision required";

  return `| \`${markdownEscape(entry.filePath)}\` | \`${markdownEscape(entry.reference)}\` | ${status} | ${disposition[1]} |`;
});

const dispositionRows = Object.entries(sourceDispositions)
  .sort(([left], [right]) => left.localeCompare(right))
  .map(
    ([sourceGroup, [targetRoute, decision, rationale]]) =>
      `| \`${markdownEscape(sourceGroup)}\` | ${targetRoute} | ${decision} | ${rationale} |`,
  );

const manifest = [
  "# Reference Media Manifest",
  "",
  "Generated from the supplied `RRTONY/tonygreenberg` legacy source. This is an evidence inventory, not a directive to copy legacy code or reproduce restricted, payment, authenticated, supplier, or AI flows.",
  "",
  `- **Distinct reference image declarations:** ${distinctEntries.length}`,
  `- **Reference image occurrences:** ${referenceEntries.length}`,
  "- **Comparison rule:** Exact and basename matches are mechanical leads only. Route-purpose, licence, and public-safety review remain required before reuse.",
  "",
  "## Source Group Dispositions",
  "",
  "| Reference source group | Current route or scope | Disposition | Rationale |",
  "| --- | --- | --- | --- |",
  ...dispositionRows,
  "",
  "## Image Declaration Inventory",
  "",
  "Each image row inherits the explicit source-group decision above. A reference-only declaration is not an implementation mandate.",
  "",
  "| Reference source file | Image declaration | Initial active-source comparison | Source-group disposition |",
  "| --- | --- | --- | --- |",
  ...rows,
  "",
  "## Decision Rules",
  "",
  "- Preserve verified public visuals through `next/image` and managed storage or explicitly allowed live sources.",
  "- Do not port images solely because they appear in legacy source. Restricted reports, payment, supplier, authenticated, and AI surfaces require separate approved implementations.",
  "- Treat any image with unclear source, licence, or public purpose as unresolved rather than generating a substitute automatically.",
].join("\n");

const prettierConfig = (await prettier.resolveConfig(outputPath)) ?? {};
const formattedManifest = await prettier.format(`${manifest}\n`, {
  ...prettierConfig,
  filepath: outputPath,
  parser: "markdown",
});

fs.writeFileSync(outputPath, formattedManifest);
console.log(
  `Wrote ${distinctEntries.length} distinct reference image declarations to ${outputPath}`,
);
