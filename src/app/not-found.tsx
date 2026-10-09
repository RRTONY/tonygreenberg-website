import type { Metadata } from "next";
import { NotFoundRedirect } from "@/components/not-found-redirect";

// A Server Component so the page can set its own title; the countdown that
// sends visitors home lives in NotFoundRedirect (a Client Component).
export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return <NotFoundRedirect />;
}
