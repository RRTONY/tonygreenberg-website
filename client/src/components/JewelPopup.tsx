/**
 * THE JEWEL PORTAL — Surreal Glass-Morphism Email Capture
 * 
 * Deep layered glass with aurora nebula backdrop, floating particles,
 * prismatic light refraction, sacred geometry, 3D depth.
 * One component used everywhere for uniform magnificence.
 */
import { useState, useEffect, useRef, useCallback } from "react";

/* ── Floating Particles Canvas ── */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();

    // Particles — luminous dust motes in a cathedral beam
    const particles: { x: number; y: number; vx: number; vy: number; r: number; hue: number; alpha: number; pulse: number }[] = [];
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.1,
        r: Math.random() * 2 + 0.5,
        hue: Math.random() * 60 + 15, // amber to rose range
        alpha: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    let t = 0;
    const draw = () => {
      t += 0.01;
      ctx.clearRect(0, 0, W, H);

      for (const p of particles) {
        p.x += p.vx + Math.sin(t + p.pulse) * 0.15;
        p.y += p.vy;
        p.pulse += 0.02;

        // Wrap around
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;

        const glow = Math.sin(p.pulse) * 0.3 + 0.7;
        const a = p.alpha * glow;

        // Outer glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        grad.addColorStop(0, `hsla(${p.hue}, 70%, 65%, ${a * 0.4})`);
        grad.addColorStop(1, `hsla(${p.hue}, 70%, 65%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `hsla(${p.hue}, 80%, 80%, ${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 1,
      }}
    />
  );
}

/* ── Sacred Geometry SVG — rotating Metatron's Cube wireframe ── */
function SacredGeometry() {
  return (
    <div style={{
      position: "absolute", top: "50%", left: "50%",
      width: "340px", height: "340px",
      transform: "translate(-50%, -50%)",
      opacity: 0.06,
      animation: "jwlGeoRotate 40s linear infinite",
      pointerEvents: "none", zIndex: 1,
    }}>
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        {/* Outer circle */}
        <circle cx="100" cy="100" r="90" stroke="url(#jwlGrad)" strokeWidth="0.5" />
        {/* Inner circles — flower of life hint */}
        <circle cx="100" cy="55" r="45" stroke="url(#jwlGrad)" strokeWidth="0.3" />
        <circle cx="100" cy="145" r="45" stroke="url(#jwlGrad)" strokeWidth="0.3" />
        <circle cx="61" cy="77" r="45" stroke="url(#jwlGrad)" strokeWidth="0.3" />
        <circle cx="139" cy="77" r="45" stroke="url(#jwlGrad)" strokeWidth="0.3" />
        <circle cx="61" cy="123" r="45" stroke="url(#jwlGrad)" strokeWidth="0.3" />
        <circle cx="139" cy="123" r="45" stroke="url(#jwlGrad)" strokeWidth="0.3" />
        {/* Hexagon */}
        <polygon points="100,10 177.3,55 177.3,145 100,190 22.7,145 22.7,55" stroke="url(#jwlGrad)" strokeWidth="0.4" />
        {/* Inner hexagon rotated */}
        <polygon points="100,30 163,60 163,140 100,170 37,140 37,60" stroke="url(#jwlGrad)" strokeWidth="0.3" />
        {/* Star lines */}
        <line x1="100" y1="10" x2="100" y2="190" stroke="url(#jwlGrad)" strokeWidth="0.2" />
        <line x1="22.7" y1="55" x2="177.3" y2="145" stroke="url(#jwlGrad)" strokeWidth="0.2" />
        <line x1="22.7" y1="145" x2="177.3" y2="55" stroke="url(#jwlGrad)" strokeWidth="0.2" />
        <defs>
          <linearGradient id="jwlGrad" x1="0" y1="0" x2="200" y2="200">
            <stop offset="0%" stopColor="#C4841D" />
            <stop offset="33%" stopColor="#B85A5A" />
            <stop offset="66%" stopColor="#3D8B6E" />
            <stop offset="100%" stopColor="#C4841D" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/* ── Props ── */
export interface JewelPopupProps {
  show: boolean;
  onDismiss: () => void;
  onSubmitEmail: (email: string) => void;
  submitted: boolean;
}

export function JewelPopup({ show, onDismiss, onSubmitEmail, submitted }: JewelPopupProps) {
  const [email, setEmail] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [hoverCta, setHoverCta] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (show) {
      requestAnimationFrame(() => setMounted(true));
    } else {
      setMounted(false);
    }
  }, [show]);

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) onSubmitEmail(email);
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        perspective: "1200px",
      }}
      onClick={onDismiss}
    >
      {/* ── Deep aurora backdrop — NOT flat, NOT black ── */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 30% 20%, rgba(61,139,110,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(184,90,90,0.12) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(196,132,29,0.1) 0%, transparent 60%), #0D0B0A",
        animation: mounted ? "jwlBackdropReveal 1s cubic-bezier(0.16,1,0.3,1) forwards" : "none",
        opacity: mounted ? 1 : 0,
      }} />

      {/* ── Animated aurora nebula layer ── */}
      <div style={{
        position: "absolute", inset: 0, overflow: "hidden",
        opacity: mounted ? 0.4 : 0,
        transition: "opacity 1.5s ease",
      }}>
        <div style={{
          position: "absolute", inset: "-50%",
          background: "conic-gradient(from 0deg at 50% 50%, #C4841D22, #B85A5A22, #3D8B6E22, #C4841D22, #F5EDE022, #C4841D22)",
          animation: "jwlAuroraRotate 20s linear infinite",
          filter: "blur(80px)",
        }} />
      </div>

      {/* ── Floating particles ── */}
      <div style={{
        position: "absolute", inset: 0,
        opacity: mounted ? 1 : 0,
        transition: "opacity 2s ease 0.5s",
      }}>
        <ParticleField />
      </div>

      {/* ── Sacred geometry background ── */}
      <div style={{
        opacity: mounted ? 1 : 0,
        transition: "opacity 2s ease 0.3s",
      }}>
        <SacredGeometry />
      </div>

      {/* ── The Glass Card — multi-layered, prismatic edges, 3D depth ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative", zIndex: 10,
          maxWidth: "440px", width: "90%",
          transform: mounted ? "translateY(0) rotateX(0deg) scale(1)" : "translateY(40px) rotateX(4deg) scale(0.92)",
          opacity: mounted ? 1 : 0,
          transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s",
        }}
      >
        {/* Prismatic edge glow — rainbow refraction on the border */}
        <div style={{
          position: "absolute", inset: "-2px", borderRadius: "24px",
          background: "conic-gradient(from 0deg, #C4841D88, #B85A5A66, #3D8B6E88, #C4841D44, #F5EDE066, #B85A5A88, #C4841D88)",
          backgroundSize: "200% 200%",
          animation: "jwlPrismaticShift 8s linear infinite",
          filter: "blur(1px)",
          opacity: 0.7,
        }} />

        {/* Second prismatic layer — offset for depth */}
        <div style={{
          position: "absolute", inset: "-1px", borderRadius: "23px",
          background: "conic-gradient(from 180deg, #C4841D55, #3D8B6E44, #B85A5A55, #F5EDE044, #C4841D55)",
          backgroundSize: "200% 200%",
          animation: "jwlPrismaticShift 8s linear infinite reverse",
          filter: "blur(0.5px)",
          opacity: 0.5,
        }} />

        {/* Glass card body — deep frosted glass with inner light */}
        <div style={{
          position: "relative", borderRadius: "22px", overflow: "hidden",
          background: "linear-gradient(165deg, rgba(245,237,224,0.1) 0%, rgba(13,11,10,0.85) 30%, rgba(13,11,10,0.9) 70%, rgba(245,237,224,0.08) 100%)",
          backdropFilter: "blur(40px) saturate(1.5)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.5), 0 15px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(245,237,224,0.15), inset 0 -1px 0 rgba(245,237,224,0.05)",
          border: "1px solid rgba(245,237,224,0.08)",
        }}>
          {/* Inner light refraction — top left highlight */}
          <div style={{
            position: "absolute", top: "-20%", left: "-10%",
            width: "60%", height: "60%",
            background: "radial-gradient(circle, rgba(196,132,29,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* Inner light refraction — bottom right warmth */}
          <div style={{
            position: "absolute", bottom: "-20%", right: "-10%",
            width: "50%", height: "50%",
            background: "radial-gradient(circle, rgba(61,139,110,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* Prismatic light streak across card */}
          <div style={{
            position: "absolute", top: "0", left: "-100%",
            width: "200%", height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(196,132,29,0.3), rgba(184,90,90,0.2), rgba(61,139,110,0.3), transparent)",
            animation: "jwlLightStreak 6s ease-in-out infinite",
            pointerEvents: "none",
          }} />

          {/* Close button */}
          <button onClick={onDismiss} style={{
            position: "absolute", top: "1rem", right: "1rem", zIndex: 5,
            background: "none", border: "none",
            fontSize: "1.2rem", color: "rgba(245,237,224,0.25)",
            cursor: "pointer", padding: "0.3rem", lineHeight: 1,
            transition: "all 0.3s",
          }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "rgba(245,237,224,0.6)"; (e.target as HTMLElement).style.textShadow = "0 0 10px rgba(196,132,29,0.3)"; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "rgba(245,237,224,0.25)"; (e.target as HTMLElement).style.textShadow = "none"; }}
          >×</button>

          {/* ── Content ── */}
          <div style={{ padding: "2.8rem 2.2rem 2.2rem", position: "relative", zIndex: 2 }}>

            {submitted ? (
              /* ═══ WELCOME STATE ═══ */
              <div style={{ textAlign: "center", animation: "jwlContentFade 0.8s ease-out" }}>
                {/* Glowing diamond */}
                <div style={{
                  fontSize: "2rem", marginBottom: "1.2rem",
                  animation: "jwlGlyphPulse 2.5s ease-in-out infinite",
                  filter: "drop-shadow(0 0 15px rgba(196,132,29,0.5)) drop-shadow(0 0 30px rgba(196,132,29,0.2))",
                }}>◆</div>

                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.5rem, 4vw, 1.9rem)",
                  lineHeight: 1.3, fontWeight: 400,
                  marginBottom: "0.8rem",
                }}>
                  <span style={{
                    backgroundImage: "linear-gradient(135deg, #C4841D, #F5EDE0, #B85A5A, #3D8B6E, #C4841D)",
                    backgroundSize: "300% auto",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    animation: "jwlTextPrismatic 6s ease infinite",
                  }}>Welcome to the smaller room.</span>
                </h3>

                <p style={{
                  fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem",
                  color: "rgba(245,237,224,0.5)", lineHeight: 1.7,
                  maxWidth: "340px", margin: "0 auto 1.8rem",
                }}>
                  The next dispatch arrives when it arrives.
                  No schedule. No algorithm. Just the things
                  I can't stop thinking about.
                </p>

                {/* Prismatic divider */}
                <div style={{
                  height: "1px", maxWidth: "200px", margin: "0 auto 1.5rem",
                  background: "linear-gradient(90deg, transparent, #C4841D55, #B85A5A44, #3D8B6E55, transparent)",
                }} />

                <button
                  onClick={onDismiss}
                  style={{
                    background: "none",
                    border: "1px solid rgba(245,237,224,0.15)",
                    borderRadius: "10px",
                    color: "rgba(245,237,224,0.6)",
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "0.9rem", padding: "0.7rem 2.5rem",
                    cursor: "pointer", fontStyle: "italic",
                    transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.target as HTMLElement;
                    el.style.borderColor = "rgba(196,132,29,0.4)";
                    el.style.color = "rgba(245,237,224,0.9)";
                    el.style.boxShadow = "0 0 20px rgba(196,132,29,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.target as HTMLElement;
                    el.style.borderColor = "rgba(245,237,224,0.15)";
                    el.style.color = "rgba(245,237,224,0.6)";
                    el.style.boxShadow = "none";
                  }}
                >
                  keep exploring
                </button>
              </div>
            ) : (
              /* ═══ INVITATION STATE ═══ */
              <div style={{ animation: "jwlContentFade 0.8s ease-out 0.3s both" }}>
                {/* Glowing diamond glyph */}
                <div style={{
                  textAlign: "center", marginBottom: "1.4rem",
                  fontSize: "1.6rem",
                  animation: "jwlGlyphPulse 3s ease-in-out infinite",
                  filter: "drop-shadow(0 0 12px rgba(196,132,29,0.4)) drop-shadow(0 0 25px rgba(196,132,29,0.15))",
                }}>◆</div>

                {/* Eyebrow */}
                <div style={{
                  fontFamily: "'DM Mono', monospace", fontSize: "0.65rem",
                  letterSpacing: "0.25em", textTransform: "uppercase",
                  color: "rgba(196,132,29,0.5)", textAlign: "center",
                  marginBottom: "1rem",
                }}>STILL HERE? GOOD.</div>

                {/* Headline */}
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(1.5rem, 4vw, 1.85rem)",
                  textAlign: "center", lineHeight: 1.3,
                  fontWeight: 400, marginBottom: "0.6rem",
                  color: "rgba(245,237,224,0.9)",
                }}>
                  Most people scroll past.<br />
                  <span style={{
                    backgroundImage: "linear-gradient(135deg, #C4841D, #F5EDE0, #B85A5A, #3D8B6E, #C4841D)",
                    backgroundSize: "300% auto",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    animation: "jwlTextPrismatic 6s ease infinite",
                    fontStyle: "italic",
                  }}>You read.</span>
                </h3>

                {/* Body */}
                <p style={{
                  fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem",
                  color: "rgba(245,237,224,0.45)", textAlign: "center",
                  lineHeight: 1.7, maxWidth: "360px", margin: "0 auto 2rem",
                }}>
                  That puts you in rare company. New essays, provocations, and the occasional
                  behind-the-scenes dispatch from the front lines. Arrives when it arrives.
                  No spam. No algorithm.
                </p>

                {/* Email form */}
                <form onSubmit={handleSubmit} style={{ maxWidth: "360px", margin: "0 auto" }}>
                  <div style={{ position: "relative", marginBottom: "0.85rem" }}>
                    {/* Input glow ring */}
                    {inputFocused && (
                      <div style={{
                        position: "absolute", inset: "-3px", borderRadius: "13px",
                        background: "conic-gradient(from 0deg, #C4841D44, #3D8B6E33, #B85A5A44, #C4841D44)",
                        animation: "jwlPrismaticShift 4s linear infinite",
                        filter: "blur(2px)",
                        pointerEvents: "none",
                      }} />
                    )}
                    <input
                      type="email" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setInputFocused(true)}
                      onBlur={() => setInputFocused(false)}
                      placeholder="your@email.com"
                      required
                      style={{
                        position: "relative",
                        width: "100%", padding: "1rem 1.3rem",
                        background: inputFocused ? "rgba(245,237,224,0.08)" : "rgba(245,237,224,0.04)",
                        border: `1px solid ${inputFocused ? "rgba(196,132,29,0.3)" : "rgba(245,237,224,0.1)"}`,
                        borderRadius: "12px",
                        color: "#F5EDE0",
                        fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.95rem",
                        outline: "none",
                        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                        boxShadow: inputFocused
                          ? "0 0 30px rgba(196,132,29,0.08), inset 0 0 20px rgba(196,132,29,0.03)"
                          : "inset 0 1px 0 rgba(245,237,224,0.03)",
                      }}
                    />
                  </div>

                  {/* CTA Button — living, breathing, prismatic */}
                  <button
                    type="submit"
                    onMouseEnter={() => setHoverCta(true)}
                    onMouseLeave={() => setHoverCta(false)}
                    style={{
                      position: "relative", overflow: "hidden",
                      width: "100%", padding: "1rem",
                      background: "linear-gradient(135deg, #C4841D 0%, #B85A5A 50%, #3D8B6E 100%)",
                      backgroundSize: hoverCta ? "200% 200%" : "100% 100%",
                      border: "none", borderRadius: "12px",
                      color: "#F5EDE0",
                      fontFamily: "'DM Mono', monospace", fontSize: "0.72rem",
                      fontWeight: 600, letterSpacing: "0.18em",
                      textTransform: "uppercase" as const,
                      cursor: "pointer",
                      transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
                      boxShadow: hoverCta
                        ? "0 10px 40px rgba(196,132,29,0.35), 0 4px 15px rgba(184,90,90,0.2), 0 0 60px rgba(196,132,29,0.1)"
                        : "0 5px 25px rgba(196,132,29,0.2), 0 2px 10px rgba(184,90,90,0.1)",
                      transform: hoverCta ? "translateY(-2px) scale(1.01)" : "translateY(0) scale(1)",
                      animation: "jwlCtaPulse 4s ease-in-out infinite",
                    }}
                  >
                    {/* Light sweep across button */}
                    <div style={{
                      position: "absolute", top: 0, left: "-100%",
                      width: "100%", height: "100%",
                      background: "linear-gradient(90deg, transparent, rgba(245,237,224,0.15), transparent)",
                      animation: "jwlButtonSweep 3s ease-in-out infinite",
                      pointerEvents: "none",
                    }} />
                    <span style={{ position: "relative", zIndex: 1 }}>JOIN THE CONVERSATION</span>
                  </button>
                </form>

                {/* Privacy note */}
                <p style={{
                  fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.72rem",
                  color: "rgba(245,237,224,0.2)", textAlign: "center",
                  marginTop: "1rem", fontStyle: "italic",
                }}>
                  Unsubscribe anytime. I'll survive.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Animations ── */}
      <style>{`
        @keyframes jwlBackdropReveal {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes jwlAuroraRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes jwlGeoRotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes jwlPrismaticShift {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes jwlLightStreak {
          0%, 100% { transform: translateX(-30%); opacity: 0; }
          40% { opacity: 1; }
          50% { transform: translateX(30%); opacity: 1; }
          90%, 100% { transform: translateX(60%); opacity: 0; }
        }
        @keyframes jwlGlyphPulse {
          0%, 100% { opacity: 0.7; transform: scale(1); filter: drop-shadow(0 0 12px rgba(196,132,29,0.4)) drop-shadow(0 0 25px rgba(196,132,29,0.15)); }
          50% { opacity: 1; transform: scale(1.1); filter: drop-shadow(0 0 20px rgba(196,132,29,0.6)) drop-shadow(0 0 40px rgba(196,132,29,0.25)); }
        }
        @keyframes jwlTextPrismatic {
          0% { background-position: 0% center; }
          50% { background-position: 300% center; }
          100% { background-position: 0% center; }
        }
        @keyframes jwlContentFade {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes jwlCtaPulse {
          0%, 100% { box-shadow: 0 5px 25px rgba(196,132,29,0.2), 0 2px 10px rgba(184,90,90,0.1); }
          50% { box-shadow: 0 5px 30px rgba(196,132,29,0.3), 0 2px 15px rgba(184,90,90,0.15), 0 0 40px rgba(196,132,29,0.08); }
        }
        @keyframes jwlButtonSweep {
          0%, 100% { left: -100%; }
          50% { left: 100%; }
        }
      `}</style>
    </div>
  );
}
