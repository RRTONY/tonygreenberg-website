/**
 * NextSteps — A "What's Next" CTA block for BrewSoul pages.
 * 
 * Drop this at the bottom of any content/reference/tool page
 * to prevent dead ends and keep the user moving through the journey.
 */
import { Link } from "wouter";

const M = { fontFamily: "'DM Mono', monospace" } as const;
const S = { fontFamily: "'Source Sans 3', sans-serif" } as const;

interface NextStep {
  label: string;
  path: string;
  description: string;
}

interface NextStepsProps {
  steps: NextStep[];
  title?: string;
}

export default function NextSteps({ steps, title = "Continue Your Journey" }: NextStepsProps) {
  return (
    <div style={{
      marginTop: "3rem", paddingTop: "2.5rem",
      borderTop: "1px solid rgba(111,78,55,0.1)",
    }}>
      <div style={{
        ...M, fontSize: "0.68rem", letterSpacing: "0.2em",
        textTransform: "uppercase", color: "#C5A23C",
        textAlign: "center", marginBottom: "0.5rem",
      }}>
        {title}
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${Math.min(steps.length, 3)}, 1fr)`,
        gap: "1rem",
        maxWidth: "800px",
        margin: "1rem auto 0",
      }}>
        {steps.map(step => (
          <Link key={step.path} href={step.path} style={{ textDecoration: "none" }}>
            <div style={{
              padding: "1.25rem",
              borderRadius: "10px",
              background: "rgba(111,78,55,0.04)",
              border: "1px solid rgba(111,78,55,0.08)",
              cursor: "pointer",
              transition: "all 0.25s ease",
              textAlign: "center",
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.background = "rgba(197,162,60,0.08)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(197,162,60,0.2)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.background = "rgba(111,78,55,0.04)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(111,78,55,0.08)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              }}
            >
              <div style={{ ...S, fontSize: "0.95rem", fontWeight: 600, color: "#2C1810", marginBottom: "0.35rem" }}>
                {step.label}
              </div>
              <div style={{ ...M, fontSize: "0.68rem", color: "#6B5B4F", lineHeight: 1.5 }}>
                {step.description}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
