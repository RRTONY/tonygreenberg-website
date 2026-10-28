// /the-stack ("The Stack"), ported from live tonygreenberg.com/the-stack on
// 2026-10-13 (owner: "both page we need to live"). Live marks it a "Private
// review draft": noindex, not in its sitemap, but listed in /the-index. Copy,
// suppliers, referral links and order are live's, unchanged. The hero and the
// five QR codes were on Manus storage and are now Sanity assets.

const CDN = "https://cdn.sanity.io/images/a3q1cyqs/production";

export const STACK_HERO = {
  src: `${CDN}/913c7e314d001aa27dfe916745bfebc4f5e1ca60-1200x670.webp`,
  width: 1200,
  height: 670,
  alt: "A balanced translucent stack representing a connected personal health system",
};

export type StackSupplier = {
  kicker: string;
  name: string;
  description: string;
  why: string;
  important?: string;
  /** Extra small print under the card (referral terms, codes). */
  note?: string;
  href: string;
  /** Referral link: marked rel="sponsored". */
  referral?: boolean;
  qr?: { src: string; width: number; height: number };
};

export type StackCategory = {
  id: string;
  title: string;
  intro: string;
  suppliers: StackSupplier[];
};

export const STACK_CATEGORIES: StackCategory[] = [
  {
    id: "bloodwork",
    title: "Bloodwork",
    intro: "A current view of measurable markers and the trend behind them.",
    suppliers: [
      {
        kicker: "65-biomarker annual panel",
        name: "Mito Health · HumanOS",
        description:
          "A broad bloodwork starting point with a clinician conversation and a plan for following the trend over time.",
        why: "It gives mood, energy, and metabolic questions a shared baseline instead of a drawer full of disconnected results.",
        important: "A blood panel is not a psychiatric evaluation and does not diagnose a mental-health condition.",
        note: "Referral destination. Confirm current availability, price, and terms directly with Mito Health.",
        href: "https://members.mitohealth.com/get-started?invite=alphatonyg",
        referral: true,
        qr: { src: `${CDN}/9b084a2e8bb8960fe67f52d784cb46d9f11c7fcc-720x720.webp`, width: 720, height: 720 },
      },
      {
        kicker: "Broad annual testing membership",
        name: "Function Health",
        description:
          "A broad recurring panel and a comparatively accessible results experience for people who want one place to follow a changing picture.",
        why: "It is a practical annual baseline when the goal is to compare like with like rather than collect isolated PDFs.",
        note: "Referral destination. Confirm the current membership price and code terms directly with Function Health.",
        href: "https://my.functionhealth.com/signup?code=AGREENBERG10",
        referral: true,
        qr: { src: `${CDN}/03cadcb526b86b487ba2fca38444cae753fb73df-720x720.webp`, width: 720, height: 720 },
      },
    ],
  },
  {
    id: "dna",
    title: "DNA",
    intro: "Context that can help turn a result into better questions.",
    suppliers: [
      {
        kicker: "30x whole-genome sequencing",
        name: "Sequencing.com · Tony Greenberg / RampRate",
        description:
          "A whole-genome option that reads broadly across the genome rather than a small selected chip panel. The current invitation lists 30x sequencing, broad health interpretation, and a raw data file that can be revisited as interpretation improves.",
        why: "It can add genetic context that helps a qualified clinician ask better questions about the same blood result, medication, or nutrient marker.",
        important: "Genetic results are not diagnoses and should not be used alone to start, stop, or change treatment.",
        note: "The RampRate landing page lists standard sequencing at $269 and expedited sequencing at $299. Large orders require a minimum of five kits. Confirm current pricing and bundle terms at checkout. I am glad to see a whole genome option become more reachable, but this is not a sales pitch. If you find equivalent value for less, or more value for the same money, send it to me. I will take that evidence back to Sequencing.com and ask them to meet it. Shipping, turnaround, and Privacy Forever settings are set by Sequencing.com at checkout.",
        href: "https://get.sequencing.com/ramprate-wgs-bundle/",
        referral: true,
        qr: { src: "/qr/sequencing-ramprate.svg", width: 370, height: 370 },
      },
      {
        kicker: "Free DNA-file upload",
        name: "Sequencing.com · Raw data upload",
        description:
          "A path to inspect a 23andMe or Ancestry file you already own before deciding whether you need a new test.",
        why: "It starts with the asset you already paid for and makes the limits of that file clear before you spend more.",
        href: "https://sequencing.com/data/upload",
        qr: { src: `${CDN}/2f27c8375e647f00070c644a50547aad8e05c116-720x720.webp`, width: 720, height: 720 },
      },
      {
        kicker: "DNA interpretation platform",
        name: "SelfDecode",
        description: "A consumer-facing interpretation layer for genetic data and health reports.",
        why: "It is useful when the raw file needs an organized question list for a clinician conversation rather than another unexplained report.",
        important: "Use consumer genetic interpretation as context, not as diagnosis or treatment direction.",
        href: "https://selfdecode.com/",
        qr: { src: `${CDN}/3bb6cec480bcfbbf5c31d46af25fafd207f0d6f7-720x720.webp`, width: 720, height: 720 },
      },
    ],
  },
  {
    id: "body-composition",
    title: "Body composition",
    intro: "What the scale misses: lean mass, fat distribution, and bone density.",
    suppliers: [
      {
        kicker: "DEXA body-composition scan",
        name: "BodySpec",
        description: "A direct-measurement option for body composition and bone-density context beyond body weight alone.",
        why: "The scale cannot distinguish lean mass, fat distribution, and bone density. Those distinctions can change the next question.",
        href: "https://www.bodyspec.com/",
      },
      {
        kicker: "DEXA and performance testing",
        name: "DexaFit",
        description: "A location-based testing option that can pair body composition with performance context.",
        why: "It offers a practical alternative when location, timing, or the type of assessment makes it a better fit than another scan provider.",
        href: "https://www.dexafit.com/",
      },
    ],
  },
  {
    id: "hormones",
    title: "Hormones",
    intro: "A deeper look when timing and metabolites matter to the question.",
    suppliers: [
      {
        kicker: "Urine hormone and cortisol-metabolite testing",
        name: "DUTCH Complete",
        description:
          "A more detailed hormone and cortisol-metabolite conversation when one blood draw does not answer the timing or pattern question.",
        why: "It can add timing and metabolite context to a qualified clinician discussion when a single blood result feels too flat to explain the pattern.",
        important:
          "Read the methodology and discuss the result with a clinician who can place it in the context of symptoms, medications, and standard care.",
        href: "https://dutchtest.com/product/dutch-complete/",
      },
    ],
  },
  {
    id: "fatty-acids",
    title: "Fatty acids",
    intro: "Nutrition biomarkers with a repeatable personal trend.",
    suppliers: [
      {
        kicker: "Nutrition biomarkers with cognitive-performance tracking",
        name: "BrainSpan · preferred fatty-acid option",
        description: "Nutrition biomarkers and cognitive performance metrics in one baseline and 90-day retest plan.",
        why: "It earns the preferred spot in this stack because it connects fatty-acid nutrition biomarkers to cognitive performance and a repeatable personal trend rather than a single isolated index.",
        important:
          "OmegaQuant offers a more fatty-acid-focused reading. BrainSpan is preferred here for its combined nutrition, cognition, and retest structure, not as a universal medical recommendation.",
        href: "https://brainspan.com/order#testing-plans",
      },
    ],
  },
  {
    id: "interventions",
    title: "Interventions",
    intro: "Interpretation and support pathways that belong after the data.",
    suppliers: [
      {
        kicker: "Clinician-guided custom formulation pathway",
        name: "Enov.one",
        description:
          "A clinician-guided route for people who want a custom formulation discussion informed by their own information rather than a generic shelf product.",
        why: "It belongs after the evidence because any intervention should begin with the actual problem, the actual history, and clinical oversight.",
        important:
          "Availability and appropriateness require clinical review. This is not a recommendation to begin a treatment or supplement protocol.",
        href: "mailto:support@enov.one",
      },
      {
        kicker: "Research-use peptide supplier",
        name: "Genesis Peptides",
        description: "A direct supplier destination for research-use peptide materials.",
        why: "It is listed for people who want to assess a supplier’s documentation and quality-control claims directly rather than rely on a reseller’s summary.",
        important:
          "Research use only. Review certificates of analysis, applicable law, and qualified clinical guidance. This is not a treatment recommendation.",
        href: "https://genesispeptides.com/peptides",
      },
      {
        kicker: "Europe-only preventive screening",
        name: "Neko Health",
        description:
          "A Europe-only preventive screening option that combines broad measurements with clinician review in its available markets.",
        why: "It is a useful example of a more integrated screening experience where it is available, with the relationship around the result treated as part of the service.",
        important: "Availability is limited by market. Screening does not replace diagnosis or ongoing clinical care.",
        href: "https://www.nekohealth.com/",
      },
    ],
  },
];
