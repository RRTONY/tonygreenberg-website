"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { ENTITIES, type MatrixEntity } from "@/lib/content/peptide-matrix";

const RISK_COLORS: Record<MatrixEntity["riskLevel"], string> = {
  HIGHEST: "#C0392B",
  HIGH: "#E67E22",
  MODERATE: "#F1C40F",
  LOW: "#2E8B57",
  REGULATORY: "#4A90D9",
};

// Small, fixed, known-at-build-time set of risk levels — precomposed literal
// classes per CONTRIBUTING.md's rule of thumb, rather than assembled from
// fragments at the usage site.
const RISK_BADGE_CLASSES: Record<MatrixEntity["riskLevel"], string> = {
  HIGHEST: "bg-[#C0392B]/15 text-[#C0392B]",
  HIGH: "bg-[#E67E22]/15 text-[#E67E22]",
  MODERATE: "bg-[#F1C40F]/15 text-[#F1C40F]",
  LOW: "bg-[#2E8B57]/15 text-[#2E8B57]",
  REGULATORY: "bg-[#4A90D9]/15 text-[#4A90D9]",
};

const RISK_BORDER_CLASSES: Record<MatrixEntity["riskLevel"], string> = {
  HIGHEST: "border-[#C0392B]/20",
  HIGH: "border-[#E67E22]/20",
  MODERATE: "border-[#F1C40F]/20",
  LOW: "border-[#2E8B57]/20",
  REGULATORY: "border-[#4A90D9]/20",
};

const RISK_TEXT_CLASSES: Record<MatrixEntity["riskLevel"], string> = {
  HIGHEST: "text-[#C0392B]",
  HIGH: "text-[#E67E22]",
  MODERATE: "text-[#F1C40F]",
  LOW: "text-[#2E8B57]",
  REGULATORY: "text-[#4A90D9]",
};

// Canvas 2D drawing uses the Canvas API directly (ctx.fillStyle, etc.) —
// this is not a React `style` prop and isn't expressible as a Tailwind
// class, so it's outside CONTRIBUTING.md's inline-style rule entirely.
function MatrixScatterPlot({
  entities,
  selectedEntity,
  onSelect,
}: {
  entities: MatrixEntity[];
  selectedEntity: string | null;
  onSelect: (id: string | null) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 600, h: 400 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const w = Math.min(containerRef.current.offsetWidth, 800);
        setCanvasSize({ w, h: Math.round(w * 0.65) });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvasSize.w;
    const H = canvasSize.h;
    const PAD = { top: 30, right: 30, bottom: 50, left: 60 };
    const plotW = W - PAD.left - PAD.right;
    const plotH = H - PAD.top - PAD.bottom;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.scale(dpr, dpr);

    ctx.fillStyle = "#0A0A10";
    ctx.fillRect(0, 0, W, H);

    const midX = PAD.left + plotW * (2.5 / 5);
    const midY = PAD.top + plotH * (1 - 50 / 100);

    ctx.fillStyle = "rgba(136,136,136,0.06)";
    ctx.fillRect(PAD.left, midY, midX - PAD.left, PAD.top + plotH - midY);

    ctx.fillStyle = "rgba(192,57,43,0.1)";
    ctx.fillRect(midX, midY, PAD.left + plotW - midX, PAD.top + plotH - midY);

    ctx.fillStyle = "rgba(74,144,217,0.06)";
    ctx.fillRect(PAD.left, PAD.top, midX - PAD.left, midY - PAD.top);

    ctx.fillStyle = "rgba(46,139,87,0.08)";
    ctx.fillRect(midX, PAD.top, PAD.left + plotW - midX, midY - PAD.top);

    ctx.font = "bold 10px 'DM Mono', monospace";
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = "#888";
    ctx.fillText("Q3: OBVIOUS SCAMS", PAD.left + 8, PAD.top + plotH - 8);
    ctx.fillStyle = "#C0392B";
    ctx.fillText("Q4: DANGER ZONE", midX + 8, PAD.top + plotH - 8);
    ctx.fillStyle = "#4A90D9";
    ctx.fillText("Q2: GOOD SCIENCE", PAD.left + 8, PAD.top + 16);
    ctx.fillStyle = "#2E8B57";
    ctx.fillText("Q1: ALIGNED", PAD.left + plotW - 80, PAD.top + 16);
    ctx.globalAlpha = 1;

    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const x = PAD.left + (plotW * i) / 5;
      ctx.beginPath();
      ctx.moveTo(x, PAD.top);
      ctx.lineTo(x, PAD.top + plotH);
      ctx.stroke();
    }
    for (let i = 0; i <= 5; i++) {
      const y = PAD.top + (plotH * i) / 5;
      ctx.beginPath();
      ctx.moveTo(PAD.left, y);
      ctx.lineTo(PAD.left + plotW, y);
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(midX, PAD.top);
    ctx.lineTo(midX, PAD.top + plotH);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(PAD.left, midY);
    ctx.lineTo(PAD.left + plotW, midY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#999";
    ctx.font = "11px 'Source Sans 3', sans-serif";
    ctx.textAlign = "center";
    for (let i = 0; i <= 5; i++) {
      const x = PAD.left + (plotW * i) / 5;
      ctx.fillText(String(i), x, PAD.top + plotH + 18);
    }
    ctx.textAlign = "right";
    for (let i = 0; i <= 5; i++) {
      const y = PAD.top + plotH - (plotH * i * 20) / 100;
      ctx.fillText(String(i * 20), PAD.left - 8, y + 4);
    }

    ctx.fillStyle = "#D4B96A";
    ctx.font = "bold 11px 'DM Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("REVIEW SCORE (1–5 STARS)", PAD.left + plotW / 2, H - 6);
    ctx.save();
    ctx.translate(14, PAD.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("EVIDENCE SCORE (0–100)", 0, 0);
    ctx.restore();

    const plotEntities = entities.filter((e) => e.reviews > 0);
    plotEntities.forEach((entity) => {
      const x = PAD.left + (entity.reviews / 5) * plotW;
      const y = PAD.top + plotH - (entity.evidence / 100) * plotH;
      const isSelected = selectedEntity === entity.id;
      const isHovered = hoveredEntity === entity.id;
      const r = isSelected || isHovered ? 10 : 7;

      if (entity.quadrant === "Q4" && entity.riskLevel === "HIGHEST") {
        ctx.beginPath();
        ctx.arc(x, y, r + 6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(192,57,43,0.2)";
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = RISK_COLORS[entity.riskLevel] || "#888";
      ctx.fill();

      if (isSelected || isHovered) {
        ctx.strokeStyle = "#D4B96A";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.fillStyle = isSelected || isHovered ? "#E8E4DC" : "rgba(232,228,220,0.7)";
      ctx.font = `${isSelected || isHovered ? "bold " : ""}10px 'DM Mono', monospace`;
      ctx.textAlign = "center";
      const label = entity.name.length > 14 ? entity.name.slice(0, 12) + "…" : entity.name;
      ctx.fillText(label, x, y - r - 5);
    });

    const usada = entities.find((e) => e.id === "usada");
    if (usada) {
      const x = PAD.left + 15;
      const y = PAD.top + plotH - (usada.evidence / 100) * plotH;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#4A90D9";
      ctx.fill();
      ctx.fillStyle = "rgba(232,228,220,0.6)";
      ctx.font = "10px 'DM Mono', monospace";
      ctx.textAlign = "left";
      ctx.fillText("USADA (Regulatory)", x + 12, y + 4);
    }
  }, [entities, selectedEntity, hoveredEntity, canvasSize]);

  const findNearestEntity = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const W = canvasSize.w;
    const H = canvasSize.h;
    const PAD = { top: 30, right: 30, bottom: 50, left: 60 };
    const plotW = W - PAD.left - PAD.right;
    const plotH = H - PAD.top - PAD.bottom;

    let found: string | null = null;
    entities
      .filter((e2) => e2.reviews > 0)
      .forEach((entity) => {
        const x = PAD.left + (entity.reviews / 5) * plotW;
        const y = PAD.top + plotH - (entity.evidence / 100) * plotH;
        const dist = Math.sqrt((mx - x) ** 2 + (my - y) ** 2);
        if (dist < 15) found = entity.id;
      });
    return found;
  };

  return (
    <div ref={containerRef} className="w-full">
      <canvas
        ref={canvasRef}
        onClick={(e) => onSelect(findNearestEntity(e))}
        onMouseMove={(e) => setHoveredEntity(findNearestEntity(e))}
        onMouseLeave={() => setHoveredEntity(null)}
        className="w-full cursor-default rounded-xl border border-brand-gold/10"
      />
    </div>
  );
}

export function PeptideMatrixExplorer() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(true);

  const selected = ENTITIES.find((e) => e.id === selectedId);
  const rankedEntities = useMemo(() => [...ENTITIES].sort((a, b) => b.gap - a.gap), []);

  return (
    <section className="mb-12">
      <button
        onClick={() => setExpanded(!expanded)}
        className="mb-4 flex items-center gap-2 font-mono text-xs tracking-wide text-brand-gold uppercase"
      >
        <ChevronRight className={`size-4 transition-transform ${expanded ? "rotate-90" : ""}`} />
        Interactive Matrix · Click Any Entity
      </button>

      {expanded && (
        <div>
          <MatrixScatterPlot entities={ENTITIES} selectedEntity={selectedId} onSelect={setSelectedId} />

          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {(
              [
                { label: "Highest Risk", color: "#C0392B" },
                { label: "Moderate Risk", color: "#F1C40F" },
                { label: "Low Risk", color: "#2E8B57" },
                { label: "Regulatory", color: "#4A90D9" },
              ] as const
            ).map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className="inline-block size-2.5 rounded-full" style={{ background: l.color }} />
                <span className="font-mono text-xs text-muted-foreground">{l.label}</span>
              </div>
            ))}
          </div>

          {selected && (
            <div className={`mt-6 rounded-xl border bg-[#0A0A10] p-6 ${RISK_BORDER_CLASSES[selected.riskLevel]}`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-heading text-xl text-[#E8E4DC]">{selected.name}</h3>
                  <p className="mt-1 font-mono text-xs tracking-wide text-[#E8E4DC]/40 uppercase">
                    {selected.type} · Tier {selected.tier ?? "N/A"} · Wall Score {selected.wallScore ?? "N/A"}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 font-mono text-xs font-bold ${RISK_BADGE_CLASSES[selected.riskLevel]}`}>
                  {selected.riskLevel} RISK
                </span>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="font-heading text-2xl text-brand-gold">
                    {selected.reviews > 0 ? `${selected.reviews}★` : "N/A"}
                  </p>
                  <p className="font-mono text-[0.65rem] text-[#E8E4DC]/40 uppercase">Reviews</p>
                </div>
                <div className="text-center">
                  <p className={`font-heading text-2xl ${RISK_TEXT_CLASSES[selected.riskLevel]}`}>
                    {selected.evidence}/100
                  </p>
                  <p className="font-mono text-[0.65rem] text-[#E8E4DC]/40 uppercase">Evidence</p>
                </div>
                <div className="text-center">
                  <p
                    className={`font-heading text-2xl ${
                      selected.gap > 50 ? "text-[#C0392B]" : selected.gap > 0 ? "text-[#F1C40F]" : "text-[#2E8B57]"
                    }`}
                  >
                    {selected.gap > 0 ? `+${selected.gap}` : selected.gap}
                  </p>
                  <p className="font-mono text-[0.65rem] text-[#E8E4DC]/40 uppercase">Gap</p>
                </div>
              </div>

              <p className="mt-6 text-sm leading-relaxed text-[#E8E4DC]/70">{selected.details}</p>

              {selected.reviewSources && (
                <p className="mt-4 font-mono text-xs text-[#E8E4DC]/30">
                  Sources: {selected.reviewSources.join(", ")}
                </p>
              )}

              <p className="mt-2 font-mono text-xs text-[#E8E4DC]/25 italic">
                Opinion based on publicly available information. See methodology below. Appeals:
                appeals@impactsoul.is
              </p>
            </div>
          )}
        </div>
      )}

      <h2 className="mt-12 mb-6 font-heading text-2xl font-bold text-foreground">All Entities Ranked</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-foreground">
              {["Entity", "Type", "Reviews", "Evidence", "Gap", "Quadrant", "Risk"].map((h) => (
                <th
                  key={h}
                  className="px-2 py-3 text-left font-mono text-xs tracking-wide text-brand-gold uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rankedEntities.map((entity) => (
              <tr
                key={entity.id}
                onClick={() => setSelectedId(entity.id)}
                className={`cursor-pointer border-b border-border transition-colors hover:bg-brand-gold/5 ${
                  selectedId === entity.id ? "bg-brand-gold/10" : ""
                }`}
              >
                <td className="px-2 py-2.5 font-medium text-foreground">{entity.name}</td>
                <td className="px-2 py-2.5 text-muted-foreground capitalize">{entity.type}</td>
                <td className="px-2 py-2.5 text-foreground">{entity.reviews > 0 ? `${entity.reviews}★` : "N/A"}</td>
                <td className="px-2 py-2.5 text-foreground">{entity.evidence}/100</td>
                <td
                  className={`px-2 py-2.5 font-bold ${
                    entity.gap > 50 ? "text-[#C0392B]" : entity.gap > 0 ? "text-[#E67E22]" : "text-[#2E8B57]"
                  }`}
                >
                  {entity.gap > 0 ? `+${entity.gap}` : entity.gap}
                </td>
                <td className="px-2 py-2.5">
                  <span className={`rounded px-1.5 py-0.5 font-mono text-xs ${RISK_BADGE_CLASSES[entity.riskLevel]}`}>
                    {entity.quadrant}
                  </span>
                </td>
                <td className="px-2 py-2.5">
                  <span className={`rounded-full px-2 py-0.5 font-mono text-[0.65rem] font-bold ${RISK_BADGE_CLASSES[entity.riskLevel]}`}>
                    {entity.riskLevel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
