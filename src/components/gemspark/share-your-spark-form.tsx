"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle, Loader2, Send } from "lucide-react";
import { submitGemSparkStory } from "@/app/gem-spark/actions";

// Ported from the GemSpark app's components/ShareYourSparkForm.tsx. Same copy and form; the story
// goes to Supabase (gemspark_story_submissions) and Tony gets an email, as the app's
// stories.submit did. While sending, the button shows a spinner with its own label.
export function ShareYourSparkForm() {
  const [story, setStory] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!story.trim() || status === "loading") return;

    if (story.trim().length < 10) {
      setStatus("error");
      setErrorMessage("Please share a bit more of your story (at least 10 characters).");
      return;
    }

    setStatus("loading");
    setErrorMessage("");
    try {
      const result = await submitGemSparkStory({ story: story.trim(), email: email.trim() || undefined });
      if (result.ok) {
        setStatus("success");
        setStory("");
        setEmail("");
      } else {
        setStatus("error");
        setErrorMessage(result.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-[#EAECEE] bg-white p-8 shadow-sm md:p-12">
        <div className="py-8 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle aria-hidden="true" className="size-8 text-green-600" />
          </div>
          <h3 className="mb-2 font-serif text-2xl text-[#2C3E50] italic">Your GemSpark Has Been Received</h3>
          <p className="mb-6 font-light text-[#5D6D7E]">
            You&apos;re now in the running for the inaugural GemSpark Award. We&apos;ll be in touch if yours is the
            one that lands hardest. Keep noticing. Keep naming.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="text-[#2C3E50] underline decoration-1 underline-offset-4 transition-colors hover:text-[#1A252F]"
          >
            Share another story
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#EAECEE] bg-white p-8 shadow-sm md:p-12">
      <h2 className="mb-6 font-serif text-3xl text-[#2C3E50] italic md:text-4xl">Submit Your GemSpark</h2>
      <p className="mb-8 text-xl leading-relaxed font-light text-[#34495E] md:text-2xl">
        You noticed one. You named it. Now share it. Tell us what happened, what you noticed, and what shifted when
        you called it a GemSpark. The most powerful submission in the next five days earns the inaugural GemSpark
        Award.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="gemspark-story"
            className="mb-2 block text-sm font-medium tracking-wider text-[#5D6D7E] uppercase"
          >
            Your GemSpark
          </label>
          <textarea
            id="gemspark-story"
            rows={4}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            className="w-full resize-none rounded-xl border-none bg-[#F8F9F9] p-4 text-lg text-[#2C3E50] transition-all placeholder:text-[#95A5A6] focus:ring-2 focus:ring-[#D4E6F1]"
            placeholder="I had a GemSpark when..."
            disabled={status === "loading"}
          />
        </div>
        <div>
          <label
            htmlFor="gemspark-email"
            className="mb-2 block text-sm font-medium tracking-wider text-[#5D6D7E] uppercase"
          >
            Email (Optional)
          </label>
          <input
            type="email"
            id="gemspark-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border-none bg-[#F8F9F9] p-4 text-lg text-[#2C3E50] transition-all placeholder:text-[#95A5A6] focus:ring-2 focus:ring-[#D4E6F1]"
            placeholder="you@example.com"
            disabled={status === "loading"}
          />
        </div>

        {status === "error" && (
          <p role="alert" className="text-sm text-red-500">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading" || !story.trim()}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#2C3E50] py-4 text-lg font-medium text-white transition-colors hover:bg-[#1A252F] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "loading" ? (
            <>
              <Loader2 aria-hidden="true" className="size-5 animate-spin" />
              <span>Submit My GemSpark</span>
            </>
          ) : (
            <>
              <span>Submit My GemSpark</span>
              <Send aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
