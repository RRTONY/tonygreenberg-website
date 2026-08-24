/**
 * HUMAN OS V2.0 — The Operating System
 * 
 * Embeds the humanosv2 standalone site (hand breaking through glass hero,
 * "BE THE GLITCH", assessment, philosophy, ecosystem, etc.)
 * as a fullscreen iframe. The humanosv2 site is the canonical CMS version.
 */
import { useEffect } from "react";
import SEO from "@/components/SEO";

export default function HumanOS() {
  useEffect(() => {
    // Force dark background while loading
    document.body.style.background = "#0a0a0a";
    document.body.style.margin = "0";
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.background = "";
      document.body.style.margin = "";
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      <SEO
        title="Human OS V2.0 — The Machine Is Perfect. Be The Glitch."
        description="Reclaim agency in the age of algorithmic control. Are you a Maximizer or a Satisficer? Take the diagnostic."
        path="/humanos"
        indexable={true}
      />
      <iframe
        src="https://humanosv2-gxa9fnfu.manus.space/"
        title="Human OS V2.0"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          border: "none",
          background: "#0a0a0a",
        }}
        allow="clipboard-write"
      />
    </>
  );
}
