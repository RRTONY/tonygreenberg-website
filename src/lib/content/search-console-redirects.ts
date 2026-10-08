// Old addresses Google still sends people to (Search Console, pages with
// impressions in the last 16 months, pulled 2026-10-09) that the new site
// answered with a 404. Live shows its own "404" page for all of them and then
// sends the visitor home; these send them to the page they were looking for.
// Essays were matched by title (same essay, shorter WordPress-era address);
// old WordPress category, tag and paging addresses go to the essay archive.
// Left as 404 on purpose (no matching page): /library, /impact, /health,
// /shop, /fauxtony, /built-on-manus, /portfolio, /terms, /members,
// /request-a-password, /the-right-numbers-supplier, /blog/the-case-file-dr-samuel-lee.
// Read by next.config.ts, after LEGACY_POST_REDIRECTS (legacy-post-redirects.ts).
export const SEARCH_CONSOLE_REDIRECTS: [source: string, destination: string][] = [
  // Searches for "tony greenberg" land here (808 impressions): the old About page.
  ["/transforming-industries-and-perceptions-tonyg", "/about"],
  ["/hiding-fees-in-the-transparent-age-is-just-bad-business", "/blog/hiding-fees-tips-in-the-transparent-age"],
  ["/ode-to-kusaki-become-culinary-masterpieces", "/blog/an-ode-to-kusaki-where-plants-become-culinary-masterpieces"],
  ["/indignance-in-the-wake-of-covid-19", "/blog/more-ignorance-or-indignance-in-the-wake-of-covid-19"],
  ["/innovative-thinking-with-tony-greenberg", "/blog/innovative-thinking-with-tony-greenberg-scale-up-show"],
  ["/fitness-fraud-dmn8-gym-trap", "/blog/trap-how-dmn8-gym-became-a-poster-child-for-fitness-fraud"],
  ["/6-act-of-speech", "/blog/6-act-of-speech-speaking-as-a-tool"],
  ["/arithmetic-of-relationships-mutual-net-profit", "/blog/the-arithmetic-of-relationships"],
  [
    "/forever-chemicals-in-my-blood-what-i-learned-testing-for-pfas-and-microplastics",
    "/blog/forever-chemicals-in-my-blood-pfas-and-microplastics",
  ],
  ["/2nd-mastering-human-and-business-development", "/blog/mastering-human-and-business-development"],
  ["/building-services-market-the-human-era-2", "/blog/building-services-market-transhuman-era"],
  [
    "/mastering-business-development-the-art-of-the-no-that-opens-the-real-door",
    "/blog/mastering-bd-the-art-of-the-no-that-opens-the-real-door",
  ],
  ["/tug-war-ethical-economic-green-decisions", "/blog/the-tug-of-war-ethical-vs-economic-decisions"],
  ["/luz-lounge-where-loyalty-goes-die-groupon-deals", "/blog/luz-lounge-where-loyalty-goes-to-die-groupon"],
  [
    "/break-out-the-buggy-whips-is-now-the-tipping-point-for-streaming-video",
    "/blog/break-buggy-whip-now-tipping-for-streaming-video",
  ],
  ["/boiling-the-human-h-summit-transcript-harvard-kurzweil", "/blog/boiling-the-human-summit-harvard-kurzweil"],
  ["/2013/02/17/origen-restaurant-oaxacas-humble-servant-of-the-terroir", "/blog/origen-restaurant"],
  ["/blog/molecule-as-mirror-10-the-doorway", "/blog/molecule-as-mirror-11-the-doorway"],
  ["/elixir", "/blog/elixir-of-life-device-and-journey"],

  // Pages that moved.
  ["/pick-up", "/pick-up-the-phone"],
  ["/find-my/attachment-style", "/find-your-attachment-style"],
  ["/psychedelic-readiness-index/calibration", "/pri-calibration"],
  ["/psychedelic-readiness-index/efficacy", "/pri-efficacy"],
  // Same as the bare /youve-been-reported redirect in next.config.ts.
  ["/manifesto/youve-been-reported", "/"],
  ["/home", "/"],
  ["/default-home-2", "/"],

  // WordPress-era category, tag and paging addresses.
  ["/business", "/blog/category/business-capital"],
  ["/business/page/:n", "/blog/category/business-capital"],
  ["/:category(uncategorized|technology|personal|featured|trust|cloud|finances|science|wine-spirits|blogroll)", "/blog"],
  ["/:category(uncategorized|technology|personal|featured|trust|cloud|finances|science|wine-spirits)/page/:n", "/blog"],
  ["/blog/page/:n", "/blog"],
  ["/tag/:tag", "/blog"],
];
