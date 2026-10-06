import Image from "next/image";
import { Mail } from "lucide-react";

// Legacy BlogPost.tsx "Elixir of Life Collection" block, shown only on
// `elixir-of-life-device-and-journey` (after Next Steps, as on live). Copy
// unchanged; images rescued into Sanity by
// scripts/rescue-2026-10-07-elixir-images.ts (the QR codes were made by an
// outside service on live; saved once instead).
const PRODUCTS = [
  {
    name: "Golden Rudraksha Pendant",
    text: "The pendant that started the journey. Based on the therapeutic properties of 33 sacred waters, 33 crystals, and 15,000 quantum frequencies—a dynamic elixir that stimulates the chakras, increases vital energy, and harmonizes emotions.",
    image: { src: "https://cdn.sanity.io/images/a3q1cyqs/production/68228649dea430737fe5a2575526a813d1b833b2-498x498.webp", width: 498, height: 498, alt: "Golden Rudraksha Pendant by Elixir of Life" },
    qr: { src: "https://cdn.sanity.io/images/a3q1cyqs/production/c2a25adfae8840454d70ab6b434995bd60db5053-360x360.png", label: "Scan to order — Golden Rudraksha", alt: "QR Code to order Golden Rudraksha" },
    url: "https://www.elixiroflife.fr/en/product-page/golden-rudraksha",
  },
  {
    name: "Alchemy Meditation Therapy Set",
    text: "A complete ceremonial set for therapists and practitioners. Includes the meditation device, vitalizers, and pendant—everything needed to create a sacred space for healing work and group ceremonies.",
    image: { src: "https://cdn.sanity.io/images/a3q1cyqs/production/78842648a244dc99703f93d33717708991a1ac60-498x414.webp", width: 498, height: 414, alt: "Alchemy Meditation Therapy Set by Elixir of Life" },
    qr: { src: "https://cdn.sanity.io/images/a3q1cyqs/production/fd052cb86640bf95c5e013a71ebafe9c285060aa-360x360.png", label: "Scan to order — Meditation Set", alt: "QR Code to order Alchemy Meditation Therapy Set" },
    url: "https://www.elixiroflife.fr/en/product-page/elixir-of-life-alchemy-meditation-therapy",
  },
];

const ORDER_MAIL =
  "mailto:tony@tonygreenberg.com?subject=Elixir%20of%20Life%20%E2%80%94%20Bulk%20Order%20Inquiry&body=Hi%20Tony%2C%0A%0AI'm%20interested%20in%20ordering%20Elixir%20of%20Life%20pieces.%0A%0AQuantity%3A%0AWhich%20pieces%3A%0APurpose%20(ceremony%2C%20gifts%2C%20personal)%3A%0A%0AThanks!";

export function ElixirCollection() {
  return (
    <section aria-labelledby="elixir-title" className="mb-10">
      <h2 id="elixir-title" className="mb-4 border-b border-brand-gold/20 pb-1.5 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
        The Elixir of Life Collection
      </h2>
      <p className="mb-6 font-essay text-base leading-[1.85] text-essay-ink italic">
        Water is the universe&apos;s most precious resource—the original healer, the first medicine, the memory of the earth itself.
        Every sacred tradition understood this. The Elixir of Life collection, handcrafted in France by Richard Poiré, channels 33
        sacred waters, 33 crystals, and 15,000 quantum frequencies into objects that don&apos;t just hold water—they remember it.
        Spreading love and healing throughout the universe, one drop at a time.
      </p>
      <div className="mb-8 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
        {PRODUCTS.map((p) => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="overflow-hidden rounded-md border border-brand-gold/15 bg-card no-underline transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(139,105,20,0.15)]"
          >
            <div className="flex justify-center bg-white p-6">
              <Image src={p.image.src} alt={p.image.alt} width={p.image.width} height={p.image.height} sizes="(max-width: 640px) 90vw, 360px" className="h-auto max-h-70 w-auto object-contain" />
            </div>
            <div className="px-6 py-5">
              <h3 className="mb-2 font-heading text-xl text-foreground">{p.name}</h3>
              <p className="mb-4 text-[0.95rem] leading-relaxed text-muted-foreground">{p.text}</p>
              <p className="font-mono text-sm text-brand-gold">€199.00</p>
            </div>
          </a>
        ))}
      </div>
      <div className="mb-8 flex flex-wrap justify-center gap-10 rounded-md border border-brand-gold/15 bg-brand-gold/3 px-6 py-6">
        {PRODUCTS.map((p) => (
          <div key={p.qr.label} className="text-center">
            <p className="mb-2 font-mono text-xs tracking-[0.15em] text-brand-gold uppercase">{p.qr.label}</p>
            <Image
              src={p.qr.src}
              alt={p.qr.alt}
              width={160}
              height={160}
              className="mx-auto size-40 rounded-lg border border-brand-gold/15 bg-[#FAFAF7] p-2"
            />
          </div>
        ))}
      </div>
      <div className="rounded-md border border-brand-gold/20 bg-linear-135 from-[#FEFCF7] to-[#F5F0E8] px-6 py-6 text-center dark:from-card dark:to-card">
        <p className="mb-3 font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">Order through Tony</p>
        <p className="mb-2 text-[0.95rem] leading-relaxed text-foreground/85">
          Special pricing and shipping when you order through me. Especially for bulk orders of 10 or more—perfect for ceremonies,
          retreats, healing circles, and meaningful gifts that carry the memory of sacred water.
        </p>
        <p className="mb-5 text-[0.95rem] leading-relaxed text-foreground/85">Reach out directly and I&apos;ll arrange everything with Richard in France.</p>
        <a
          href={ORDER_MAIL}
          className="inline-flex min-h-11 items-center gap-2 rounded-xs bg-brand-gold px-6 font-mono text-xs tracking-widest text-white uppercase no-underline hover:opacity-90"
        >
          <Mail aria-hidden="true" className="size-3.5" />
          Contact Tony for special pricing
        </a>
      </div>
    </section>
  );
}
