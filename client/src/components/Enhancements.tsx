/*
 * Site Enhancements: Animated Counters, Scroll-Triggered Quotes, Parallax
 */

import { useEffect, useRef, useState, useCallback } from "react";

/* ── Animated Counter ── */
export function AnimatedCounter({
  end,
  prefix = "",
  suffix = "",
  duration = 2000,
  decimals = 0,
}: {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
}) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    const startTime = Date.now();
    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * end);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [hasStarted, end, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {decimals > 0 ? count.toFixed(decimals) : Math.round(count).toLocaleString()}
      {suffix}
    </span>
  );
}

/* ── Scroll-Triggered Quote ── */
export function ScrollQuote({
  quote,
  attribution,
}: {
  quote: string;
  attribution?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        maxWidth: "42rem",
        margin: "3rem auto",
        padding: "2rem 2.5rem",
        borderLeft: "3px solid #D4B96A",
        background: "rgba(212,185,106,0.04)",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateX(0)" : "translateX(-30px)",
        transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
    >
      <p
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.15rem",
          
          color: "#333",
          lineHeight: 1.7,
          margin: 0,
        }}
      >
        "{quote}"
      </p>
      {attribution && (
        <span
          style={{
            display: "block",
            marginTop: "0.75rem",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.78rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
            color: "#8B6914",
          }}
        >
          {attribution}
        </span>
      )}
    </div>
  );
}

/* ── Stats Bar with Animated Counters ── */
export function StatsBar() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "2rem",
        padding: "3rem 2rem",
        background: "#0A0A10",
        borderTop: "1px solid rgba(212,185,106,0.2)",
        borderBottom: "1px solid rgba(212,185,106,0.2)",
      }}
    >
      {[
        { end: 24, prefix: "$", suffix: "B+", label: "Benchmarked" },
        { end: 25, suffix: " Years", label: "In the Room" },
        { end: 1, suffix: "M+", label: "Data Points" },
        { end: 93, suffix: "%", label: "Client Score" },
        { end: 20, suffix: "×", label: "Avg ROI" },
        { end: 7, suffix: "", label: "Active Doors" },
      ].map((stat, i) => (
        <div key={i} style={{ textAlign: "center" }}>
          <div
            className="stat-glow"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "2.2rem",
              fontWeight: 700,
              color: "#D4B96A",
              lineHeight: 1.2,
            }}
          >
            <AnimatedCounter
              end={stat.end}
              prefix={stat.prefix}
              suffix={stat.suffix}
              duration={2000 + i * 200}
            />
          </div>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.78rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              color: "rgba(255,255,255,0.5)",
              marginTop: "0.4rem",
            }}
          >
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Typewriter Effect ── */
export function TypewriterText({
  text,
  speed = 50,
  delay = 500,
  className,
  style,
}: {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [displayed, setDisplayed] = useState("");
  const [hasPlayed, setHasPlayed] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Check if already played this session
    const key = `typewriter-${text.slice(0, 20)}`;
    if (sessionStorage.getItem(key)) {
      setDisplayed(text);
      setHasPlayed(true);
      return;
    }

    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPlayed) {
          setHasPlayed(true);
          sessionStorage.setItem(key, "1");
          let i = 0;
          setTimeout(() => {
            const interval = setInterval(() => {
              i++;
              setDisplayed(text.slice(0, i));
              if (i >= text.length) clearInterval(interval);
            }, speed);
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [text, speed, delay, hasPlayed]);

  return (
    <span ref={ref} className={className} style={style}>
      {displayed}
      {!hasPlayed && <span style={{ opacity: 0 }}>{text}</span>}
      {hasPlayed && displayed.length < text.length && (
        <span
          style={{
            borderRight: "2px solid #D4B96A",
            animation: "blink 0.8s infinite",
          }}
        />
      )}
    </span>
  );
}
