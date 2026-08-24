import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Redirects old manifesto sub-routes to the consolidated page with anchor.
 * /attention-theft/economics → /attention-theft#heresy
 * /attention-theft/blocker-finder → /attention-theft#blocker-finder
 * /attention-theft/legal → /attention-theft#legal
 * /attention-theft/weapons → /attention-theft#weapons
 * /attention-theft/report → /attention-theft#report
 */
const ROUTE_TO_ANCHOR: Record<string, string> = {
  "/attention-theft/economics": "#heresy",
  "/attention-theft/blocker-finder": "#blocker-finder",
  "/attention-theft/legal": "#legal",
  "/attention-theft/weapons": "#weapons",
  "/attention-theft/report": "#report",
};

export default function ManifestoRedirect() {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const anchor = ROUTE_TO_ANCHOR[location];
    if (anchor) {
      setLocation("/attention-theft");
      // After navigation, scroll to the anchor
      setTimeout(() => {
        const el = document.getElementById(anchor.replace("#", ""));
        if (el) {
          const offset = 80;
          const top = el.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 300);
    }
  }, [location, setLocation]);

  return null;
}
