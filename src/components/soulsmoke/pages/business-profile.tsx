"use client";

import { useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, Check, ChefHat, CircleHelp, Home, Package, Store, Truck, Wine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalStore } from "@/components/soulsmoke/hooks/use-local-store";
import { ss } from "@/lib/content/soulsmoke/nav";

// Ported from the SoulSmoke app's client/src/pages/BusinessProfile.tsx. Same form, confirmation
// and copy. On Manus the profile went to a shared database (trpc.leadGen.createBusinessProfile,
// signed-in visitors only, with an owner alert). There is no account or shared database here
// yet (owner to decide), so the form works for everyone and the profile is saved in the
// visitor's own browser ("soulsmoke-business-profile"), with the server's fields and checks
// (business type and name required, email must be valid when given, one profile per visitor).
// The "Sign In to Register" screen is gone.

export const BUSINESS_TYPES = ["retailer", "bar", "restaurant", "distributor", "importer", "other"] as const;
export type BusinessType = (typeof BUSINESS_TYPES)[number];

export type StoredBusinessProfile = {
  businessType: BusinessType;
  businessName: string;
  contactName?: string;
  contactEmail?: string;
  phone?: string;
  website?: string;
  city?: string;
  state?: string;
  country?: string;
  licenseType?: string;
  annualVolume?: string;
  focusCategories?: string;
  bio?: string;
  isVerified: boolean;
  createdAt: string;
};

export const BUSINESS_PROFILE_KEY = "soulsmoke-business-profile";

const businessTypes = [
  { value: "retailer" as const, label: "Retailer / Liquor Store", icon: Store },
  { value: "bar" as const, label: "Bar / Cocktail Lounge", icon: Wine },
  { value: "restaurant" as const, label: "Restaurant", icon: ChefHat },
  { value: "distributor" as const, label: "Distributor", icon: Truck },
  { value: "importer" as const, label: "Importer", icon: Package },
  { value: "other" as const, label: "Other", icon: CircleHelp },
];

const emptyForm = {
  businessType: "" as BusinessType | "",
  businessName: "",
  contactName: "",
  contactEmail: "",
  phone: "",
  website: "",
  city: "",
  state: "",
  country: "US",
  licenseType: "",
  annualVolume: "",
  focusCategories: "",
  bio: "",
};

const optional = (s: string) => (s.trim() ? s.trim() : undefined);

/** Mirrors the Manus server's createBusinessProfile input checks. Returns null when invalid. */
export function toBusinessProfile(form: typeof emptyForm, now = new Date()): StoredBusinessProfile | null {
  const businessName = form.businessName.trim();
  if (!form.businessType || !BUSINESS_TYPES.includes(form.businessType) || !businessName) return null;
  const contactEmail = optional(form.contactEmail);
  if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) return null;
  return {
    businessType: form.businessType,
    businessName,
    contactName: optional(form.contactName),
    contactEmail,
    phone: optional(form.phone),
    website: optional(form.website),
    city: optional(form.city),
    state: optional(form.state),
    country: optional(form.country),
    licenseType: optional(form.licenseType),
    annualVolume: optional(form.annualVolume),
    focusCategories: optional(form.focusCategories),
    bio: optional(form.bio),
    isVerified: false,
    createdAt: now.toISOString(),
  };
}

const inputClass =
  "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none";

export function BusinessProfile() {
  const [profile, setProfile] = useLocalStore<StoredBusinessProfile | null>(BUSINESS_PROFILE_KEY, null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const id = useId();
  const fid = (name: string) => `${id}-${name}`;

  if (profile || success) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto max-w-2xl py-20">
          <div className="mb-12 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-500/20">
              <Check aria-hidden="true" className="size-8 text-green-500" />
            </div>
            <h1 className="mb-2 font-display text-3xl font-bold">
              {success ? "Profile Created!" : "Your Business Profile"}
            </h1>
            <p className="text-zinc-400">
              {success
                ? "We'll review your profile and start connecting you with producers."
                : "Your business is registered. We'll connect you with producers as opportunities arise."}
            </p>
          </div>

          {profile && (
            <div className="space-y-4 rounded-xl border border-zinc-700 bg-zinc-900 p-8">
              <div className="flex items-center gap-3">
                <Building2 aria-hidden="true" className="size-6 shrink-0 text-amber-500" />
                <div className="min-w-0">
                  <h3 className="text-xl font-bold wrap-break-word">{profile.businessName}</h3>
                  <p className="text-sm text-zinc-400 capitalize">{profile.businessType}</p>
                </div>
              </div>
              {profile.contactEmail && (
                <p className="text-sm wrap-break-word text-zinc-300">Email: {profile.contactEmail}</p>
              )}
              {profile.city && (
                <p className="text-sm text-zinc-300">
                  Location: {profile.city}
                  {profile.state ? `, ${profile.state}` : ""}
                </p>
              )}
              {profile.bio && <p className="mt-4 text-sm text-zinc-400">{profile.bio}</p>}
              {!profile.isVerified && (
                <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
                  <p className="text-sm text-amber-400">Pending verification — we&apos;ll review your profile shortly.</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild variant="outline" className="border-amber-500 text-amber-500 hover:bg-amber-500/10">
              <Link href={ss("/discovery")}>Explore Discovery Engine</Link>
            </Button>
            <Button asChild variant="ghost" className="text-zinc-400 hover:text-white">
              <Link href={ss("/")}>
                <Home aria-hidden="true" className="mr-2 size-4" /> Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next = toBusinessProfile(form);
    if (!next) {
      setError(Boolean(form.businessType && form.businessName.trim()));
      return;
    }
    setError(false);
    setProfile(next);
    setSuccess(true);
  };

  const text = (
    key: "businessName" | "contactName" | "contactEmail" | "phone" | "website" | "city" | "state",
    label: string,
    placeholder: string,
    type = "text",
    extra?: { required?: boolean; wide?: boolean },
  ) => (
    <div className={extra?.wide ? "sm:col-span-2" : undefined}>
      <label htmlFor={fid(key)} className="mb-1 block text-sm font-semibold text-zinc-300">
        {label}
      </label>
      <input
        id={fid(key)}
        type={type}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        className={inputClass}
        placeholder={placeholder}
        required={extra?.required}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <Link href={ss("/")} className="mb-8 inline-flex items-center text-sm text-zinc-500 hover:text-zinc-300">
          <ArrowLeft aria-hidden="true" className="mr-1 size-4" /> Back
        </Link>

        <div className="mb-12 text-center">
          <Building2 aria-hidden="true" className="mx-auto mb-4 size-12 text-amber-500" />
          <h1 className="mb-2 font-display text-3xl font-bold">Register Your Business</h1>
          <p className="mx-auto max-w-lg text-zinc-400">
            Join the SoulSmoke network to discover and source extraordinary mezcal directly from producers. Free
            registration, no commitment.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Business Type */}
          <fieldset>
            <legend className="mb-3 block text-sm font-semibold text-zinc-300">Business Type *</legend>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {businessTypes.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={form.businessType === value}
                  onClick={() => setForm((f) => ({ ...f, businessType: value }))}
                  className={
                    form.businessType === value
                      ? "rounded-xl border border-amber-500 bg-amber-500/10 p-4 text-left text-amber-500 transition-all"
                      : "rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-left text-zinc-400 transition-all hover:border-zinc-500"
                  }
                >
                  <Icon aria-hidden="true" className="mb-2 size-5" />
                  <span className="block text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </fieldset>

          {/* Business Details */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {text("businessName", "Business Name *", "Your business name", "text", { required: true, wide: true })}
            {text("contactName", "Contact Name", "Your name")}
            {text("contactEmail", "Email", "you@business.com", "email")}
            {text("phone", "Phone", "+1 (555) 000-0000", "tel")}
            {text("website", "Website", "https://yourbusiness.com", "url")}
            {text("city", "City", "City")}
            {text("state", "State / Province", "State")}
          </div>

          {/* Additional Info */}
          <div className="space-y-4">
            <div>
              <label htmlFor={fid("volume")} className="mb-1 block text-sm font-semibold text-zinc-300">
                Annual Volume (estimated cases)
              </label>
              <select
                id={fid("volume")}
                value={form.annualVolume}
                onChange={(e) => setForm((f) => ({ ...f, annualVolume: e.target.value }))}
                className={inputClass}
              >
                <option value="">Select...</option>
                <option value="1-10">1-10 cases/year</option>
                <option value="10-50">10-50 cases/year</option>
                <option value="50-200">50-200 cases/year</option>
                <option value="200-1000">200-1,000 cases/year</option>
                <option value="1000+">1,000+ cases/year</option>
              </select>
            </div>
            <div>
              <label htmlFor={fid("bio")} className="mb-1 block text-sm font-semibold text-zinc-300">
                Tell us about your business
              </label>
              <textarea
                id={fid("bio")}
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                className="h-24 w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none"
                placeholder="What makes your business unique? What kind of mezcal are you looking for?"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={!form.businessType || !form.businessName}
            className="w-full bg-amber-500 py-4 text-lg font-bold text-black hover:bg-amber-400"
          >
            Register My Business
          </Button>

          {error && (
            <p role="alert" className="text-center text-sm text-red-400">
              Something went wrong. Please try again.
            </p>
          )}

          <p className="text-center text-xs text-zinc-500">
            Your information is kept confidential and only shared with verified producers when you express interest in
            specific bottles.
          </p>
        </form>
      </div>
    </div>
  );
}
