// Ported from legacy _legacy-manus-app/client/src/data/mirrorData.json —
// the real content behind "The Mirror" life assessment, served at both
// /the-mirror (canonical — see NEEDS in the port report) and /life-assessment
// (redirects to /the-mirror). 6 dimensions, 18 questions (3 per dimension),
// and 85 real blog-post-slug → dimension "mirror" mappings used to
// recommend articles based on a respondent's weakest dimensions. All ported
// verbatim, unchanged.
//
// Cross-checked against src/lib/content/find-your-me.ts's own real hook for
// this exact assessment ("6 dimensions. 18 questions. A radar chart that
// doesn't care about your feelings.") — dimension count, question count,
// and all 6 dimension ids (relationships/purpose/body/truth/tribe/
// consciousness) match exactly. No discrepancy found.
//
// One real data bug found in the legacy source and deliberately NOT carried
// forward: mirrorData.json has a stray top-level key sibling to "mirrors" —
// "the-peptide-truth-65m-fraud-industry-vs-life-changing-medicine": { mirror,
// question } — using a different shape ({ mirror, question }) than every
// real entry inside "mirrors" ({ dimension, reflection, prompt }). It sits
// outside the "mirrors" object the legacy app actually reads
// (mirrorData.mirrors), so it was dead data even on the legacy site — an
// authoring mistake, not a real 86th mirror. Omitted rather than guessing a
// "dimension" value for it.
//
// Article recommendations are resolved defensively, matching legacy's own
// behavior exactly: the page looks up each mirror slug against real Sanity
// posts server-side and only recommends slugs that actually resolve to a
// live post (legacy did the same lookup against its local blogData.json and
// skipped slugs with no match) — so a renamed/retired post silently drops
// out of recommendations instead of 404ing.

export type MirrorDimensionId =
  | "relationships"
  | "purpose"
  | "body"
  | "truth"
  | "tribe"
  | "consciousness";

export interface MirrorDimension {
  id: MirrorDimensionId;
  name: string;
  icon: string;
  description: string;
  flowState: string;
  frictionState: string;
}

export interface MirrorQuestionOption {
  text: string;
  score: number;
}

export interface MirrorQuestion {
  dimension: MirrorDimensionId;
  number: number;
  stem: string;
  options: MirrorQuestionOption[];
}

// `dimension` is intentionally a plain `string`, not `MirrorDimensionId`: one
// real legacy entry ("find-my-ev-paul-scott-wont-let-you-buy-a-gas-car") has
// `dimension: "action"`, a value that doesn't match any of the 6 real
// dimension ids above — a second real legacy data bug, ported verbatim
// rather than silently corrected or dropped. Because no respondent's
// weakest-dimension set can ever contain "action", this one entry can never
// be recommended — permanently inert in both the legacy app and this port.
export interface MirrorArticle {
  dimension: string;
  reflection: string;
  prompt: string;
}

export const MIRROR_DIMENSIONS: MirrorDimension[] = [
  {
    id: "relationships",
    name: "Relationships & Connection",
    icon: "Heart",
    description: "How you love, how you attach, how you let go",
    flowState: "Magnetic presence — you attract what you are, not what you want",
    frictionState: "Guarded patterns — protecting yourself from the very connection you crave"
  },
  {
    id: "purpose",
    name: "Purpose & Career",
    icon: "Compass",
    description: "What you build, what you serve, what keeps you up at 3am",
    flowState: "Sacred work — your career is indistinguishable from your calling",
    frictionState: "Golden handcuffs — trading meaning for security, one quarter at a time"
  },
  {
    id: "body",
    name: "Health & Body",
    icon: "Flame",
    description: "The vessel that carries everything else",
    flowState: "Biochemical sovereignty — you own your biology, it doesn't own you",
    frictionState: "Disconnected — treating symptoms while ignoring the system"
  },
  {
    id: "truth",
    name: "Truth & Integrity",
    icon: "Eye",
    description: "The distance between who you are and who you pretend to be",
    flowState: "Radical alignment — your public self and private self are the same person",
    frictionState: "Performative living — curating an identity that doesn't match your interior"
  },
  {
    id: "tribe",
    name: "Community & Tribe",
    icon: "Users",
    description: "Who you surround yourself with shapes who you become",
    flowState: "Sacred circle — your tribe challenges you, holds you, and won't let you shrink",
    frictionState: "Isolation or echo chamber — alone, or surrounded by people who never push back"
  },
  {
    id: "consciousness",
    name: "Consciousness & Growth",
    icon: "Sparkles",
    description: "How deep you're willing to go",
    flowState: "Integrated awareness — you've done the work and it shows in how you move through the world",
    frictionState: "Spiritual bypassing — using growth language to avoid actual growth"
  }
];

export const MIRROR_QUESTIONS: MirrorQuestion[] = [
  {
    dimension: "relationships",
    number: 1,
    stem: "When I think about the people closest to me, the honest truth is...",
    options: [
      {
        text: "I've built walls so sophisticated I forgot they were walls",
        score: 2
      },
      {
        text: "I give more than I receive and I've made peace with that (or have I?)",
        score: 4
      },
      {
        text: "I'm learning to be vulnerable without calling it weakness",
        score: 6
      },
      {
        text: "I attract people who match my frequency — and I've done the work to raise it",
        score: 9
      }
    ]
  },
  {
    dimension: "relationships",
    number: 2,
    stem: "The conversation I most need to have but keep avoiding is about...",
    options: [
      {
        text: "What I actually need from the people I love",
        score: 3
      },
      {
        text: "Why I keep choosing the same patterns in different faces",
        score: 4
      },
      {
        text: "The gap between how I show up and how I want to show up",
        score: 6
      },
      {
        text: "I've had it — and it changed everything",
        score: 9
      }
    ]
  },
  {
    dimension: "relationships",
    number: 3,
    stem: "If someone who truly knew me described my relationship with intimacy, they'd say...",
    options: [
      {
        text: "I'm terrified of it but I'd never admit that out loud",
        score: 2
      },
      {
        text: "I confuse intensity with depth",
        score: 4
      },
      {
        text: "I'm getting better at staying when it gets uncomfortable",
        score: 7
      },
      {
        text: "I've learned that real intimacy is letting someone see you without your armor",
        score: 9
      }
    ]
  },
  {
    dimension: "purpose",
    number: 1,
    stem: "On Sunday night, thinking about Monday morning, I feel...",
    options: [
      {
        text: "Dread dressed up as discipline",
        score: 2
      },
      {
        text: "Fine — it pays the bills and I'm good at it",
        score: 4
      },
      {
        text: "Energized about the mission, frustrated by the machinery",
        score: 6
      },
      {
        text: "There's no Monday — my work and my life are the same river",
        score: 9
      }
    ]
  },
  {
    dimension: "purpose",
    number: 2,
    stem: "The thing I'd build if money and reputation were irrelevant is...",
    options: [
      {
        text: "I genuinely don't know anymore — I lost that thread years ago",
        score: 2
      },
      {
        text: "Something that helps people, but I can't articulate it yet",
        score: 4
      },
      {
        text: "I know exactly what it is and I'm slowly moving toward it",
        score: 7
      },
      {
        text: "I'm already building it",
        score: 9
      }
    ]
  },
  {
    dimension: "purpose",
    number: 3,
    stem: "When someone asks 'what do you do?' I...",
    options: [
      {
        text: "Give them the LinkedIn version and change the subject",
        score: 2
      },
      {
        text: "Struggle to explain it because it doesn't fit in a box",
        score: 5
      },
      {
        text: "Light up — because what I do is who I am",
        score: 8
      },
      {
        text: "Tell them I'm trying to measure how fast humans can become their best selves",
        score: 9
      }
    ]
  },
  {
    dimension: "body",
    number: 1,
    stem: "My relationship with my body is best described as...",
    options: [
      {
        text: "A landlord-tenant situation — I live here but I don't maintain the property",
        score: 2
      },
      {
        text: "I exercise and eat okay but I'm running on caffeine and cortisol",
        score: 4
      },
      {
        text: "I've started treating it like the instrument it is — tuning, not punishing",
        score: 7
      },
      {
        text: "I've optimized my biochemistry and I can feel the difference in every decision I make",
        score: 9
      }
    ]
  },
  {
    dimension: "body",
    number: 2,
    stem: "If I'm honest about what I put into my body...",
    options: [
      {
        text: "I don't think about it — convenience wins every time",
        score: 2
      },
      {
        text: "I know better than I do — the gap between knowledge and action is wide",
        score: 4
      },
      {
        text: "I've made real changes and I can feel the compound interest",
        score: 7
      },
      {
        text: "Every molecule that enters my body is a conscious choice",
        score: 9
      }
    ]
  },
  {
    dimension: "body",
    number: 3,
    stem: "The last time I felt truly alive in my body was...",
    options: [
      {
        text: "I can't remember — that's the problem",
        score: 2
      },
      {
        text: "During a vacation or a peak experience — but not in daily life",
        score: 4
      },
      {
        text: "Recently — I've been building practices that bring me back to my body",
        score: 7
      },
      {
        text: "This morning — presence is my default state now",
        score: 9
      }
    ]
  },
  {
    dimension: "truth",
    number: 1,
    stem: "The biggest lie I tell myself is...",
    options: [
      {
        text: "That I'm fine",
        score: 2
      },
      {
        text: "That I'll start tomorrow",
        score: 4
      },
      {
        text: "That I've already done enough inner work",
        score: 6
      },
      {
        text: "I've stopped lying to myself — that was the hardest and most liberating thing I've ever done",
        score: 9
      }
    ]
  },
  {
    dimension: "truth",
    number: 2,
    stem: "When I encounter information that contradicts my worldview, I...",
    options: [
      {
        text: "Dismiss it — I've already figured out what's true",
        score: 2
      },
      {
        text: "Feel uncomfortable but scroll past it",
        score: 4
      },
      {
        text: "Sit with the discomfort and investigate",
        score: 7
      },
      {
        text: "Get excited — friction is where growth lives",
        score: 9
      }
    ]
  },
  {
    dimension: "truth",
    number: 3,
    stem: "If everyone could see my browser history, my journal, and my 3am thoughts, they'd discover...",
    options: [
      {
        text: "Someone very different from my public persona",
        score: 2
      },
      {
        text: "Someone more anxious and searching than they'd expect",
        score: 4
      },
      {
        text: "Someone who's working hard to close the gap between inside and outside",
        score: 7
      },
      {
        text: "Exactly who they already see — I've integrated",
        score: 9
      }
    ]
  },
  {
    dimension: "tribe",
    number: 1,
    stem: "The people I spend the most time with...",
    options: [
      {
        text: "Are mostly inherited — family, coworkers, proximity",
        score: 3
      },
      {
        text: "Are good people but we don't go deep",
        score: 4
      },
      {
        text: "Challenge me and I challenge them — we're growing together",
        score: 7
      },
      {
        text: "Are my chosen family — we hold each other accountable to becoming who we said we'd become",
        score: 9
      }
    ]
  },
  {
    dimension: "tribe",
    number: 2,
    stem: "When I imagine my ideal community, it looks like...",
    options: [
      {
        text: "I honestly don't know — I've never had one",
        score: 2
      },
      {
        text: "A group of smart people who get what I'm trying to do",
        score: 4
      },
      {
        text: "A tribe that shares values, pushes boundaries, and builds things together",
        score: 7
      },
      {
        text: "What I'm already building — and I want to scale it",
        score: 9
      }
    ]
  },
  {
    dimension: "tribe",
    number: 3,
    stem: "The hardest relationship truth I've learned is...",
    options: [
      {
        text: "That most people don't actually want to go deep",
        score: 3
      },
      {
        text: "That I've been the common denominator in my relationship problems",
        score: 5
      },
      {
        text: "That vulnerability is the price of admission to real connection",
        score: 7
      },
      {
        text: "That you can love someone and still need to let them go — and that's not failure",
        score: 9
      }
    ]
  },
  {
    dimension: "consciousness",
    number: 1,
    stem: "My relationship with my own mind is...",
    options: [
      {
        text: "Adversarial — it runs me more than I run it",
        score: 2
      },
      {
        text: "I meditate sometimes but my monkey mind usually wins",
        score: 4
      },
      {
        text: "I've developed real practices and I can feel the difference",
        score: 7
      },
      {
        text: "My mind is an instrument I've learned to play — not perfectly, but with intention",
        score: 9
      }
    ]
  },
  {
    dimension: "consciousness",
    number: 2,
    stem: "The deepest experience I've ever had was...",
    options: [
      {
        text: "I'm not sure I've had one — or I've been too busy to notice",
        score: 2
      },
      {
        text: "A moment of awe that I can't quite explain but I've never forgotten",
        score: 5
      },
      {
        text: "A deliberate practice (meditation, psychedelics, breathwork) that cracked me open",
        score: 7
      },
      {
        text: "A sustained state of awareness that changed how I see everything",
        score: 9
      }
    ]
  },
  {
    dimension: "consciousness",
    number: 3,
    stem: "If I could download one insight directly into my nervous system, it would be...",
    options: [
      {
        text: "How to stop the noise and just be present",
        score: 3
      },
      {
        text: "How to trust the process when everything feels uncertain",
        score: 5
      },
      {
        text: "How to hold paradox — strength and surrender, ambition and acceptance",
        score: 7
      },
      {
        text: "I don't need to download it — I need to remember what I already know",
        score: 9
      }
    ]
  }
];

export const MIRROR_ARTICLES: Record<string, MirrorArticle> = {
  "the-butchers-daughter-the-carbon-toll-and-the-cheese-that-ate-the-planet": {
    dimension: "truth",
    reflection: "your willingness to follow uncomfortable data wherever it leads",
    prompt: "Do you change your behavior when the evidence demands it — or do you negotiate with the truth?"
  },
  "restaurants-beware-of-vegans-and-vegans-beware-of-lying-restaurants": {
    dimension: "truth",
    reflection: "how you handle being lied to by institutions you trusted",
    prompt: "When a system betrays your trust, do you adapt quietly or hold it accountable?"
  },
  "love-as-dharma-a-science-based-playbook-for-magnetic-partnership": {
    dimension: "relationships",
    reflection: "your capacity to merge science with surrender in love",
    prompt: "Can you be strategic about love without losing the sacred in it?"
  },
  "the-molecule-as-mirror-from-substance-to-service": {
    dimension: "consciousness",
    reflection: "your relationship with altered states and what they reveal",
    prompt: "Are you using expansion as escape — or as integration?"
  },
  "productivity-apps-that-rocked-my-world-in-2024-secrets-of-a-workflow-junkie": {
    dimension: "purpose",
    reflection: "whether your systems serve your mission or have become the mission",
    prompt: "Are you optimizing your life — or optimizing your avoidance of living it?"
  },
  "the-future-of-health-is-already-here-its-just-not-evenly-distributed": {
    dimension: "body",
    reflection: "your access to — and willingness to pursue — cutting-edge health",
    prompt: "Are you waiting for the system to save you, or building your own protocol?"
  },
  "how-to-alienate-a-loyal-vegan-of-decades-desperately-trying-to-buy-your-product": {
    dimension: "truth",
    reflection: "how you respond when brands betray their stated values",
    prompt: "Do you hold companies to the same standard you hold yourself?"
  },
  "the-longevity-paradox-why-the-people-who-live-longest-dont-try-to": {
    dimension: "body",
    reflection: "whether you're chasing longevity or living fully right now",
    prompt: "Are you so focused on living longer that you've forgotten to live deeper?"
  },
  "the-psychedelic-renaissance-is-here-but-whos-invited-to-the-ceremony": {
    dimension: "consciousness",
    reflection: "your relationship with gatekeeping in consciousness expansion",
    prompt: "Who gets to heal? And who decides?"
  },
  "forever-chemicals-in-your-blood-the-pfas-crisis-nobody-is-solving": {
    dimension: "body",
    reflection: "your tolerance for invisible threats to your biology",
    prompt: "What are you carrying in your blood that you didn't consent to?"
  },
  "the-attention-economy-is-a-pyramid-scheme-and-youre-the-product": {
    dimension: "consciousness",
    reflection: "who owns your attention — and whether you've taken it back",
    prompt: "If your attention is currency, who are you paying?"
  },
  "ai-wont-replace-you-a-person-using-ai-will": {
    dimension: "purpose",
    reflection: "your relationship with tools that are smarter than your habits",
    prompt: "Are you using AI to amplify your genius or to automate your mediocrity?"
  },
  "the-trust-recession-why-nobody-believes-anything-anymore": {
    dimension: "truth",
    reflection: "how you navigate a world where trust has become a luxury",
    prompt: "In a world of manufactured consensus, what do you actually believe?"
  },
  "impact-investing-is-dead-long-live-impact-investing": {
    dimension: "purpose",
    reflection: "whether your money reflects your values or contradicts them",
    prompt: "Does your portfolio look like your principles?"
  },
  "the-tokenization-of-everything-from-dinosaur-bones-to-ocean-cleanup": {
    dimension: "tribe",
    reflection: "your willingness to reimagine ownership as collective stewardship",
    prompt: "What would you co-own with strangers if it meant saving something sacred?"
  },
  "gratitude-in-action-a-best-follow-up-to-a-decade-of-change": {
    dimension: "relationships",
    reflection: "whether your gratitude is performative or practiced",
    prompt: "Do you say thank you — or do you live it?"
  },
  "energy-as-impact": {
    dimension: "purpose",
    reflection: "your understanding of infrastructure as a moral choice",
    prompt: "Every watt is a vote. What are you voting for?"
  },
  "the-decay-of-professional-phone-calls-circa-2022-or-whatever-happened-to-the-art-of-conversation": {
    dimension: "relationships",
    reflection: "how you communicate when it actually matters",
    prompt: "When was the last time you had a real conversation — not a transaction?"
  },
  "from-supply-chain-to-the-blockchain-heal-the-body-mind-soul": {
    dimension: "consciousness",
    reflection: "your ability to see systems as living organisms",
    prompt: "Can you trace the thread from a supply chain to a soul?"
  },
  "davos-2022-world-economic-forum-here-we-come": {
    dimension: "tribe",
    reflection: "your relationship with power and the rooms where decisions get made",
    prompt: "Are you in the room — or building a better room?"
  },
  "forward-health-is-a-sideway-step-at-best": {
    dimension: "body",
    reflection: "your ability to distinguish innovation from marketing",
    prompt: "Is your healthcare provider healing you or billing you?"
  },
  "psychedelics-could-become-extractive-capitalism-unless-we-hold-the-line": {
    dimension: "consciousness",
    reflection: "your vigilance against co-option of sacred things",
    prompt: "Can capitalism hold a ceremony without turning it into a product?"
  },
  "founders-institute-tony-on-outsourcing-101": {
    dimension: "purpose",
    reflection: "your willingness to delegate without losing your soul",
    prompt: "What can you let go of — and what must you hold?"
  },
  "covid-deniers-need-to-take-a-breath": {
    dimension: "truth",
    reflection: "how you handle collective delusion when it's personal",
    prompt: "When the crowd is wrong, do you have the courage to say so?"
  },
  "hiding-fees-tips-in-the-transparent-age-is-just-bad-business": {
    dimension: "truth",
    reflection: "your tolerance for hidden costs in business and life",
    prompt: "What are you paying for that nobody told you about?"
  },
  "mastering-human-and-business-development": {
    dimension: "tribe",
    reflection: "how you build bridges between people who should know each other",
    prompt: "Are you a connector — or are you just collecting connections?"
  },
  "6-act-of-speech-speaking-as-a-tool": {
    dimension: "truth",
    reflection: "whether your words create or destroy",
    prompt: "Every sentence you speak is an act of creation. What are you building?"
  },
  "marc-andreessen-rebuttal-2020": {
    dimension: "truth",
    reflection: "your willingness to challenge powerful narratives",
    prompt: "Can you disagree with someone you admire without losing respect for them — or yourself?"
  },
  "more-ignorance-or-indignance-in-the-wake-of-covid-19": {
    dimension: "consciousness",
    reflection: "how you process collective trauma without numbing out",
    prompt: "Are you processing what happened — or pretending it didn't?"
  },
  "mastering-bd-the-art-of-the-no-that-opens-the-real-door": {
    dimension: "purpose",
    reflection: "your ability to say no as a creative act",
    prompt: "The most powerful word in business isn't yes — it's no. How well do you wield it?"
  },
  "dao-the-way-of-dao": {
    dimension: "consciousness",
    reflection: "your comfort with paradox and non-linear thinking",
    prompt: "Can you hold two contradictory truths and let them both be real?"
  },
  "enterprise-blockchain-can-big-business-co-opt-an-existential-revolution": {
    dimension: "purpose",
    reflection: "your relationship with disruption when it threatens your comfort",
    prompt: "Do you want the revolution — or just the returns?"
  },
  "what-solutions-are-best-built-with-blockchain-or-not": {
    dimension: "truth",
    reflection: "your ability to separate signal from hype",
    prompt: "Can you love a technology without losing your critical thinking?"
  },
  "a-historical-perspective-on-blockchain": {
    dimension: "consciousness",
    reflection: "your understanding that every revolution has a prehistory",
    prompt: "Do you see patterns — or just events?"
  },
  "the-ball-and-blockchain-obstacles-to-a-world-changing-trajectory": {
    dimension: "purpose",
    reflection: "your patience with world-changing ideas that move slowly",
    prompt: "Can you believe in something that won't pay off in your lifetime?"
  },
  "is-there-such-a-thing-as-price-gouging-and-price-fixing-in-it-services": {
    dimension: "truth",
    reflection: "your tolerance for systemic dishonesty in business",
    prompt: "If the market is rigged, do you play the game or change the rules?"
  },
  "business-at-the-speed-of-light-what-is-a-millisecond-worth-to-you": {
    dimension: "purpose",
    reflection: "your understanding that speed without direction is just chaos",
    prompt: "You're moving fast. But toward what?"
  },
  "trust-us-are-you-really-my-friend": {
    dimension: "relationships",
    reflection: "how you calibrate trust in a world designed to exploit it",
    prompt: "Who have you trusted that you shouldn't have — and what did it teach you?"
  },
  "the-tug-of-war-ethical-vs-economic-decisions": {
    dimension: "truth",
    reflection: "where your ethics and your economics collide",
    prompt: "When your wallet and your conscience disagree, who wins?"
  },
  "would-you-hire-someone-who-led-a-rebellion": {
    dimension: "tribe",
    reflection: "your relationship with people who break rules",
    prompt: "Do you hire for compliance or for courage?"
  },
  "how-fast-growth-companies-are-most-likely-to-fall-part-3": {
    dimension: "purpose",
    reflection: "your understanding that growth without structure is collapse",
    prompt: "Are you scaling — or are you just getting bigger?"
  },
  "so-now-that-we-admit-we-have-a-problem-part-2": {
    dimension: "truth",
    reflection: "your willingness to admit the problem before fixing it",
    prompt: "What have you been pretending isn't broken?"
  },
  "it-buyers-say-we-are-ok-are-you-sure-part-1": {
    dimension: "truth",
    reflection: "your ability to hear what people aren't saying",
    prompt: "When someone says they're fine, do you believe them?"
  },
  "the-cios-guide-to-smarter-vendor-negotiation": {
    dimension: "purpose",
    reflection: "your negotiation style — and what it reveals about your values",
    prompt: "Do you negotiate to win — or to create mutual value?"
  },
  "when-valuations-dont-mean-valuable": {
    dimension: "truth",
    reflection: "your ability to distinguish price from worth",
    prompt: "What in your life is expensive but worthless — and what's priceless but free?"
  },
  "the-arithmetic-of-relationships-whats-our-mutual-net-profit": {
    dimension: "relationships",
    reflection: "whether you measure relationships by what you get or what you create together",
    prompt: "What's the ROI on your most important relationship?"
  },
  "the-ties-that-bind-interpersonal-relationships-amended-for-the-21st-century": {
    dimension: "relationships",
    reflection: "how you navigate attachment in a world designed for detachment",
    prompt: "Are your ties binding you together — or holding you back?"
  },
  "grateful-smuggest-sentiment-or-second-most-selfish-act": {
    dimension: "consciousness",
    reflection: "whether your gratitude is a practice or a performance",
    prompt: "Is your gratitude changing you — or just your Instagram?"
  },
  "10-magic-questions-to-make-your-project-go-right-how-to-kick-off-a-project-properly": {
    dimension: "purpose",
    reflection: "your discipline in asking the right questions before building",
    prompt: "Do you start with questions — or assumptions?"
  },
  "high-hells-the-demise-of-powerful-femininity": {
    dimension: "truth",
    reflection: "your relationship with power symbols and who they actually serve",
    prompt: "What are you wearing — literally or metaphorically — that's hurting you?"
  },
  "i-apologize-not-me-nix-i-am-sorry-from-our-lexicon": {
    dimension: "truth",
    reflection: "how you use language to connect or to deflect",
    prompt: "When you say sorry, do you mean it — or are you just managing the moment?"
  },
  "clear-communication-companies-spend-a-lot-of-money-on-it": {
    dimension: "relationships",
    reflection: "whether you communicate to be understood or to sound smart",
    prompt: "Are your words landing — or just leaving your mouth?"
  },
  "origen-restaurant-oaxacas-humble-servant-of-the-terroir": {
    dimension: "body",
    reflection: "your reverence for where your food comes from",
    prompt: "Do you eat to fuel — or to commune?"
  },
  "clout-v-klout-why-they-arent-the-same-thing-and-never-will-be": {
    dimension: "tribe",
    reflection: "whether your influence is measured or manufactured",
    prompt: "Is your influence changing lives — or just metrics?"
  },
  "burning-man-meets-davos-the-summit-series": {
    dimension: "tribe",
    reflection: "your comfort at the intersection of purpose and privilege",
    prompt: "Can you hold space for both radical self-expression and radical accountability?"
  },
  "my-other-car-is-a-bentley-not-my-first-electric-car": {
    dimension: "body",
    reflection: "whether your choices reflect your values or your status",
    prompt: "What are you driving — and what's driving you?"
  },
  "amazon-trumps-all-other-suitors-in-quest-for-hulu": {
    dimension: "purpose",
    reflection: "your understanding of power consolidation in media",
    prompt: "When one company owns everything, who owns the narrative?"
  },
  "jumping-through-hoops-with-hulu-will-hollywood-kill-their-own-golden-goose": {
    dimension: "purpose",
    reflection: "your ability to see industries destroy themselves in slow motion",
    prompt: "What industry are you watching cannibalize itself right now?"
  },
  "profiling-the-public-cloud-buyer": {
    dimension: "purpose",
    reflection: "your decision-making process when the stakes are invisible",
    prompt: "Do you know what you're buying — or just what you're being sold?"
  },
  "key-cloud-migration-decisions": {
    dimension: "purpose",
    reflection: "your ability to make irreversible decisions with incomplete information",
    prompt: "What migration are you avoiding — in tech or in life?"
  },
  "banking-on-the-wrongs-a-guide-to-the-anti-millennial-funding-crisis": {
    dimension: "tribe",
    reflection: "your relationship with generational blame and systemic failure",
    prompt: "Are you blaming a generation — or the system that failed them?"
  },
  "a-cynic-predicts-it-and-media-in-2011": {
    dimension: "truth",
    reflection: "your willingness to make predictions and be held accountable for them",
    prompt: "What did you predict that came true — and what did you get wrong?"
  },
  "the-2011-cynic-measures-his-predictions": {
    dimension: "truth",
    reflection: "your willingness to grade your own homework",
    prompt: "Do you measure your predictions — or just remember the ones you got right?"
  },
  "2-great-books-on-a-mountain-saved-my-life-and-strife": {
    dimension: "consciousness",
    reflection: "the book or experience that fundamentally changed your trajectory",
    prompt: "What saved your life — and have you shared it with anyone?"
  },
  "break-out-the-buggy-whips-is-now-the-tipping-point-for-streaming-video": {
    dimension: "purpose",
    reflection: "your ability to recognize tipping points before they tip",
    prompt: "What's about to change everything — and are you ready?"
  },
  "making-it-fit-like-a-good-shoe-or-10-years-later-and-ramprate-still-fits": {
    dimension: "purpose",
    reflection: "your patience with building something that lasts",
    prompt: "What have you built that still fits after a decade?"
  },
  "trusting-your-tongue-youre-the-expert-in-wine": {
    dimension: "body",
    reflection: "your trust in your own senses over expert opinion",
    prompt: "Do you trust your own taste — or do you need someone to tell you what's good?"
  },
  "eco-vegan-realities-series-ethical-economic-decisions": {
    dimension: "truth",
    reflection: "the gap between your ethical ideals and your daily choices",
    prompt: "How far is your fork from your philosophy?"
  },
  "return-on-investment-going-green-going-green-2": {
    dimension: "truth",
    reflection: "whether sustainability is your conviction or your marketing",
    prompt: "Is your green real — or just a shade of greenwash?"
  },
  "it-services-markets-crumble-driving-detroits-rut": {
    dimension: "purpose",
    reflection: "your understanding that markets are ecosystems, not machines",
    prompt: "What market are you in — and is it alive or dying?"
  },
  "save-the-entrepreneur-big-business-keeps-buying-startups-and-killing-them": {
    dimension: "purpose",
    reflection: "your relationship with being acquired vs staying independent",
    prompt: "Would you sell your vision for security — and could you live with yourself?"
  },
  "triple-bottom-line-of-soul-trust-empathy-business-friendship": {
    dimension: "relationships",
    reflection: "whether you bring your whole self to business or just your resume",
    prompt: "Do your business relationships have a soul — or just a spreadsheet?"
  },
  "boiling-the-human-h-summit-transcript-harvard-kurzweil": {
    dimension: "consciousness",
    reflection: "your comfort with the idea that humanity is being upgraded",
    prompt: "If the human is being boiled, are you the frog — or the chef?"
  },
  "surfing-the-wwc-the-worldwide-wine-club": {
    dimension: "tribe",
    reflection: "your ability to build community around shared pleasure",
    prompt: "What do you gather around — and who gathers with you?"
  },
  "the-google-verizon-walled-garden-plan-no-substantive-impact-on-net-neutrality": {
    dimension: "truth",
    reflection: "your vigilance against corporate control of open systems",
    prompt: "Who controls your access — and do you even notice?"
  },
  "greenberg-on-the-same-stage-as-kurzweil-hah-h-summit-rise-of-the-citizen-scientist": {
    dimension: "consciousness",
    reflection: "your willingness to stand on stages that terrify you",
    prompt: "What stage are you avoiding — and what would happen if you stepped onto it?"
  },
  "building-a-services-market-for-the-transhuman-era": {
    dimension: "purpose",
    reflection: "your ability to build for a future that doesn't exist yet",
    prompt: "Are you building for today's market — or tomorrow's species?"
  },
  "truth-and-bias-are-mutually-exclusive": {
    dimension: "truth",
    reflection: "your awareness of your own biases",
    prompt: "What bias are you carrying that you've mistaken for truth?"
  },
  "the-myth-of-the-rfp-for-everything-at-half-price": {
    dimension: "purpose",
    reflection: "your relationship with the fantasy of getting everything for nothing",
    prompt: "What are you trying to get at half price — and what's it actually costing you?"
  },
  "trust-your-tongue-the-only-wine-and-spirit-critic-that-matters-is-your-own-palate": {
    dimension: "body",
    reflection: "your sovereignty over your own sensory experience",
    prompt: "When did you last trust yourself over the experts?"
  },
  "why-good-service-is-all-about-trust": {
    dimension: "relationships",
    reflection: "whether you build trust through consistency or through grand gestures",
    prompt: "Is your trust earned daily — or performed occasionally?"
  },
  "customer-service-the-key-to-business-success": {
    dimension: "relationships",
    reflection: "how you treat people who can't do anything for you",
    prompt: "How you treat the person who serves your coffee is who you actually are."
  },
  "wheres-my-flying-car-and-an-efficient-it-market": {
    dimension: "purpose",
    reflection: "your patience with the gap between promise and delivery",
    prompt: "What were you promised that never arrived — and have you stopped waiting?"
  },
  "simplify-your-life-dr-bronners-to-pressure-cookers": {
    dimension: "body",
    reflection: "your willingness to strip away complexity and return to essentials",
    prompt: "What would you remove from your life if you were brave enough?"
  },
  "find-my-ev-paul-scott-wont-let-you-buy-a-gas-car": {
    dimension: "action",
    reflection: "your willingness to act on what you already know is true",
    prompt: "You have the math. You have the evidence. You have the budget guide. The only question left is whether you will act — or keep carrying excuses for an industry that does not care about you."
  }
};

export const MIRROR_ARTICLE_SLUGS: string[] = Object.keys(MIRROR_ARTICLES);
