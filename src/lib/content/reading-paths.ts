// Ported from legacy client/src/data/readingPaths.ts — 90+ hand-picked
// "read next" connections between essays, each with a real editorial
// reason explaining why the two pieces belong together (not a generic
// same-category fallback). Real content, unchanged, except:
// - 2 duplicate keys under a stale slug spelling for the same real post
//   (`enterprise-blockchain-can-big-business-co-opt-an-existential-threat`
//   and `triple-bottom-line-of-soul-trust-empathy-business-friendship`)
//   collapsed into the post'''s one correctly-spelled key, keeping that
//   key'''s own recommendation list rather than merging two competing
//   editorial takes.
// - 2 more stale target slugs fixed against the real migrated post corpus
//   (same class of renamed-post bug already fixed elsewhere in this
//   migration): the Bentley/EV piece and the Butcher'''s Daughter piece.
// - 1 resulting self-reference dropped (a post recommending itself, once
//   its stale-slug alias resolved to its own real slug).
// - 8 recommendations pointing at `attention-theft-the-silent-crime-of-the-`
//   `digital-age` dropped — not a blog post (it'''s legacy'''s standalone
//   `/attention-theft` manifesto, not yet ported), so these already never
//   rendered in legacy either (its own lookup only ever searched blog
//   posts, silently dropping non-matches) — carrying forward the same
//   effective behavior, just done at data-build time instead of on every
//   render.
export interface ReadingPathEntry {
  slug: string;
  reason: string;
}

export const READING_PATHS: Record<string, ReadingPathEntry[]> = {
  "is-that-a-lot-clarisse-abelarde": [
    {
      "slug": "the-decay-of-modern-day-communication",
      "reason": "What platforms do to human expression"
    },
    {
      "slug": "psychedelics-could-become-extractive-capitalism",
      "reason": "When sacred things meet the algorithm"
    },
    {
      "slug": "boiling-the-human-summit-harvard-kurzweil",
      "reason": "The body, the machine, and what gets lost between"
    },
    {
      "slug": "truth-bias-mutually-exclusive",
      "reason": "Who decides what you're allowed to see"
    }
  ],
  "only-time-buys-trust": [
    {
      "slug": "the-arithmetic-of-relationships",
      "reason": "The math behind the philosophy"
    },
    {
      "slug": "why-good-service-is-all-about-trust",
      "reason": "Trust in action, at the transaction level"
    },
    {
      "slug": "mastering-bd-the-art-of-the-no-that-opens-the-real-door",
      "reason": "When trust meets negotiation"
    }
  ],
  "the-arithmetic-of-relationships": [
    {
      "slug": "only-time-buys-trust",
      "reason": "The foundational essay on trust"
    },
    {
      "slug": "the-buyers-and-sellers-honesty-dance-1",
      "reason": "Relationships at the deal table"
    },
    {
      "slug": "mastering-human-and-business-development",
      "reason": "Scaling relationships into systems"
    }
  ],
  "why-good-service-is-all-about-trust": [
    {
      "slug": "customer-service-key-to-business-success",
      "reason": "The other side of the service coin"
    },
    {
      "slug": "bread-stuck-with-no-customer-service",
      "reason": "What happens when trust breaks"
    },
    {
      "slug": "only-time-buys-trust",
      "reason": "The philosophy behind the practice"
    }
  ],
  "the-buyers-and-sellers-honesty-dance-1": [
    {
      "slug": "the-buyers-sellers-honesty-dance-2",
      "reason": "Part two — the dance continues"
    },
    {
      "slug": "hiding-fees-tips-in-the-transparent-age",
      "reason": "When the dance turns dishonest"
    },
    {
      "slug": "the-arithmetic-of-relationships",
      "reason": "The deeper math of buyer-seller dynamics"
    }
  ],
  "the-buyers-sellers-honesty-dance-2": [
    {
      "slug": "the-buyers-and-sellers-honesty-dance-1",
      "reason": "Start from the beginning"
    },
    {
      "slug": "the-cios-guide-to-smarter-vendor-negotiation",
      "reason": "The enterprise version of the dance"
    },
    {
      "slug": "thing-price-gouging-price-fixing",
      "reason": "When the dance becomes a con"
    }
  ],
  "customer-service-key-to-business-success": [
    {
      "slug": "why-good-service-is-all-about-trust",
      "reason": "Trust as the foundation of service"
    },
    {
      "slug": "luz-lounge-where-loyalty-goes-to-die-groupon",
      "reason": "A case study in service failure"
    },
    {
      "slug": "the-decay-of-professional-phone-calls",
      "reason": "The erosion of professional communication"
    }
  ],
  "mastering-bd-the-art-of-the-no-that-opens-the-real-door": [
    {
      "slug": "the-cios-guide-to-smarter-vendor-negotiation",
      "reason": "The enterprise application"
    },
    {
      "slug": "mastering-human-and-business-development",
      "reason": "The full framework"
    },
    {
      "slug": "only-time-buys-trust",
      "reason": "Why 'no' works — it's about trust"
    }
  ],
  "the-cios-guide-to-smarter-vendor-negotiation": [
    {
      "slug": "mastering-bd-the-art-of-the-no-that-opens-the-real-door",
      "reason": "The art behind the strategy"
    },
    {
      "slug": "profiling-the-public-cloud-buyer",
      "reason": "Know your buyer before you negotiate"
    },
    {
      "slug": "thing-price-gouging-price-fixing",
      "reason": "When vendors cross the line"
    }
  ],
  "thing-price-gouging-price-fixing": [
    {
      "slug": "hiding-fees-tips-in-the-transparent-age",
      "reason": "Another form of pricing dishonesty"
    },
    {
      "slug": "the-buyers-and-sellers-honesty-dance-1",
      "reason": "The honest alternative"
    },
    {
      "slug": "trap-how-dmn8-gym-became-a-poster-child-for-fitness-fraud",
      "reason": "Price gouging taken to the extreme"
    }
  ],
  "hiding-fees-tips-in-the-transparent-age": [
    {
      "slug": "thing-price-gouging-price-fixing",
      "reason": "The bigger picture of pricing fraud"
    },
    {
      "slug": "luz-lounge-where-loyalty-goes-to-die-groupon",
      "reason": "Another business that hid the truth"
    },
    {
      "slug": "the-tug-of-war-ethical-vs-economic-decisions",
      "reason": "The ethics of pricing"
    }
  ],
  "mastering-human-and-business-development": [
    {
      "slug": "mastering-bd-the-art-of-the-no-that-opens-the-real-door",
      "reason": "The tactical companion piece"
    },
    {
      "slug": "the-arithmetic-of-relationships",
      "reason": "The relationship math underneath"
    },
    {
      "slug": "10-magic-questions-for-projects-success-kick-ass",
      "reason": "The project management angle"
    }
  ],
  "profiling-the-public-cloud-buyer": [
    {
      "slug": "it-challenges-buyers-are-ok-are-you-sure-part-1",
      "reason": "The challenges these buyers face"
    },
    {
      "slug": "the-cios-guide-to-smarter-vendor-negotiation",
      "reason": "How to negotiate the cloud deal"
    },
    {
      "slug": "cios-maximize-roi-or-find-new-role-joe-weinman",
      "reason": "The ROI imperative"
    }
  ],
  "it-challenges-buyers-are-ok-are-you-sure-part-1": [
    {
      "slug": "so-now-that-we-admit-we-have-a-problem-part-2",
      "reason": "Part two — admitting the problem"
    },
    {
      "slug": "profiling-the-public-cloud-buyer",
      "reason": "Who these buyers actually are"
    },
    {
      "slug": "business-at-the-speed-of-light-millisecond-worth",
      "reason": "Why speed matters in infrastructure"
    }
  ],
  "so-now-that-we-admit-we-have-a-problem-part-2": [
    {
      "slug": "fast-growth-companies-likely-to-fall-part-3",
      "reason": "Part three — the consequences"
    },
    {
      "slug": "it-challenges-buyers-are-ok-are-you-sure-part-1",
      "reason": "Start from the beginning"
    },
    {
      "slug": "the-cios-guide-to-smarter-vendor-negotiation",
      "reason": "The solution: smarter negotiation"
    }
  ],
  "fast-growth-companies-likely-to-fall-part-3": [
    {
      "slug": "it-challenges-buyers-are-ok-are-you-sure-part-1",
      "reason": "Start the series from part one"
    },
    {
      "slug": "when-valuations-dont-mean-valuable",
      "reason": "When growth isn't value"
    },
    {
      "slug": "marc-andreessen-rebuttal-2020",
      "reason": "The venture capital perspective"
    }
  ],
  "business-at-the-speed-of-light-millisecond-worth": [
    {
      "slug": "profiling-the-public-cloud-buyer",
      "reason": "The buyers driving this speed"
    },
    {
      "slug": "cios-maximize-roi-or-find-new-role-joe-weinman",
      "reason": "The economics of milliseconds"
    },
    {
      "slug": "boiling-the-human-summit-harvard-kurzweil",
      "reason": "Speed and the singularity"
    }
  ],
  "cios-maximize-roi-or-find-new-role-joe-weinman": [
    {
      "slug": "profiling-the-public-cloud-buyer",
      "reason": "The buyers these CIOs serve"
    },
    {
      "slug": "the-cios-guide-to-smarter-vendor-negotiation",
      "reason": "The negotiation playbook"
    },
    {
      "slug": "productivity-apps-that-rocked-my-world-in-2024",
      "reason": "The tools that actually work"
    }
  ],
  "productivity-apps-that-rocked-my-world-in-2024": [
    {
      "slug": "cios-maximize-roi-or-find-new-role-joe-weinman",
      "reason": "The ROI of the right tools"
    },
    {
      "slug": "business-at-the-speed-of-light-millisecond-worth",
      "reason": "Why speed tools matter"
    },
    {
      "slug": "clear-communication",
      "reason": "Tools are nothing without clear communication"
    }
  ],
  "forever-chemicals-in-my-blood-pfas-and-microplastics": [
    {
      "slug": "elixir-of-life-device-and-journey",
      "reason": "The quest to undo the damage"
    },
    {
      "slug": "forward-health-is-a-sideway-step-at-best",
      "reason": "When the health system fails you"
    },
    {
      "slug": "boiling-the-human-summit-harvard-kurzweil",
      "reason": "The body as technology platform"
    }
  ],
  "elixir-of-life-device-and-journey": [
    {
      "slug": "forever-chemicals-in-my-blood-pfas-and-microplastics",
      "reason": "What the elixir is fighting"
    },
    {
      "slug": "psychedelics-could-become-extractive-capitalism",
      "reason": "Another frontier of human optimization"
    },
    {
      "slug": "human-operating-system",
      "reason": "The operating system the elixir is upgrading"
    }
  ],
  "forward-health-is-a-sideway-step-at-best": [
    {
      "slug": "forever-chemicals-in-my-blood-pfas-and-microplastics",
      "reason": "The health crisis they're not solving"
    },
    {
      "slug": "trap-how-dmn8-gym-became-a-poster-child-for-fitness-fraud",
      "reason": "Another wellness industry failure"
    },
    {
      "slug": "the-tug-of-war-ethical-vs-economic-decisions",
      "reason": "When health meets profit motive"
    }
  ],
  "boiling-the-human-summit-harvard-kurzweil": [
    {
      "slug": "human-operating-system",
      "reason": "The operating system being boiled"
    },
    {
      "slug": "the-way-of-dao",
      "reason": "The philosophical counterweight to the singularity"
    },
    {
      "slug": "psychedelics-could-become-extractive-capitalism",
      "reason": "Consciousness expansion as infrastructure"
    }
  ],
  "psychedelics-could-become-extractive-capitalism": [
    {
      "slug": "the-tug-of-war-ethical-vs-economic-decisions",
      "reason": "The ethical tension at the heart of the industry"
    },
    {
      "slug": "boiling-the-human-summit-harvard-kurzweil",
      "reason": "Consciousness and the singularity"
    },
    {
      "slug": "human-operating-system",
      "reason": "What psychedelics are actually upgrading"
    }
  ],
  "the-tug-of-war-ethical-vs-economic-decisions": [
    {
      "slug": "eco-vegan-realities-seriesethical-economic",
      "reason": "Ethics applied to daily choices"
    },
    {
      "slug": "psychedelics-could-become-extractive-capitalism",
      "reason": "When a movement meets the market"
    },
    {
      "slug": "hiding-fees-tips-in-the-transparent-age",
      "reason": "Economic decisions that cross the line"
    }
  ],
  "eco-vegan-realities-seriesethical-economic": [
    {
      "slug": "how-to-alienate-a-loyal-vegan",
      "reason": "When the ethical choice gets complicated"
    },
    {
      "slug": "the-tug-of-war-ethical-vs-economic-decisions",
      "reason": "The broader ethical framework"
    },
    {
      "slug": "return-on-investment-going-green-going-green-2",
      "reason": "The economics of going green"
    }
  ],
  "how-to-alienate-a-loyal-vegan": [
    {
      "slug": "eco-vegan-realities-seriesethical-economic",
      "reason": "The ethical framework behind the frustration"
    },
    {
      "slug": "an-ode-to-kusaki-where-plants-become-culinary-masterpieces",
      "reason": "When plant-based is done right"
    },
    {
      "slug": "luz-lounge-where-loyalty-goes-to-die-groupon",
      "reason": "Another loyalty betrayal"
    }
  ],
  "grateful-smuggest-sentiment-or-selfish-act": [
    {
      "slug": "the-tug-of-war-ethical-vs-economic-decisions",
      "reason": "The ethics of gratitude"
    },
    {
      "slug": "the-way-of-dao",
      "reason": "A deeper philosophical lens"
    },
    {
      "slug": "clear-communication",
      "reason": "What we say vs. what we mean"
    }
  ],
  "clear-communication": [
    {
      "slug": "6-act-of-speech-speaking-as-a-tool",
      "reason": "The mechanics of clear speech"
    },
    {
      "slug": "the-decay-of-modern-day-communication",
      "reason": "What happens when clarity dies"
    },
    {
      "slug": "apologize",
      "reason": "The hardest communication of all"
    }
  ],
  "apologize": [
    {
      "slug": "clear-communication",
      "reason": "The foundation of a real apology"
    },
    {
      "slug": "the-decay-of-modern-day-communication",
      "reason": "Why apologies have become so rare"
    },
    {
      "slug": "the-arithmetic-of-relationships",
      "reason": "The relationship math of saying sorry"
    }
  ],
  "6-act-of-speech-speaking-as-a-tool": [
    {
      "slug": "clear-communication",
      "reason": "The companion piece on clarity"
    },
    {
      "slug": "the-decay-of-professional-phone-calls",
      "reason": "When speech tools break down"
    },
    {
      "slug": "mastering-bd-the-art-of-the-no-that-opens-the-real-door",
      "reason": "Speech as a business tool"
    }
  ],
  "the-decay-of-modern-day-communication": [
    {
      "slug": "the-decay-of-professional-phone-calls",
      "reason": "The professional dimension of the decay"
    },
    {
      "slug": "clear-communication",
      "reason": "The antidote"
    },
    {
      "slug": "apologize",
      "reason": "The ultimate test of communication"
    }
  ],
  "the-decay-of-professional-phone-calls": [
    {
      "slug": "the-decay-of-modern-day-communication",
      "reason": "The broader communication crisis"
    },
    {
      "slug": "customer-service-key-to-business-success",
      "reason": "When phone calls are the service"
    },
    {
      "slug": "clear-communication",
      "reason": "What professional calls should be"
    }
  ],
  "save-entrepreneurs-big-business-buying-startup-2": [
    {
      "slug": "when-valuations-dont-mean-valuable",
      "reason": "The valuation trap"
    },
    {
      "slug": "innovative-thinking-with-tony-greenberg-scale-up-show",
      "reason": "How to scale without selling out"
    },
    {
      "slug": "marc-andreessen-rebuttal-2020",
      "reason": "The VC perspective on startups"
    }
  ],
  "when-valuations-dont-mean-valuable": [
    {
      "slug": "save-entrepreneurs-big-business-buying-startup-2",
      "reason": "When big business comes calling"
    },
    {
      "slug": "fast-growth-companies-likely-to-fall-part-3",
      "reason": "The growth trap"
    },
    {
      "slug": "what-solutions-are-best-built-with-blockchain",
      "reason": "New models of value creation"
    }
  ],
  "innovative-thinking-with-tony-greenberg-scale-up-show": [
    {
      "slug": "founders-institute-tony-outsourci",
      "reason": "Another founder perspective"
    },
    {
      "slug": "mastering-human-and-business-development",
      "reason": "The development framework"
    },
    {
      "slug": "10-magic-questions-for-projects-success-kick-ass",
      "reason": "The project execution playbook"
    }
  ],
  "founders-institute-tony-outsourci": [
    {
      "slug": "innovative-thinking-with-tony-greenberg-scale-up-show",
      "reason": "The scaling companion"
    },
    {
      "slug": "save-entrepreneurs-big-business-buying-startup-2",
      "reason": "The exit question"
    },
    {
      "slug": "would-you-hire-someone-who-led-a-rebellion",
      "reason": "The rebel founder archetype"
    }
  ],
  "would-you-hire-someone-who-led-a-rebellion": [
    {
      "slug": "marc-andreessen-rebuttal-2020",
      "reason": "Another rebel perspective"
    },
    {
      "slug": "founders-institute-tony-outsourci",
      "reason": "The founder's journey"
    },
    {
      "slug": "mastering-bd-the-art-of-the-no-that-opens-the-real-door",
      "reason": "The rebel's negotiation style"
    }
  ],
  "marc-andreessen-rebuttal-2020": [
    {
      "slug": "would-you-hire-someone-who-led-a-rebellion",
      "reason": "Another contrarian take"
    },
    {
      "slug": "when-valuations-dont-mean-valuable",
      "reason": "The valuation reality check"
    },
    {
      "slug": "the-tug-of-war-ethical-vs-economic-decisions",
      "reason": "The ethics of venture capital"
    }
  ],
  "what-solutions-are-best-built-with-blockchain": [
    {
      "slug": "the-ball-and-blockchain-decentralization",
      "reason": "The decentralization thesis"
    },
    {
      "slug": "the-way-of-dao",
      "reason": "The philosophy of decentralized systems"
    },
    {
      "slug": "psychedelics-could-become-extractive-capitalism",
      "reason": "Tokenization meets impact"
    }
  ],
  "the-ball-and-blockchain-decentralization": [
    {
      "slug": "what-solutions-are-best-built-with-blockchain",
      "reason": "The practical applications"
    },
    {
      "slug": "the-way-of-dao",
      "reason": "DAOs and the philosophy of decentralization"
    },
    {
      "slug": "boiling-the-human-summit-harvard-kurzweil",
      "reason": "Decentralization as resistance to the boil"
    }
  ],
  "an-ode-to-kusaki-where-plants-become-culinary-masterpieces": [
    {
      "slug": "origen-restaurant",
      "reason": "Another restaurant that gets it right"
    },
    {
      "slug": "how-to-alienate-a-loyal-vegan",
      "reason": "When plant-based goes wrong"
    },
    {
      "slug": "eco-vegan-realities-seriesethical-economic",
      "reason": "The ethics of what we eat"
    }
  ],
  "origen-restaurant": [
    {
      "slug": "an-ode-to-kusaki-where-plants-become-culinary-masterpieces",
      "reason": "Another culinary masterpiece"
    },
    {
      "slug": "luz-lounge-where-loyalty-goes-to-die-groupon",
      "reason": "The opposite of Origen"
    },
    {
      "slug": "india-my-virtual-soul-home",
      "reason": "Food as cultural connection"
    }
  ],
  "bread-stuck-with-no-customer-service": [
    {
      "slug": "customer-service-key-to-business-success",
      "reason": "What they should have done"
    },
    {
      "slug": "luz-lounge-where-loyalty-goes-to-die-groupon",
      "reason": "Another service disaster"
    },
    {
      "slug": "the-decay-of-professional-phone-calls",
      "reason": "The communication breakdown"
    }
  ],
  "luz-lounge-where-loyalty-goes-to-die-groupon": [
    {
      "slug": "trap-how-dmn8-gym-became-a-poster-child-for-fitness-fraud",
      "reason": "Another business that betrayed trust"
    },
    {
      "slug": "bread-stuck-with-no-customer-service",
      "reason": "Another service failure"
    },
    {
      "slug": "hiding-fees-tips-in-the-transparent-age",
      "reason": "The hidden costs of loyalty"
    }
  ],
  "trap-how-dmn8-gym-became-a-poster-child-for-fitness-fraud": [
    {
      "slug": "dmn8-the-most-beautiful-crooked-gym-in-the-world",
      "reason": "The full exposé"
    },
    {
      "slug": "luz-lounge-where-loyalty-goes-to-die-groupon",
      "reason": "Another business built on deception"
    },
    {
      "slug": "thing-price-gouging-price-fixing",
      "reason": "The pricing fraud connection"
    }
  ],
  "dmn8-the-most-beautiful-crooked-gym-in-the-world": [
    {
      "slug": "trap-how-dmn8-gym-became-a-poster-child-for-fitness-fraud",
      "reason": "The companion investigation"
    },
    {
      "slug": "forward-health-is-a-sideway-step-at-best",
      "reason": "The wellness industry's broken promises"
    },
    {
      "slug": "the-tug-of-war-ethical-vs-economic-decisions",
      "reason": "When aesthetics mask fraud"
    }
  ],
  "more-ignorance-or-indignance-in-the-wake-of-covid-19": [
    {
      "slug": "covid-deniers-need-to-take-a-breath",
      "reason": "The follow-up"
    },
    {
      "slug": "the-decay-of-modern-day-communication",
      "reason": "Communication breakdown during crisis"
    },
    {
      "slug": "the-tug-of-war-ethical-vs-economic-decisions",
      "reason": "The ethics of pandemic response"
    }
  ],
  "covid-deniers-need-to-take-a-breath": [
    {
      "slug": "more-ignorance-or-indignance-in-the-wake-of-covid-19",
      "reason": "The companion piece"
    },
    {
      "slug": "clear-communication",
      "reason": "Why clear messaging matters in a crisis"
    },
    {
      "slug": "grateful-smuggest-sentiment-or-selfish-act",
      "reason": "Gratitude in a pandemic"
    }
  ],
  "the-way-of-dao": [
    {
      "slug": "human-operating-system",
      "reason": "The operating system the Dao runs on"
    },
    {
      "slug": "what-solutions-are-best-built-with-blockchain",
      "reason": "DAOs and the Way"
    },
    {
      "slug": "boiling-the-human-summit-harvard-kurzweil",
      "reason": "Eastern philosophy meets the singularity"
    }
  ],
  "human-operating-system": [
    {
      "slug": "the-way-of-dao",
      "reason": "The philosophical layer"
    },
    {
      "slug": "boiling-the-human-summit-harvard-kurzweil",
      "reason": "The system being upgraded"
    },
    {
      "slug": "psychedelics-could-become-extractive-capitalism",
      "reason": "Upgrading the OS through consciousness"
    }
  ],
  "high-hells-demise-of-powerful-femininity": [
    {
      "slug": "the-tug-of-war-ethical-vs-economic-decisions",
      "reason": "Power and ethics"
    },
    {
      "slug": "grateful-smuggest-sentiment-or-selfish-act",
      "reason": "Social performance vs. authenticity"
    },
    {
      "slug": "clear-communication",
      "reason": "What power actually sounds like"
    }
  ],
  "jumping-through-hoops-with-hulu-will-hollywood-kill-their-offspring-again": [
    {
      "slug": "amazon-trumps-all-other-suitors-quest-hulu",
      "reason": "The Hulu saga continues"
    },
    {
      "slug": "clout-v-klout-differences-and-never-be-the-same",
      "reason": "Media influence in the digital age"
    },
    {
      "slug": "when-valuations-dont-mean-valuable",
      "reason": "When media valuations disconnect from reality"
    }
  ],
  "amazon-trumps-all-other-suitors-quest-hulu": [
    {
      "slug": "jumping-through-hoops-with-hulu-will-hollywood-kill-their-offspring-again",
      "reason": "The beginning of the Hulu story"
    },
    {
      "slug": "profiling-the-public-cloud-buyer",
      "reason": "Amazon's other empire"
    },
    {
      "slug": "save-entrepreneurs-big-business-buying-startup-2",
      "reason": "When big business acquires"
    }
  ],
  "clout-v-klout-differences-and-never-be-the-same": [
    {
      "slug": "the-decay-of-modern-day-communication",
      "reason": "The influence economy's impact on communication"
    },
    {
      "slug": "jumping-through-hoops-with-hulu-will-hollywood-kill-their-offspring-again",
      "reason": "Media influence and power"
    },
    {
      "slug": "boiling-the-human-summit-harvard-kurzweil",
      "reason": "Digital influence and the singularity"
    }
  ],
  "find-my-ev-paul-scott-wont-let-you-buy-a-gas-car": [
    {
      "slug": "my-other-car-is-a-bentley-not-car-to-leaf-alone",
      "reason": "The origin story — Tony's first EV purchase with Paul Scott in 2011"
    },
    {
      "slug": "the-butchers-daughter-the-carbon-toll-and-the-cheese-that-ate-the-planet",
      "reason": "The same crusade applied to food — exposing extractive systems hiding behind consumer choices"
    },
    {
      "slug": "return-on-investment-going-green-going-green-2",
      "reason": "The broader ROI of going green"
    }
  ],
  "my-other-car-is-a-bentley-not-car-to-leaf-alone": [
    {
      "slug": "find-my-ev-paul-scott-wont-let-you-buy-a-gas-car",
      "reason": "The sequel — 14 years later, Paul's still fighting and the math is even more devastating"
    },
    {
      "slug": "return-on-investment-going-green-going-green-2",
      "reason": "The ROI of going green"
    },
    {
      "slug": "eco-vegan-realities-seriesethical-economic",
      "reason": "Another ethical consumer choice"
    }
  ],
  "return-on-investment-going-green-going-green-2": [
    {
      "slug": "my-other-car-is-a-bentley-not-car-to-leaf-alone",
      "reason": "Green transportation in practice"
    },
    {
      "slug": "eco-vegan-realities-seriesethical-economic",
      "reason": "The economics of ethical choices"
    },
    {
      "slug": "the-tug-of-war-ethical-vs-economic-decisions",
      "reason": "When green meets the bottom line"
    }
  ],
  "summit-series-weekend-community": [
    {
      "slug": "davos-2022-world-economic-forum-here-we-come",
      "reason": "Another gathering of minds"
    },
    {
      "slug": "india-my-virtual-soul-home",
      "reason": "Community across cultures"
    },
    {
      "slug": "the-arithmetic-of-relationships",
      "reason": "The math of community"
    }
  ],
  "davos-2022-world-economic-forum-here-we-come": [
    {
      "slug": "summit-series-weekend-community",
      "reason": "Another summit, different vibe"
    },
    {
      "slug": "marc-andreessen-rebuttal-2020",
      "reason": "The power players at Davos"
    },
    {
      "slug": "the-tug-of-war-ethical-vs-economic-decisions",
      "reason": "The ethics of global capitalism"
    }
  ],
  "india-my-virtual-soul-home": [
    {
      "slug": "summit-series-weekend-community",
      "reason": "Community in different forms"
    },
    {
      "slug": "the-way-of-dao",
      "reason": "Eastern philosophy and spiritual connection"
    },
    {
      "slug": "an-ode-to-kusaki-where-plants-become-culinary-masterpieces",
      "reason": "Cultural appreciation through food"
    }
  ],
  "10-magic-questions-for-projects-success-kick-ass": [
    {
      "slug": "mastering-human-and-business-development",
      "reason": "The development framework"
    },
    {
      "slug": "innovative-thinking-with-tony-greenberg-scale-up-show",
      "reason": "Scaling the project"
    },
    {
      "slug": "clear-communication",
      "reason": "Questions require clear communication"
    }
  ],
  "the-2011-cynic-measures-his-predictions": [
    {
      "slug": "boiling-the-human-summit-harvard-kurzweil",
      "reason": "The prediction that started it all"
    },
    {
      "slug": "marc-andreessen-rebuttal-2020",
      "reason": "Another prediction and rebuttal"
    },
    {
      "slug": "fast-growth-companies-likely-to-fall-part-3",
      "reason": "Predictions about growth"
    }
  ],
  "enterprise-blockchain-can-big-business-co-opt": [
    {
      "slug": "from-supply-chain-to-the-blockchain-heal",
      "reason": "Blockchain in the supply chain"
    },
    {
      "slug": "google-verizon-walled-garden-plan",
      "reason": "When big tech controls the infrastructure"
    },
    {
      "slug": "you-are-the-moat",
      "reason": "Individual sovereignty in a platform world"
    }
  ],
  "the-peptide-truth-65m-fraud-industry-vs-life-changing-medicine": [
    {
      "slug": "find-my-ev-paul-scott-wont-let-you-buy-a-gas-car",
      "reason": "Another investigation where an industry insider exposes what the mainstream won't tell you"
    },
    {
      "slug": "the-butchers-daughter-the-carbon-toll-and-the-cheese-that-ate-the-planet",
      "reason": "The wellness industry's relationship with truth and marketing"
    },
    {
      "slug": "my-other-car-is-a-bentley-not-car-to-leaf-alone",
      "reason": "Identity and consumption decisions — the same psychology that drives health purchases"
    }
  ],
  "the-butchers-daughter-the-carbon-toll-and-the-cheese-that-ate-the-planet": [
    {
      "slug": "eco-vegan-realities-seriesethical-economic",
      "reason": "The ethical framework behind what we consume"
    },
    {
      "slug": "how-to-alienate-a-loyal-vegan",
      "reason": "When food ethics meet restaurant reality"
    },
    {
      "slug": "an-ode-to-kusaki-where-plants-become-culinary-masterpieces",
      "reason": "When plant-based is done right"
    }
  ],
  "triple-bottom-line-of-soul-gregory-markel": [
    {
      "slug": "energy-as-impact",
      "reason": "Energy and purpose"
    },
    {
      "slug": "the-tug-of-war-ethical-vs-economic-decisions",
      "reason": "Ethics and economics in tension"
    }
  ],
  "molecule-as-mirror-1-three-rooms-one-longing": [
    {
      "slug": "molecule-as-mirror-2-the-old-maps",
      "reason": "Part 2 — the journey continues"
    },
    {
      "slug": "molecule-as-mirror-3-the-new-cartographers",
      "reason": "Part 3 — who's drawing the new maps"
    },
    {
      "slug": "the-molecule-as-mirror-from-substance-to-service",
      "reason": "The full arc in one essay"
    }
  ],
  "molecule-as-mirror-2-the-old-maps": [
    {
      "slug": "molecule-as-mirror-1-three-rooms-one-longing",
      "reason": "Start from the beginning"
    },
    {
      "slug": "molecule-as-mirror-3-the-new-cartographers",
      "reason": "Part 3 — the new frameworks"
    },
    {
      "slug": "molecule-as-mirror-4-power-and-relief",
      "reason": "Part 4 — power dynamics"
    }
  ],
  "molecule-as-mirror-3-the-new-cartographers": [
    {
      "slug": "molecule-as-mirror-2-the-old-maps",
      "reason": "Part 2 — the old frameworks"
    },
    {
      "slug": "molecule-as-mirror-4-power-and-relief",
      "reason": "Part 4 — the next layer"
    },
    {
      "slug": "molecule-as-mirror-1-three-rooms-one-longing",
      "reason": "Start from the beginning"
    }
  ],
  "molecule-as-mirror-4-power-and-relief": [
    {
      "slug": "molecule-as-mirror-3-the-new-cartographers",
      "reason": "Part 3 — the cartographers"
    },
    {
      "slug": "molecule-as-mirror-5-escape-and-meaning",
      "reason": "Part 5 — escape vs meaning"
    },
    {
      "slug": "molecule-as-mirror-6-the-pause-protocol",
      "reason": "Part 6 — the protocol"
    }
  ],
  "molecule-as-mirror-5-escape-and-meaning": [
    {
      "slug": "molecule-as-mirror-4-power-and-relief",
      "reason": "Part 4 — power and relief"
    },
    {
      "slug": "molecule-as-mirror-6-the-pause-protocol",
      "reason": "Part 6 — the pause"
    },
    {
      "slug": "molecule-as-mirror-7-the-pathway-to-dharma",
      "reason": "Part 7 — toward dharma"
    }
  ],
  "molecule-as-mirror-6-the-pause-protocol": [
    {
      "slug": "molecule-as-mirror-5-escape-and-meaning",
      "reason": "Part 5 — escape and meaning"
    },
    {
      "slug": "molecule-as-mirror-7-the-pathway-to-dharma",
      "reason": "Part 7 — the dharma path"
    },
    {
      "slug": "molecule-as-mirror-8-resources-and-costs",
      "reason": "Part 8 — practical resources"
    }
  ],
  "molecule-as-mirror-7-the-pathway-to-dharma": [
    {
      "slug": "molecule-as-mirror-6-the-pause-protocol",
      "reason": "Part 6 — the pause protocol"
    },
    {
      "slug": "molecule-as-mirror-8-resources-and-costs",
      "reason": "Part 8 — resources and costs"
    },
    {
      "slug": "molecule-as-mirror-9-a-ceremony-story",
      "reason": "Part 9 — the ceremony"
    }
  ],
  "molecule-as-mirror-8-resources-and-costs": [
    {
      "slug": "molecule-as-mirror-7-the-pathway-to-dharma",
      "reason": "Part 7 — the dharma path"
    },
    {
      "slug": "molecule-as-mirror-9-a-ceremony-story",
      "reason": "Part 9 — a ceremony story"
    },
    {
      "slug": "molecule-as-mirror-10-what-the-pioneers-know",
      "reason": "Part 10 — what the pioneers know"
    }
  ],
  "molecule-as-mirror-9-a-ceremony-story": [
    {
      "slug": "molecule-as-mirror-8-resources-and-costs",
      "reason": "Part 8 — resources and costs"
    },
    {
      "slug": "molecule-as-mirror-10-what-the-pioneers-know",
      "reason": "Part 10 — the pioneers"
    },
    {
      "slug": "molecule-as-mirror-11-the-doorway",
      "reason": "Part 11 — the final doorway"
    }
  ],
  "molecule-as-mirror-10-what-the-pioneers-know": [
    {
      "slug": "molecule-as-mirror-9-a-ceremony-story",
      "reason": "Part 9 — the ceremony"
    },
    {
      "slug": "molecule-as-mirror-11-the-doorway",
      "reason": "Part 11 — the final doorway"
    },
    {
      "slug": "molecule-as-mirror-1-three-rooms-one-longing",
      "reason": "Start from the beginning"
    }
  ],
  "molecule-as-mirror-11-the-doorway": [
    {
      "slug": "molecule-as-mirror-10-what-the-pioneers-know",
      "reason": "Part 10 — what the pioneers know"
    },
    {
      "slug": "the-molecule-as-mirror-from-substance-to-service",
      "reason": "The full arc distilled"
    },
    {
      "slug": "molecule-as-mirror-1-three-rooms-one-longing",
      "reason": "Start from the beginning"
    }
  ],
  "the-molecule-as-mirror-from-substance-to-service": [
    {
      "slug": "molecule-as-mirror-1-three-rooms-one-longing",
      "reason": "The full 11-part series starts here"
    },
    {
      "slug": "molecule-as-mirror-11-the-doorway",
      "reason": "The final chapter"
    },
    {
      "slug": "psychedelics-could-become-extractive-capitalism",
      "reason": "When the medicine meets the market"
    }
  ],
  "the-bottle-that-quietly-ends-an-entire-civilization": [
    {
      "slug": "the-decay-of-modern-day-communication",
      "reason": "What we lose when convenience wins"
    },
    {
      "slug": "truth-bias-mutually-exclusive",
      "reason": "Truth in the age of convenience"
    }
  ],
  "truth-bias-mutually-exclusive": [
    {
      "slug": "the-decay-of-modern-day-communication",
      "reason": "Communication and what it costs us"
    },
    {
      "slug": "the-bottle-that-quietly-ends-an-entire-civilization",
      "reason": "Civilization-scale convenience"
    }
  ],
  "the-ties-that-bind-interpersonal-relationships": [
    {
      "slug": "the-arithmetic-of-relationships",
      "reason": "The math behind connection"
    },
    {
      "slug": "only-time-buys-trust",
      "reason": "Trust as the foundation of all bonds"
    },
    {
      "slug": "love-as-dharma-a-science-based-playbook-for-magnetic-partnership",
      "reason": "Love as a practice"
    }
  ],
  "the-clock-keeper-chronicles-part-1": [
    {
      "slug": "the-1000-hour-hold",
      "reason": "Time as the ultimate currency"
    },
    {
      "slug": "the-decay-of-modern-day-communication",
      "reason": "What we lose when time is wasted"
    }
  ],
  "frqncy-the-bus-that-restores-the-world": [
    {
      "slug": "gratitude-in-action",
      "reason": "Impact in motion"
    },
    {
      "slug": "energy-as-impact",
      "reason": "Energy and purpose aligned"
    },
    {
      "slug": "triple-bottom-line-of-soul-gregory-markel",
      "reason": "Soul + business + impact"
    }
  ],
  "conscious-capital-partnership-ecosystem": [
    {
      "slug": "the-tug-of-war-ethical-vs-economic-decisions",
      "reason": "The ethics of capital"
    },
    {
      "slug": "energy-as-impact",
      "reason": "Capital aligned with purpose"
    },
    {
      "slug": "triple-bottom-line-of-soul-gregory-markel",
      "reason": "Soul-aligned business"
    }
  ],
  "detroits-rut-stagnation-signs-services-markets": [
    {
      "slug": "wheres-my-flying-car-and-an-efficient-it-market",
      "reason": "Markets and their failures"
    },
    {
      "slug": "it-services-good-shoe-10-years-later-ramprate",
      "reason": "IT services and what they cost"
    },
    {
      "slug": "key-cloud-migration-decisions",
      "reason": "The decisions that move markets"
    }
  ],
  "it-services-good-shoe-10-years-later-ramprate": [
    {
      "slug": "detroits-rut-stagnation-signs-services-markets",
      "reason": "Market stagnation and its causes"
    },
    {
      "slug": "wheres-my-flying-car-and-an-efficient-it-market",
      "reason": "The IT market's broken promises"
    },
    {
      "slug": "the-cios-guide-to-smarter-vendor-negotiation",
      "reason": "How to negotiate your way out"
    }
  ],
  "myth-rfp-everything-half-price": [
    {
      "slug": "the-cios-guide-to-smarter-vendor-negotiation",
      "reason": "The real negotiation playbook"
    },
    {
      "slug": "it-services-good-shoe-10-years-later-ramprate",
      "reason": "IT services reality check"
    },
    {
      "slug": "mastering-bd-the-art-of-the-no-that-opens-the-real-door",
      "reason": "The art of the deal"
    }
  ],
  "from-supply-chain-to-the-blockchain-heal": [
    {
      "slug": "enterprise-blockchain-can-big-business-co-opt",
      "reason": "Can big business co-opt the chain"
    },
    {
      "slug": "you-are-the-moat",
      "reason": "Sovereignty in a platform world"
    },
    {
      "slug": "key-cloud-migration-decisions",
      "reason": "Infrastructure decisions that matter"
    }
  ],
  "google-verizon-walled-garden-plan": [
    {
      "slug": "enterprise-blockchain-can-big-business-co-opt",
      "reason": "When corporations control the rails"
    },
    {
      "slug": "you-are-the-moat",
      "reason": "Your sovereignty in their garden"
    }
  ],
  "greenberg-kurzweil-scientist-foundation-of-trust": [
    {
      "slug": "boiling-the-human-summit-harvard-kurzweil",
      "reason": "The Harvard summit context"
    },
    {
      "slug": "you-are-the-moat",
      "reason": "Human advantage in the AI age"
    },
    {
      "slug": "only-time-buys-trust",
      "reason": "Trust as the foundation of everything"
    }
  ],
  "key-cloud-migration-decisions": [
    {
      "slug": "detroits-rut-stagnation-signs-services-markets",
      "reason": "Market context for cloud decisions"
    },
    {
      "slug": "it-services-good-shoe-10-years-later-ramprate",
      "reason": "IT services reality"
    },
    {
      "slug": "enterprise-blockchain-can-big-business-co-opt",
      "reason": "Infrastructure and control"
    }
  ],
  "productivity-apps-that-rock-my-world-in-2026": [
    {
      "slug": "you-are-the-moat",
      "reason": "Tools that amplify your unique edge"
    },
    {
      "slug": "boiling-the-human-summit-harvard-kurzweil",
      "reason": "Human + AI — the real partnership"
    }
  ],
  "wheres-my-flying-car-and-an-efficient-it-market": [
    {
      "slug": "detroits-rut-stagnation-signs-services-markets",
      "reason": "Detroit as a market case study"
    },
    {
      "slug": "it-services-good-shoe-10-years-later-ramprate",
      "reason": "IT services and the efficiency gap"
    },
    {
      "slug": "you-are-the-moat",
      "reason": "Human ingenuity vs. market failure"
    }
  ],
  "you-are-the-moat": [
    {
      "slug": "boiling-the-human-summit-harvard-kurzweil",
      "reason": "Human potential in the AI age"
    },
    {
      "slug": "greenberg-kurzweil-scientist-foundation-of-trust",
      "reason": "Trust as the ultimate moat"
    }
  ],
  "energy-as-impact": [
    {
      "slug": "gratitude-in-action",
      "reason": "Impact in motion"
    },
    {
      "slug": "triple-bottom-line-of-soul-gregory-markel",
      "reason": "Soul-aligned business"
    },
    {
      "slug": "conscious-capital-partnership-ecosystem",
      "reason": "Capital with purpose"
    }
  ],
  "gratitude-in-action": [
    {
      "slug": "energy-as-impact",
      "reason": "Energy aligned with gratitude"
    },
    {
      "slug": "frqncy-the-bus-that-restores-the-world",
      "reason": "Gratitude in motion"
    },
    {
      "slug": "triple-bottom-line-of-soul-gregory-markel",
      "reason": "The soul of business"
    }
  ],
  "powering-purpose-driven-innovation": [
    {
      "slug": "energy-as-impact",
      "reason": "Energy as the fuel for purpose"
    },
    {
      "slug": "conscious-capital-partnership-ecosystem",
      "reason": "Capital aligned with innovation"
    },
    {
      "slug": "triple-bottom-line-of-soul-gregory-markel",
      "reason": "The triple bottom line"
    }
  ],
  "the-1000-hour-hold": [
    {
      "slug": "the-clock-keeper-chronicles-part-1",
      "reason": "Time as the ultimate currency"
    },
    {
      "slug": "the-decay-of-professional-phone-calls",
      "reason": "The erosion of professional time"
    }
  ],
  "restaurants-beware-of-vegans-and-vegans-beware-of-lying-restaurants": [
    {
      "slug": "how-to-alienate-a-loyal-vegan",
      "reason": "The vegan restaurant experience"
    },
    {
      "slug": "eco-vegan-realities-seriesethical-economic",
      "reason": "The ethics of plant-based eating"
    },
    {
      "slug": "the-butchers-daughter-the-carbon-toll-and-the-cheese-that-ate-the-planet",
      "reason": "When wellness marketing misleads"
    }
  ],
  "the-restaurant-with-no-menu-prices-ai-ethics-manifesto": [
    {
      "slug": "hiding-fees-tips-in-the-transparent-age",
      "reason": "Hidden pricing and its ethics"
    },
    {
      "slug": "the-1000-hour-hold",
      "reason": "Another manifesto against corporate abuse"
    },
    {
      "slug": "the-buyers-and-sellers-honesty-dance-1",
      "reason": "The honesty we deserve"
    }
  ],
  "drbronners-to-pressurecookers-simplify-your-life": [
    {
      "slug": "the-bottle-that-quietly-ends-an-entire-civilization",
      "reason": "What simplicity costs civilization"
    },
    {
      "slug": "points-pointless-only-wine-expert-matters",
      "reason": "Trusting your own judgment"
    },
    {
      "slug": "trust-tongue-bottle-wine",
      "reason": "The expert is you"
    }
  ],
  "love-as-dharma-a-science-based-playbook-for-magnetic-partnership": [
    {
      "slug": "the-arithmetic-of-relationships",
      "reason": "The math of love"
    },
    {
      "slug": "only-time-buys-trust",
      "reason": "Trust as the foundation of love"
    },
    {
      "slug": "the-ties-that-bind-interpersonal-relationships",
      "reason": "What binds us together"
    }
  ],
  "points-pointless-only-wine-expert-matters": [
    {
      "slug": "trust-tongue-bottle-wine",
      "reason": "The same argument, deeper"
    },
    {
      "slug": "surfing-wwc-worldwide-wine-club",
      "reason": "Wine as exploration"
    },
    {
      "slug": "drbronners-to-pressurecookers-simplify-your-life",
      "reason": "Trusting your own taste"
    }
  ],
  "surfing-wwc-worldwide-wine-club": [
    {
      "slug": "trust-tongue-bottle-wine",
      "reason": "Trust your tongue"
    },
    {
      "slug": "points-pointless-only-wine-expert-matters",
      "reason": "Why the experts don't matter"
    },
    {
      "slug": "an-ode-to-kusaki-where-plants-become-culinary-masterpieces",
      "reason": "Food and drink as experience"
    }
  ],
  "transforming-tony-2-books-mountain-life-strife": [
    {
      "slug": "love-as-dharma-a-science-based-playbook-for-magnetic-partnership",
      "reason": "Transformation through love"
    },
    {
      "slug": "molecule-as-mirror-1-three-rooms-one-longing",
      "reason": "Transformation through consciousness"
    },
    {
      "slug": "gratitude-in-action",
      "reason": "Gratitude as transformation"
    }
  ],
  "trust-tongue-bottle-wine": [
    {
      "slug": "points-pointless-only-wine-expert-matters",
      "reason": "Why points don't matter"
    },
    {
      "slug": "surfing-wwc-worldwide-wine-club",
      "reason": "Wine as adventure"
    },
    {
      "slug": "drbronners-to-pressurecookers-simplify-your-life",
      "reason": "Simplify and trust yourself"
    }
  ],
  "founders-institute-anti-millennial-funding-guide": [
    {
      "slug": "conscious-capital-partnership-ecosystem",
      "reason": "Capital that doesn't require a press release"
    },
    {
      "slug": "mastering-bd-the-art-of-the-no-that-opens-the-real-door",
      "reason": "The real art of the deal"
    },
    {
      "slug": "the-tug-of-war-ethical-vs-economic-decisions",
      "reason": "Ethics in the funding game"
    }
  ],
  "a-cynic-predicts-it-and-media-in-2011": [
    {
      "slug": "wheres-my-flying-car-and-an-efficient-it-market",
      "reason": "Another tech prediction that aged well"
    },
    {
      "slug": "google-verizon-walled-garden-plan",
      "reason": "The media landscape and who controls it"
    }
  ],
  "a-historical-perspective-on-blockchain": [
    {
      "slug": "enterprise-blockchain-can-big-business-co-opt",
      "reason": "Can big business co-opt the chain"
    },
    {
      "slug": "from-supply-chain-to-the-blockchain-heal",
      "reason": "Blockchain healing the supply chain"
    },
    {
      "slug": "you-are-the-moat",
      "reason": "Individual sovereignty in a platform world"
    }
  ],
  "akbar-cuisine-restoration-economics": [
    {
      "slug": "an-ode-to-kusaki-where-plants-become-culinary-masterpieces",
      "reason": "Another restaurant that gets it right"
    },
    {
      "slug": "how-to-alienate-a-loyal-vegan",
      "reason": "The restaurant experience from the other side"
    },
    {
      "slug": "the-restaurant-with-no-menu-prices-ai-ethics-manifesto",
      "reason": "What restaurants owe their guests"
    }
  ],
  "break-buggy-whip-now-tipping-for-streaming-video": [
    {
      "slug": "hiding-fees-tips-in-the-transparent-age",
      "reason": "Hidden fees and the tipping economy"
    },
    {
      "slug": "the-1000-hour-hold",
      "reason": "Another manifesto against consumer abuse"
    },
    {
      "slug": "the-restaurant-with-no-menu-prices-ai-ethics-manifesto",
      "reason": "Pricing transparency as an ethical imperative"
    }
  ],
  "building-services-market-transhuman-era": [
    {
      "slug": "boiling-the-human-summit-harvard-kurzweil",
      "reason": "The Harvard summit that started the conversation"
    },
    {
      "slug": "you-are-the-moat",
      "reason": "Human advantage in the transhuman era"
    },
    {
      "slug": "greenberg-kurzweil-scientist-foundation-of-trust",
      "reason": "Trust as the foundation of the future"
    }
  ],
  "california-toll-roads-legalized-scam": [
    {
      "slug": "the-1000-hour-hold",
      "reason": "Another manifesto against systems that abuse consumers"
    },
    {
      "slug": "hiding-fees-tips-in-the-transparent-age",
      "reason": "Hidden fees in plain sight"
    },
    {
      "slug": "the-restaurant-with-no-menu-prices-ai-ethics-manifesto",
      "reason": "Pricing transparency as an ethical imperative"
    }
  ],
  "iboga-ibogaine-the-full-paradox": [
    {
      "slug": "psychedelics-could-become-extractive-capitalism",
      "reason": "The ethical risks of commercializing sacred medicines"
    },
    {
      "slug": "molecule-as-mirror-9-a-ceremony-story",
      "reason": "A first-person ceremony story that echoes this journey"
    },
    {
      "slug": "molecule-as-mirror-5-escape-and-meaning",
      "reason": "The deeper question of why we seek altered states"
    }
  ]
};
