import { useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";

interface ReadCounterProps {
  postSlug: string;
  version: "short" | "long";
}

/**
 * Live read counter that increments on page view and displays current count.
 * Shows both short and long version counts side by side.
 */
export default function ReadCounter({ postSlug, version }: ReadCounterProps) {
  const hasIncremented = useRef(false);

  const { data: counts } = trpc.articleReads.getCounts.useQuery(
    { postSlug },
    { staleTime: 30_000 }
  );

  const increment = trpc.articleReads.increment.useMutation();

  useEffect(() => {
    if (!hasIncremented.current) {
      hasIncremented.current = true;
      increment.mutate({ postSlug, version });
    }
  }, [postSlug, version]); // eslint-disable-line react-hooks/exhaustive-deps

  const shortCount = counts?.short || 0;
  const longCount = counts?.long || 0;

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      fontFamily: "'DM Mono', monospace",
      fontSize: "0.7rem",
      color: "#999",
      letterSpacing: "0.05em",
    }}>
      <span style={{ color: version === "short" ? "#8B6914" : "#999" }}>
        {shortCount.toLocaleString()} reads (essay)
      </span>
      <span style={{ color: "#ddd" }}>|</span>
      <span style={{ color: version === "long" ? "#8B6914" : "#999" }}>
        {longCount.toLocaleString()} reads (deep discourse)
      </span>
    </div>
  );
}
