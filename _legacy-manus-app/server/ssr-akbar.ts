/**
 * Server-Side Rendering for the Akbar Cuisine article.
 * Serves full semantic HTML (article prose, JSON-LD, OG tags) to search engine bots
 * and AI crawlers so the content is indexable, quotable, and machine-legible.
 *
 * PERMANENT RULE: Every page unblocked for indexing MUST have server-rendered HTML.
 * Content must be visible in View Source without JavaScript execution.
 */

const BASE_URL = "https://tonygreenberg.com";
const CANONICAL = `${BASE_URL}/akbar`;
const OG_IMAGE = `${BASE_URL}/manus-storage/slider-2_a9ef7e3a.jpg`;

const ARTICLE_TITLE = "Los Angeles Is Losing Its Memory — Akbar Cuisine Refuses to Forget";
const ARTICLE_DESCRIPTION = "While Los Angeles optimizes itself into a content factory, one restaurant on Washington Boulevard still smells like coriander, old corks, warm naan, cardamom, smoke, and polished wood. It does not want your content. It wants your nervous system.";
const ARTICLE_DATE = "2026-05-23";
const ARTICLE_AUTHOR = "Tony Greenberg";

/** Generate the full SSR HTML page for the Akbar article */
export function renderAkbarArticleHTML(): string {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: ARTICLE_TITLE,
    description: ARTICLE_DESCRIPTION,
    image: OG_IMAGE,
    author: {
      "@type": "Person",
      name: ARTICLE_AUTHOR,
      url: `${BASE_URL}/about`,
    },
    publisher: {
      "@type": "Person",
      name: ARTICLE_AUTHOR,
      url: BASE_URL,
    },
    datePublished: ARTICLE_DATE,
    dateModified: new Date().toISOString().split("T")[0],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": CANONICAL,
    },
    articleSection: "Living Well",
    keywords: [
      "Akbar Cuisine",
      "Venice Los Angeles",
      "Indian restaurant",
      "restoration economics",
      "fish tikka",
      "Goan fish curry",
      "wine pairing Indian food",
      "Washington Boulevard",
      "ImpactSoul",
      "Tony Greenberg",
    ],
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${ARTICLE_TITLE} | ${ARTICLE_AUTHOR}</title>
  <meta name="description" content="${escapeAttr(ARTICLE_DESCRIPTION)}" />
  <meta name="author" content="${ARTICLE_AUTHOR}" />
  <meta name="robots" content="index, follow, archive, imageindex" />
  <meta name="googlebot" content="index, follow" />
  <link rel="canonical" href="${CANONICAL}" />

  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escapeAttr(ARTICLE_TITLE)}" />
  <meta property="og:description" content="${escapeAttr(ARTICLE_DESCRIPTION)}" />
  <meta property="og:image" content="${OG_IMAGE}" />
  <meta property="og:image:width" content="1920" />
  <meta property="og:image:height" content="1280" />
  <meta property="og:image:alt" content="Akbar Cuisine of India — traditional Indian dishes on Washington Boulevard, Venice, Los Angeles" />
  <meta property="og:url" content="${CANONICAL}" />
  <meta property="og:site_name" content="Tony Greenberg" />
  <meta property="og:locale" content="en_US" />
  <meta property="article:published_time" content="${ARTICLE_DATE}T00:00:00Z" />
  <meta property="article:modified_time" content="${new Date().toISOString()}" />
  <meta property="article:author" content="${ARTICLE_AUTHOR}" />
  <meta property="article:section" content="Living Well" />
  <meta property="article:tag" content="Akbar Cuisine" />
  <meta property="article:tag" content="Venice Los Angeles" />
  <meta property="article:tag" content="Restoration Economics" />
  <meta property="article:tag" content="Indian Food" />
  <meta property="article:tag" content="Wine Pairing" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@ThinkTony" />
  <meta name="twitter:creator" content="@ThinkTony" />
  <meta name="twitter:title" content="${escapeAttr(ARTICLE_TITLE)}" />
  <meta name="twitter:description" content="${escapeAttr(ARTICLE_DESCRIPTION)}" />
  <meta name="twitter:image" content="${OG_IMAGE}" />
  <meta name="twitter:image:alt" content="Akbar Cuisine of India — Venice, Los Angeles" />

  <!-- JSON-LD Structured Data -->
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>

  <style>
    body { font-family: 'Cormorant Garamond', Georgia, serif; max-width: 720px; margin: 0 auto; padding: 2rem 1rem; line-height: 1.85; color: #F4EDD8; background: #0A0A0F; }
    h1 { font-family: 'Fraunces', Georgia, serif; font-size: 2.4rem; line-height: 1.15; margin-bottom: 0.75rem; color: #F4EDD8; }
    h1 span { color: #C8362A; }
    h2 { font-family: 'Fraunces', Georgia, serif; font-size: 1.7rem; margin-top: 3rem; margin-bottom: 1.5rem; color: #F4EDD8; }
    p { font-size: 1.25rem; margin-bottom: 1.5rem; }
    img { max-width: 100%; height: auto; border-radius: 8px; margin: 2rem 0; }
    a { color: #C9A84C; }
    .meta { color: #9A9080; font-size: 0.9rem; margin-bottom: 2.5rem; font-family: 'IBM Plex Mono', monospace; }
    .eyebrow { font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #C9A84C; margin-bottom: 1rem; }
    blockquote { border-left: 3px solid #C9A84C; padding-left: 1.5rem; margin: 2rem 0; font-style: italic; color: #F4EDD8; font-size: 1.3rem; }
    .pullquote { border-left: 3px solid #E8821A; padding-left: 1.5rem; margin: 2.5rem 0; font-family: 'Fraunces', serif; font-size: 1.3rem; line-height: 1.7; color: #F4EDD8; }
    .highlight { color: #C9A84C; font-weight: 600; font-style: italic; font-size: 1.35rem; }
    .term { color: #C9A84C; font-weight: 600; margin-bottom: 0.3rem; }
    .definition { color: #F4EDD8; margin-bottom: 1.5rem; }
    .wine-card { border-left: 2px solid #C9A84C; padding-left: 1rem; margin-bottom: 1.5rem; }
    .wine-name { font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; color: #C9A84C; }
    .wine-dish { font-family: 'Fraunces', serif; font-size: 1.2rem; color: #F4EDD8; margin: 0.3rem 0; }
    .wine-note { color: #9A9080; font-size: 1.05rem; }
    .impact-box { border-left: 3px solid #00C9B1; padding: 1.5rem; background: rgba(0,201,177,0.03); margin: 2.5rem 0; }
    .closing { color: #C8362A; font-family: 'Fraunces', serif; font-size: 1.3rem; }
    .gold { color: #C9A84C; font-weight: 600; }
    hr { border: none; border-top: 1px solid rgba(201,168,76,0.2); margin: 3rem 0; }
    .article-footer { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid rgba(201,168,76,0.2); font-size: 0.9rem; color: #9A9080; }
  </style>
  <!-- Google Search Console Verification -->
  <meta name="google-site-verification" content="LQaaihFDlOKA7Ss4kjGxfoxV4lESbtBfDANA92BMM9k" />
  <meta name="google-site-verification" content="2hxApw8im70U8QDy4paYiyez268CR69g97hfCWoDMGs" />
</head>
<body>
  <article>
    <header>
      <p class="eyebrow">A Field Report on Restoration Economics</p>
      <h1>${ARTICLE_TITLE.replace("Akbar Cuisine", "<span>Akbar Cuisine</span>")}</h1>
      <p class="meta">By <a href="${BASE_URL}/about">${ARTICLE_AUTHOR}</a> · Published May 2026 · 7 min read · <a href="${CANONICAL}">Read the full interactive version</a></p>
      <p><em>While Los Angeles optimizes itself into a content factory, one restaurant on Washington Boulevard keeps doing the thing modern dining forgot: restore\u00A0people.</em></p>
    </header>

    <figure>
      <img src="${BASE_URL}/manus-storage/gallery-1_562d2f35.jpg" alt="Akbar Cuisine of India — Washington Boulevard — Venice, Los Angeles" width="1200" height="800" sizes="(max-width: 768px) 100vw, 1200px" loading="lazy" />
      <figcaption>Akbar Cuisine of India · Washington Boulevard · Venice, Los\u00A0Angeles</figcaption>
    </figure>

    <section id="the-nervous-system">
      <h2>The Nervous System</h2>

      <blockquote>"Every legendary restaurant eventually develops one mythological figure quietly holding the entire organism together while pretending they are merely doing their\u00A0job."</blockquote>

      <p>Restaurants do not actually run on food. They run on nervous systems. And at Akbar, the nervous system has a name: JC. He stands exactly where friction becomes hospitality — absorbing pressure from both sides before customers ever feel it. He remembers people the old way. Human memory. Not database\u00A0memory.</p>

      <p>He has quietly regulated the emotional weather of Akbar for decades. The timing of water arriving. The pacing between courses. The calm that radiates outward from his presence like heat from a clay oven. You do not notice what JC does until you eat somewhere he is not — and then you feel the absence like a missing\u00A0frequency.</p>

      <p>The garlic naan arrives at the precise moment your conversation pauses. It tears with exactly the right resistance — layers of technique compressed into architecture. Steam rises carrying ghee and roasted garlic. The fish tikka is not protein. It is time made edible: hours of yogurt and spice marination penetrating deep into the flesh, then the violence of the tandoor transforming patience into char. The green chutney beside it tastes\u00A0photosynthetic.</p>

      <p>The bhartha — velvet dragged through embers. Roasted eggplant collapsed into tomatoes and onions with a spice profile calibrated across generations. The tamarind carries molasses-dark bass notes. The rice absorbs sauce without surrendering structural\u00A0integrity.</p>

      <p class="highlight">JC changes flavor indirectly — through timing, through calm, through the rhythm of a room held\u00A0steady.</p>
    </section>

    <section id="stars-and-death">
      <h2>3.8 Stars and the Death of Memory</h2>

      <p>Akbar has a 3.8 on Google. Let that land. A place that has been holding this neighborhood together for decades — through recessions, through fires, through the complete cultural lobotomy of Venice — and the algorithm gives it the same score as a fast-casual poke\u00A0bowl.</p>

      <p>Modern review systems reward stimulation instead of depth. They reward lighting, content engineering, visual seduction — the choreography of appearing interesting rather than the discipline of being nourishing. A restaurant that photographs well scores higher than one that feeds you well. A place optimized for the first visit outranks a place optimized for the\u00A0thousandth.</p>

      <p>Akbar does not perform for cameras. The room smells faintly of decades — cardamom embedded in the walls, ghee vapor in the ceiling tiles, the particular warmth of a space that has held ten thousand conversations. This is not something you can rate on a five-point\u00A0scale.</p>

      <p class="term">Ritual over novelty.</p>
      <p class="definition">The Goan fish curry does not require a seasonal update. The menu has not changed because the menu does not need to change. It is a signal maintained across\u00A0time.</p>

      <p class="term">Trust over stimulation.</p>
      <p class="definition">You do not discover Akbar. You are brought here by someone who trusts you enough to share it. The recommendation is the\u00A0review.</p>

      <p class="term">Returning over arriving.</p>
      <p class="definition">The thousandth visit reveals what the first visit cannot. Emotional permanence is invisible to algorithms that only measure\u00A0novelty.</p>

      <p class="highlight">Places that survive long enough to become part of people's lives do not need five stars. They need\u00A0witnesses.</p>
    </section>

    <section id="ebay-deal">
      <h2>The Night the eBay Deal Almost Killed Us</h2>

      <p>In 2004, I was running a technology company through one of those deals that either makes you or unmakes you. The eBay transaction. Months of legal architecture that would make a securities lawyer weep into his Macallan. The kind of stress that lives in your jaw at 3 AM and your lower back by\u00A0noon.</p>

      <p><em>Every Thursday night, without fail, we went to\u00A0Akbar.</em></p>

      <p>Not because it was convenient. Because JC would see us walk in — shoulders up, jaws locked, cortisol radiating — and within four minutes the table would have water, warm naan, and a silence that said: you are safe here. Take your\u00A0time.</p>

      <p>The Goan fish curry would arrive and the room would smell like coconut milk reducing over low heat, tamarind darkening at the edges, curry leaves releasing their last green breath into the steam. Somewhere between the second naan and the third glass of an improbable Turley Zin, the deal would stop feeling like it might kill us. The food was not peripheral to survival. It was\u00A0infrastructure.</p>

      <div class="pullquote">The deal closed. We survived. And JC never once asked what we did for a living. He just kept the room\u00A0steady.</div>

      <p>Twenty years later, the restaurant is still there. JC is still there. Still holding the organism together while pretending he is merely doing his\u00A0job.</p>
    </section>

    <section id="wine-pairings">
      <h2>The Liquid Treasure Chest</h2>

      <p><em>Forget the lazy "pair spicy food with Riesling" algorithm. These are improbable marriages — cult Zinfandels against tandoori smoke, grower Champagne with butter-soaked naan, Brunello contemplating mortality alongside\u00A0bhartha.</em></p>

      <div class="wine-card">
        <p class="wine-name">Turley Old Vines Zinfandel</p>
        <p class="wine-dish">with Tandoori Prawns</p>
        <p class="wine-note">Eighty-year-old vines from Paso Robles. The brambly dark fruit absorbs tandoori smoke the way old leather absorbs rain. Improbable.\u00A0Transcendent.</p>
      </div>

      <div class="wine-card">
        <p class="wine-name">Pierre Gimonnet Grower Champagne</p>
        <p class="wine-dish">with Garlic Naan</p>
        <p class="wine-note">Not Moët. Not Veuve. A farmer's champagne — chalky, precise, almost austere — against butter-drenched bread still radiating clay-oven heat. The collision is\u00A0sacred.</p>
      </div>

      <div class="wine-card">
        <p class="wine-name">Brunello di Montalcino (Biondi-Santi)</p>
        <p class="wine-dish">with Bhartha</p>
        <p class="wine-note">Smoky eggplant dragged through embers meets a wine that spent five years in Slavonian oak contemplating mortality. Both taste like patience\u00A0rewarded.</p>
      </div>

      <div class="wine-card">
        <p class="wine-name">Restrained Oregon Pinot (Cristom)</p>
        <p class="wine-dish">with Goan Fish Curry</p>
        <p class="wine-note">Willamette Valley earth and coconut-tamarind broth. The pinot's forest-floor minerality catches the curry's molasses-dark bass notes\u00A0mid-fall.</p>
      </div>

      <div class="wine-card">
        <p class="wine-name">Albariño (Do Ferreiro)</p>
        <p class="wine-dish">with Sea Bass Tikka</p>
        <p class="wine-note">Galician salt spray and charred fish flesh. The Atlantic meeting the Arabian Sea through\u00A0glass.</p>
      </div>

      <div class="wine-card">
        <p class="wine-name">Vouvray Demi-Sec (Huet)</p>
        <p class="wine-dish">with Vegetable Samosas</p>
        <p class="wine-note">Loire honeyed quince against cumin-spiked potato and pea. The sweetness doesn't compete — it genuflects before the\u00A0spice.</p>
      </div>
    </section>

    <section id="what-akbar-could-become">
      <div class="impact-box">
        <h2>What Akbar Could Become</h2>

        <p>Imagine the spice blends packaged. Not mass-produced — numbered. Small-batch runs in hand-stamped tins. The Goan fish curry base as a concentrate. The tandoori marinade in glass jars with wax seals. A quarterly subscription: four spice architectures, a card explaining the lineage of each blend, a QR code linking to JC telling the story of how each dish entered the\u00A0menu.</p>

        <p>This is not a franchise play. It is a preservation play. The knowledge inside Akbar's kitchen is irreplaceable — and currently exists only in the hands and memory of people who will not be here forever. Packaging is not commercialization. It is\u00A0archiving.</p>

        <p>At ImpactSoul, we fund restoration infrastructure. Akbar is not a portfolio company. But it is proof of concept — evidence that businesses built on depth rather than extraction can survive for decades in a market that rewards the\u00A0opposite.</p>
      </div>
    </section>

    <section id="closing">
      <hr />

      <h2>The Question That Remains</h2>

      <p class="closing">In a city that is losing its memory, who is holding\u00A0yours?</p>

      <p>Not memory in the nostalgic sense. Memory in the cellular sense. The smell of cumin hitting hot oil. The sound of naan tearing. The specific silence of a room where no one is performing. The weight of a wine glass held by someone who has stopped checking their\u00A0phone.</p>

      <p>JC will not remember your name the first time. He will remember it the second. By the third visit, you are no longer a customer. You are someone he is holding space for. That is the difference between a restaurant and a\u00A0place.</p>

      <p class="gold">Akbar Cuisine of India. Washington Boulevard. Venice, Los Angeles. Still there. Still restoring. JC still at the\u00A0door.</p>

      <p><em>The reservation is yours to\u00A0make.</em></p>
    </section>

    <footer class="article-footer">
      <p><strong>${ARTICLE_AUTHOR}</strong> is Founder &amp; CEO of <a href="https://ramprate.com">RampRate</a> and Founder of <a href="https://impactsoul.is">ImpactSoul</a>. Author of <em>boy in the human</em>.</p>
      <p><a href="${CANONICAL}">View the full interactive version with images and design →</a></p>
      <p><a href="${BASE_URL}/blog">Read more essays →</a></p>
    </footer>
  </article>
</body>
</html>`;

  return html;
}

function escapeAttr(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
