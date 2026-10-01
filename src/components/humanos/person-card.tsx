import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { PersonData } from "@/lib/content/humanos-content";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Legacy rendered a real 56px round headshot per person from Manus'
// `/api/img/` path; those were rescued into Sanity (see humanos-content.ts)
// and render here through next/image inside the shadcn `Avatar` shell. A
// person without `img` keeps the initials fallback.
export function PersonCard({
  person,
  accent = "violet",
}: {
  person: PersonData;
  accent?: "violet" | "emerald";
}) {
  const accentText = accent === "violet" ? "text-violet-700" : "text-emerald-700";
  const accentBorder = accent === "violet" ? "border-violet-600/40" : "border-emerald-600/40";
  const accentBg = accent === "violet" ? "bg-violet-100 text-violet-700" : "bg-emerald-100 text-emerald-700";

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-7 shadow-sm">
      <div className="flex items-center gap-4">
        <Avatar size="lg" className={`size-14 overflow-hidden border-2 ${accentBorder}`}>
          {person.img ? (
            <Image src={person.img} alt={person.name} fill sizes="56px" className="rounded-full object-cover" />
          ) : (
            <AvatarFallback className={accentBg}>{initials(person.name)}</AvatarFallback>
          )}
        </Avatar>
        <div>
          <p className="font-heading text-base font-semibold text-neutral-900">{person.name}</p>
          <p className={`font-mono text-[0.6rem] tracking-[0.1em] uppercase ${accentText}`}>{person.role}</p>
          <p className="text-sm text-neutral-500">{person.org}</p>
        </div>
      </div>
      <blockquote
        className={`m-0 border-l-2 pl-4 text-sm leading-relaxed text-neutral-600 italic ${accentBorder}`}
      >
        &ldquo;{person.quote}&rdquo;
      </blockquote>
    </div>
  );
}
