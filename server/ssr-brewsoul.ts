/**
 * Server-Side Rendering for BrewSoul — Tony Greenberg's Coffee Curation Platform
 *
 * Serves full semantic HTML to search engine bots, AI crawlers, and any HTTP
 * client that cannot execute JavaScript (curl, Claude WebFetch, Googlebot, etc.)
 *
 * The BrewSoul platform is a React SPA — without SSR, curl and AI tools only
 * see an empty <div id="root"></div> shell. This module inlines the full catalog
 * summary so the content is indexable, quotable, and machine-legible.
 *
 * Machine-readable static files are also available at:
 *   /brewsoul/catalog.json  — Full structured JSON (107 coffees + 100 chains)
 *   /brewsoul/catalog.txt   — Plain text version for maximum compatibility
 *
 * PERMANENT RULE: Every page unblocked for indexing MUST have server-rendered HTML.
 * Content must be visible in View Source without JavaScript execution.
 */

const BASE_URL = "https://tonygreenberg.com";
const CANONICAL = `${BASE_URL}/brewsoul`;
const CATALOG_JSON_URL = `${BASE_URL}/brewsoul/catalog.json`;
const CATALOG_TXT_URL = `${BASE_URL}/brewsoul/catalog.txt`;

const TITLE = "BrewSoul — Tony Greenberg's Coffee Intelligence Platform";
const DESCRIPTION = "BrewSoul is Tony Greenberg's curated coffee database: 107 specialty coffees scored on cupping score, flavor, mold testing, farmer transparency, and value — plus rankings for 100 coffee chains from S-tier specialty roasters to F-tier commodity chains.";

// ── Top 20 coffees for the SSR summary (highest wowProxy) ────────────────────
const TOP_COFFEES = [
  { name: "Finca Deborah Aurora", producer: "Finca Deborah", origin: "Panama, Boquete", variety: "Gesha", process: "Anaerobic Natural", score: 93, price: "$120/150g", notes: "Tropical fruit, Champagne, Rose water, Mango, Vanilla", wow: 98 },
  { name: "Hacienda La Esmeralda Gesha Private Collection", producer: "Hacienda La Esmeralda", origin: "Panama, Boquete", variety: "Gesha", process: "Washed", score: 95, price: "$200/200g", notes: "Jasmine, Bergamot, Peach nectar, Honey, Lemongrass", wow: 99 },
  { name: "Gesha Village Lot 74", producer: "Gesha Village Coffee Estate", origin: "Ethiopia, Bench Maji", variety: "Gesha 1931", process: "Washed", score: 94.5, price: "$85/200g", notes: "Jasmine, Bergamot, Peach, Raw honey, White tea", wow: 95 },
  { name: "Yemen Haraaz Red", producer: "Luna Coffee", origin: "Yemen, Haraaz Mountains", variety: "Yemeni Heirloom (Udaini)", process: "Natural", score: 93, price: "$95/150g", notes: "Dried fig, Cardamom, Dark cherry, Cacao nib, Port wine", wow: 95 },
  { name: "Kemgin Lot W2", producer: "Ninety Plus", origin: "Ethiopia, Bench Maji", variety: "Wild Ethiopian", process: "Proprietary Controlled Fermentation", score: 94, price: "$150/120g", notes: "Mango, Papaya, Vanilla cream, Jasmine, Honey, Cinnamon", wow: 92 },
  { name: "Raspberry Candy", producer: "ONA Coffee", origin: "Ethiopia, Guji Shakiso", variety: "Heirloom Ethiopian", process: "Carbonic Maceration Natural", score: 92, price: "$45/200g", notes: "Raspberry, Candy, Watermelon, Rose, Cream soda", wow: 90 },
  { name: "La Palma y El Tucán Sidra", producer: "SEY Coffee", origin: "Colombia, Cundinamarca", variety: "Sidra", process: "Lactic Anaerobic", score: 91.5, price: "$38/250g", notes: "Lychee, Cider apple, Cream, Floral honey, Spice", wow: 82 },
  { name: "Kenya AA Kiambu", producer: "Proud Mary", origin: "Kenya, Kiambu County", variety: "SL28/SL34", process: "Washed", score: 90, price: "$28/250g", notes: "Blackcurrant, Grapefruit, Tomato, Brown sugar, Sparkling", wow: 78 },
  { name: "Elida Estate Catuaí Natural", producer: "Elida Estate", origin: "Panama, Boquete", variety: "Catuaí", process: "Natural", score: 91, price: "$55/200g", notes: "Cherry, Rum raisin, Cacao, Tropical fruit, Caramel", wow: 78 },
  { name: "Black Forager Natural", producer: "Onyx Coffee Lab", origin: "Ethiopia, Guji", variety: "Heirloom Ethiopian", process: "Natural", score: 91, price: "$32/284g", notes: "Blueberry, Dark chocolate, Strawberry jam, Wine", wow: 75 },
  { name: "Mamuto AA", producer: "George Howell Coffee", origin: "Kenya, Kirinyaga", variety: "SL28", process: "Washed", score: 92, price: "$35/340g", notes: "Raspberry, Red currant, Dark chocolate, Tamarind, Floral", wow: 80 },
  { name: "Colombia Pink Bourbon Washed", producer: "DAK Coffee Roasters", origin: "Colombia, Huila", variety: "Pink Bourbon", process: "Washed", score: 90, price: "$20/250g", notes: "Rosewater, Peach, Vanilla, Mandarin, Silky", wow: 72 },
  { name: "Ethiopia Yirgacheffe Kochere", producer: "Manhattan Coffee Roasters", origin: "Ethiopia, Yirgacheffe", variety: "Heirloom Ethiopian", process: "Washed", score: 90, price: "$18/250g", notes: "Lemon, Jasmine, Earl Grey, Apricot, Honey", wow: 65 },
  { name: "The Natural Ethiopia", producer: "Black & White Coffee", origin: "Ethiopia, Sidamo", variety: "Heirloom Ethiopian", process: "Natural", score: 89, price: "$24/284g", notes: "Strawberry, Blueberry, Grape, Chocolate, Tropical", wow: 65 },
  { name: "Burundi Kibira Honey", producer: "Passenger Coffee", origin: "Burundi, Kayanza", variety: "Red Bourbon", process: "Honey", score: 89, price: "$22/284g", notes: "Peach, Brown sugar, Vanilla, Plum, Almond", wow: 60 },
  { name: "Finca Tamana Castillo", producer: "Tim Wendelboe", origin: "Colombia, Huila", variety: "Castillo", process: "Washed", score: 89, price: "$22/250g", notes: "Caramel, Orange, Milk chocolate, Toffee, Clean", wow: 55 },
  { name: "Rwanda Buf Café Bourbon", producer: "Koppi Roasters", origin: "Rwanda, Nyamasheke", variety: "Red Bourbon", process: "Washed", score: 88, price: "$17/250g", notes: "Red grape, Plum, Floral, Caramel, Tea-like", wow: 55 },
  { name: "Guatemala Huehuetenango Pacamara", producer: "Regalia Coffee", origin: "Guatemala, Huehuetenango", variety: "Pacamara", process: "Washed", score: 88, price: "$25/340g", notes: "Plum, Dark chocolate, Almond, Citrus zest, Creamy", wow: 58 },
  { name: "Sumatra Gayo Wet-Hulled", producer: "Brandywine Coffee Roasters", origin: "Indonesia, Aceh Gayo Highlands", variety: "Catimor/Typica", process: "Wet-Hulled (Giling Basah)", score: 86, price: "$19/340g", notes: "Cedar, Dark chocolate, Tobacco, Earth, Mushroom, Herbs", wow: 45 },
  { name: "Brazil Mogiana Natural", producer: "Orfeo Coffee", origin: "Brazil, Mogiana São Paulo", variety: "Yellow Bourbon", process: "Natural", score: 85, price: "$14/340g", notes: "Peanut butter, Dark chocolate, Caramel, Dried fruit", wow: 25 },
];

// ── Top 10 chain rankings ─────────────────────────────────────────────────────
const TOP_CHAINS = [
  { rank: 1, tier: "S", name: "Counter Culture Coffee", hq: "Durham, NC", score: 90, verdict: "The gold standard. Full transparency report every year. Best $15/bag in America." },
  { rank: 2, tier: "S", name: "Onyx Coffee Lab", hq: "Rogers, AR", score: 89, verdict: "Most exciting roaster in America. Competition-winning quality at every price point." },
  { rank: 3, tier: "S", name: "Intelligentsia Coffee", hq: "Chicago, IL", score: 86, verdict: "Invented the third wave. Direct trade pioneer. Still among the best." },
  { rank: 4, tier: "S", name: "Blue Bottle Coffee", hq: "Oakland, CA", score: 84, verdict: "Elevated the café experience. Exceptional pour-overs, beautiful spaces." },
  { rank: 5, tier: "A", name: "Stumptown Coffee Roasters", hq: "Portland, OR", score: 80, verdict: "Bridged specialty and mainstream. Hair Bender blend is iconic." },
  { rank: 6, tier: "A", name: "La Colombe Coffee Roasters", hq: "Philadelphia, PA", score: 77, verdict: "Draft latte innovators. Strong sourcing ethics, beautiful cafés." },
  { rank: 7, tier: "A", name: "Verve Coffee Roasters", hq: "Santa Cruz, CA", score: 76, verdict: "Exceptional single origins. Surf-culture aesthetic meets serious coffee." },
  { rank: 8, tier: "A", name: "Equator Coffees", hq: "San Rafael, CA", score: 75, verdict: "First B Corp coffee company. Sourcing ethics are unmatched." },
  { rank: 9, tier: "B", name: "Peet's Coffee", hq: "Emeryville, CA", score: 65, verdict: "The original specialty roaster. Darker roasts than ideal, but consistent." },
  { rank: 10, tier: "C", name: "Starbucks", hq: "Seattle, WA", score: 48, verdict: "Ubiquitous but mediocre. Over-roasted, over-sugared, over-priced." },
];

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function renderBrewSoulHTML(): string {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    applicationCategory: "FoodApplication",
    author: {
      "@type": "Person",
      name: "Tony Greenberg",
      url: `${BASE_URL}/about`,
    },
    publisher: {
      "@type": "Person",
      name: "Tony Greenberg",
      url: BASE_URL,
    },
    dateModified: new Date().toISOString().split("T")[0],
    keywords: [
      "specialty coffee", "coffee catalog", "coffee ratings", "best coffee beans",
      "single origin coffee", "coffee cupping scores", "mold-free coffee",
      "farmer transparency coffee", "coffee chain rankings", "pour over coffee",
      "Gesha coffee", "Ethiopian coffee", "Kenyan coffee", "Panamanian coffee",
      "Tony Greenberg coffee", "BrewSoul",
    ],
    offers: {
      "@type": "AggregateOffer",
      description: "107 specialty coffees curated and scored by Tony Greenberg",
    },
  };

  const coffeeRowsHTML = TOP_COFFEES.map(c => `
    <tr>
      <td><strong>${esc(c.name)}</strong><br><small>${esc(c.producer)}</small></td>
      <td>${esc(c.origin)}</td>
      <td>${esc(c.variety)}</td>
      <td>${esc(c.process)}</td>
      <td>${c.score}</td>
      <td>${esc(c.notes)}</td>
      <td>${esc(c.price)}</td>
      <td>${c.wow}/100</td>
    </tr>`).join("\n");

  const chainRowsHTML = TOP_CHAINS.map(ch => `
    <tr>
      <td>#${ch.rank}</td>
      <td><strong>${esc(ch.name)}</strong></td>
      <td>${ch.hq}</td>
      <td><strong>${ch.tier}</strong></td>
      <td>${ch.score}/100</td>
      <td>${esc(ch.verdict)}</td>
    </tr>`).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(TITLE)}</title>
  <meta name="description" content="${esc(DESCRIPTION)}" />
  <meta name="author" content="Tony Greenberg" />
  <meta name="robots" content="index, follow, archive" />
  <meta name="googlebot" content="index, follow" />
  <link rel="canonical" href="${CANONICAL}" />
  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${esc(TITLE)}" />
  <meta property="og:description" content="${esc(DESCRIPTION)}" />
  <meta property="og:image" content="https://tonygreenberg.com/og-default.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${esc(TITLE)}" />
  <meta property="og:url" content="${CANONICAL}" />
  <meta property="og:site_name" content="Tony Greenberg" />
  <meta property="og:locale" content="en_US" />
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@ThinkTony" />
  <meta name="twitter:creator" content="@ThinkTony" />
  <meta name="twitter:title" content="${esc(TITLE)}" />
  <meta name="twitter:description" content="${esc(DESCRIPTION)}" />
  <meta name="twitter:image" content="https://tonygreenberg.com/og-default.jpg" />
  <meta name="twitter:image:alt" content="${esc(TITLE)}" />
  <!-- JSON-LD Structured Data -->
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  <style>
    body { font-family: 'Source Sans 3', 'Source Sans Pro', -apple-system, sans-serif; max-width: 960px; margin: 0 auto; padding: 2rem 1rem; line-height: 1.7; color: #1a1a1a; background: #FAFAF7; }
    h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 2.2rem; line-height: 1.2; margin-bottom: 0.5rem; }
    h2 { font-family: 'Playfair Display', Georgia, serif; font-size: 1.6rem; margin-top: 2.5rem; border-bottom: 2px solid #D4B96A; padding-bottom: 0.4rem; }
    h3 { font-family: 'Playfair Display', Georgia, serif; font-size: 1.2rem; margin-top: 1.5rem; }
    a { color: #8B6914; }
    .meta { color: #666; font-size: 0.9rem; margin-bottom: 2rem; }
    table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.85rem; }
    th { background: #0A0A10; color: #D4B96A; padding: 0.6rem 0.8rem; text-align: left; font-weight: 600; }
    td { padding: 0.5rem 0.8rem; border-bottom: 1px solid #e8e4d8; vertical-align: top; }
    tr:nth-child(even) td { background: #f5f2eb; }
    .api-box { background: #0A0A10; color: #D4B96A; padding: 1rem 1.5rem; border-radius: 4px; margin: 1.5rem 0; font-family: monospace; font-size: 0.9rem; }
    .api-box a { color: #D4B96A; }
    .cta { background: #8B6914; color: #fff; padding: 0.8rem 1.8rem; border-radius: 4px; display: inline-block; text-decoration: none; font-weight: bold; margin-top: 1rem; }
    .footer { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid #e0e0e0; font-size: 0.9rem; color: #666; }
    .tier-s { color: #2d7a2d; font-weight: bold; }
    .tier-a { color: #1a5fa8; font-weight: bold; }
    .tier-b { color: #8B6914; font-weight: bold; }
    .tier-c { color: #c07000; }
    .tier-d { color: #c04000; }
    .tier-f { color: #a00000; }
    @media (max-width: 600px) { table { font-size: 0.75rem; } th, td { padding: 0.4rem; } }
  </style>
  <!-- Google Search Console Verification -->
  <meta name="google-site-verification" content="LQaaihFDlOKA7Ss4kjGxfoxV4lESbtBfDANA92BMM9k" />
  <meta name="google-site-verification" content="2hxApw8im70U8QDy4paYiyez268CR69g97hfCWoDMGs" />
</head>
<body>
  <article>
    <header>
      <h1>BrewSoul — Coffee Intelligence</h1>
      <p class="meta">By <a href="${BASE_URL}/about">Tony Greenberg</a> · <a href="${CANONICAL}">Interactive Platform</a> · <a href="${CATALOG_JSON_URL}">catalog.json</a> · <a href="${CATALOG_TXT_URL}">catalog.txt</a></p>
      <p><strong>BrewSoul</strong> is Tony Greenberg's curated coffee intelligence platform — a comprehensive database of 107 specialty coffees and 100 coffee chain rankings, scored across cupping quality, flavor complexity, mold testing, farmer transparency, and value. Every entry includes Tony's personal connoisseur note.</p>
    </header>

    <div class="api-box">
      <strong>Machine-Readable Catalog Endpoints</strong><br>
      Full JSON: <a href="${CATALOG_JSON_URL}">${CATALOG_JSON_URL}</a><br>
      Plain Text: <a href="${CATALOG_TXT_URL}">${CATALOG_TXT_URL}</a><br>
      <small>These static files are accessible without JavaScript — use curl, fetch(), or any HTTP client.</small>
    </div>

    <h2>About BrewSoul</h2>
    <p>BrewSoul covers the full spectrum of coffee — from the world's rarest microlots (Hacienda La Esmeralda Gesha at $200/200g, scoring 95/100) to the most shameful commodity frauds. Each coffee entry includes:</p>
    <ul>
      <li><strong>Cupping Score</strong> — SCA-certified or roaster-internal score (0–100)</li>
      <li><strong>Flavor Profile</strong> — Acidity, body, sweetness, complexity, fruitiness, chocolate (each 0–10)</li>
      <li><strong>Tasting Notes</strong> — Specific descriptors (e.g., "Jasmine, Bergamot, Peach, Raw honey")</li>
      <li><strong>Mold Test Status</strong> — Verified (third-party lab), Claims (roaster self-reported), or Untested</li>
      <li><strong>Farmer Transparency Grade</strong> — A through F, based on published sourcing data</li>
      <li><strong>Farmer Share %</strong> — What percentage of the retail price reaches the farmer</li>
      <li><strong>Wow Proxy</strong> — Tony's composite "worth-it" score (0–100)</li>
      <li><strong>Tony's Connoisseur Note</strong> — Personal editorial commentary on each coffee</li>
    </ul>

    <h2>Top Specialty Coffees — Selected Highlights</h2>
    <p>Showing 20 of 107 catalog entries. <a href="${CATALOG_JSON_URL}">Download the full catalog as JSON</a> or <a href="${CATALOG_TXT_URL}">plain text</a>.</p>
    <table>
      <thead>
        <tr>
          <th>Name / Producer</th>
          <th>Origin</th>
          <th>Variety</th>
          <th>Process</th>
          <th>Score</th>
          <th>Tasting Notes</th>
          <th>Price</th>
          <th>Wow</th>
        </tr>
      </thead>
      <tbody>
        ${coffeeRowsHTML}
      </tbody>
    </table>

    <h2>Coffee Chain Rankings — Top 10 of 100</h2>
    <p>BrewSoul ranks 100 coffee chains from S-tier specialty roasters to F-tier commodity chains. Scoring formula: Coffee Quality (30%) + Value (25%) + Sourcing Ethics (20%) + Experience (15%) + Consistency (10%).</p>
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Name</th>
          <th>HQ</th>
          <th>Tier</th>
          <th>Score</th>
          <th>Verdict</th>
        </tr>
      </thead>
      <tbody>
        ${chainRowsHTML}
      </tbody>
    </table>
    <p><a href="${CATALOG_JSON_URL}">See all 100 chain rankings in catalog.json →</a></p>

    <h2>Scoring Methodology</h2>
    <h3>Coffee Scoring</h3>
    <ul>
      <li><strong>Cupping Score</strong> — SCA Q-Grader certified or roaster internal (85+ = specialty grade)</li>
      <li><strong>Mold Test</strong> — Third-party mycotoxin testing (Verified &gt; Claims &gt; Untested)</li>
      <li><strong>Transparency Grade</strong> — Based on published farm data, farmer pay, and sourcing audits</li>
      <li><strong>Scarcity Proxy</strong> — How rare/limited the lot is (affects availability and collectibility)</li>
      <li><strong>Weirdness Score</strong> — How far outside conventional coffee flavor profiles (0 = classic, 10 = avant-garde)</li>
      <li><strong>Wow Proxy</strong> — Composite score weighting cupping score, rarity, flavor complexity, and value</li>
    </ul>
    <h3>Chain Scoring</h3>
    <ul>
      <li><strong>Coffee Quality (30%)</strong> — Actual cup quality, roast skill, freshness</li>
      <li><strong>Value (25%)</strong> — Quality relative to price (QPR)</li>
      <li><strong>Sourcing Ethics (20%)</strong> — Transparency, farmer equity, sustainability certifications</li>
      <li><strong>Experience (15%)</strong> — Ambiance, service, café design</li>
      <li><strong>Consistency (10%)</strong> — Same quality across locations</li>
    </ul>

    <h2>Origins Covered</h2>
    <p>The BrewSoul catalog covers coffees from: Ethiopia (Yirgacheffe, Guji, Bench Maji, Sidamo, Harrar), Kenya (Kiambu, Kirinyaga, Nyeri), Panama (Boquete, Chiriquí), Colombia (Huila, Cundinamarca, Nariño), Yemen (Haraaz Mountains), Indonesia (Aceh Gayo, Sulawesi), Guatemala (Huehuetenango, Antigua), Costa Rica (Tarrazú, Tres Ríos), Rwanda (Nyamasheke, Kayanza), Burundi (Kayanza), Brazil (Mogiana, Sul de Minas), and more.</p>

    <h2>Varieties Covered</h2>
    <p>Gesha/Geisha, SL28, SL34, Heirloom Ethiopian, Sidra, Pink Bourbon, Pacamara, Catuaí, Yellow Bourbon, Red Bourbon, Castillo, Catimor, Typica, Caturra, Yemeni Heirloom (Udaini), Wild Ethiopian, and more.</p>

    <h2>Processing Methods</h2>
    <p>Washed (Wet), Natural (Dry), Honey (Red, Yellow, Black), Anaerobic Natural, Anaerobic Washed, Lactic Anaerobic, Carbonic Maceration, Wet-Hulled (Giling Basah), Proprietary Controlled Fermentation.</p>

    <a class="cta" href="${CANONICAL}">Explore BrewSoul →</a>

    <footer class="footer">
      <p><strong>Tony Greenberg</strong> is Founder &amp; CEO of <a href="https://ramprate.com">RampRate</a> and Founder of <a href="https://impactsoul.is">ImpactSoul</a>. BrewSoul is his personal coffee intelligence platform.</p>
      <p>Machine-readable catalog: <a href="${CATALOG_JSON_URL}">catalog.json</a> · <a href="${CATALOG_TXT_URL}">catalog.txt</a></p>
      <p><a href="${BASE_URL}">← Tony Greenberg</a></p>
    </footer>
  </article>
</body>
</html>`;
}
