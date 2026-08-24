import { useState, useRef, useEffect, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Section, Spacer, FadeIn } from "@/components/Editorial";
import { Streamdown } from "streamdown";
import { toast } from "sonner";

const SAMPLE_QUESTIONS = [
  "What's the biggest mistake CIOs make when negotiating cloud contracts?",
  "How do you evaluate a company's consciousness level?",
  "What's your investment thesis on psychedelic medicine?",
  "How do you think about the intersection of blockchain and impact?",
  "What's the difference between a Spark and an Amplifier in the Flow Circuit?",
  "Why did you start RampRate?",
  "What's your take on AI infrastructure right now?",
  "How do you decide which investments to make?",
];

const MAX_FREE_QUESTIONS = 3;

interface Message {
  role: "user" | "assistant";
  content: string;
}

function EngageCTA() {
  return (
    <FadeIn>
      <div
        style={{
          background: "#0A0A10",
          borderRadius: 20,
          padding: "48px 32px",
          textAlign: "center",
          maxWidth: 600,
          margin: "40px auto",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gold accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 80,
            height: 3,
            background: "linear-gradient(90deg, transparent, #D4B96A, transparent)",
          }}
        />

        <p
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.75rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#D4B96A",
            marginBottom: 16,
          }}
        >
          You've used your {MAX_FREE_QUESTIONS} free questions
        </p>

        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
            fontWeight: 700,
            color: "#FAFAF7",
            lineHeight: 1.2,
            marginBottom: 16,
          }}
        >
          Want the real thing?
        </h2>

        <p
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "1.05rem",
            lineHeight: 1.7,
            color: "#999",
            maxWidth: 440,
            margin: "0 auto 32px",
          }}
        >
          FauxTony is a digital echo. The real Tony has 25 years of pattern recognition,
          a Rolodex that would make a venture capitalist weep, and opinions that haven't
          been filtered through a language model.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
          <a
            href="/ecosystem"
            className="cta-glow"
            style={{
              display: "inline-block",
              background: "#D4B96A",
              color: "#0A0A10",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.82rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "14px 36px",
              borderRadius: 10,
              textDecoration: "none",
              fontWeight: 600,
              transition: "all 0.3s ease",
            }}
          >
            Join the Ecosystem &rarr;
          </a>

          <a
            href="/ecosystem"
            style={{
              display: "inline-block",
              border: "1px solid #444",
              color: "#D4B96A",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.78rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "12px 32px",
              borderRadius: 10,
              textDecoration: "none",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.borderColor = "#D4B96A";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.borderColor = "#444";
            }}
          >
            Subscribe to the Newsletter
          </a>

          <a
            href="/start-here"
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: "0.9rem",
              color: "#666",
              textDecoration: "underline",
              textUnderlineOffset: 4,
              marginTop: 8,
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.color = "#D4B96A";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.color = "#666";
            }}
          >
            Or start reading — the essays are free
          </a>
        </div>
      </div>
    </FadeIn>
  );
}

// Generate or retrieve a persistent session ID for FauxTony chats
function getFauxTonySessionId(): string {
  const KEY = "fauxTonySessionId";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = `ft_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(KEY, id);
  }
  return id;
}

export default function FauxTony() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [sessionId, setSessionId] = useState(() => getFauxTonySessionId());

  const clearChat = () => {
    // Generate a new session ID, preserving old conversation in DB
    const newId = `ft_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem("fauxTonySessionId", newId);
    setSessionId(newId);
    setMessages([]);
    setHistoryLoaded(false);
  };

  // Load chat history from DB on mount
  const historyQuery = trpc.fauxTony.getHistory.useQuery(
    { sessionId },
    { enabled: !!sessionId, refetchOnWindowFocus: false }
  );

  useEffect(() => {
    if (historyQuery.data && !historyLoaded) {
      const restored = historyQuery.data.messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));
      if (restored.length > 0) {
        setMessages(restored);
      }
      setHistoryLoaded(true);
    }
  }, [historyQuery.data, historyLoaded]);

  // Count user questions
  const userQuestionCount = useMemo(
    () => messages.filter((m) => m.role === "user").length,
    [messages]
  );
  const isLocked = userQuestionCount >= MAX_FREE_QUESTIONS;
  const questionsRemaining = MAX_FREE_QUESTIONS - userQuestionCount;

  const askMutation = trpc.fauxTony.ask.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "The FauxTony circuits hit a snag. Try again \u2014 persistence is underrated." },
      ]);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (question: string) => {
    if (!question.trim() || askMutation.isPending || isLocked) return;
    const q = question.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: q }]);
    askMutation.mutate({
      question: q,
      sessionId,
      conversationHistory: messages.slice(-6),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(input);
    }
  };

  return (
    <div style={{ background: "#FAFAF7", minHeight: "100vh" }}>
      <Spacer />

      {/* Header */}
      <Section>
        <FadeIn>
          <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto" }}>
            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#8B6914",
                marginBottom: 12,
              }}
            >
              Ask Anything
            </p>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.2rem, 5vw, 3.2rem)",
                fontWeight: 700,
                color: "#0A0A10",
                lineHeight: 1.15,
                marginBottom: 16,
              }}
            >
              FauxTony
            </h1>
            <p
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "1.1rem",
                lineHeight: 1.7,
                color: "#444",
                maxWidth: 560,
                margin: "0 auto",
              }}
            >
              A digital echo trained on 91 essays, 39 RampRate articles, and 25 years of
              enterprise deals, psychedelic medicine, tokenized impact, and consciousness research.
              Ask a question. Get an answer that sounds like Tony — because it learned from everything he wrote.
            </p>
          </div>
        </FadeIn>
      </Section>

      <Spacer />

      {/* Chat Area */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 20px", paddingBottom: 60 }}>

        {/* Clear Chat + Question counter */}
        {messages.length > 0 && (
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <button
              onClick={clearChat}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#999",
                background: "none",
                border: "1px solid #ddd",
                borderRadius: 6,
                padding: "6px 16px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#8B6914'; e.currentTarget.style.borderColor = '#8B6914'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#999'; e.currentTarget.style.borderColor = '#ddd'; }}
            >
              Start Fresh
            </button>
          </div>
        )}
        {messages.length > 0 && !isLocked && (
          <div
            style={{
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: questionsRemaining === 1 ? "#B8860B" : "#999",
                background: questionsRemaining === 1 ? "rgba(184,134,11,0.08)" : "rgba(0,0,0,0.03)",
                padding: "6px 16px",
                borderRadius: 20,
                transition: "all 0.3s ease",
              }}
            >
              {questionsRemaining} question{questionsRemaining !== 1 ? "s" : ""} remaining
            </span>
          </div>
        )}

        {/* Messages */}
        {messages.length === 0 ? (
          <FadeIn>
            <div style={{ marginBottom: 40 }}>
              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#999",
                  marginBottom: 16,
                }}
              >
                Try asking...
              </p>
              <div className="stagger-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                {SAMPLE_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSubmit(q)}
                    className="card-lift"
                    style={{
                      background: "white",
                      border: "1px solid #e8e4dc",
                      borderRadius: 10,
                      padding: "14px 18px",
                      textAlign: "left",
                      cursor: "pointer",
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "0.95rem",
                      lineHeight: 1.5,
                      color: "#333",
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.borderColor = "#8B6914";
                      (e.target as HTMLElement).style.background = "#fefdfb";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.borderColor = "#e8e4dc";
                      (e.target as HTMLElement).style.background = "white";
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </FadeIn>
        ) : (
          <div style={{ marginBottom: 24 }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    maxWidth: msg.role === "user" ? "75%" : "90%",
                    padding: msg.role === "user" ? "14px 20px" : "20px 24px",
                    borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: msg.role === "user" ? "#0A0A10" : "white",
                    color: msg.role === "user" ? "#FAFAF7" : "#1a1a1a",
                    border: msg.role === "user" ? "none" : "1px solid #e8e4dc",
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: msg.role === "user" ? "1rem" : "1.05rem",
                    lineHeight: 1.75,
                  }}
                >
                  {msg.role === "assistant" ? (
                    <div>
                      <p
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: "0.7rem",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "#8B6914",
                          marginBottom: 10,
                        }}
                      >
                        FauxTony
                      </p>
                      <Streamdown>{msg.content}</Streamdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {askMutation.isPending && (
              <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 20 }}>
                <div
                  style={{
                    padding: "20px 24px",
                    borderRadius: "18px 18px 18px 4px",
                    background: "white",
                    border: "1px solid #e8e4dc",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.7rem",
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#8B6914",
                      marginBottom: 8,
                    }}
                  >
                    FauxTony
                  </p>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    {[0, 1, 2].map((d) => (
                      <div
                        key={d}
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#8B6914",
                          opacity: 0.4,
                          animation: `fauxPulse 1.4s ease-in-out ${d * 0.2}s infinite`,
                        }}
                      />
                    ))}
                    <style>{`
                      @keyframes fauxPulse {
                        0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
                        40% { opacity: 1; transform: scale(1.1); }
                      }
                    `}</style>
                    <span
                      style={{
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontSize: "0.9rem",
                        color: "#888",
                        marginLeft: 8,
                      }}
                    >
                      Thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Engagement CTA when locked */}
        {isLocked && <EngageCTA />}

        {/* Input Area — hidden when locked */}
        {!isLocked && (
          <div
            style={{
              position: "sticky",
              bottom: 20,
              background: "white",
              border: "1px solid #e0dcd4",
              borderRadius: 16,
              padding: "12px 16px",
              display: "flex",
              alignItems: "flex-end",
              gap: 12,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask FauxTony anything..."
              rows={1}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                resize: "none",
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "1rem",
                lineHeight: 1.5,
                color: "#1a1a1a",
                background: "transparent",
                minHeight: 24,
                maxHeight: 120,
              }}
            />
            <button
              onClick={() => handleSubmit(input)}
              disabled={!input.trim() || askMutation.isPending}
              style={{
                background: input.trim() ? "#0A0A10" : "#ccc",
                color: "white",
                border: "none",
                borderRadius: 10,
                padding: "10px 20px",
                cursor: input.trim() ? "pointer" : "default",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.8rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
            >
              {askMutation.isPending ? "..." : "Ask"}
            </button>
          </div>
        )}

        {/* Disclaimer */}
        <p
          style={{
            textAlign: "center",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.7rem",
            color: "#aaa",
            marginTop: 16,
            letterSpacing: "0.05em",
          }}
        >
          FauxTony is an AI approximation, not the real Tony. For the real thing, subscribe and reach out.
        </p>
        {/* Share Conversation Button */}
        {messages.length > 0 && <ShareConversationButton sessionId={sessionId} />}
      </div>
    </div>
  );
}

function ShareConversationButton({ sessionId }: { sessionId: string }) {
  const { isAuthenticated } = useAuth();
  const shareMutation = trpc.sharedChat.create.useMutation({
    onSuccess: (data) => {
      if (data.success && data.shareId) {
        const url = `${window.location.origin}/shared-chat/${data.shareId}`;
        navigator.clipboard.writeText(url);
        toast.success("Link copied! Share this conversation with anyone.");
      }
    },
    onError: () => toast.error("Couldn't share. Try again in a moment."),
  });
  if (!isAuthenticated) return null;
  return (
    <div style={{ textAlign: "center", marginTop: 12 }}>
      <button
        onClick={() => shareMutation.mutate({ sessionId })}
        disabled={shareMutation.isPending}
        style={{
          background: "none",
          border: "1px solid #d4b96a",
          color: "#8B6914",
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.72rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase" as const,
          padding: "8px 18px",
          borderRadius: 6,
          cursor: "pointer",
          opacity: shareMutation.isPending ? 0.5 : 1,
        }}
      >
        {shareMutation.isPending ? "Sharing..." : "Share This Conversation"}
      </button>
    </div>
  );
}
