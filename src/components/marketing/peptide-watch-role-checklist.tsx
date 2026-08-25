"use client";

import { useState } from "react";
import { User, Factory, Truck, Stethoscope, FlaskConical, type LucideIcon } from "lucide-react";
import { ROLE_CHECKLISTS } from "@/lib/content/peptide-watch";

const ROLE_ICONS: Record<string, LucideIcon> = {
  user: User,
  factory: Factory,
  truck: Truck,
  stethoscope: Stethoscope,
  flask: FlaskConical,
};

// All 5 role checklists render into the DOM always (real, substantial
// content) — only the active one is visible, the rest are toggled via
// `hidden` rather than unmounted, so every checklist stays crawlable.
export function PeptideWatchRoleChecklist() {
  const [activeRole, setActiveRole] = useState(0);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {ROLE_CHECKLISTS.map((rc, i) => {
          const Icon = ROLE_ICONS[rc.iconKey];
          const isActive = activeRole === i;
          return (
            <button
              key={rc.role}
              onClick={() => setActiveRole(i)}
              className={`flex items-center gap-1.5 rounded px-4 py-2 text-sm font-bold transition-colors ${
                isActive ? "text-white" : "bg-secondary text-foreground hover:bg-muted"
              }`}
              style={isActive ? { backgroundColor: rc.color } : undefined}
            >
              <Icon className="size-4" />
              {rc.role}
            </button>
          );
        })}
      </div>

      {ROLE_CHECKLISTS.map((rc, i) => {
        const Icon = ROLE_ICONS[rc.iconKey];
        return (
          <div
            key={rc.role}
            className={`rounded-r border-l-4 bg-card p-6 shadow-xs ${activeRole === i ? "" : "hidden"}`}
            style={{ borderColor: rc.color }}
          >
            <h3 className="mb-2 flex items-center gap-2 font-heading text-xl font-bold text-foreground">
              <Icon className="size-5" />
              {rc.role} Checklist
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">{rc.description}</p>
            <ol className="flex flex-col gap-3">
              {rc.items.map((item, j) => (
                <li key={j} className="flex items-start gap-3 text-sm">
                  <span
                    className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: rc.color }}
                  >
                    {j + 1}
                  </span>
                  <span className="leading-relaxed text-foreground/80">{item}</span>
                </li>
              ))}
            </ol>
          </div>
        );
      })}
    </div>
  );
}
