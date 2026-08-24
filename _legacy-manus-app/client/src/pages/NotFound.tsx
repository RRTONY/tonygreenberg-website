import { useEffect, useState } from "react";

export default function NotFound() {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.replace("https://tonygreenberg.com/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF7]">
      <div className="text-center max-w-md px-6">
        <h1
          className="text-6xl font-bold text-[#0A0A10] mb-4"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          404
        </h1>
        <p
          className="text-lg text-[#0A0A10]/70 mb-6"
          style={{ fontFamily: "Source Sans 3, sans-serif" }}
        >
          This page doesn't exist. Redirecting you home...
        </p>
        <p
          className="text-sm text-[#8B6914] font-mono"
          style={{ fontFamily: "DM Mono, monospace" }}
        >
          Redirecting in {countdown}s
        </p>
        <a
          href="https://tonygreenberg.com/"
          className="mt-4 inline-block text-[#8B6914] underline hover:text-[#D4B96A] transition-colors"
          style={{ fontFamily: "Source Sans 3, sans-serif" }}
        >
          Go to tonygreenberg.com now →
        </a>
      </div>
    </div>
  );
}
