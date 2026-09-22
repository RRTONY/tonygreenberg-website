// This page is a target representation for ImpactSoul, not an operating dashboard.
// All labels intentionally distinguish proposed models from verified operating
// results. Keep quantitative performance, partner, or allocation claims out of
// this module until independently sourced and approved for publication.

export const DASHBOARD_STATUS = {
  label: "Target representation · 30-day refinement",
  reviewHorizonDays: 30,
  summary:
    "A working pro-forma for the ImpactSoul business model, shared for critique and refinement rather than presented as operating performance.",
  disclosure:
    "Nothing on this page represents current capital deployed, token ownership, charitable allocations, investment performance, confirmed partners, or measured outcomes.",
} as const;

export const TARGET_SIGNALS = [
  {
    label: "Refinement window",
    value: "30 days",
    detail:
      "A defined period to test the model, collect critique, and publish a cleaner next version.",
  },
  {
    label: "Model focus",
    value: "Regenerative capital",
    detail:
      "Durable funding and stewardship are the operating priority; digital rails are optional tools.",
  },
  {
    label: "Review standard",
    value: "Evidence first",
    detail:
      "Public claims, partners, outcomes, and financial figures stay unpublished until they can be substantiated.",
  },
] as const;

export interface ModelLayer {
  name: string;
  description: string;
  decision: string;
  iconKey: string;
}

export const MODEL_LAYERS: ModelLayer[] = [
  {
    name: "Cultural experiences",
    description:
      "Create participatory spaces and programs that make regenerative finance tangible rather than abstract.",
    decision:
      "Prototype the visitor, partner, and community experience before scaling the platform.",
    iconKey: "sparkles",
  },
  {
    name: "Regenerative capital",
    description:
      "Direct capital toward work designed to renew ecosystems, communities, and long-term capacity.",
    decision:
      "Prioritize grants, philanthropy, earned revenue, and mission-aligned capital structures.",
    iconKey: "sprout",
  },
  {
    name: "Shared accountability",
    description:
      "Define evidence, consent, stewardship, and community voice before turning them into a public score.",
    decision: "Publish only criteria and sources that can be reviewed, challenged, and improved.",
    iconKey: "shield-check",
  },
  {
    name: "Optional digital rails",
    description:
      "Consider digital ownership, recordkeeping, or participation tools only where they create real utility.",
    decision: "A token is not the business model and should never substitute for impact or trust.",
    iconKey: "network",
  },
];

export const REX_LIGHT_CENTER = {
  name: "REX Light Center",
  status: "Proposed cultural and business concept",
  summary:
    "A proposed center for light, perception, paleontology, and public learning: a place to encounter deep time and ask how cultural assets can support a regenerative future.",
  businessRole:
    "The concept is intended to test a sustainable operating mix of public programming, cultural partnerships, mission-aligned sponsorship, and earned revenue—before any asset, capital, or ownership structure is announced.",
  artReference:
    "The spatial direction is informed by public study of James Turrell’s light-and-perception practice. This is not a James Turrell project, commission, installation, collaboration, or endorsement.",
  sourceUrl: "https://turrell.utexas.edu/",
  sourceLabel: "Learn about James Turrell’s practice",
} as const;

export interface CapitalPathway {
  name: string;
  role: string;
  guardrail: string;
  iconKey: string;
}

export const CAPITAL_PATHWAYS: CapitalPathway[] = [
  {
    name: "Philanthropy and grants",
    role: "Fund public-benefit work where financial return is neither expected nor required.",
    guardrail: "Name the recipient, purpose, restrictions, and evidence once commitments are real.",
    iconKey: "heart-handshake",
  },
  {
    name: "Mission-aligned partnerships",
    role: "Build revenue through institutions and collaborators that share the operating principles.",
    guardrail: "Publish partnership claims only after both parties approve the description.",
    iconKey: "handshake",
  },
  {
    name: "Earned cultural revenue",
    role: "Test programming, education, and convenings that can sustain the center and its work.",
    guardrail:
      "Separate ticketing or service revenue from charitable promises and donor messaging.",
    iconKey: "ticket",
  },
  {
    name: "Long-term stewardship capital",
    role: "Explore patient capital structures that protect the mission over short-term extraction.",
    guardrail: "Subject every financial structure to legal, tax, governance, and impact review.",
    iconKey: "landmark",
  },
  {
    name: "Digital participation, if useful",
    role: "Evaluate digital tools as a limited participation or recordkeeping layer, not the center of the model.",
    guardrail:
      "No token, security, return, ownership, or liquidity claim is implied by this prototype.",
    iconKey: "network",
  },
];

export interface MeasurementLens {
  name: string;
  question: string;
  evidence: string;
  iconKey: string;
}

export const MEASUREMENT_LENSES: MeasurementLens[] = [
  {
    name: "Ecological renewal",
    question: "What is restored, protected, or made more resilient?",
    evidence: "Methods, baselines, and independent evidence to be defined with domain partners.",
    iconKey: "leaf",
  },
  {
    name: "Community benefit",
    question: "Who benefits, who decides, and who can challenge the work?",
    evidence:
      "Consentful community feedback and governance design to be established before launch.",
    iconKey: "users",
  },
  {
    name: "Cultural stewardship",
    question: "Does the work protect context, provenance, and living cultural value?",
    evidence: "Artist, community, and institutional review pathways to be designed.",
    iconKey: "landmark",
  },
  {
    name: "Financial resilience",
    question: "Can the model fund its commitments without extracting from people or place?",
    evidence:
      "A transparent pro-forma and operating assumptions to be reviewed during the 30-day window.",
    iconKey: "line-chart",
  },
];

export const THIRTY_DAY_PLAN = [
  {
    period: "Days 1–7",
    title: "Claim and assumption audit",
    detail:
      "Remove unsupported performance language and make every target, dependency, and unknown explicit.",
  },
  {
    period: "Days 8–14",
    title: "Light Center brief",
    detail:
      "Develop the proposed REX Light Center narrative, operating concept, safeguards, and partner criteria.",
  },
  {
    period: "Days 15–21",
    title: "Capital-flow prototype",
    detail:
      "Test the relationships between earned revenue, grants, philanthropy, and long-term stewardship capital.",
  },
  {
    period: "Days 22–30",
    title: "Contributor review and share-out",
    detail:
      "Invite critique, record revisions, and share a cleaner model with its assumptions and boundaries visible.",
  },
] as const;

export const SAFEGUARD_MESSAGES = [
  "This is not an offer, solicitation, investment product, token sale, or promise of financial return.",
  "Any future financial, charitable, ownership, or digital-asset program requires separate legal, tax, governance, and security review.",
  "The REX Light Center is a proposed concept; no physical site, artist relationship, cultural partnership, or funding commitment is represented as confirmed.",
] as const;
