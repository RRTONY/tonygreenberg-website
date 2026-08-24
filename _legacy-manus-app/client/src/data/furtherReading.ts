/**
 * Further Reading recommendations keyed by category and format tag.
 * Each blog post gets curated links based on its topic area.
 * These are real, relevant resources that match Tony's vibe.
 */

interface ReadingLink {
  title: string;
  url: string;
  source: string;
  why: string;
}

const categoryReading: Record<string, ReadingLink[]> = {
  "Business & Capital": [
    { title: "The Fifth Discipline", url: "https://www.amazon.com/Fifth-Discipline-Practice-Learning-Organization/dp/0385517254", source: "Peter Senge", why: "Systems thinking applied to organizations — the book that changed how I see companies" },
    { title: "Thinking in Systems", url: "https://www.amazon.com/Thinking-Systems-Donella-H-Meadows/dp/1603580557", source: "Donella Meadows", why: "Everything you know is only a model. Get your model out where it can be viewed." },
    { title: "The Innovator's Dilemma", url: "https://www.amazon.com/Innovators-Dilemma-Technologies-Management-Innovation/dp/1633691780", source: "Clayton Christensen", why: "Why great companies fail — and what to do about it" },
    { title: "Stratechery", url: "https://stratechery.com", source: "Ben Thompson", why: "The sharpest analysis of tech business strategy on the internet" },
    { title: "Cloudonomics", url: "https://www.amazon.com/Cloudonomics-Business-Value-Cloud-Computing/dp/1118229967", source: "Joe Weinman", why: "The economics of cloud infrastructure — by someone who actually understands it" },
  ],
  "Systems & Innovation": [
    { title: "The Age of Surveillance Capitalism", url: "https://www.amazon.com/Age-Surveillance-Capitalism-Future-Frontier/dp/1610395697", source: "Shoshana Zuboff", why: "The definitive work on how data extraction became the dominant business model" },
    { title: "The Singularity Is Nearer", url: "https://www.amazon.com/Singularity-Nearer-Ray-Kurzweil/dp/0593162706", source: "Ray Kurzweil", why: "The future is arriving faster than your planning cycle" },
    { title: "a16z Blog", url: "https://a16z.com/blog", source: "Andreessen Horowitz", why: "Love them or hate them, they publish the sharpest tech analysis" },
    { title: "Wired", url: "https://www.wired.com", source: "Condé Nast", why: "Still the best long-form tech journalism when they try" },
    { title: "How to Change Your Mind", url: "https://www.amazon.com/Change-Your-Mind-Consciousness-Transcendence/dp/0735224153", source: "Michael Pollan", why: "The book that brought psychedelic medicine into the mainstream conversation" },
  ],
  "Culture & Communication": [
    { title: "You Can Have It All", url: "https://www.amazon.com/You-Can-Have-Arnold-Patent/dp/0671000764", source: "Arnold Patent", why: "We don't create abundance. Abundance is always present. We create limitation." },
    { title: "Be Here Now", url: "https://www.amazon.com/Be-Here-Now-Ram-Dass/dp/0517543052", source: "Ram Dass", why: "We're all just walking each other home." },
    { title: "Man's Search for Meaning", url: "https://www.amazon.com/Mans-Search-Meaning-Viktor-Frankl/dp/0807014273", source: "Viktor Frankl", why: "Between stimulus and response there is a space. In that space is our freedom." },
    { title: "Letters from a Stoic", url: "https://www.amazon.com/Letters-Stoic-Penguin-Classics-Seneca/dp/0140442103", source: "Seneca", why: "The original manifestos — 2,000 years old and still cutting" },
    { title: "Sapiens", url: "https://www.amazon.com/Sapiens-Humankind-Yuval-Noah-Harari/dp/0062316095", source: "Yuval Noah Harari", why: "The stories we tell ourselves are the infrastructure of civilization" },
  ],
  "Living Well": [
    { title: "Count Down", url: "https://www.amazon.com/Count-Down-Threatening-Reproductive-Development/dp/1982113669", source: "Shanna Swan", why: "The definitive book on how chemicals are reshaping human biology" },
    { title: "The Body Keeps the Score", url: "https://www.amazon.com/Body-Keeps-Score-Healing-Trauma/dp/0143127748", source: "Bessel van der Kolk", why: "Because the body is not separate from the mind — it never was" },
    { title: "Peter Attia's Outlive", url: "https://www.amazon.com/Outlive-Longevity-Peter-Attia-MD/dp/0593236599", source: "Peter Attia", why: "The science of longevity, without the biohacking vanity" },
    { title: "Wine Folly", url: "https://winefolly.com", source: "Madeline Puckette", why: "Trust your tongue — but also learn the vocabulary" },
    { title: "Punch", url: "https://punchdrink.com", source: "Punch", why: "The best writing about drinks on the internet" },
  ],
  "Impact & Purpose": [
    { title: "ImpactSoul", url: "https://impactsoul.is", source: "Tony Greenberg", why: "Tokenizing high-value assets to fund regenerative impact" },
    { title: "RampRate SPY Index", url: "https://ramprate.com", source: "RampRate", why: "1M+ data points benchmarking enterprise technology" },
    { title: "Operating Manual for Spaceship Earth", url: "https://www.amazon.com/Operating-Manual-Spaceship-Buckminster-Fuller/dp/3037781262", source: "Buckminster Fuller", why: "Build a new model that makes the existing model obsolete" },
    { title: "The Web of Life", url: "https://www.amazon.com/Web-Life-Scientific-Understanding-Systems/dp/0385476760", source: "Fritjof Capra", why: "Patterns cannot be weighed or measured. Patterns must be mapped." },
    { title: "The Inside-Out Revolution", url: "https://www.amazon.com/Inside-Out-Revolution-Only-Thing-Need/dp/1401942555", source: "Michael Neill", why: "Understanding how the mind works changes everything" },
  ],
  "The Crusades": [
    { title: "Dark Patterns at Scale", url: "https://arxiv.org/abs/1907.07032", source: "Mathur et al.", why: "The academic framework behind deceptive UX — required reading for consumer advocates" },
    { title: "Consumer Financial Protection Bureau", url: "https://www.consumerfinance.gov/complaint/", source: "CFPB", why: "File complaints that actually get investigated" },
    { title: "FTC Consumer Complaint", url: "https://reportfraud.ftc.gov", source: "FTC", why: "When a company crosses the line, this is where you start" },
    { title: "Dark Patterns Tip Line", url: "https://darkpatterns.org", source: "Harry Brignull", why: "Report and document deceptive design patterns" },
    { title: "Tools of Titans", url: "https://www.amazon.com/Tools-Titans-Billionaires-World-Class-Performers/dp/1328683788", source: "Tim Ferriss", why: "Distilled wisdom from people who've built things that matter" },
  ],
};

const formatReading: Record<string, ReadingLink[]> = {
  "The Crusade": [
    { title: "Dark Patterns Tip Line", url: "https://darkpatterns.org", source: "Harry Brignull", why: "Report and document deceptive design patterns" },
    { title: "Consumer Financial Protection Bureau", url: "https://www.consumerfinance.gov/complaint/", source: "CFPB", why: "File complaints that actually get investigated" },
    { title: "FTC Consumer Complaint", url: "https://reportfraud.ftc.gov", source: "FTC", why: "When a company crosses the line, this is where you start" },
  ],
  "The Systems Map": [
    { title: "Thinking in Systems", url: "https://www.amazon.com/Thinking-Systems-Donella-H-Meadows/dp/1603580557", source: "Donella Meadows", why: "The primer that makes systems thinking accessible" },
    { title: "Leverage Points", url: "https://donellameadows.org/archives/leverage-points-places-to-intervene-in-a-system/", source: "Donella Meadows", why: "Where to intervene in a system — the most important essay in systems thinking" },
  ],
  "The Manifesto": [
    { title: "Letters from a Stoic", url: "https://www.amazon.com/Letters-Stoic-Penguin-Classics-Seneca/dp/0140442103", source: "Seneca", why: "The original manifestos — 2,000 years old and still cutting" },
    { title: "Meditations", url: "https://www.amazon.com/Meditations-New-Translation-Marcus-Aurelius/dp/0812968255", source: "Marcus Aurelius", why: "A Roman emperor's private journal on how to live" },
  ],
  "The Lesson": [
    { title: "Poor Charlie's Almanack", url: "https://www.amazon.com/Poor-Charlies-Almanack-Essential-Charles/dp/1953953239", source: "Charlie Munger", why: "Mental models from the greatest business mind of the century" },
    { title: "The Almanack of Naval Ravikant", url: "https://www.navalmanack.com", source: "Naval Ravikant", why: "Wealth and happiness distilled to first principles" },
  ],
};

/**
 * Get curated further reading links for a blog post
 */
export function getFurtherReading(category: string, formatTag: string): ReadingLink[] {
  const catLinks = categoryReading[category] || categoryReading["Impact & Purpose"] || [];
  const fmtLinks = formatReading[formatTag] || [];

  // Combine, deduplicate by URL, limit to 5
  const seen = new Set<string>();
  const combined: ReadingLink[] = [];

  // Prioritize format-specific links, then category
  for (const link of [...fmtLinks, ...catLinks]) {
    if (!seen.has(link.url)) {
      seen.add(link.url);
      combined.push(link);
    }
    if (combined.length >= 5) break;
  }

  return combined;
}
