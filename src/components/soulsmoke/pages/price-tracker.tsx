"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bell, BellOff, ExternalLink, Loader2, Minus, Search, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { addPriceAlert, deletePriceAlert, listPriceAlerts } from "@/app/soul-smoke/actions";
import { allMezcals } from "@/lib/content/soulsmoke/mezcal-data";
import { ss } from "@/lib/content/soulsmoke/nav";
import { soulsmokeFontVariables } from "@/lib/fonts/soulsmoke-fonts";

// Ported from the SoulSmoke app's client/src/pages/PriceTracker.tsx. Same sample price data,
// cards and copy. The price cards are public; price alerts belong to a signed-in member, as on
// SoulSmoke: saved in Supabase (soulsmoke_price_alerts) through src/app/soul-smoke/actions.ts,
// which replaces trpc.priceAlerts (mezcal name required, target price in cents, newest first).
// Signed out: no "Set Price Alert" button and the original "Never Miss a Deal" section, linking
// to /login.
// The dialog renders in a portal outside the /soul-smoke wrapper, so it carries the wrapper's
// class and font variables to keep SoulSmoke's colors and type.

export type PriceAlert = {
  id: string;
  mezcalName: string;
  /** In cents, like the Manus app's price_alerts.targetPrice. */
  targetPrice: number | null;
  createdAt: string;
};

const LOGIN_HREF = "/login?next=/soul-smoke/price-tracker";

// Sample price history data (in production, this would come from a database)
const priceHistory: Record<string, { date: string; price: number; retailer: string }[]> = {
  "Real Minero Largo": [
    { date: "2025-12", price: 189, retailer: "Old Town Tequila" },
    { date: "2025-11", price: 185, retailer: "K&L Wine" },
    { date: "2025-10", price: 179, retailer: "Old Town Tequila" },
    { date: "2025-09", price: 175, retailer: "Astor Wines" },
    { date: "2025-08", price: 169, retailer: "K&L Wine" },
  ],
  "Del Maguey Chichicapa": [
    { date: "2025-12", price: 75, retailer: "Total Wine" },
    { date: "2025-11", price: 72, retailer: "K&L Wine" },
    { date: "2025-10", price: 75, retailer: "Total Wine" },
    { date: "2025-09", price: 69, retailer: "Astor Wines" },
  ],
  "Vago Elote": [
    { date: "2025-12", price: 89, retailer: "Old Town Tequila" },
    { date: "2025-11", price: 85, retailer: "K&L Wine" },
    { date: "2025-10", price: 82, retailer: "Astor Wines" },
  ],
};

const availableMezcals = Array.from(new Set(allMezcals.map((m) => m.name))).sort();

interface TrackedBottle {
  name: string;
  currentPrice: number;
  lowestPrice: number;
  highestPrice: number;
  trend: "up" | "down" | "stable";
  lastSeen: string;
  retailer: string;
}

const trackedBottles: TrackedBottle[] = [
  {
    name: "Real Minero Largo",
    currentPrice: 189,
    lowestPrice: 169,
    highestPrice: 195,
    trend: "up",
    lastSeen: "2 days ago",
    retailer: "Old Town Tequila",
  },
  {
    name: "Del Maguey Chichicapa",
    currentPrice: 75,
    lowestPrice: 65,
    highestPrice: 82,
    trend: "stable",
    lastSeen: "1 day ago",
    retailer: "Total Wine",
  },
  {
    name: "Vago Elote",
    currentPrice: 89,
    lowestPrice: 79,
    highestPrice: 95,
    trend: "up",
    lastSeen: "3 days ago",
    retailer: "Old Town Tequila",
  },
  {
    name: "5 Sentidos Tobalá",
    currentPrice: 145,
    lowestPrice: 135,
    highestPrice: 155,
    trend: "down",
    lastSeen: "1 week ago",
    retailer: "K&L Wine",
  },
  {
    name: "El Jolgorio Tepeztate",
    currentPrice: 165,
    lowestPrice: 155,
    highestPrice: 175,
    trend: "stable",
    lastSeen: "4 days ago",
    retailer: "Astor Wines",
  },
];

const retailers = [
  { name: "Old Town Tequila", url: "https://oldtowntequila.com" },
  { name: "K&L Wine", url: "https://klwines.com" },
  { name: "Astor Wines", url: "https://astorwines.com" },
  { name: "Total Wine", url: "https://totalwine.com" },
  { name: "Hi-Time Wine", url: "https://hitimewine.net" },
  { name: "Pogo's Wine", url: "https://pogoswine.com" },
  { name: "Cask", url: "https://caskstore.com" },
  { name: "Mezcal Reviews", url: "https://mezcalreviews.com" },
];

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  switch (trend) {
    case "up":
      return <TrendingUp aria-label="Price rising" className="size-4 shrink-0 text-red-400" />;
    case "down":
      return <TrendingDown aria-label="Price falling" className="size-4 shrink-0 text-green-400" />;
    default:
      return <Minus aria-label="Price stable" className="size-4 shrink-0 text-gray-300" />;
  }
}

function PriceHistoryChart({ name }: { name: string }) {
  const history = priceHistory[name];
  const min = Math.min(...history.map((p) => p.price));
  const max = Math.max(...history.map((p) => p.price));
  return (
    <div className="mt-4 border-t border-white/10 pt-4">
      <div className="flex h-12 items-end gap-1">
        {history
          .slice()
          .reverse()
          .map((point) => {
            const height = ((point.price - min) / (max - min)) * 100 || 50;
            return (
              <div
                key={point.date}
                className="flex-1 rounded-t bg-amber-600/50"
                // Bar height is the price (runtime value).
                style={{ height: `${Math.max(height, 10)}%` }}
                title={`${point.date}: $${point.price}`}
              />
            );
          })}
      </div>
      <div className="mt-1 flex justify-between text-xs text-gray-400">
        <span>{history[history.length - 1].date}</span>
        <span>{history[0].date}</span>
      </div>
    </div>
  );
}

type AlertsState = { status: "loading" } | { status: "signedOut" } | { status: "ready"; alerts: PriceAlert[] };

export function PriceTracker() {
  const [state, setState] = useState<AlertsState>({ status: "loading" });
  const [alertError, setAlertError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isAddingAlert, setIsAddingAlert] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMezcal, setSelectedMezcal] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const mezcalId = useId();
  const priceId = useId();

  useEffect(() => {
    let live = true;
    listPriceAlerts().then((result) => {
      if (!live) return;
      if (result.ok) setState({ status: "ready", alerts: result.data });
      else if (result.signedOut) setState({ status: "signedOut" });
      else {
        setState({ status: "ready", alerts: [] });
        setAlertError(result.error);
      }
    });
    return () => {
      live = false;
    };
  }, []);

  const alerts = state.status === "ready" ? state.alerts : [];

  const handleAddAlert = async () => {
    if (!selectedMezcal.trim() || saving) return;
    const dollars = parseInt(targetPrice, 10);
    setSaving(true);
    setFormError(null);
    const result = await addPriceAlert({
      mezcalName: selectedMezcal,
      targetPrice: targetPrice && Number.isFinite(dollars) ? dollars * 100 : null,
    });
    setSaving(false);
    if (!result.ok) {
      if (result.signedOut) setState({ status: "signedOut" });
      setFormError(result.error);
      return;
    }
    setState({ status: "ready", alerts: [result.data, ...alerts] });
    setIsAddingAlert(false);
    setSelectedMezcal("");
    setTargetPrice("");
  };

  const deleteAlert = async (id: string) => {
    setDeletingId(id);
    setAlertError(null);
    const result = await deletePriceAlert(id);
    setDeletingId(null);
    if (!result.ok) {
      setAlertError(result.error);
      return;
    }
    setState({ status: "ready", alerts: alerts.filter((alert) => alert.id !== id) });
  };

  const filteredTrackedBottles = trackedBottles.filter((bottle) =>
    bottle.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-stone-950 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-linear-to-b from-emerald-950/30 to-stone-950" />
        <div className="relative z-10 container">
          <Link
            href={ss("/")}
            className="mb-8 inline-flex items-center gap-2 text-amber-400 hover:text-amber-300"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to Home
          </Link>

          <h1 className="mb-4 font-serif text-5xl text-amber-400 md:text-6xl">Price Tracker</h1>
          <p className="max-w-2xl text-xl text-gray-200">
            Track prices across retailers. Set alerts for rare bottles. Never miss a deal on the mezcal you&apos;re
            hunting.
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="border-b border-white/10 py-8">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="relative w-full md:w-96">
              <Search aria-hidden="true" className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-gray-400" />
              <Input
                aria-label="Search bottles"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bottles..."
                className="border-white/10 bg-white/5 pl-10"
              />
            </div>

            {state.status === "loading" && (
              <Loader2 aria-label="Checking your alerts" className="size-6 animate-spin text-amber-400" />
            )}
            {state.status === "ready" && (
            <Dialog open={isAddingAlert} onOpenChange={setIsAddingAlert}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-amber-600 hover:bg-amber-500">
                  <Bell aria-hidden="true" className="size-4" />
                  Set Price Alert
                </Button>
              </DialogTrigger>
              <DialogContent
                className={`${soulsmokeFontVariables} soulsmoke-root border-zinc-800 bg-zinc-900 text-white sm:max-w-lg`}
              >
                <DialogHeader>
                  <DialogTitle className="font-serif text-2xl text-amber-400">Create Price Alert</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label htmlFor={mezcalId} className="text-sm text-gray-300">
                      Select Mezcal
                    </label>
                    <select
                      id={mezcalId}
                      value={selectedMezcal}
                      onChange={(e) => setSelectedMezcal(e.target.value)}
                      className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white"
                    >
                      <option value="">Choose a mezcal...</option>
                      {availableMezcals.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor={priceId} className="text-sm text-gray-300">
                      Target Price (optional)
                    </label>
                    <div className="relative">
                      <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">$</span>
                      <Input
                        id={priceId}
                        type="number"
                        min={0}
                        value={targetPrice}
                        onChange={(e) => setTargetPrice(e.target.value)}
                        placeholder="Alert me when price drops below..."
                        className="border-zinc-700 bg-zinc-800 pl-8"
                      />
                    </div>
                    <p className="text-xs text-gray-400">Leave blank to get alerts for any price drop</p>
                  </div>
                  {formError && (
                    <p role="alert" className="text-sm text-red-400">
                      {formError}
                    </p>
                  )}
                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" onClick={() => setIsAddingAlert(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="gap-2 bg-amber-600 hover:bg-amber-500"
                      onClick={handleAddAlert}
                      disabled={!selectedMezcal || saving}
                    >
                      {saving && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
                      Create Alert
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            )}
          </div>
        </div>
      </section>

      {alertError && (
        <div className="container py-4">
          <p role="alert" className="text-sm text-red-400">
            {alertError}
          </p>
        </div>
      )}

      {/* Member's Alerts */}
      {alerts.length > 0 && (
        <section className="border-b border-white/10 bg-amber-950/10 py-8">
          <div className="container">
            <h2 className="mb-4 flex items-center gap-2 font-serif text-xl text-amber-400">
              <Bell aria-hidden="true" className="size-5" />
              Your Active Alerts
            </h2>
            <div className="flex flex-wrap gap-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-2"
                >
                  <span className="text-white">{alert.mezcalName}</span>
                  {alert.targetPrice ? (
                    <span className="text-sm text-amber-400">Under ${(alert.targetPrice / 100).toFixed(0)}</span>
                  ) : null}
                  <button
                    type="button"
                    aria-label={`Remove alert for ${alert.mezcalName}`}
                    disabled={deletingId === alert.id}
                    onClick={() => deleteAlert(alert.id)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    {deletingId === alert.id ? (
                      <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                    ) : (
                      <BellOff aria-hidden="true" className="size-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Price Tracking Grid */}
      <section className="py-16">
        <div className="container">
          <h2 className="mb-8 font-serif text-2xl text-amber-400">Currently Tracking</h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTrackedBottles.map((bottle) => (
              <div key={bottle.name} className="rounded-xl border border-white/10 bg-white/5 p-6">
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="font-serif text-lg text-white">{bottle.name}</h3>
                  <TrendIcon trend={bottle.trend} />
                </div>

                <div className="mb-4 text-3xl font-bold text-amber-400">${bottle.currentPrice}</div>

                <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Lowest</span>
                    <div className="text-green-400">${bottle.lowestPrice}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Highest</span>
                    <div className="text-red-400">${bottle.highestPrice}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4 text-sm text-gray-300">
                  <span>{bottle.retailer}</span>
                  <span>{bottle.lastSeen}</span>
                </div>

                {priceHistory[bottle.name] && <PriceHistoryChart name={bottle.name} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Retailers We Track */}
      <section className="border-t border-white/10 py-16">
        <div className="container">
          <h2 className="mb-8 font-serif text-2xl text-amber-400">Retailers We Monitor</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {retailers.map((retailer) => (
              <a
                key={retailer.name}
                href={retailer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
              >
                <span className="text-gray-200">{retailer.name}</span>
                <ExternalLink aria-hidden="true" className="size-4 shrink-0 text-gray-400" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA for signed-out visitors */}
      {state.status === "signedOut" && (
        <section className="bg-linear-to-b from-transparent to-amber-950/20 py-16">
          <div className="container max-w-2xl text-center">
            <Bell aria-hidden="true" className="mx-auto mb-6 size-12 text-amber-400" />
            <h2 className="mb-4 font-serif text-3xl text-amber-400">Never Miss a Deal</h2>
            <p className="mb-8 text-gray-300">
              Sign in to set price alerts for your favorite bottles. We&apos;ll notify you when prices drop or when rare
              bottles become available.
            </p>
            <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-500">
              <Link href={LOGIN_HREF}>Sign In to Set Alerts</Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
