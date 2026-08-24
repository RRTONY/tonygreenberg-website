import { useRef } from "react";

interface TimelineEvent {
  date: string;
  label: string;
  description: string;
  type: "career" | "harm" | "legal" | "future";
}

const events: TimelineEvent[] = [
  {
    date: "2013",
    label: "Board Certified",
    description: "Lee earns board certification from the American Board of Psychiatry and Neurology after residencies at Cedars-Sinai and the University of Washington. Works as a staff psychiatrist at Kaiser Permanente.",
    type: "career",
  },
  {
    date: "2018–2022",
    label: "Medical Director, Sedona",
    description: "Serves as medical director at a licensed treatment center in Sedona, Arizona. Begins developing the 'Heart Protocol' — a proprietary stack of MDMA, ketamine, psilocybin, and phenibut.",
    type: "career",
  },
  {
    date: "2021–2024",
    label: "Medical Director, AWKN Ranch / Within Center",
    description: "Becomes medical director at Within/AWKN Ranch in Austin, Texas. Prior harms to participants reported at this facility. Builds 'Eternal Life Tribe' — 4,000+ paying members at $55/month.",
    type: "harm",
  },
  {
    date: "2024",
    label: "2 Million Followers",
    description: "Lee's social media following reaches 2 million across platforms. Podcast, speaking circuit, and branded ceremonies operating at scale. The Heart Protocol is his signature product.",
    type: "career",
  },
  {
    date: "Feb 10, 2025",
    label: "Tina Sodhi Dies",
    description: "Tina Sodhi, 51 — Indian immigrant, Art of Breathing founder — pays $2,000 to attend a three-day Heart Protocol retreat at Sabia Wellness House on Flamingo Way, Miami Beach. She is found unresponsive in a rooftop infrared sauna. Pronounced dead at the scene.",
    type: "harm",
  },
  {
    date: "Jul 2025",
    label: "Medical Examiner Ruling",
    description: "Miami-Dade Medical Examiner rules cause of death: hyponatremic dehydration from a combination of MDMA, ketamine, and DMT — plus a ZenCleanz parasite cleanse administered at Lee's instruction — in prolonged sauna confinement.",
    type: "legal",
  },
  {
    date: "Sep 2025",
    label: "Texas Medical Board Complaint",
    description: "A formal complaint is filed with the Texas Medical Board citing the death of Tina Sodhi and prior harms at AWKN Ranch.",
    type: "legal",
  },
  {
    date: "May 2026",
    label: "Texas License Suspended",
    description: "Texas Medical Board temporarily suspends Lee's license, stating his \"continuation in the practice of medicine poses a continuing threat to public welfare.\"",
    type: "legal",
  },
  {
    date: "Jul 14, 2026",
    label: "Arrested — Manslaughter Charge",
    description: "Lee, 44, is arrested on a second-degree felony manslaughter charge. He pleads not guilty and requests a jury trial. On the same day: Eli Lilly announces a $2.8B acquisition of AtaiBeckley — the largest psychedelic medicine transaction in history.",
    type: "legal",
  },
  {
    date: "Jul 17, 2026",
    label: "Ordered to Stop Practicing",
    description: "A Miami-Dade judge prohibits Lee from providing any medical, psychological, or psychiatric care while the case is pending. He is ordered to surrender all passports. Florida medical license listed as delinquent.",
    type: "legal",
  },
  {
    date: "Oct 2026",
    label: "Jury Trial Scheduled",
    description: "Lee's jury trial is scheduled for October 2026. Maximum sentence: 15 years. AWKN Ranch / Within Center in Austin continues to operate — with no medical director listed on its website.",
    type: "future",
  },
];

const typeConfig = {
  career: {
    dot: "bg-[#C9A84C]",
    badge: "bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/30",
    label: "CAREER",
  },
  harm: {
    dot: "bg-red-500",
    badge: "bg-red-500/10 text-red-400 border border-red-500/20",
    label: "HARM",
  },
  legal: {
    dot: "bg-orange-400",
    badge: "bg-orange-400/10 text-orange-400 border border-orange-400/20",
    label: "LEGAL",
  },
  future: {
    dot: "bg-[#8B6914]",
    badge: "bg-[#8B6914]/15 text-[#C9A84C] border border-[#8B6914]/30",
    label: "PENDING",
  },
};

export function DrLeeTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="my-12 not-prose">
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-xs tracking-[0.2em] text-[#8B6914] uppercase mb-2">
          ◆ CASE TIMELINE
        </p>
        <h3
          className="font-serif text-2xl md:text-3xl text-[#2C1810]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Dr. Samuel Lee — From Credential to Courtroom
        </h3>
        <p className="text-sm text-[#6B5744] mt-2 font-light">
          Every verified date. Every institution. Every decision that led to a
          rooftop sauna in Miami Beach.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-8">
        {(["career", "harm", "legal", "future"] as const).map((t) => (
          <span
            key={t}
            className={`text-[10px] font-mono tracking-widest px-2 py-1 rounded-sm ${typeConfig[t].badge}`}
          >
            {typeConfig[t].label}
          </span>
        ))}
      </div>

      {/* Timeline */}
      <div ref={containerRef} className="relative">
        {/* Vertical line */}
        <div className="absolute left-[7px] md:left-[11px] top-0 bottom-0 w-px bg-gradient-to-b from-[#C9A84C]/40 via-[#8B6914]/30 to-red-500/20" />

        <div className="space-y-0">
          {events.map((event, i) => {
            const cfg = typeConfig[event.type];
            const isLast = i === events.length - 1;
            return (
              <div key={i} className="relative flex gap-5 md:gap-7 pb-8 group">
                {/* Dot */}
                <div className="relative flex-shrink-0 mt-1">
                  <div
                    className={`w-[15px] h-[15px] md:w-[23px] md:h-[23px] rounded-full border-2 border-[#FAFAF7] ${cfg.dot} shadow-sm z-10 relative`}
                  />
                  {isLast && (
                    <div
                      className={`absolute inset-0 rounded-full ${cfg.dot} opacity-30 animate-ping`}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-2">
                  <div className="flex flex-wrap items-baseline gap-2 mb-1">
                    <span className="font-mono text-xs text-[#8B6914] tracking-wider">
                      {event.date}
                    </span>
                    <span
                      className={`text-[9px] font-mono tracking-widest px-1.5 py-0.5 rounded-sm ${cfg.badge}`}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  <h4
                    className="font-serif text-base md:text-lg text-[#2C1810] leading-snug mb-1"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {event.label}
                  </h4>
                  <p className="text-sm text-[#5C4A3A] leading-relaxed font-light">
                    {event.description}
                  </p>
                  {!isLast && (
                    <div className="mt-4 border-b border-[#E8E0D5]/60" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
