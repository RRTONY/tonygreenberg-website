/**
 * ADMIN SPAM LINK GENERATOR
 * Quick tool to generate personalized "You've Been Reported" links.
 * Enter company name, domain, and email — get a scary link.
 */
import { useState, useCallback } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Copy, Check, ExternalLink, Skull, Flame, AlertTriangle, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QRCodeSVG } from "qrcode.react";

export default function AdminSpamLink() {
  const { user, loading } = useAuth();
  const [company, setCompany] = useState("");
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050202" }}>
        <div className="animate-pulse text-red-500 font-mono text-sm">LOADING ARSENAL...</div>
      </div>
    );
  }

  if (!user) {
    window.location.href = getLoginUrl();
    return null;
  }

  const baseUrl = "https://tonygreenberg.com";
  const params = new URLSearchParams();
  if (company.trim()) params.set("company", company.trim());
  if (domain.trim()) params.set("domain", domain.trim());
  if (email.trim()) params.set("email", email.trim());
  const generatedUrl = `${baseUrl}/youve-been-reported${params.toString() ? `?${params.toString()}` : ""}`;
  const hasInput = !!(company.trim() || domain.trim() || email.trim());

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [generatedUrl]);

  const handleOpen = useCallback(() => {
    window.open(generatedUrl, "_blank");
  }, [generatedUrl]);

  const handleAutoFillDomain = useCallback(() => {
    if (email.includes("@")) {
      const d = email.split("@")[1];
      if (d) setDomain(d);
    }
  }, [email]);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #050202 0%, #0A0505 40%, #1A0808 100%)" }}>
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-50"
        style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(200,22,26,0.02) 2px, rgba(200,22,26,0.02) 4px)" }} />

      <div className="relative z-10 max-w-2xl mx-auto px-5 pt-16 pb-24">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Skull size={32} style={{ color: "#C8161A", filter: "drop-shadow(0 0 12px rgba(200,22,26,0.6))" }} />
            <Flame size={28} style={{ color: "#C8161A", filter: "drop-shadow(0 0 8px rgba(200,22,26,0.4))" }} />
            <Skull size={32} style={{ color: "#C8161A", filter: "drop-shadow(0 0 12px rgba(200,22,26,0.6))" }} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-3"
            style={{ fontFamily: "'Fraunces', serif", color: "#F5F0E0", textShadow: "0 0 40px rgba(200,22,26,0.3)" }}>
            Spam <span style={{ color: "#C8161A" }}>Link Generator</span>
          </h1>
          <p className="text-sm font-mono tracking-wider" style={{ color: "rgba(245,240,224,0.5)" }}>
            ENTER SPAMMER DETAILS — GENERATE PERSONALIZED ENFORCEMENT LINK
          </p>
        </div>

        {/* Input Form */}
        <div className="space-y-5 mb-10">
          <div>
            <label className="block text-xs font-mono tracking-[0.2em] uppercase mb-2" style={{ color: "#C8161A" }}>
              Company Name
            </label>
            <Input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. AcmeCorp, SalesForce, etc."
              className="bg-black/50 border-red-900/30 text-white placeholder:text-gray-600 font-mono focus:border-red-600 focus:ring-red-600/20"
            />
          </div>

          <div>
            <label className="block text-xs font-mono tracking-[0.2em] uppercase mb-2" style={{ color: "#C8161A" }}>
              Sender Email
            </label>
            <div className="flex gap-2">
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. spam@acmecorp.com"
                className="bg-black/50 border-red-900/30 text-white placeholder:text-gray-600 font-mono focus:border-red-600 focus:ring-red-600/20"
              />
              {email.includes("@") && !domain && (
                <Button variant="outline" size="sm" onClick={handleAutoFillDomain}
                  className="border-red-900/40 text-red-400 hover:bg-red-900/20 text-xs whitespace-nowrap">
                  Auto-fill domain
                </Button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono tracking-[0.2em] uppercase mb-2" style={{ color: "#C8161A" }}>
              Domain
            </label>
            <Input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. acmecorp.com"
              className="bg-black/50 border-red-900/30 text-white placeholder:text-gray-600 font-mono focus:border-red-600 focus:ring-red-600/20"
            />
          </div>
        </div>

        {/* Generated URL */}
        {hasInput && (
          <div className="mb-8 p-5 rounded-xl"
            style={{
              backgroundColor: "rgba(200,22,26,0.08)",
              border: "1px solid rgba(200,22,26,0.3)",
              boxShadow: "0 0 40px rgba(200,22,26,0.1)",
            }}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={16} style={{ color: "#C8161A" }} />
              <span className="text-xs font-mono tracking-[0.2em] uppercase" style={{ color: "#C8161A" }}>
                GENERATED ENFORCEMENT LINK
              </span>
            </div>
            <div className="p-3 rounded-lg mb-4 break-all"
              style={{ backgroundColor: "rgba(0,0,0,0.4)", border: "1px solid rgba(200,22,26,0.15)" }}>
              <code className="text-sm font-mono" style={{ color: "rgba(245,240,224,0.8)" }}>
                {generatedUrl}
              </code>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleCopy}
                className="bg-red-900/80 hover:bg-red-800 text-white font-mono text-sm">
                {copied ? <Check size={16} className="mr-2" /> : <Copy size={16} className="mr-2" />}
                {copied ? "COPIED" : "COPY LINK"}
              </Button>
              <Button onClick={handleOpen} variant="outline"
                className="border-red-900/40 text-red-400 hover:bg-red-900/20 font-mono text-sm">
                <ExternalLink size={16} className="mr-2" />
                PREVIEW
              </Button>
              <Button onClick={() => setShowQR(!showQR)} variant="outline"
                className="border-red-900/40 text-red-400 hover:bg-red-900/20 font-mono text-sm">
                <QrCode size={16} className="mr-2" />
                {showQR ? "HIDE QR" : "QR CODE"}
              </Button>
            </div>

            {showQR && (
              <div className="mt-5 flex justify-center">
                <div className="p-4 rounded-lg bg-white">
                  <QRCodeSVG value={generatedUrl} size={200} level="H" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="p-5 rounded-xl" style={{ backgroundColor: "rgba(245,240,224,0.03)", border: "1px solid rgba(245,240,224,0.08)" }}>
          <h3 className="text-sm font-mono tracking-[0.2em] uppercase mb-4" style={{ color: "rgba(245,240,224,0.6)" }}>
            HOW TO USE
          </h3>
          <ol className="space-y-3 text-sm" style={{ color: "rgba(245,240,224,0.5)" }}>
            <li className="flex gap-3">
              <span className="font-mono font-bold" style={{ color: "#C8161A" }}>1.</span>
              <span>Enter the spammer's company name, email, and domain above.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-mono font-bold" style={{ color: "#C8161A" }}>2.</span>
              <span>Copy the generated link.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-mono font-bold" style={{ color: "#C8161A" }}>3.</span>
              <span>Reply to their spam email with the link. Or send it to their CEO.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-mono font-bold" style={{ color: "#C8161A" }}>4.</span>
              <span>Print the QR code and mail it to their office for maximum impact.</span>
            </li>
          </ol>
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <a href="/admin/spam-tracking" className="text-xs font-mono tracking-wider hover:underline" style={{ color: "rgba(245,240,224,0.4)" }}>
            ← BACK TO SPAM TRACKING DASHBOARD
          </a>
        </div>
      </div>
    </div>
  );
}
