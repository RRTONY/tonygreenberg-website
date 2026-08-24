/*
 * SERIES — "The Collections"
 * Landing page showing all curated essay series
 */

import { Link } from "wouter";
import {
  Section,
  SectionTitle,
  Eyebrow,
  Spacer,
  FadeIn,
  NextPage,
} from "@/components/Editorial";
import { seriesData } from "@/data/seriesData";
import blogData from "@/data/blogData.json";
import SEO from "@/components/SEO";

interface Post {
  slug: string;
  title: string;
  category: string;
  image: string;
  summary: string;
}

const posts = (blogData as (Post & { unpublished?: boolean })[]).filter(p => !p.unpublished);

const categoryColors: Record<string, string> = {
  "Business & Capital": "#1565C0",
  "Systems & Innovation": "#7B2D8E",
  "Culture & Communication": "#C75B12",
  "Living Well": "#2E7D32",
  "Impact & Purpose": "#00695C",
  "The Crusades": "#B71C1C",
};

export default function SeriesPage() {
  return (
    <div>
      <SEO
        title="Series"
        description="Curated essay collections — multi-part investigations into blockchain, trust, communication, and the future of business."
        path="/series"
        indexable={true}
      />

      {/* ── HERO ── */}
      <div
        style={{
          padding: "4rem 2rem 3rem",
          background: "linear-gradient(180deg, #FAFAF7 0%, #F5F0E8 100%)",
        }}
      >
        <Section>
          <FadeIn>
            <Link
              href="/"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase" as const,
                color: "#8B6914",
                textDecoration: "none",
                display: "inline-block",
                marginBottom: "1.5rem",
              }}
            >
              &larr; Back to The Blog
            </Link>

            <Eyebrow>The Collections</Eyebrow>
            <SectionTitle>Essay Series</SectionTitle>
            <p
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "1.15rem",
                color: "#444",
                lineHeight: 1.7,
                maxWidth: "640px",
              }}
            >
              Some ideas need more than one essay. These are the multi-part
              investigations — threads that weave through blockchain, trust,
              communication, and the future of business.
            </p>
          </FadeIn>
        </Section>
      </div>

      <Spacer />

      {/* ── SERIES GRID ── */}
      <Section>
        <div style={{ display: "grid", gap: "2.5rem" }}>
          {seriesData.map((series) => {
            const color = categoryColors[series.category] || "#8B6914";
            const seriesPosts = series.posts
              .map((slug) => posts.find((p) => p.slug === slug))
              .filter(Boolean) as Post[];
            const firstPost = seriesPosts[0];

            return (
              <FadeIn key={series.id}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: firstPost?.image
                      ? "minmax(0, 1fr) 280px"
                      : "1fr",
                    gap: "2rem",
                    padding: "2rem",
                    background: "#fff",
                    border: "1px solid #E8E3D8",
                    borderRadius: "4px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#D4B96A";
                    e.currentTarget.style.boxShadow =
                      "0 4px 20px rgba(139,105,20,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#E8E3D8";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Content */}
                  <div>
                    {/* Category badge */}
                    <div
                      style={{
                        display: "inline-block",
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.68rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase" as const,
                        color: color,
                        background: `${color}12`,
                        padding: "0.2rem 0.6rem",
                        borderRadius: "2px",
                        marginBottom: "0.8rem",
                      }}
                    >
                      {series.category} &middot; {series.posts.length} Parts
                    </div>

                    {/* Title */}
                    <h2
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.6rem",
                        fontWeight: 700,
                        color: "#111",
                        lineHeight: 1.2,
                        marginBottom: "0.3rem",
                      }}
                    >
                      {series.title}
                    </h2>
                    <p
                      style={{
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontSize: "0.95rem",
                        color: "#8B6914",
                        marginBottom: "0.8rem",
                      }}
                    >
                      {series.subtitle}
                    </p>

                    {/* Description */}
                    <p
                      style={{
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontSize: "0.95rem",
                        color: "#555",
                        lineHeight: 1.7,
                        marginBottom: "1.2rem",
                      }}
                    >
                      {series.description}
                    </p>

                    {/* Episode list */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.35rem",
                      }}
                    >
                      {seriesPosts.map((sp, i) => (
                        <Link
                          key={sp.slug}
                          href={`/blog/${sp.slug}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            textDecoration: "none",
                            padding: "0.3rem 0.5rem",
                            borderRadius: "3px",
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                              "rgba(139,105,20,0.06)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          <span
                            style={{
                              fontFamily: "'DM Mono', monospace",
                              fontSize: "0.72rem",
                              color: "#bbb",
                              fontWeight: 600,
                              minWidth: "1.5rem",
                            }}
                          >
                            {i + 1}.
                          </span>
                          <span
                            style={{
                              fontFamily: "'Source Sans 3', sans-serif",
                              fontSize: "0.92rem",
                              color: "#8B6914",
                            }}
                          >
                            {sp.title}
                          </span>
                        </Link>
                      ))}
                    </div>

                    {/* Start reading CTA */}
                    <Link
                      href={`/blog/${series.posts[0]}`}
                      style={{
                        display: "inline-block",
                        marginTop: "1.2rem",
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.78rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase" as const,
                        color: "#8B6914",
                        textDecoration: "none",
                        borderBottom: "1px solid #D4B96A",
                        paddingBottom: "2px",
                      }}
                    >
                      Start Reading &rarr;
                    </Link>
                  </div>

                  {/* Thumbnail */}
                  {firstPost?.image && (
                    <div
                      style={{
                        borderRadius: "4px",
                        overflow: "hidden",
                        alignSelf: "start",
                      }}
                    >
                      <img
                        src={firstPost.image}
                        alt={series.title}
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </div>
                  )}
                </div>
              </FadeIn>
            );
          })}
        </div>
      </Section>

      <Spacer />

      <NextPage href="/the-index" label="Search All Essays" />
    </div>
  );
}
