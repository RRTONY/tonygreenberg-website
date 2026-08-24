/**
 * Stage 1 Supplier Intake — /supplier-intake
 * Public short form, ~2-3 min, no uploads.
 * 18 fields matching unified_two_stage_form_spec.pdf exactly.
 * On submit: generates supplierId + stage2Token for Stage 2 merge.
 */
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, ArrowRight, Building2 } from "lucide-react";

/* ─── Canonical option lists (must match scoring_rules.json) ─── */
const FACILITY_TYPES = ["Own Manufacturing", "Contract Manufacturer (CMO)", "Hybrid (Own + CMO)", "White Label", "Private Label"] as const;
const EMPLOYEE_RANGES = ["1–10", "11–50", "51–200", "201+"] as const;

// Year Founded dropdown: 1970 → current year
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: CURRENT_YEAR - 1969 }, (_, i) => String(CURRENT_YEAR - i)) as string[];
const FACILITY_CLASSIFICATIONS = ["FDA Registered", "cGMP Certified", "ISO 13485/9001", "503B", "503A", "Other"] as const;
const CHAIN_OF_CUSTODY = ["Currently live", "Can implement on request", "Not currently capable"] as const;
const PRICING_MODELS = ["Per Unit", "Tiered Volume Pricing", "Annual Contract", "Custom-Negotiable"] as const;
const LEAD_TIMES = ["Under 2 weeks", "2–4 weeks", "4–8 weeks", "8+ weeks"] as const;
const MOQ_OPTIONS = ["No minimum", "Small (under $5K)", "Moderate ($5K–$25K)", "Large ($25K+)"] as const;
const INDEPENDENT_TESTING = ["Yes, ongoing", "Yes, one-time per new listing", "No"] as const;
const LABELING_RESTRICTIONS = ["Research-Use-Only", "Compounded Pharmacy", "Both, depending on product"] as const;
const RECALL_CAPA = ["No recalls or CAPAs", "Minor CAPAs resolved", "Active CAPA in progress", "Recall history (disclose)"] as const;

/* ─── Form state type ─── */
type FormState = {
  legal_entity_name: string;
  state_country_of_incorporation: string;
  primary_contact_name: string;
  email: string;
  phone: string;
  website: string;
  current_peptide_products: string;
  facility_type: string;
  number_of_employees: string;
  monthly_production_capacity: string;
  facility_classification: string;
  chain_of_custody_capability: string;
  pricing_model: string;
  standard_lead_time: string;
  minimum_order_quantity: string;
  independent_testing_willingness: string;
  product_labeling_sale_restrictions: string;
  recall_capa_history: string;
};

const EMPTY: FormState = {
  legal_entity_name: "",
  state_country_of_incorporation: "",
  primary_contact_name: "",
  email: "",
  phone: "",
  website: "",
  current_peptide_products: "",
  facility_type: "",
  number_of_employees: "",
  monthly_production_capacity: "",
  facility_classification: "",
  chain_of_custody_capability: "",
  pricing_model: "",
  standard_lead_time: "",
  minimum_order_quantity: "",
  independent_testing_willingness: "",
  product_labeling_sale_restrictions: "",
  recall_capa_history: "",
};

/* ─── Required fields ─── */
const REQUIRED: (keyof FormState)[] = [
  "legal_entity_name",
  "state_country_of_incorporation",
  "primary_contact_name",
  "email",
  "current_peptide_products",
  "facility_type",
  "number_of_employees",
  "facility_classification",
  "chain_of_custody_capability",
  "pricing_model",
  "standard_lead_time",
  "minimum_order_quantity",
  "independent_testing_willingness",
  "product_labeling_sale_restrictions",
  "recall_capa_history",
];

/* ─── Styling ─── */
const inputClass =
  "bg-[#111118] border border-neutral-700 text-neutral-200 placeholder:text-neutral-600 rounded-lg focus:border-[#D4B96A] focus:ring-1 focus:ring-[#D4B96A]/30 transition-colors";
const inputErrorClass =
  "bg-[#111118] border border-red-500 text-neutral-200 placeholder:text-neutral-600 rounded-lg focus:border-[#D4B96A] focus:ring-1 focus:ring-[#D4B96A]/30 transition-colors";
const textareaClass =
  "bg-[#111118] border border-neutral-700 text-neutral-200 placeholder:text-neutral-600 rounded-lg focus:border-[#D4B96A] focus:ring-1 focus:ring-[#D4B96A]/30 transition-colors min-h-[90px]";
const textareaErrorClass =
  "bg-[#111118] border border-red-500 text-neutral-200 placeholder:text-neutral-600 rounded-lg focus:border-[#D4B96A] focus:ring-1 focus:ring-[#D4B96A]/30 transition-colors min-h-[90px]";

/* ─── Field wrapper ─── */
function Field({
  label,
  required,
  sub,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  sub?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-mono tracking-wider text-[#D4B96A] mb-1.5">
        {label}
        {required && <span className="text-[#D4B96A]/60 ml-0.5">*</span>}
      </label>
      {sub && <p className="text-xs text-neutral-500 mb-1.5">{sub}</p>}
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

/* ─── Dropdown helper ─── */
function Dropdown({
  value,
  onChange,
  options,
  placeholder,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder: string;
  error?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={`${error ? inputErrorClass : inputClass} w-full`}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-[#111118] border border-neutral-700 text-neutral-200">
        {options.map((opt) => (
          <SelectItem key={opt} value={opt} className="hover:bg-neutral-800 focus:bg-neutral-800">
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/* ─── Main component ─── */
export default function SupplierIntakeForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [supplierId, setSupplierId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Honeypot — hidden from real users
  const [botField, setBotField] = useState("");

  const set = (field: keyof FormState) => (value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormState, string>> = {};
    for (const field of REQUIRED) {
      if (!form[field]?.trim()) {
        const label = field.replace(/_/g, " ");
        newErrors[field] = `${label.charAt(0).toUpperCase() + label.slice(1)} is required`;
      }
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email address";
    }
    // Website: lenient — accepts bare domains (example.com) as well as full URLs (https://example.com)
    if (form.website) {
      const w = form.website.trim();
      const withProto = /^https?:\/\//i.test(w) ? w : `https://${w}`;
      try {
        const u = new URL(withProto);
        if (!u.hostname.includes('.')) throw new Error('no tld');
      } catch {
        newErrors.website = "Enter a valid website (e.g., example.com or https://example.com)";
      }
    }
    // Phone: allow digits, spaces, dashes, parens, plus sign — reject pure text
    if (form.phone && !/^[+\d][\d\s()\-+.]{4,}$/.test(form.phone.trim())) {
      newErrors.phone = "Enter a valid phone number (e.g., +1 555-000-0000)";
    }
    // Monthly Production Capacity: must contain at least one digit if provided
    if (form.monthly_production_capacity && !/\d/.test(form.monthly_production_capacity)) {
      newErrors.monthly_production_capacity = "Enter a quantity with a number (e.g., 500 kg/month)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const submitMutation = trpc.vendor.submitStage1.useMutation({
    onSuccess: (data) => {
      setSubmitted(true);
      setSupplierId(data.supplierId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Please try again.";
      toast.error("Submission failed: " + msg);
      setIsSubmitting(false);
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (botField) return; // honeypot triggered
    if (!validate()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    submitMutation.mutate({
      ...form,
      facility_type: form.facility_type as "Own Manufacturing" | "Contract Manufacturer (CMO)" | "Hybrid (Own + CMO)" | "White Label" | "Private Label",
      number_of_employees: form.number_of_employees as "1\u201310" | "11\u201350" | "51\u2013200" | "201+",
      facility_classification: form.facility_classification as "FDA Registered" | "cGMP Certified" | "ISO 13485/9001" | "503B" | "503A" | "Other",
      chain_of_custody_capability: form.chain_of_custody_capability as "Currently live" | "Can implement on request" | "Not currently capable",
      pricing_model: form.pricing_model as "Per Unit" | "Tiered Volume Pricing" | "Annual Contract" | "Custom-Negotiable",
      independent_testing_willingness: form.independent_testing_willingness as "Yes, ongoing" | "Yes, one-time per new listing" | "No",
      product_labeling_sale_restrictions: form.product_labeling_sale_restrictions as "Research-Use-Only" | "Compounded Pharmacy" | "Both, depending on product",
      recall_capa_history: form.recall_capa_history as "No recalls or CAPAs" | "Minor CAPAs resolved" | "Active CAPA in progress" | "Recall history (disclose)",
      standard_lead_time: form.standard_lead_time as "Under 2 weeks" | "2–4 weeks" | "4–8 weeks" | "8+ weeks",
      minimum_order_quantity: form.minimum_order_quantity as "No minimum" | "Small (under $5K)" | "Moderate ($5K–$25K)" | "Large ($25K+)",
      source_site: "tonygreenberg" as const,
      stage2UrlBase: `${window.location.origin}/supplier-intake-long/`,
    });
  }

  /* ─── Success screen ─── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0A0A10] flex items-center justify-center px-4">
        <div className="max-w-xl w-full text-center">
          <CheckCircle2 className="w-16 h-16 text-[#D4B96A] mx-auto mb-6" />
          <h1 className="font-serif text-3xl text-neutral-100 mb-4">
            Application Received
          </h1>
          <p className="text-neutral-400 mb-6 leading-relaxed">
            Thank you for applying. We review every submission and will reach out
            directly if we decide to move forward. If selected, you'll receive a
            private link to complete the full supplier profile.
          </p>
          <p className="text-xs font-mono text-neutral-600 mb-8">
            Reference: {supplierId}
          </p>
          <Link href="/">
            <Button variant="outline" className="border-[#D4B96A]/40 text-[#D4B96A] hover:bg-[#D4B96A]/10">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  /* ─── Form ─── */
  return (
    <div className="min-h-screen bg-[#0A0A10] text-neutral-200">
      {/* Header */}
      <div className="border-b border-neutral-800 bg-[#0D0D14]">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-6 h-6 text-[#D4B96A]" />
            <span className="font-mono text-xs tracking-[0.2em] text-[#D4B96A] uppercase">
              Supplier Application
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-neutral-100 mb-3">
            Stage 1: Supplier Profile
          </h1>
          <p className="text-neutral-400 leading-relaxed max-w-xl">
            A short qualification form — about 2–3 minutes. No uploads required at
            this stage. If we decide to pursue a relationship, you'll receive a
            private link to complete the full supplier profile.
          </p>
          <p className="text-xs font-mono text-neutral-600 mt-3">
            Fields marked <span className="text-[#D4B96A]/60">*</span> are required.
          </p>
        </div>
      </div>

      {/* Form body */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="max-w-3xl mx-auto px-6 py-10 space-y-10">

          {/* Section 1: Identity & Contact */}
          <section>
            <h2 className="font-mono text-xs tracking-[0.2em] text-[#D4B96A] uppercase mb-6 pb-2 border-b border-neutral-800">
              Identity &amp; Contact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Legal Entity Name" required error={errors.legal_entity_name}>
                <Input
                  value={form.legal_entity_name}
                  onChange={(e) => set("legal_entity_name")(e.target.value)}
                  placeholder="Acme Peptides Inc."
                  className={errors.legal_entity_name ? inputErrorClass : inputClass}
                />
              </Field>
              <Field label="State / Country of Incorporation" required error={errors.state_country_of_incorporation}>
                <Input
                  value={form.state_country_of_incorporation}
                  onChange={(e) => set("state_country_of_incorporation")(e.target.value)}
                  placeholder="Delaware, USA"
                  className={errors.state_country_of_incorporation ? inputErrorClass : inputClass}
                />
              </Field>
              <Field label="Primary Contact Name" required error={errors.primary_contact_name}>
                <Input
                  value={form.primary_contact_name}
                  onChange={(e) => set("primary_contact_name")(e.target.value)}
                  placeholder="Jane Smith"
                  className={errors.primary_contact_name ? inputErrorClass : inputClass}
                />
              </Field>
              <Field label="Email" required error={errors.email}>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email")(e.target.value)}
                  placeholder="jane@acmepeptides.com"
                  className={errors.email ? inputErrorClass : inputClass}
                />
              </Field>
              <Field label="Phone" sub="Optional" error={errors.phone}>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone")(e.target.value)}
                  placeholder="+1 (302) 555-0100"
                  className={errors.phone ? inputErrorClass : inputClass}
                />
              </Field>
              <Field label="Website" sub="Optional" error={errors.website}>
                <Input
                  type="text"
                  value={form.website}
                  onChange={(e) => set("website")(e.target.value)}
                  placeholder="acmepeptides.com or https://acmepeptides.com"
                  className={errors.website ? inputErrorClass : inputClass}
                />
              </Field>
            </div>
          </section>

          {/* Section 2: Offer / Scale */}
          <section>
            <h2 className="font-mono text-xs tracking-[0.2em] text-[#D4B96A] uppercase mb-6 pb-2 border-b border-neutral-800">
              Offer &amp; Scale
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <Field label="Current Peptide Products" required error={errors.current_peptide_products}
                  sub="List the peptides you currently manufacture or supply (e.g., BPC-157, TB-500, Semaglutide)">
                  <Textarea
                    value={form.current_peptide_products}
                    onChange={(e) => set("current_peptide_products")(e.target.value)}
                    placeholder="BPC-157, TB-500, Semaglutide, Tirzepatide..."
                    className={errors.current_peptide_products ? textareaErrorClass : textareaClass}
                  />
                </Field>
              </div>
              <Field label="Facility Type" required error={errors.facility_type}>
                <Dropdown
                  value={form.facility_type}
                  onChange={set("facility_type")}
                  options={FACILITY_TYPES}
                  placeholder="Select facility type"
                  error={errors.facility_type}
                />
              </Field>
              <Field label="Number of Employees" required error={errors.number_of_employees}>
                <Dropdown
                  value={form.number_of_employees}
                  onChange={set("number_of_employees")}
                  options={EMPLOYEE_RANGES}
                  placeholder="Select range"
                  error={errors.number_of_employees}
                />
              </Field>
              <Field label="Monthly Production Capacity" sub="Optional — e.g., 500 kg/month" error={errors.monthly_production_capacity}>
                <Input
                  value={form.monthly_production_capacity}
                  onChange={(e) => set("monthly_production_capacity")(e.target.value)}
                  placeholder="500 kg/month"
                  className={errors.monthly_production_capacity ? inputErrorClass : inputClass}
                />
              </Field>
            </div>
          </section>

          {/* Section 3: Scoring-Signal Dropdowns */}
          <section>
            <h2 className="font-mono text-xs tracking-[0.2em] text-[#D4B96A] uppercase mb-2 pb-2 border-b border-neutral-800">
              Qualification Signals
            </h2>
            <p className="text-xs text-neutral-500 mb-6">
              These fields are used to assess fit. Select the option that most
              accurately describes your current capabilities — not aspirational ones.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Facility Classification" required error={errors.facility_classification}
                sub="Select your highest applicable classification">
                <Dropdown
                  value={form.facility_classification}
                  onChange={set("facility_classification")}
                  options={FACILITY_CLASSIFICATIONS}
                  placeholder="Select classification"
                  error={errors.facility_classification}
                />
              </Field>
              <Field label="Chain-of-Custody Capability" required error={errors.chain_of_custody_capability}
                sub="Lot-level traceability from raw material to finished product">
                <Dropdown
                  value={form.chain_of_custody_capability}
                  onChange={set("chain_of_custody_capability")}
                  options={CHAIN_OF_CUSTODY}
                  placeholder="Select capability"
                  error={errors.chain_of_custody_capability}
                />
              </Field>
              <Field label="Pricing Model" required error={errors.pricing_model}>
                <Dropdown
                  value={form.pricing_model}
                  onChange={set("pricing_model")}
                  options={PRICING_MODELS}
                  placeholder="Select pricing model"
                  error={errors.pricing_model}
                />
              </Field>
              <Field label="Independent Testing Willingness" required error={errors.independent_testing_willingness}
                sub="Would you allow us to independently test your products?">
                <Dropdown
                  value={form.independent_testing_willingness}
                  onChange={set("independent_testing_willingness")}
                  options={INDEPENDENT_TESTING}
                  placeholder="Select option"
                  error={errors.independent_testing_willingness}
                />
              </Field>
              <Field label="Product Labeling &amp; Sale Restrictions" required error={errors.product_labeling_sale_restrictions}
                sub="How are your products labeled and sold?">
                <Dropdown
                  value={form.product_labeling_sale_restrictions}
                  onChange={set("product_labeling_sale_restrictions")}
                  options={LABELING_RESTRICTIONS}
                  placeholder="Select option"
                  error={errors.product_labeling_sale_restrictions}
                />
              </Field>
              <Field label="Recall / CAPA History" required error={errors.recall_capa_history}
                sub="Corrective and Preventive Action history">
                <Dropdown
                  value={form.recall_capa_history}
                  onChange={set("recall_capa_history")}
                  options={RECALL_CAPA}
                  placeholder="Select option"
                  error={errors.recall_capa_history}
                />
              </Field>
              <Field label="Standard Lead Time" required error={errors.standard_lead_time}
                sub="Typical lead time from order to delivery">
                <Dropdown
                  value={form.standard_lead_time}
                  onChange={set("standard_lead_time")}
                  options={LEAD_TIMES}
                  placeholder="Select lead time"
                  error={errors.standard_lead_time}
                />
              </Field>
              <Field label="Minimum Order Quantity" required error={errors.minimum_order_quantity}
                sub="Smallest order size you can fulfill">
                <Dropdown
                  value={form.minimum_order_quantity}
                  onChange={set("minimum_order_quantity")}
                  options={MOQ_OPTIONS}
                  placeholder="Select MOQ range"
                  error={errors.minimum_order_quantity}
                />
              </Field>
            </div>
          </section>

          {/* Honeypot — hidden from real users */}
          <div className="hidden" aria-hidden="true">
            <input
              tabIndex={-1}
              autoComplete="off"
              value={botField}
              onChange={(e) => setBotField(e.target.value)}
              name="website_url"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-xs text-neutral-600 max-w-sm">
              Submissions are reviewed manually. We do not share your information
              with third parties.
            </p>
            <Button
              type="submit"
              disabled={isSubmitting || submitMutation.isPending}
              className="bg-[#D4B96A] hover:bg-[#C4A95A] text-[#0A0A10] font-semibold px-8 py-3 rounded-lg flex items-center gap-2 shrink-0"
            >
              {isSubmitting || submitMutation.isPending ? (
                "Submitting…"
              ) : (
                <>
                  Submit Application
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
