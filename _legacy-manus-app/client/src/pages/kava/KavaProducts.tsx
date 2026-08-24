import { useState } from "react";
import SEO from "@/components/SEO";
import KavaLayout, {
  KAVA,
  KavaHero,
  KavaSection,
  KavaSectionTitle,
  KavaCard,
  KavaBadge,
  KavaDivider,
  KavaDisclaimer,
} from "./KavaLayout";

interface Product {
  name: string;
  cultivar?: string;
  chemotype?: string;
  klPercent?: string;
  price: string;
  buyUrl: string;
  priRating: number;
  valueNote: string;
  extra?: string;
}

interface Category {
  id: string;
  title: string;
  desc: string;
  products: Product[];
}

const CATEGORIES: Category[] = [
  {
    id: "ceremonial",
    title: "Ceremonial Grade Traditional Powder",
    desc: "The gold standard for PRI ceremony — noble cultivar, aqueous preparation.",
    products: [
      {
        name: "Kalm with Kava — Borongoru Reserve",
        cultivar: "Borongoru, Vanuatu, Noble",
        chemotype: "2-4-6-5-3-1 (heady-heavy balance)",
        klPercent: "~10-12%",
        price: "$35/8oz, $68/1lb",
        buyUrl: "https://kalmwithkava.com",
        priRating: 5,
        valueNote: "Best overall quality-to-price ratio; most recommended for first-time facilitators.",
      },
      {
        name: "Bula Kava House — Mo'i 'Awa",
        cultivar: "Mo'i, Royal Hawaiian, Noble",
        chemotype: "4-5-6-2-3-1 (clean heady)",
        price: "$38/8oz, $72/1lb",
        buyUrl: "https://bulakavahouse.com",
        priRating: 5,
        valueNote: "Premium price justified by unique royal Hawaiian cultivar lineage; cleanest heady profile available.",
      },
      {
        name: "Wakacon — Fijian Waka",
        cultivar: "Fijian Waka, Noble",
        chemotype: "4-6-2-3-5-1",
        price: "$28/8oz, $54/1lb",
        buyUrl: "https://amazon.com/wakacon",
        priRating: 4,
        valueNote: "Strongest USD per mg of kavalactones ratio in the market; best entry point for budget-conscious programs.",
      },
      {
        name: "Nakamal at Home — Multi-Cultivar Library",
        cultivar: "15+ noble cultivars (Vanuatu, Fiji, Tonga, Samoa)",
        price: "$30-$48/8oz depending on cultivar",
        buyUrl: "https://nakamalathome.com",
        priRating: 4,
        valueNote: "Best resource for facilitator education and chemotype comparison; widest cultivar selection from a single source.",
      },
    ],
  },
  {
    id: "fresh",
    title: "Fresh Frozen — Highest Potency",
    desc: "Harvest to freeze under 4 hours. The most authentic expression of kava available commercially.",
    products: [
      {
        name: "Root of Happiness — Fresh Frozen Hawaiian 'Awa",
        extra: "Weekly harvest cycle, harvest to freeze under 4 hours",
        price: "~$65-$80/1lb frozen",
        buyUrl: "https://rootofhappinesskava.com",
        priRating: 5,
        valueNote: "Most potent available; significantly higher than dried powder; experienced facilitators only; worth the premium for advanced ceremony.",
      },
    ],
  },
  {
    id: "rtd",
    title: "RTD Beverages",
    desc: "Ready-to-drink options for introduction and portability. Not ceremonial grade.",
    products: [
      {
        name: "Leilo — Kava Can",
        extra: "~50mg kavalactones/can, GMP facility, FDA-registered",
        price: "$4-$5/can, $48/12-pack",
        buyUrl: "https://leilo.com",
        priRating: 3,
        valueNote: "Intro level only; not ceremonial grade; appropriate for participant education sessions.",
      },
      {
        name: "Kavahana — Kava Nectar Instant Powder",
        extra: "Cold-pressed noble root juice, zero sugar, zero sweeteners, no fiber, no straining",
        price: "~$45/30 servings ($1.50/serving)",
        buyUrl: "https://shop.kavahana.com",
        priRating: 4,
        valueNote: "Best RTD option for portability and clean label; LA flagship bar; works on-the-go for facilitator prep.",
      },
      {
        name: "Mitra-9 — Kava 2.0 Seltzer",
        extra: "Flavors: Orange Dreamsicle, Coconut Lychee, Lemonade, Strawberry Watermelon",
        price: "$4-$6/can",
        buyUrl: "https://mitra9brands.com",
        priRating: 2,
        valueNote: "Mainstream sober-curious market only; not appropriate for ceremonial context.",
      },
      {
        name: "Psychedelic Water",
        extra: "Organic kava + green tea leaf + damiana leaf. WARNING: contains caffeine from green tea.",
        price: "$4-$5/can",
        buyUrl: "https://psychedelicwater.com",
        priRating: 2,
        valueNote: "Broad mainstream distribution (130+ Urban Outfitters). Caffeine content disqualifies from pre-ceremony use.",
      },
    ],
  },
  {
    id: "supplements",
    title: "Supplements",
    desc: "For individual daily therapeutic use between sessions. Not a ceremonial substitute.",
    products: [
      {
        name: "Gaia Herbs — Kava Capsules",
        extra: "~75mg KL/capsule, aqueous extraction, certified organic",
        price: "$28-$35/60 capsules",
        buyUrl: "https://gaiaherbs.com",
        priRating: 4,
        valueNote: "Best for individual daily anxiety support between sessions; aqueous extraction preferred over ethanolic.",
      },
      {
        name: "NOW Foods — Kava Extract",
        extra: "Standardized 30% kavalactones",
        price: "~$20-$28/60 capsules",
        buyUrl: "https://nowfoods.com",
        priRating: 3,
        valueNote: "Best value supplement for broad availability; appropriate for general anxiety support outside ceremony.",
      },
    ],
  },
  {
    id: "bars",
    title: "Kava Bars — Key US Locations",
    desc: "In-person kava experiences across the United States.",
    products: [
      {
        name: "Ohana Kava Bar — Colorado",
        extra: "Multiple Denver locations. Traditional + community format, ceremonial-minded, noble-only policy.",
        price: "$5-$12/shell",
        buyUrl: "#",
        priRating: 5,
        valueNote: "Top ceremonial-minded bar in the continental US.",
      },
      {
        name: "Bula Kava House — Portland, Oregon",
        extra: "Traditional Fijian, strict noble-only policy, most authentically ceremonial bar in the continental US.",
        price: "$4-$10/shell",
        buyUrl: "https://bulakavahouse.com",
        priRating: 5,
        valueNote: "Most authentically ceremonial bar experience available.",
      },
      {
        name: "Kavahana LA — Los Angeles, California",
        extra: "Premium modern format, facilitator-friendly, cold-pressed kava on tap.",
        price: "$8-$15/shell",
        buyUrl: "https://kavahana.com",
        priRating: 4,
        valueNote: "Best modern kava bar experience on the West Coast.",
      },
      {
        name: "Local 'Awa Bars — Hawaii statewide",
        extra: "Authentic lineage, traditional preparation.",
        price: "$5-$8/shell",
        buyUrl: "#",
        priRating: 5,
        valueNote: "Cheapest and most authentic expression available in the US.",
      },
    ],
  },
];

function Stars({ count }: { count: number }) {
  return (
<div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          className="w-4 h-4 rounded-full"
          style={{
            backgroundColor: n <= count ? KAVA.saffron : KAVA.sandMuted,
          }}
        />
      ))}
    </div>
  );
}

export default function KavaProducts() {
  const [activeCategory, setActiveCategory] = useState("ceremonial");

  const category = CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];

  return (
    <KavaLayout>
      <SEO
        title="Kava Products — Sourcing Guide"
        description="A guide to kava products: traditional powder, instant, tinctures, and what to look for."
        path="/kava/products"
        keywords="Tony Greenberg, kava products, kava powder, kava sourcing, kava tincture"
        indexable={true}
      />
      <KavaHero
        eyebrow="Module 9"
        title="Product Index"
        subtitle="Ceremonial powders, fresh frozen, RTD beverages, supplements, and kava bars — all with PRI ratings, USD pricing, and buy links."
      />

      {/* ── Category Tabs ── */}
      <KavaSection>
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
              style={{
                backgroundColor: activeCategory === c.id ? KAVA.saffron : "#fff",
                color: activeCategory === c.id ? "#fff" : KAVA.ink,
                border: `1px solid ${activeCategory === c.id ? KAVA.saffron : KAVA.sandMuted}`,
              }}
            >
              {c.title.split("—")[0].trim()}
            </button>
          ))}
        </div>

        {/* ── Category Description ── */}
        <div className="mb-6">
          <KavaSectionTitle>{category.title}</KavaSectionTitle>
          <p className="text-base" style={{ lineHeight: 1.75, color: KAVA.ink, opacity: 0.7 }}>
            {category.desc}
          </p>
        </div>

        {/* ── Products ── */}
        <div className="space-y-4">
          {category.products.map((p) => (
            <KavaCard key={p.name}>
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <h3
                  className="font-bold text-lg"
                  style={{ fontFamily: "'Fraunces', serif", color: KAVA.ink }}
                >
                  {p.name}
                </h3>
                <Stars count={p.priRating} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {p.cultivar && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide" style={{ color: KAVA.saffron }}>
                      Cultivar
                    </p>
                    <p className="text-sm" style={{ color: KAVA.ink }}>{p.cultivar}</p>
                  </div>
                )}
                {p.chemotype && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide" style={{ color: KAVA.saffron }}>
                      Chemotype
                    </p>
                    <p className="text-sm font-mono" style={{ color: KAVA.ink }}>{p.chemotype}</p>
                  </div>
                )}
                {p.klPercent && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide" style={{ color: KAVA.saffron }}>
                      KL%
                    </p>
                    <p className="text-sm" style={{ color: KAVA.ink }}>{p.klPercent}</p>
                  </div>
                )}
                {p.extra && (
                  <div className="sm:col-span-2">
                    <p className="text-xs font-bold uppercase tracking-wide" style={{ color: KAVA.saffron }}>
                      Details
                    </p>
                    <p className="text-sm" style={{ color: KAVA.ink, lineHeight: 1.75 }}>{p.extra}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3" style={{ borderTop: `1px solid ${KAVA.sandMuted}` }}>
                <div>
                  <p className="font-bold text-lg" style={{ color: KAVA.saffron }}>
                    {p.price}
                  </p>
                  <p className="text-xs" style={{ color: KAVA.ink, opacity: 0.5 }}>
                    PRI Rating: {p.priRating}/5
                  </p>
                </div>
                {p.buyUrl !== "#" && (
                  <a
                    href={p.buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg text-sm font-bold text-white"
                    style={{ backgroundColor: KAVA.saffron }}
                  >
                    Buy Now
                  </a>
                )}
              </div>

              <p
                className="text-sm mt-3 pt-3"
                style={{ borderTop: `1px solid ${KAVA.sandMuted}`, lineHeight: 1.75, color: KAVA.ink, opacity: 0.6 }}
              >
                <strong>Value note:</strong> {p.valueNote}
              </p>
            </KavaCard>
          ))}
        </div>
      </KavaSection>

      <KavaDisclaimer />
    </KavaLayout>
  );
}
