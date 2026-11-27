// The six corner points of the hexagon the AWI and QPR badges draw (an SVG polygon "points" string).
// Plain module (no "use client") so both the client AWI badge and the server QPR badge can call it.
export function hexPoints(center: number, radius: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return `${center + radius * Math.cos(angle)},${center + radius * Math.sin(angle)}`;
  }).join(" ");
}
