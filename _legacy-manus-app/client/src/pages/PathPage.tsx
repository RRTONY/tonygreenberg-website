import { useMemo, useState } from "react";
import { Link, useParams } from "wouter";
import { ARCHETYPES, AUTHORITY_ITEMS, type ArchetypeKey } from "@/data/archetypes";
import blogData from "@/data/blogData.json";
import { trpc } from "@/lib/trpc";

interface Post { slug: string; title: string; excerpt: string; category: string; heroImage?: string; }

export default function PathPage() {
  const params = useParams<{ archetype: string }>();
  const key = params.archetype as ArchetypeKey;
  const arch = ARCHETYPES[key];
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const subscribeMutation = trpc.subscribe.add.useMutation({
    onSuccess: () => setSubscribed(true),
  });

  const handleSubscribe = () => {
    if (!email || subscribed) return;
    subscribeMutation.mutate({ email, source: `path-${key}` });
  };

  const posts = useMemo(() => {
    if (!arch) return [];
    return (blogData as Post[]).filter((p) => arch.categories.includes(p.category)).slice(0, 5);
  }, [arch]);

  if (!arch) {
    return (
      <div style={{ background: "#FAFAF7", minHeight: "100vh", padding: "80px 24px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#111" }}>Path not found</h1>
        <Link href="/" style={{ color: "#8B6914" }}>← Back to home</Link>
      </div>
    );
  }

  return (
    <div style={{ background: "#FAFAF7", minHeight: "100vh" }}>
      <div style={{ background: "#1A1A1A", padding: "10px 0", textAlign: "center", letterSpacing: "0.15em", fontSize: "11px", fontFamily: "'DM Mono', monospace", color: "#D4B96A" }}>
        {AUTHORITY_ITEMS.join("  ·  ")}
      </div>
      <div style={{ textAlign: "center", padding: "60px 24px 40px" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>{arch.icon}</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 5vw, 52px)", color: "#111", marginBottom: 8 }}>{arch.name}</h1>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, letterSpacing: "0.2em", color: "#8B6914", textTransform: "uppercase", marginBottom: 24 }}>{arch.tagline}</div>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 18, color: "#333", lineHeight: 1.7, maxWidth: 600, margin: "0 auto" }}>{arch.description}</p>
      </div>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 40px" }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.2em", color: "#8B6914", textTransform: "uppercase", textAlign: "center", marginBottom: 32 }}>
          Essential Reading for the {arch.name.replace("The ", "")}s
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ display: "flex", gap: 16, background: "#fff", border: "1px solid #E8E4DA", borderRadius: 8, padding: 16, textDecoration: "none", transition: "border-color 0.2s" }}>
              {post.heroImage && <img src={post.heroImage} alt="" sizes="80px" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} loading="lazy" />}
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: "#8B6914", textTransform: "uppercase", marginBottom: 4 }}>{post.category}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: "#111", lineHeight: 1.3, marginBottom: 6 }}>{post.title}</div>
                <div style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 14, color: "#555", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{post.excerpt}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div style={{ textAlign: "center", padding: "40px 24px" }}>
        <Link href="/assessment" style={{ display: "inline-block", background: "#8B6914", color: "#fff", fontFamily: "'DM Mono', monospace", fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase", padding: "14px 32px", borderRadius: 4, textDecoration: "none" }}>Take the Assessment →</Link>
      </div>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 24px 40px", textAlign: "center" }}>
        <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 15, color: "#444", marginBottom: 12 }}>Get {arch.name.toLowerCase()} essays delivered weekly.</p>
        <div style={{ display: "flex", gap: 8 }}>
          <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ flex: 1, padding: "10px 14px", border: "1px solid #D4C9A8", borderRadius: 4, fontFamily: "'Source Sans 3', sans-serif", fontSize: 15, background: "#fff", color: "#222" }} />
          <button
            onClick={handleSubscribe}
            disabled={subscribeMutation.isPending || subscribed || !email}
            style={{
              background: subscribed ? "#2D5A27" : "#8B6914",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "10px 20px",
              fontFamily: "'DM Mono', monospace",
              fontSize: 12,
              letterSpacing: "0.1em",
              cursor: subscribed ? "default" : "pointer",
              opacity: subscribeMutation.isPending ? 0.7 : 1,
            }}
          >
            {subscribed ? "Subscribed ✓" : subscribeMutation.isPending ? "..." : "Subscribe"}
          </button>
        </div>
      </div>
      <div style={{ textAlign: "center", padding: "0 24px 80px" }}>
        <a href="https://impactsoul.is" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.1em", color: "#8B6914", textDecoration: "none" }}>Explore ImpactSoul →</a>
      </div>
    </div>
  );
}
