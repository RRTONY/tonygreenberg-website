"use client";

import { useEffect, useRef, useState } from "react";

// The "90-day commitment" questions on /america-unbundled-field-guide.
// Ported from the live page's inline script: answers stay on the visitor's
// device (localStorage, same key as live so anyone who saved there keeps
// their answers after cutover), can be copied as text, or downloaded as a
// .txt file. Nothing is sent to a server.
const STORAGE_KEY = "america-unbundled-responses-v1";

const QUESTIONS = [
  { name: "q1", label: "one", text: "When the side you usually agree with is wrong, will you say so?" },
  { name: "q2", label: "two", text: "Which liberty are you unwilling to trade away for convenience or victory?" },
  { name: "q3", label: "three", text: "What power should be constrained no matter who holds it?" },
  { name: "q4", label: "four", text: "What evidence would change your mind?" },
  { name: "q5", label: "five", text: "What are you willing to do beyond posting an opinion?" },
  { name: "q6", label: "six", text: "Who can you build with even when you disagree?" },
  { name: "q7", label: "seven", text: "Whose freedom matters when your own is secure?" },
  { name: "q8", label: "eight", text: "What local institution could you strengthen in the next ninety days?" },
  { name: "q9", label: "nine", text: "What do you want government to stop doing, and what must it still protect?" },
  { name: "q10", label: "ten", text: "What future are you willing to build with people outside your tribe?" },
];

export function FieldGuideResponses() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState("");

  // Restore saved answers into the (uncontrolled) textareas after mount.
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as Record<string, string>;
      for (const q of QUESTIONS) {
        const field = form.elements.namedItem(q.name);
        if (field instanceof HTMLTextAreaElement && saved[q.name]) field.value = saved[q.name];
      }
    } catch {
      // Storage unavailable (private mode, blocked): start empty.
    }
  }, []);

  function values(): Record<string, string> {
    const form = formRef.current;
    const out: Record<string, string> = {};
    for (const q of QUESTIONS) {
      const field = form?.elements.namedItem(q.name);
      out[q.name] = field instanceof HTMLTextAreaElement ? field.value.trim() : "";
    }
    return out;
  }

  function textVersion() {
    const v = values();
    return QUESTIONS.map((q, i) => `${i + 1}. ${q.text}\n${v[q.name] || "[No response]"}`).join("\n\n");
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values()));
      setStatus("Saved privately on this device.");
    } catch {
      setStatus("This browser would not let the page save. Try Copy or Download instead.");
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(textVersion());
      setStatus("Answers copied.");
    } catch {
      setStatus("Copy was blocked by the browser. Try Download instead.");
    }
  }

  function download() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([textVersion()], { type: "text/plain" }));
    a.download = "america-unbundled-90-day-commitment.txt";
    a.click();
    URL.revokeObjectURL(a.href);
    setStatus("Answers downloaded.");
  }

  return (
    <>
      <form ref={formRef} className="mt-8 grid gap-x-7 gap-y-8 md:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        {QUESTIONS.map((q, i) => (
          <label key={q.name} className="flex flex-col gap-3 border-t border-border pt-5">
            <span className="font-serif text-lg leading-snug text-balance text-foreground">
              {String(i + 1).padStart(2, "0")} · {q.text}
            </span>
            <textarea
              name={q.name}
              aria-label={`Answer question ${q.label}`}
              rows={4}
              className="min-h-24 w-full resize-y border border-foreground/30 bg-card p-3 font-serif text-base text-foreground focus-visible:border-[#5b3ca8] focus-visible:ring-2 focus-visible:ring-[#5b3ca8]/30 focus-visible:outline-none dark:focus-visible:border-[#b3a1ec]"
            />
          </label>
        ))}
      </form>
      <div className="mt-8 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={save}
          className="min-h-11 border border-foreground px-4 text-xs font-bold tracking-[0.08em] text-foreground uppercase transition-colors hover:bg-foreground hover:text-background"
        >
          Save privately
        </button>
        <button
          type="button"
          onClick={copy}
          className="min-h-11 border border-foreground px-4 text-xs font-bold tracking-[0.08em] text-foreground uppercase transition-colors hover:bg-foreground hover:text-background"
        >
          Copy answers
        </button>
        <button
          type="button"
          onClick={download}
          className="min-h-11 border border-foreground px-4 text-xs font-bold tracking-[0.08em] text-foreground uppercase transition-colors hover:bg-foreground hover:text-background"
        >
          Download
        </button>
      </div>
      <p className="mt-3 min-h-6 text-sm text-muted-foreground" role="status" aria-live="polite">
        {status}
      </p>
    </>
  );
}
