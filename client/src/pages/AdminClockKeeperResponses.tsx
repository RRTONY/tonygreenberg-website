import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

const QUESTIONS = [
  { id: "q1", label: "Q1", category: "Core Technology", text: "You've spent 50 years watching systems fail. What's the earliest pattern you remember recognizing — the first time you saw something everyone else missed — and how old were you?" },
  { id: "q2", label: "Q2", category: "Core Technology", text: "You've built a meta-pattern recognition engine that runs across technology, consciousness, relationships, and capital markets simultaneously. Describe the architecture. Not metaphorically — operationally. How does information from one domain actually inform decisions in another?" },
  { id: "q3", label: "Q3", category: "Core Technology", text: "The RampRate SPY Index holds 1M+ data points. ImpactSoul tokenizes cultural assets. Your psychedelic investments target FDA breakthrough therapy. These look like separate ventures. Map the hidden connections. What's the unified theory?" },
  { id: "q4", label: "Q4", category: "Urgent Corrections", text: "You've been strategically invisible for 50 years. Name three things you should have said publicly — and didn't — that would have changed outcomes for other people. Not regrets. Corrections." },
  { id: "q5", label: "Q5", category: "Urgent Corrections", text: "You've watched extractive capitalism consume psychedelic medicine, impact investing, and enterprise technology. You've named it in writing. But naming isn't stopping it. What's your actual plan to stop it — not document it, stop it — in at least one of these domains before you can't?" },
  { id: "q6", label: "Q6", category: "Urgent Corrections", text: "Your B Corp certification, your token ecosystems, your regenerative frameworks — are they actually regenerative, or are they the most sophisticated version of the same extraction you critique? Prove the difference with numbers." },
  { id: "q7", label: "Q7", category: "Ensemble Mastery", text: "You describe yourself as someone who hears the ensemble when others hear noise. Play the ensemble right now. Take any three of your current investments or projects and show me how they create a sound together that none of them makes alone." },
  { id: "q8", label: "Q8", category: "Ensemble Mastery", text: "You've built relationships with Paul Stamets, consciousness researchers, Fortune 500 CIOs, and impact investors. These people don't usually talk to each other. What do you know about connecting unlike minds that most 'network builders' get wrong?" },
  { id: "q9", label: "Q9", category: "Ensemble Mastery", text: "Your writing moves between corporate accountability journalism, consciousness exploration, relationship frameworks, and food criticism — sometimes in the same week. Most people would call this unfocused. You'd call it something else. What's the word, and why is everyone else wrong about focus?" },
  { id: "q10", label: "Q10", category: "Transmission", text: "You have operational knowledge that will die with you if you don't transmit it. Not your opinions — your pattern recognition methodology. The thing that lets you see what others can't. Can you teach it? Have you tried? What happened?" },
  { id: "q11", label: "Q11", category: "Transmission", text: "If you had to compress everything you know into a single decision framework — something someone could actually use tomorrow morning — what would it look like? Not a philosophy. A tool." },
  { id: "q12", label: "Q12", category: "Transmission", text: "The Clock Keeper has been watching for 50 years. The clocks are getting louder. Some are about to stop. If this is your last chance to say the thing you've been holding back — the observation that's too dangerous, too honest, or too strange to publish — what is it?" },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Core Technology": "#8B6914",
  "Urgent Corrections": "#DC143C",
  "Ensemble Mastery": "#6A5ACD",
  "Transmission": "#2E8B57",
};

function AdminClockKeeperResponses() {
  const { user, loading: authLoading } = useAuth();
  const { data: responses, isLoading } = trpc.clockKeeper.listResponses.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
    retry: false,
  });
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (authLoading || isLoading) {
    return (
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "center",
        minHeight: "60vh", fontFamily: "'DM Mono', monospace", fontSize: "0.85rem",
        color: "#999", letterSpacing: "0.1em",
      }}>
        Loading responses...
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div style={{
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        minHeight: "60vh", fontFamily: "'Source Serif 4', serif", color: "#666",
        gap: "1rem", padding: "2rem",
      }}>
        <div style={{ fontSize: "3rem" }}>🔒</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "#0A0A10" }}>
          Admin Access Required
        </h2>
        <p>This page is only accessible to site administrators.</p>
      </div>
    );
  }

  const responseList = responses || [];

  return (
    <div style={{
      maxWidth: "1000px",
      margin: "0 auto",
      padding: "3rem 2rem",
      fontFamily: "'Source Serif 4', 'Georgia', serif",
    }}>
      {/* Header */}
      <div style={{ marginBottom: "3rem" }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.72rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#8B6914",
          marginBottom: "0.5rem",
        }}>
          ADMIN · CLOCK KEEPER CHRONICLES
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "2.2rem",
          fontWeight: 700,
          color: "#0A0A10",
          marginBottom: "0.5rem",
          lineHeight: 1.2,
        }}>
          Part II Responses
        </h1>
        <p style={{ color: "#666", fontSize: "1rem" }}>
          {responseList.length === 0
            ? "No responses yet. When someone submits answers to the 12 questions, they'll appear here."
            : `${responseList.length} response${responseList.length !== 1 ? "s" : ""} received`}
        </p>
      </div>

      {/* Response Cards */}
      {responseList.map((response: any) => {
        const isExpanded = expandedId === response.id;
        const answeredQuestions = QUESTIONS.filter(q => response[q.id]);
        const answeredCount = answeredQuestions.length;
        const createdAt = new Date(response.createdAt);

        return (
          <div
            key={response.id}
            style={{
              marginBottom: "1.5rem",
              border: "1px solid rgba(139,105,20,0.15)",
              borderRadius: "8px",
              overflow: "hidden",
              background: isExpanded ? "#FAFAF7" : "#fff",
              transition: "all 0.2s ease",
            }}
          >
            {/* Summary Header (clickable) */}
            <div
              onClick={() => setExpandedId(isExpanded ? null : response.id)}
              style={{
                padding: "1.2rem 1.5rem",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: isExpanded ? "1px solid rgba(139,105,20,0.1)" : "none",
              }}
            >
              <div>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.15rem",
                  fontWeight: 600,
                  color: "#0A0A10",
                  marginBottom: "0.25rem",
                }}>
                  {response.respondentName || "Anonymous"}
                </div>
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  color: "#888",
                  letterSpacing: "0.05em",
                }}>
                  {createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  {" · "}
                  {createdAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                  {response.respondentEmail && ` · ${response.respondentEmail}`}
                  {" · "}
                  {answeredCount}/12 questions answered
                  {response.reframe && " · includes reframe"}
                </div>
              </div>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "1.2rem",
                color: "#D4B96A",
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}>
                ▾
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div style={{ padding: "1.5rem" }}>
                {/* Group by category */}
                {["Core Technology", "Urgent Corrections", "Ensemble Mastery", "Transmission"].map(category => {
                  const categoryQuestions = QUESTIONS.filter(q => q.category === category && response[q.id]);
                  if (categoryQuestions.length === 0) return null;

                  return (
                    <div key={category} style={{ marginBottom: "2rem" }}>
                      <div style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.7rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: CATEGORY_COLORS[category],
                        marginBottom: "1rem",
                        paddingBottom: "0.4rem",
                        borderBottom: `2px solid ${CATEGORY_COLORS[category]}22`,
                      }}>
                        {category}
                      </div>

                      {categoryQuestions.map(q => (
                        <div key={q.id} style={{ marginBottom: "1.5rem" }}>
                          <div style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "0.92rem",
                            color: "#888",
                            fontStyle: "italic",
                            marginBottom: "0.5rem",
                            lineHeight: 1.5,
                          }}>
                            <span style={{
                              fontFamily: "'DM Mono', monospace",
                              fontSize: "0.72rem",
                              color: CATEGORY_COLORS[category],
                              fontStyle: "normal",
                              fontWeight: 700,
                              marginRight: "0.5rem",
                            }}>
                              {q.label}
                            </span>
                            {q.text}
                          </div>
                          <div style={{
                            fontFamily: "'Source Serif 4', serif",
                            fontSize: "1.05rem",
                            color: "#222",
                            lineHeight: 1.8,
                            paddingLeft: "1rem",
                            borderLeft: `3px solid ${CATEGORY_COLORS[category]}33`,
                            whiteSpace: "pre-wrap",
                          }}>
                            {response[q.id]}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}

                {/* Reframe */}
                {response.reframe && (
                  <div style={{ marginBottom: "1rem" }}>
                    <div style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.7rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "#0A0A10",
                      marginBottom: "1rem",
                      paddingBottom: "0.4rem",
                      borderBottom: "2px solid rgba(10,10,16,0.1)",
                    }}>
                      THE REFRAME
                    </div>
                    <div style={{
                      fontFamily: "'Source Serif 4', serif",
                      fontSize: "1.05rem",
                      color: "#222",
                      lineHeight: 1.8,
                      paddingLeft: "1rem",
                      borderLeft: "3px solid rgba(10,10,16,0.2)",
                      whiteSpace: "pre-wrap",
                    }}>
                      {response.reframe}
                    </div>
                  </div>
                )}

                {/* Unanswered questions */}
                {answeredCount < 12 && (
                  <div style={{
                    marginTop: "1.5rem",
                    padding: "1rem",
                    background: "rgba(139,105,20,0.04)",
                    borderRadius: "6px",
                  }}>
                    <div style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.7rem",
                      letterSpacing: "0.1em",
                      color: "#999",
                      marginBottom: "0.5rem",
                    }}>
                      UNANSWERED ({12 - answeredCount})
                    </div>
                    <div style={{
                      fontFamily: "'Source Serif 4', serif",
                      fontSize: "0.88rem",
                      color: "#999",
                      lineHeight: 1.6,
                    }}>
                      {QUESTIONS.filter(q => !response[q.id]).map(q => q.label).join(", ")}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default AdminClockKeeperResponses;
