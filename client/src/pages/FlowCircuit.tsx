import { useEffect } from "react";
import SEO from "@/components/SEO";

/**
 * Flow Circuit — redirects to flow.tonygreenberg.com
 * The Flow Circuit app is a full separate application that cannot be embedded via iframe.
 * This route provides a canonical tonygreenberg.com URL that redirects to the live app.
 */
export default function FlowCircuit() {
  useEffect(() => {
    window.location.replace("https://flow.tonygreenberg.com");
  }, []);

  return (
    <>
    <SEO
        title="Flow Circuit — Flow State Assessment"
        description="Identify the conditions, triggers, and blockers of your flow state. A diagnostic tool by Tony Greenberg."
        path="/flow-circuit"
        keywords="Tony Greenberg, flow state, peak performance, flow assessment"
        indexable={true}
      />
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A10]">
      <p className="text-white/60 font-mono text-sm tracking-wider">
        Loading Flow Circuit...
      </p>
    </div>
    </>);
}
