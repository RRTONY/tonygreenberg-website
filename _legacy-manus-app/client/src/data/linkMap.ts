/**
 * Centralized link map for all companies, people, and organizations
 * mentioned across the site. Used for auto-linking in blog posts
 * and manual linking on static pages.
 */

export const linkMap: Record<string, string> = {
  // Tony's companies
  "RampRate": "https://ramprate.com",
  "ImpactSoul": "https://impactsoul.is",
  "Menagerie": "https://menagerie.is",
  "Redivider": "https://redivider.com",
  "FusionRamp": "/living-declaration",
  "STRATUM": "/living-declaration",

  // Portfolio companies — Psychedelic Medicine
  "MycoMedica Life Sciences": "https://mycomedica.com",
  "MycoMedica": "https://mycomedica.com",
  "AtaiBeckley": "https://www.atai.life",
  "atai Life Sciences": "https://www.atai.life",
  "Beckley Psytech": "https://www.beckleypsytech.com",
  "Wake Network": "https://www.wakenetwork.ai",
  "Radicle Science": "https://www.radicle.science",
  "Tripp": "https://www.tripp.com",
  "MAPS": "https://maps.org",

  // Token ecosystems
  "BEYOND": "https://impactsoul.is",
  "REX": "https://impactsoul.is",

  // Enterprise clients
  "Microsoft": "https://www.microsoft.com",
  "Disney": "https://www.disney.com",
  "Goldman Sachs": "https://www.goldmansachs.com",
  "Nike": "https://www.nike.com",
  "Google": "https://www.google.com",
  "Verizon": "https://www.verizon.com",
  "Amazon": "https://www.amazon.com",
  "Hulu": "https://www.hulu.com",
  "Netflix": "https://www.netflix.com",
  "Blizzard": "https://www.blizzard.com",
  "Blizzard Entertainment": "https://www.blizzard.com",
  "ViacomCBS": "https://www.paramount.com",
  "Viacom": "https://www.paramount.com",
  "eBay": "https://www.ebay.com",
  "Sony": "https://www.sony.com",
  "Sony Music": "https://www.sonymusic.com",
  "Miramax": "https://www.miramax.com",
  "AOL": "https://en.wikipedia.org/wiki/AOL",
  "BBC": "https://www.bbc.com",
  "NHL": "https://www.nhl.com",
  "Beats": "https://www.beatsbydre.com",
  "Apple": "https://www.apple.com",
  "Beats by Dre": "https://www.beatsbydre.com",
  "Fox": "https://www.fox.com",
  "Fox Broadcasting": "https://www.fox.com",
  "Paramount": "https://www.paramount.com",
  "Warner Bros": "https://www.warnerbros.com",
  "Activision": "https://www.activision.com",
  "Electronic Arts": "https://www.ea.com",
  "EA": "https://www.ea.com",
  "Lionsgate": "https://www.lionsgate.com",
  "Interscope": "https://www.interscope.com",
  "Universal Music": "https://www.universalmusic.com",
  "Cisco": "https://www.cisco.com",
  "Oracle": "https://www.oracle.com",
  "IBM": "https://www.ibm.com",
  "Salesforce": "https://www.salesforce.com",
  "Meta": "https://about.meta.com",
  "Facebook": "https://about.meta.com",
  "Twitter": "https://twitter.com",
  "LinkedIn": "https://www.linkedin.com",
  "Spotify": "https://www.spotify.com",
  "Tesla": "https://www.tesla.com",
  "SpaceX": "https://www.spacex.com",
  "Uber": "https://www.uber.com",
  "Airbnb": "https://www.airbnb.com",
  "Stripe": "https://stripe.com",
  "PayPal": "https://www.paypal.com",
  "Square": "https://squareup.com",
  "Shopify": "https://www.shopify.com",
  "AWS": "https://aws.amazon.com",
  "Azure": "https://azure.microsoft.com",
  "Equinix": "https://www.equinix.com",
  "CenturyLink": "https://www.lumen.com",
  "Lumen": "https://www.lumen.com",
  "Akamai": "https://www.akamai.com",
  "Cloudflare": "https://www.cloudflare.com",
  "Rackspace": "https://www.rackspace.com",

  // People — Tony's network
  "Rick Doblin": "https://www.linkedin.com/in/rick-doblin-b0aa794",
  "Buckminster Fuller": "https://en.wikipedia.org/wiki/Buckminster_Fuller",
  "Alex Veytsel": "https://www.linkedin.com/in/alexveytsel",
  "Marc Andreessen": "https://www.linkedin.com/in/pmarca",
  "Ray Kurzweil": "https://en.wikipedia.org/wiki/Ray_Kurzweil",
  "Joe Weinman": "https://www.linkedin.com/in/joeweinman",
  "Ryan Staley": "https://www.linkedin.com/in/ryanstaley",
  "Tony Greenberg": "https://www.linkedin.com/in/tonygreenberg",
  "Brock Pierce": "https://www.linkedin.com/in/brockpierce",
  "Jamie Wheal": "https://www.flowgenomeproject.com",
  "Michael Pollan": "https://michaelpollan.com",
  "Tim Ferriss": "https://tim.blog",
  "Naval Ravikant": "https://nav.al",
  "Balaji Srinivasan": "https://balajis.com",
  "Vitalik Buterin": "https://vitalik.eth.limo",
  "Amanda Feilding": "https://www.beckleyfoundation.org",
  "Robin Carhart-Harris": "https://en.wikipedia.org/wiki/Robin_Carhart-Harris",
  "Matthew Johnson": "https://www.hopkinsmedicine.org/profiles/details/matthew-johnson",
  "Clarisse Abelarde": "https://clarisseart-jyfqwtnv.manus.space/",
  "Bill Clinton": "https://en.wikipedia.org/wiki/Bill_Clinton",
  "Clinton Global Initiative": "https://www.clintonfoundation.org/programs/cgi",
  "Elon Musk": "https://en.wikipedia.org/wiki/Elon_Musk",
  "Jeff Bezos": "https://en.wikipedia.org/wiki/Jeff_Bezos",
  "Satya Nadella": "https://www.linkedin.com/in/satyanadella",
  "Jensen Huang": "https://www.linkedin.com/in/jenhsunhuang",
  "Sam Altman": "https://www.linkedin.com/in/samaltman",
  "OpenAI": "https://openai.com",
  "NVIDIA": "https://www.nvidia.com",
  "Anthropic": "https://www.anthropic.com",

  // Influences (to be added)
  "Arnold Patent": "https://www.arnoldpatent.com",
  "Ram Dass": "https://www.ramdass.org",
  "Matt Mochary": "https://www.mocharymethod.com",
  "Donella Meadows": "https://donellameadows.org",
  "Peter Senge": "https://www.linkedin.com/in/peter-senge-89a3b34",
  "Fritjof Capra": "https://www.fritjofcapra.net",

  // Organizations
  "FDA": "https://www.fda.gov",
  "FTC": "https://www.ftc.gov",
  "CA Attorney General": "https://oag.ca.gov",
  "SEC": "https://www.sec.gov",
  "DEA": "https://www.dea.gov",
  "Oura Ring": "https://ouraring.com",
  "Oura": "https://ouraring.com",
  "Humanity+": "https://humanityplus.org",
  "H+ Summit": "https://en.wikipedia.org/wiki/Humanity%2B",
  "Harvard University": "https://www.harvard.edu",
  "Stanford": "https://www.stanford.edu",
  "MIT": "https://www.mit.edu",
  "Johns Hopkins": "https://www.jhu.edu",
  "Imperial College London": "https://www.imperial.ac.uk",
  "Burning Man": "https://burningman.org",
  "TED": "https://www.ted.com",
  "Forbes": "https://www.forbes.com",
  "HuffPost": "https://www.huffpost.com",
  "Huffington Post": "https://www.huffpost.com",
  "Business Insider": "https://www.businessinsider.com",
  "Medium": "https://medium.com",
  "Wired": "https://www.wired.com",
  "TechCrunch": "https://techcrunch.com",
  "The Atlantic": "https://www.theatlantic.com",
  "New York Times": "https://www.nytimes.com",
  "Wall Street Journal": "https://www.wsj.com",
  "B Corp": "https://www.bcorporation.net",
  "Certified B Corp": "https://www.bcorporation.net",
  "SPY Index": "https://ramprate.com",
  "Beckley Foundation": "https://www.beckleyfoundation.org",

  // Consumer crusade targets
  "Homeaglow": "/homeaglow-the-anatomy-of-a-consumer-fraud",
  "Forward Health": "https://www.goforward.com",
  "DMN8": "https://www.dmn8fitness.com",
  "Luz Lounge": "https://www.luzlounge.com",
  "Lodge Bread": "https://www.lodgebread.com",
  "Dr. Bronner's": "https://www.drbronner.com",

  // Books & Authors
  "Shanna Swan": "https://www.amazon.com/Count-Down-Threatening-Reproductive-Development/dp/1982113669",

  // Internal site pages — cross-linking
  "The Amplifier": "/amplifier",
  "The Diamond Cut": "/diamond-cut",
  "Seven Doors": "/walk-through",
  "The Liquid Library": "/spirits",
  "The Body": "/the-body",
  "The Nightstand": "/the-nightstand",
  "Find My": "/find-my",
  "Self-Portrait": "/self-portrait",
  "The Manifesto": "/living-declaration",
  "The Territory": "/the-territory",
  "Engine Room": "/engine-room",
  "The Rolodex": "/clients",
  "Built by Tony G": "/recent-creations",
  "The Index": "/the-index",
  "Ecosystem Map": "/ecosystem-map",
  "Enter The Gate": "/engage",
  "Find Your Purpose": "/assessments/dharma-finder",
  "Find Your Mirror": "/the-mirror",
  "consciousness scale": "/assessments/consciousness-scale",
  "Aqueous": "https://aqwaterqpr-wvzsc3ph.manus.space",

  // Blockchain / Web3
  "Ethereum": "https://ethereum.org",
  "Bitcoin": "https://bitcoin.org",

  // Health
  "Kusaki": "https://www.kusakivegan.com",
  "Alchemy Orchards": "https://www.alchemyorchards.com",
  "Akbar Cuisine": "/akbar",
  "Akbar Cuisine of India": "/akbar",
  "Akbar": "https://www.akbarmdr.com",
  "TimoTree": "/blog/frqncy-the-bus-that-restores-the-world",
  "FRQNCY": "/blog/frqncy-the-bus-that-restores-the-world",
  "BioFRQNCY Bus": "/blog/frqncy-the-bus-that-restores-the-world",

  // BrewSoul coffee pages — internal cross-links
  "BrewSoul": "/brewsoul",
  "biodynamic coffee": "/brewsoul/biodynamic",
  "Demeter-certified": "/brewsoul/biodynamic",
  "Swiss Water Process": "/brewsoul/decaf",
  "clean decaf": "/brewsoul/decaf",
  "methylene chloride": "/brewsoul/decaf",
  "coffee and health": "/brewsoul/health",
  "CYP1A2": "/brewsoul/health",
  "chlorogenic acid": "/brewsoul/health",
  "Coffee Prescription": "/brewsoul/prescription",

  // Media
  "The Scale Up Show": "https://www.youtube.com/@RyanStaley",
  "Walter Cronkite": "https://en.wikipedia.org/wiki/Walter_Cronkite",

  // EV & Transportation
  "Plug In America": "https://pluginamerica.org",
  "Paul Scott": "https://pluginamerica.org/about/",
  "Who Killed the Electric Car": "https://www.whokilledtheelectriccar.com",
  "Santa Monica Rings": "https://www.santamonica.com/things-to-do/original-muscle-beach-santa-monica/",
};

/**
 * Auto-link function: takes raw text and returns JSX-compatible
 * segments with hyperlinks for recognized entities.
 */
export function autoLinkText(text: string): Array<string | { text: string; href: string }> {
  // Sort keys by length (longest first) to avoid partial matches
  const sortedKeys = Object.keys(linkMap).sort((a, b) => b.length - a.length);

  const segments: Array<string | { text: string; href: string }> = [];
  let remaining = text;
  const usedLinks = new Set<string>(); // Only link each entity once per text block

  while (remaining.length > 0) {
    let earliestMatch: { index: number; key: string; href: string } | null = null;

    for (const key of sortedKeys) {
      if (usedLinks.has(key)) continue;
      const idx = remaining.indexOf(key);
      if (idx !== -1 && (earliestMatch === null || idx < earliestMatch.index)) {
        // Check word boundaries to avoid matching inside compound words (e.g. "Meta" in "Meta-Pattern")
        const charBefore = idx > 0 ? remaining[idx - 1] : ' ';
        const charAfter = idx + key.length < remaining.length ? remaining[idx + key.length] : ' ';
        const isWordBoundaryBefore = /[\s,.:;!?()\[\]"'\n]/.test(charBefore) || idx === 0;
        const isWordBoundaryAfter = /[\s,.:;!?()\[\]"'\n]/.test(charAfter) || idx + key.length === remaining.length;
        if (isWordBoundaryBefore && isWordBoundaryAfter) {
          earliestMatch = { index: idx, key, href: linkMap[key] };
        }
      }
    }

    if (earliestMatch) {
      if (earliestMatch.index > 0) {
        segments.push(remaining.slice(0, earliestMatch.index));
      }
      segments.push({ text: earliestMatch.key, href: earliestMatch.href });
      usedLinks.add(earliestMatch.key);
      remaining = remaining.slice(earliestMatch.index + earliestMatch.key.length);
    } else {
      segments.push(remaining);
      break;
    }
  }

  return segments;
}
