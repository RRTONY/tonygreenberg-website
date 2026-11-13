"use client";

import { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { CheckCircle, Loader2, Send } from "lucide-react";
import { submitGemSparkStory } from "@/app/gem-spark/actions";

// Ported from the GemSpark app's components/ShareYourSparkForm.tsx. Same copy and form; the story
// goes to Supabase (gemspark_story_submissions) and Tony gets an email, as the app's
// stories.submit did. While sending, the button shows a spinner with its own label.

// Same limits submitGemSparkStory enforces (10..10,000 characters; email optional, max 320).
// The email may be left empty (rule 17): Yup's email() skips "".
const schema = Yup.object({
  story: Yup.string()
    .trim()
    .required("Please share your story.")
    .min(10, "Please share a bit more of your story (at least 10 characters).")
    .max(10000, "Keep it under 10,000 characters."),
  email: Yup.string().trim().email("That email address doesn't look right.").max(320, "That email address is too long."),
});

type Values = Yup.InferType<typeof schema>;

const errorClass = "mt-2 text-sm text-red-500";

export function ShareYourSparkForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (values: Values) => {
    setStatus("idle");
    setErrorMessage("");
    try {
      const result = await submitGemSparkStory({ story: values.story.trim(), email: values.email?.trim() || undefined });
      if (result.ok) {
        setStatus("success");
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

      <Formik<Values> initialValues={{ story: "", email: "" }} validationSchema={schema} onSubmit={handleSubmit}>
        {({ isSubmitting, values, errors, touched }) => {
          const storyInvalid = Boolean(touched.story && errors.story);
          const emailInvalid = Boolean(touched.email && errors.email);
          return (
            <Form noValidate className="space-y-6">
              <div>
                <label
                  htmlFor="gemspark-story"
                  className="mb-2 block text-sm font-medium tracking-wider text-[#5D6D7E] uppercase"
                >
                  Your GemSpark
                </label>
                <Field
                  as="textarea"
                  id="gemspark-story"
                  name="story"
                  rows={4}
                  className="w-full resize-none rounded-xl border-none bg-[#F8F9F9] p-4 text-lg text-[#2C3E50] transition-all placeholder:text-[#95A5A6] focus:ring-2 focus:ring-[#D4E6F1]"
                  placeholder="I had a GemSpark when..."
                  required
                  disabled={isSubmitting}
                  aria-invalid={storyInvalid}
                  aria-describedby={storyInvalid ? "gemspark-story-error" : undefined}
                />
                <ErrorMessage
                  name="story"
                  render={(msg) => (
                    <p id="gemspark-story-error" role="alert" className={errorClass}>
                      {msg}
                    </p>
                  )}
                />
              </div>
              <div>
                <label
                  htmlFor="gemspark-email"
                  className="mb-2 block text-sm font-medium tracking-wider text-[#5D6D7E] uppercase"
                >
                  Email (Optional)
                </label>
                <Field
                  type="email"
                  id="gemspark-email"
                  name="email"
                  className="w-full rounded-xl border-none bg-[#F8F9F9] p-4 text-lg text-[#2C3E50] transition-all placeholder:text-[#95A5A6] focus:ring-2 focus:ring-[#D4E6F1]"
                  placeholder="you@example.com"
                  disabled={isSubmitting}
                  aria-invalid={emailInvalid}
                  aria-describedby={emailInvalid ? "gemspark-email-error" : undefined}
                />
                <ErrorMessage
                  name="email"
                  render={(msg) => (
                    <p id="gemspark-email-error" role="alert" className={errorClass}>
                      {msg}
                    </p>
                  )}
                />
              </div>

              {status === "error" && (
                <p role="alert" className="text-sm text-red-500">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !values.story.trim()}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#2C3E50] py-4 text-lg font-medium text-white transition-colors hover:bg-[#1A252F] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
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
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
