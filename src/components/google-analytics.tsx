import Script from "next/script";

// Google Analytics 4, ported from legacy client/index.html (same property,
// G-4GVW40S47N) so visitor stats carry on after the switch from Manus. Plain
// next/script rather than @next/third-parties (that would be a new package).
// Only tonygreenberg.com is counted: Netlify previews and localhost are left
// out entirely (legacy sent them as "internal" traffic instead), so test
// visits never reach the real reports. Page changes inside the site are
// counted by GA4's own "page changes based on browser history" setting
// (Enhanced measurement, on by default for the data stream).
const MEASUREMENT_ID = "G-4GVW40S47N";

export function GoogleAnalytics() {
  return (
    <Script id="google-analytics" strategy="afterInteractive">
      {`(function () {
  var h = window.location.hostname;
  if (h !== "tonygreenberg.com" && h !== "www.tonygreenberg.com") return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", "${MEASUREMENT_ID}", { cookie_flags: "SameSite=None;Secure" });
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}";
  document.head.appendChild(s);
})();`}
    </Script>
  );
}
