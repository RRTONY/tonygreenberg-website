import type { Metadata } from "next";
import { FindYourAttachmentStyleQuiz } from "@/components/assessments/find-your-attachment-style-quiz";

export const metadata: Metadata = {
  title: "Find Your Attachment Style",
  description: "Discover your attachment style and how it shapes your relationships.",
  alternates: { canonical: "/find-your-attachment-style" },
};

export default function FindYourAttachmentStylePage() {
  return <FindYourAttachmentStyleQuiz />;
}
