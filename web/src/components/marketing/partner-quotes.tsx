// Real client testimonials, ported from legacy client/src/components/
// PartnerQuotes.tsx. Legacy picked a random N per page load (client-side
// `Math.random()`); this renders a deterministic slice instead — SSR-safe
// (no hydration mismatch) and means the quotes are actually present in the
// server-rendered HTML rather than only appearing after a client shuffle.
// Different pages can request a different `offset` for variety.

type Quote = { name: string; title: string; company: string; quote: string };

const ALL_QUOTES: Quote[] = [
  { name: "Paul Sams", title: "COO", company: "Blizzard Entertainment", quote: "RampRate has been my most reliable global resource and is ready to perform for us at a moment's notice. Their inside knowledge and ability to handle high-level complex negotiations helped us move fast." },
  { name: "Phil Wiser", title: "EVP & CTO", company: "ViacomCBS", quote: "They saved us millions, created agility and new budget out of thin air. They are a secret weapon in my tool box for truth, transparency and actionable direction." },
  { name: "Dean Nelson", title: "VP of Global Foundation Services", company: "eBay", quote: "We can count on RampRate to be precise, timely and create millions in value. They are no-nonsense, data driven and responsive to a T." },
  { name: "Robert Gonsalves", title: "Director of Production Operations", company: "Walt Disney Internet Group", quote: "The deal that RampRate got for the Walt Disney Internet Group was one of the best deals in IT services I saw during my tenure at Disney." },
  { name: "Ian Rodgers", title: "CEO, Beats Music (acquired by Apple)", company: "Beats Music", quote: "Within 30 hours of our decision-making, we were fully installed and up and running. Not only did RampRate save us an incredible amount of time, resources, and money." },
  { name: "Peter Borner", title: "Head of IT", company: "Sony Music", quote: "All in all, they made me look like a hero to my executive management. They are a secret weapon." },
  { name: "Richard Titus", title: "EVP BBC / MD Razorfish LA", company: "BBC / Razorfish", quote: "I would recommend either he or his firm unequivocally for business planning, scale or cost containment. Globally astute consummate analysts and deal pros extraordinaire." },
  { name: "Jay Samit", title: "Former EVP", company: "Sony Corporation of America", quote: "In a field filled with prognosticators who claim to know the next great thing, RampRate applies sound business judgment and analytics to assist senior management in making crucial, time-sensitive decisions." },
  { name: "Gary Share", title: "Windows Marketing and Product", company: "Microsoft", quote: "RampRate is an invaluable partner for us. They helped us cut the clutter, gain insight and distill our team's thoughts for over 50 digital media, IT and product studies." },
  { name: "Charles Butler", title: "Director of Network Operations", company: "AOL", quote: "WOW is the best I can say. They lowered overall prices between 17-36% and helped us achieve breakthrough innovative best-of-breed SLA coverage." },
  { name: "Kipras Kazlauskas", title: "Co-Founder", company: "Syntropy", quote: "They paid for themselves by accelerating our growth by years and remain a vital resource for the team." },
  { name: "Wulf Kaal", title: "Entrepreneur & Co-Founder", company: "Menagerie", quote: "Tony Greenberg is fun to work with even in highly contentious and stressful business environments. He has a unique ability to bring out the good and turn even the worst situations around." },
  { name: "Blair Harrison", title: "CEO", company: "Frequency (formerly Viacom)", quote: "Using RampRate as a partner in these decisions is one of the smartest moves a business-minded CTO and management team can make!" },
  { name: "William Quigley", title: "Managing Director", company: "WAX / Clearstone Venture Partners", quote: "Tony and his team are very well connected in the global high-tech community. He is also a generous giver of his time and energy to worthy causes, driving impact to become measurable and reportable." },
  { name: "Ryan Hughes", title: "Digital Operations", company: "National Hockey League", quote: "RampRate did an outstanding job helping us deliver content for a breakthrough pay-per-view feature the NHL is offering hockey fans." },
  { name: "Andrew Robbins", title: "VP of New Media", company: "Miramax", quote: "They work fast, saved us over 40% and months of due diligence which we just didn't have." },
  { name: "Niles Triget", title: "Operations", company: "Thomson Reuters / Delphion", quote: "RampRate was adaptable, brilliant and innovative. Their team stayed on schedule and stayed within the price. We saved millions." },
  { name: "Ron Vaisbort", title: "Executive", company: "Intel / Ivalua / Blackberry", quote: "RampRate defines professionalism and they run a world-class team. They remain on the vanguard — staying on top of all the major digital media trends." },
  { name: "Todd Miller", title: "CIO", company: "SF Chronicle — Hearst Corp", quote: "They bring uniquely rare data and a solid practice to the table. They opened my eyes to the possibilities of outsourcing on a broader scale." },
];

export function PartnerQuotes({ count = 3, offset = 0 }: { count?: number; offset?: number }) {
  const quotes = Array.from({ length: count }, (_, i) => ALL_QUOTES[(offset + i) % ALL_QUOTES.length]);

  return (
    <div className="grid gap-5 sm:grid-cols-3">
      {quotes.map((q) => (
        <figure key={q.name} className="rounded-lg border border-border bg-muted/30 p-6">
          <blockquote className="mb-4 text-sm text-foreground/80 italic">
            &ldquo;{q.quote}&rdquo;
          </blockquote>
          <figcaption className="font-mono text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{q.name}</span>
            <br />
            {q.title}, {q.company}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
