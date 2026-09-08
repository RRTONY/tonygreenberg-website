// Real content ported from the legacy HumanOS V2.0 section
// (_legacy-manus-app/client/src/pages/humanos/*.tsx) — nav items, the
// ecosystem roster (mentor/advisors/partners/clients), resources
// (playbooks/daily practices/reading list), the connect channels, and the
// "Path to Here" timeline. All copy is verbatim from the legacy source.
//
// Every legacy person photo lived at `/api/img/<name>_<hash>.png` — a
// Manus-hosted path that this app must never reference (CONTRIBUTING.md
// rule 12). Those fields are dropped entirely rather than proxied; person
// cards render an initials avatar instead (see components/humanos/
// person-card.tsx), same "drop the unrecoverable photo, keep the real
// text" call already made on /living-declaration.

export const HUMANOS_NAV_ITEMS = [
  { label: "Philosophy", href: "/humanos/philosophy" },
  { label: "Ecosystem", href: "/humanos/ecosystem" },
  { label: "Resources", href: "/humanos/resources" },
  { label: "Connect", href: "/humanos/connect" },
] as const;

export type PersonData = { name: string; role: string; org: string; quote: string };

export const MENTOR: PersonData = {
  name: "David Orban",
  role: "Faculty & Advisor",
  org: "Singularity University | Transhumanism Pioneer",
  quote:
    "The future belongs to those who understand that technology and humanity are not separate forces, but co-evolving partners. Human OS 2.0 represents the conscious choice to upgrade our operating systems — not just our devices, but our minds, our societies, and our relationship with what it means to be human in an age of exponential change.",
};

export const ADVISORS: PersonData[] = [
  { name: "Will Poole", role: "Co-Founder", org: "Capria Ventures (Former Microsoft Windows Leader)", quote: "Creating an impact economy powered by community, not billionaires — enough waiting, time to act." },
  { name: "Gary Silverman", role: "Partner", org: "White & Case LLP", quote: "Guiding blockchain's first use cases toward positive change — blazing the trail others will follow." },
  { name: "Alessa Berg", role: "Founder", org: "Top Tier Impact, ESG360", quote: "Aligning ecology, community, and capital to build an economy that restores, not extracts." },
  { name: "Andrew Durgee", role: "CEO", org: "Republic Crypto", quote: "Moving blockchain past speculation into regeneration — building sustainable value for a sustainable world." },
  { name: "Pico Velasquez", role: "Co-Founder and CEO", org: "Artha Ventures", quote: "Rallying mass impact movements to fund sustainable change — ready to better the world together." },
  { name: "Stuart Newton", role: "Co-Founder", org: "Abundant Village", quote: "Democratizing impact — you don't need billions to create meaningful change with your work." },
  { name: "Alan Ginsberg", role: "Co-Founder", org: "Ginsberg Development", quote: "Tokenizing real-world assets to unlock illiquid value and shared ownership as impact's economic engine." },
  { name: "Peta Milan", role: "CEO", org: "JET Regeneration Group", quote: "Igniting community-driven regenerative projects that elevate all life — shifting the needle on systemic impact." },
];

export const PARTNERS: PersonData[] = [
  { name: "Matt McKibbin", role: "Founder and Chief Decentralization Officer", org: "DecentraNet", quote: "Decentralization is about more than just technology; it's about shifting power back to the edges. ImpactSoul is building the infrastructure for a world where value flows freely to where it's needed most." },
  { name: "Ted Moskovitz", role: "Founder", org: "DecentraNet", quote: "We are rewriting the social contract. ImpactSoul represents a practical, scalable way to align economic incentives with human flourishing." },
  { name: "Josh Kriger", role: "Co-Founder & Co-Host", org: "Edge of NFT / Edge of Company", quote: "Our primary goal is to support, nourish, and co-create this ecosystem. ImpactSoul aligns perfectly with the mission to use Web3 for genuine social impact and human flourishing." },
];

export const CLIENTS: string[] = [
  "Sony", "Nike", "Microsoft", "eBay", "Intel", "Verizon", "Hearst", "Blizzard",
  "Sega", "Nintendo", "Virgin", "Vodafone", "Yahoo", "AOL", "Fox", "NBC",
  "MTV", "Disney", "Citigroup", "Goldman Sachs", "Credit Suisse", "Merrill Lynch",
  "McKinsey", "Broadcom", "Sandisk", "PayPal", "Ticketmaster", "Expedia", "GoDaddy",
];

// Every "Take the Diagnostic" CTA in the legacy source pointed to
// `/assessment` — an 8-question Maximizer/Satisficer quiz. That quiz was
// never actually built: legacy's real `/assessment` (singular) route is
// an unrelated Builder/Crusader/Investor archetype quiz, and `/assessments`
// (plural) is an unrelated index of three other quizzes (Dharma Finder,
// Consciousness Scale, Grant Study) — neither exists in this app yet
// either. Rather than link every CTA to a 404 or bait-and-switch to an
// unrelated quiz, every "diagnostic" CTA below points to
// `/humanos/philosophy`, which actually delivers the Maximizer-vs-
// Satisficer content being promised.
export const DIAGNOSTIC_HREF = "/humanos/philosophy";

export const PLAYBOOKS = [
  { num: "01", title: "The Attention Audit", desc: "A 7-day protocol for mapping exactly where your cognitive bandwidth goes — and reclaiming it. Track every notification, every scroll, every context switch. The data will shock you.", link: "/attention-theft" },
  { num: "02", title: "The Satisficer Protocol", desc: "A decision-making framework for defining 'enough' before you start searching. Eliminates analysis paralysis and the grass-is-greener syndrome.", link: DIAGNOSTIC_HREF },
  { num: "03", title: "The Digital Sabbath", desc: "A weekly practice of intentional disconnection. Not a detox — a recalibration. 24 hours of analog living to reset your baseline.", link: null },
  { num: "04", title: "The Consciousness Scale", desc: "Map your organization's operating system from survival mode to generative leadership. Based on 25 years of enterprise advisory.", link: "/assessments/consciousness-scale" },
] as const;

export const DAILY_PRACTICES = [
  { title: "Morning Protocol", items: ["No screens for the first 60 minutes", "Journaling: 3 pages, stream of consciousness", "Movement: 20 minutes minimum, no podcasts", "Intention setting: one word for the day"] },
  { title: "Work Protocol", items: ["Time-boxing: 90-minute deep work blocks", "Single-tasking: one tab, one task, one outcome", "Communication windows: check email/messages 3x daily", "Decision journaling: record the criteria, not just the choice"] },
  { title: "Evening Protocol", items: ["Digital sunset: screens off 90 minutes before sleep", "Gratitude practice: 3 specific moments from today", "Tomorrow's MIT: identify the Most Important Thing", "Reading: 30 minutes minimum, physical books preferred"] },
] as const;

export const READING_LIST = [
  { title: "Stealing Fire", author: "Steven Kotler & Jamie Wheal", why: "The science of altered states and peak performance — the neurochemistry behind flow, mindfulness, psychedelics, and technology." },
  { title: "The Paradox of Choice", author: "Barry Schwartz", why: "The foundational text on Maximizers vs. Satisficers. Essential reading for understanding why more options make us less happy." },
  { title: "Recapture the Rapture", author: "Jamie Wheal", why: "A blueprint for meaning-making in a post-institutional world. Addresses the collapse of traditional meaning structures." },
  { title: "The Singularity Is Nearer", author: "Ray Kurzweil", why: "The updated case for exponential technology and its implications for human consciousness and capability." },
  { title: "How to Change Your Mind", author: "Michael Pollan", why: "The mainstream introduction to psychedelic science and its potential for treating depression, addiction, and existential distress." },
  { title: "Finite and Infinite Games", author: "James P. Carse", why: "The philosophical foundation for understanding the difference between playing to win and playing to keep playing." },
  { title: "The Master and His Emissary", author: "Iain McGilchrist", why: "A groundbreaking exploration of how the divided brain shapes our world — and why the left hemisphere's dominance is destroying it." },
  { title: "Sapiens", author: "Yuval Noah Harari", why: "The story of how Homo sapiens conquered the world through shared fictions — and what happens when those fictions stop serving us." },
] as const;

// Legacy's "Read the Living Declaration" channel linked to `/manifesto`,
// which in legacy's own router is nothing but a redirect to
// `/living-declaration` (client/src/App.tsx line 253/463). Linked directly
// to the real destination here instead of reproducing a dead redirect hop.
export const CONNECT_CHANNELS = [
  { title: "Take the Diagnostic", desc: "8 questions. 3 minutes. Discover whether you're a Maximizer or a Satisficer — and get a personalized protocol for reclaiming your agency.", href: DIAGNOSTIC_HREF, cta: "Start Reading" },
  { title: "Read the Living Declaration", desc: "The full philosophical framework behind Human OS 2.0 — from Boiling the Human to the Conscious Satisficer protocol.", href: "/living-declaration", cta: "Read Now" },
  { title: "Explore the Ecosystem", desc: "Meet the mentors, advisors, and partners building the infrastructure for human flourishing.", href: "/humanos/ecosystem", cta: "Meet the Team" },
  { title: "Pick Up the Phone", desc: "Sometimes the most radical act is a conversation. If this resonates, let's talk.", href: "/pick-up-the-phone", cta: "Connect" },
] as const;

export const PATH_TIMELINE = [
  { year: "2010", title: "The H+ Summit", desc: "Harvard University. Shared the stage with Ray Kurzweil. Delivered 'Boiling the Human' — the first public articulation of how technology was outpacing our biological evolution. The audience was transhumanists, futurists, and AI researchers. The message was simple: we are the frog in the pot." },
  { year: "2011–2015", title: "The Enterprise Years", desc: "Built RampRate into a $24B+ benchmarking powerhouse. Advised Microsoft, Disney, Goldman Sachs, Nike. Created the SPY Index — 1M+ data points on enterprise technology. Learned that even the most sophisticated organizations were running on outdated human operating systems." },
  { year: "2016–2018", title: "The Psychedelic Turn", desc: "Six investments in psychedelic medicine: MycoMedica Life Sciences (co-founded with Paul Stamets), AtaiBeckley, Wake Network, Radicle Science, and Tripp. Consciousness expansion shifted from philosophy to infrastructure." },
  { year: "2019–2021", title: "ImpactSoul & Tokenization", desc: "Founded ImpactSoul as a Certified B Corp. Launched four token ecosystems: BEYOND (ocean cleanup), REX (paleontology), SPACE (digital access), BEING (mental health). Proved that tokenization could fund regenerative impact at scale." },
  { year: "2022–2024", title: "The Payments Corridor", desc: "Four payment processing companies through 'the corridor' — a payments infrastructure play at the intersection of traditional finance and Web3. The bridge between old money and new impact." },
  { year: "2025", title: "Human OS 2.0", desc: "Everything converges. The enterprise advisory, the psychedelic research, the impact tokenization, the payments infrastructure — all feeding into a single operating system for conscious human evolution. The machine is perfect. Be the glitch." },
] as const;
