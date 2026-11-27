import { AqueousNotFound } from "@/components/aqueous/pages/not-found";

// Ported from the Aqueous app's client/src/pages/NotFound.tsx (2026-11-24). Any notFound() or unknown
// path under /aqueous renders this inside the Aqueous layout (its nav and footer). A not-found file
// can't export metadata; Next.js adds the noindex robots tag to 404s itself.
export default function AqueousNotFoundPage() {
  return <AqueousNotFound />;
}
