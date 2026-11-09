import "./gemspark.css";

// The GemSpark, Tony's story about serendipity and synchronicity, ported from its Manus app
// (serensynch, exported 2026-11-10) as a standalone section like it was there: SiteChrome hides
// the main site's header and footer under /gem-spark. The app had no shared chrome of its own
// beyond each page's version switcher and progress bar.
export default function GemSparkLayout({ children }: LayoutProps<"/gem-spark">) {
  return <div className="gemspark-root">{children}</div>;
}
