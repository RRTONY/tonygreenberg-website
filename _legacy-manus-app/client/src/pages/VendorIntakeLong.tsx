/**
 * Stage 2 Vendor Intake — /vendor-intake-long?token=XXX
 * Gated per-supplier link. Multi-step save-and-resume wizard.
 * 42 fields matching unified_two_stage_form_spec.pdf exactly.
 * On submit: updates the Stage 1 record — does NOT create a new one.
 */
import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
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
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building2,
  Factory,
  ShieldCheck,
  DollarSign,
  FileCheck,
  Paperclip,
  Save,
  Loader2,
  AlertTriangle,
} from "lucide-react";

/* ─── Step config ─── */
const STEPS = [
  { key: "company", label: "Company", icon: Building2 },
  { key: "manufacturing", label: "Manufacturing", icon: Factory },
  { key: "quality", label: "Quality", icon: ShieldCheck },
  { key: "commercial", label: "Commercial", icon: DollarSign },
  { key: "regulatory", label: "Regulatory", icon: FileCheck },
  { key: "upload", label: "Documents", icon: Paperclip },
] as const;
type StepKey = (typeof STEPS)[number]["key"];

/* ─── Form state ─── */
type S2Form = {
  // Company
  dba_name: string;
  year_founded: string;
  headquarters_address: string;
  manufacturing_facility_address: string;
  contact_title: string;
  ownership_principals: string;
  // Manufacturing
  peptide_synthesis_method: string;
  purity_levels_achieved: string;
  sterile_fill_capability: string;
  cold_chain_storage_capabilities: string;
  batch_documentation: string;
  // Quality
  quality_management_system: string;
  third_party_testing: string;
  testing_lab_name: string;
  coa_lot_specific: string;
  coa_publicly_viewable: string;
  coa_public_link: string;
  identity_confirmation_method: string;
  testing_protocols: string;
  stability_testing_program: string;
  // Commercial
  payment_terms: string;
  existing_distribution_channels: string;
  references: string;
  pricing_for_top_compounds: string;
  full_price_list_catalog: string;
  // Regulatory
  fda_registration_number: string;
  dea_registration: string;
  state_licenses: string;
  buyer_eligibility: string;
  shipping_jurisdictions: string;
  last_fda_inspection_date: string;
  fda_inspection_outcome: string;
  manufacturing_certifications: string;
  warning_letters_regulatory_disclosure: string;
  insurance_coverage: string;
  // Uploads (S3 URLs stored after upload)
  upload_coa: string;
  upload_cgmp_cert: string;
  upload_fda_docs: string;
  upload_insurance_cert: string;
  upload_sop: string;
  upload_additional: string;
};

const EMPTY_S2: S2Form = {
  dba_name: "",
  year_founded: "",
  headquarters_address: "",
  manufacturing_facility_address: "",
  contact_title: "",
  ownership_principals: "",
  peptide_synthesis_method: "",
  purity_levels_achieved: "",
  sterile_fill_capability: "",
  cold_chain_storage_capabilities: "",
  batch_documentation: "",
  quality_management_system: "",
  third_party_testing: "",
  testing_lab_name: "",
  coa_lot_specific: "",
  coa_publicly_viewable: "",
  coa_public_link: "",
  identity_confirmation_method: "",
  testing_protocols: "",
  stability_testing_program: "",
  payment_terms: "",
  existing_distribution_channels: "",
  references: "",
  pricing_for_top_compounds: "",
  full_price_list_catalog: "",
  fda_registration_number: "",
  dea_registration: "",
  state_licenses: "",
  buyer_eligibility: "",
  shipping_jurisdictions: "",
  last_fda_inspection_date: "",
  fda_inspection_outcome: "",
  manufacturing_certifications: "",
  warning_letters_regulatory_disclosure: "",
  insurance_coverage: "",
  upload_coa: "",
  upload_cgmp_cert: "",
  upload_fda_docs: "",
  upload_insurance_cert: "",
  upload_sop: "",
  upload_additional: "",
};

/* ─── Required fields per step ─── */
const REQUIRED_BY_STEP: Record<StepKey, (keyof S2Form)[]> = {
  company: [
    "year_founded",
    "headquarters_address",
    "contact_title",
    "ownership_principals",
  ],
  manufacturing: [
    "peptide_synthesis_method",
    "purity_levels_achieved",
    "sterile_fill_capability",
  ],
  quality: [
    "quality_management_system",
    "third_party_testing",
    "testing_lab_name",
    "coa_lot_specific",
    "coa_publicly_viewable",
    "identity_confirmation_method",
    "testing_protocols",
    "stability_testing_program",
    "batch_documentation",
  ],
  commercial: [
    "payment_terms",
    "references",
    "pricing_for_top_compounds",
  ],
  regulatory: [
    "dea_registration",
    "buyer_eligibility",
    "shipping_jurisdictions",
    "insurance_coverage",
  ],
  upload: [
    "upload_coa",
    "upload_cgmp_cert",
    "upload_insurance_cert",
  ],
};

/* ─── Styling ─── */
const inputClass =
  "bg-[#111118] border border-neutral-700 text-neutral-200 placeholder:text-neutral-600 rounded-lg focus:border-[#D4B96A] focus:ring-1 focus:ring-[#D4B96A]/30 transition-colors";
const inputErrorClass =
  "bg-[#111118] border border-red-500 text-neutral-200 placeholder:text-neutral-600 rounded-lg focus:border-[#D4B96A] focus:ring-1 focus:ring-[#D4B96A]/30 transition-colors";
const textareaClass =
  "bg-[#111118] border border-neutral-700 text-neutral-200 placeholder:text-neutral-600 rounded-lg focus:border-[#D4B96A] focus:ring-1 focus:ring-[#D4B96A]/30 transition-colors min-h-[100px]";
const textareaErrorClass =
  "bg-[#111118] border border-red-500 text-neutral-200 placeholder:text-neutral-600 rounded-lg focus:border-[#D4B96A] focus:ring-1 focus:ring-[#D4B96A]/30 transition-colors min-h-[100px]";

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

/* ─── Upload field ─── */
function UploadField({
  label,
  required,
  sub,
  fieldName,
  token,
  value,
  onChange,
  error,
}: {
  label: string;
  required?: boolean;
  sub?: string;
  fieldName: "upload_coa" | "upload_cgmp_cert" | "upload_fda_docs" | "upload_insurance_cert" | "upload_sop" | "upload_additional";
  token: string;
  value: string;
  onChange: (url: string) => void;
  error?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const getUploadUrl = trpc.vendor.getUploadUrl.useMutation();

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 16 * 1024 * 1024) {
      toast.error("File must be under 16 MB");
      return;
    }
    setUploading(true);
    try {
      const { url } = await getUploadUrl.mutateAsync({
        token,
        fileName: file.name,
        fileType: file.type,
        fieldName,
      });
      // PUT directly to S3
      const res = await fetch(url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (!res.ok) throw new Error("Upload failed");
      // Store the base URL (strip query params for storage)
      const cleanUrl = url.split("?")[0];
      onChange(cleanUrl);
      setFileName(file.name);
      toast.success(`${label} uploaded`);
    } catch (err) {
      toast.error("Upload failed — please try again");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Field label={label} required={required} sub={sub} error={error}>
      <div
        className={`border rounded-lg p-4 flex items-center gap-3 transition-colors ${
          error ? "border-red-500" : value ? "border-[#D4B96A]/40 bg-[#D4B96A]/5" : "border-neutral-700 bg-[#111118]"
        }`}
      >
        {uploading ? (
          <Loader2 className="w-4 h-4 text-[#D4B96A] animate-spin shrink-0" />
        ) : value ? (
          <CheckCircle2 className="w-4 h-4 text-[#D4B96A] shrink-0" />
        ) : (
          <Paperclip className="w-4 h-4 text-neutral-500 shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          {value ? (
            <p className="text-sm text-neutral-300 truncate">{fileName || "Uploaded"}</p>
          ) : (
            <p className="text-sm text-neutral-500">No file selected</p>
          )}
        </div>
        <label className="cursor-pointer">
          <span className="text-xs font-mono text-[#D4B96A] border border-[#D4B96A]/40 rounded px-3 py-1.5 hover:bg-[#D4B96A]/10 transition-colors whitespace-nowrap">
            {uploading ? "Uploading…" : value ? "Replace" : "Choose File"}
          </span>
          <input
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFile}
            disabled={uploading}
          />
        </label>
      </div>
    </Field>
  );
}

/* ─── Main component ─── */
export default function VendorIntakeLong() {
  const [location] = useLocation();
  const token = new URLSearchParams(window.location.search).get("token") ?? "";

  const [step, setStep] = useState<StepKey>("company");
  const [form, setForm] = useState<S2Form>(EMPTY_S2);
  const [errors, setErrors] = useState<Partial<Record<keyof S2Form, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stepIdx = STEPS.findIndex((s) => s.key === step);

  /* ─── Load existing record ─── */
  const { data: record, isLoading, error: loadError } = trpc.vendor.getByToken.useQuery(
    { token },
    { enabled: !!token, retry: false }
  );

  // Pre-populate form from saved record
  useEffect(() => {
    if (!record) return;
    const saved: Partial<S2Form> = {};
    for (const key of Object.keys(EMPTY_S2) as (keyof S2Form)[]) {
      const val = (record as Record<string, unknown>)[key];
      if (typeof val === "string" && val) saved[key] = val;
    }
    setForm((f) => ({ ...f, ...saved }));
    if ((record as Record<string, unknown>).stage === "stage2_submitted") {
      setSubmitted(true);
    }
  }, [record]);

  const set = (field: keyof S2Form) => (value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  /* ─── Auto-save ─── */
  const saveProgressMutation = trpc.vendor.saveStage2Progress.useMutation();

  const saveProgress = useCallback(async () => {
    if (!token || isSaving) return;
    setIsSaving(true);
    try {
      await saveProgressMutation.mutateAsync({ token, ...form });
      setLastSaved(new Date());
    } catch {
      // silent — don't interrupt user
    } finally {
      setIsSaving(false);
    }
  }, [token, form, isSaving]);

  // Auto-save every 60 seconds
  useEffect(() => {
    const interval = setInterval(saveProgress, 60_000);
    return () => clearInterval(interval);
  }, [saveProgress]);

  /* ─── Validation ─── */
  function validateStep(stepKey: StepKey): boolean {
    const required = REQUIRED_BY_STEP[stepKey];
    const newErrors: Partial<Record<keyof S2Form, string>> = {};
    for (const field of required) {
      if (!form[field]?.trim()) {
        const label = field.replace(/_/g, " ");
        newErrors[field] = `${label.charAt(0).toUpperCase() + label.slice(1)} is required`;
      }
    }
    setErrors((e) => ({ ...e, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  }

  /* ─── Navigation ─── */
  async function goNext() {
    const valid = validateStep(step);
    if (!valid) {
      toast.error("Please fill in all required fields before continuing.");
      return;
    }
    await saveProgress();
    if (stepIdx < STEPS.length - 1) {
      setStep(STEPS[stepIdx + 1].key);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function goPrev() {
    if (stepIdx > 0) {
      setStep(STEPS[stepIdx - 1].key);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  /* ─── Final submit ─── */
  const submitMutation = trpc.vendor.submitStage2.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Please try again.";
      toast.error("Submission failed: " + msg);
      setIsSubmitting(false);
    },
  });

  async function handleSubmit() {
    const valid = validateStep("upload");
    if (!valid) {
      toast.error("Please upload all required documents before submitting.");
      return;
    }
    setIsSubmitting(true);
    submitMutation.mutate({ token, ...form });
  }

  /* ─── Guard: no token ─── */
  if (!token) {
    return (
      <div className="min-h-screen bg-[#0A0A10] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h1 className="font-serif text-2xl text-neutral-100 mb-3">Invalid Link</h1>
          <p className="text-neutral-400">
            This page requires a valid supplier link. Please check the email you
            received and use the link provided.
          </p>
        </div>
      </div>
    );
  }

  /* ─── Guard: loading ─── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A10] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#D4B96A] animate-spin" />
      </div>
    );
  }

  /* ─── Guard: error (invalid/not-activated token) ─── */
  if (loadError) {
    const isForbidden = loadError.message?.includes("not been activated");
    return (
      <div className="min-h-screen bg-[#0A0A10] flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h1 className="font-serif text-2xl text-neutral-100 mb-3">
            {isForbidden ? "Link Not Yet Active" : "Link Not Found"}
          </h1>
          <p className="text-neutral-400">
            {isForbidden
              ? "Your Stage 2 link has not been activated yet. You'll receive an email when we're ready to proceed."
              : "This link is invalid or has expired. Please contact us if you believe this is an error."}
          </p>
        </div>
      </div>
    );
  }

  /* ─── Success screen ─── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0A0A10] flex items-center justify-center px-4">
        <div className="max-w-xl w-full text-center">
          <CheckCircle2 className="w-16 h-16 text-[#D4B96A] mx-auto mb-6" />
          <h1 className="font-serif text-3xl text-neutral-100 mb-4">
            Full Profile Submitted
          </h1>
          <p className="text-neutral-400 mb-6 leading-relaxed">
            Thank you for completing your vendor profile. Our team will review your
            submission and reach out within 5–7 business days with next steps.
          </p>
          <p className="text-xs font-mono text-neutral-600">
            Supplier ID: {(record as Record<string, unknown>)?.supplierId as string}
          </p>
        </div>
      </div>
    );
  }

  /* ─── Step progress bar ─── */
  const StepBar = () => (
    <div className="flex items-center gap-1 overflow-x-auto pb-1">
      {STEPS.map((s, i) => {
        const Icon = s.icon;
        const isActive = s.key === step;
        const isDone = i < stepIdx;
        return (
          <button
            key={s.key}
            onClick={() => {
              if (isDone) {
                setStep(s.key);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            disabled={!isDone && !isActive}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono tracking-wide whitespace-nowrap transition-colors ${
              isActive
                ? "bg-[#D4B96A]/15 text-[#D4B96A] border border-[#D4B96A]/30"
                : isDone
                ? "text-neutral-400 hover:text-[#D4B96A] cursor-pointer"
                : "text-neutral-600 cursor-not-allowed"
            }`}
          >
            {isDone ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-[#D4B96A]" />
            ) : (
              <Icon className="w-3.5 h-3.5" />
            )}
            {s.label}
          </button>
        );
      })}
    </div>
  );

  /* ─── Step content ─── */
  const renderStep = () => {
    switch (step) {
      /* ── Company ── */
      case "company":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="DBA / Trade Name" sub="Optional — if different from legal entity name">
              <Input
                value={form.dba_name}
                onChange={(e) => set("dba_name")(e.target.value)}
                placeholder="Acme Bio"
                className={inputClass}
              />
            </Field>
            <Field label="Year Founded" required error={errors.year_founded}>
              <Input
                value={form.year_founded}
                onChange={(e) => set("year_founded")(e.target.value)}
                placeholder="2018"
                className={errors.year_founded ? inputErrorClass : inputClass}
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Headquarters Address" required error={errors.headquarters_address}>
                <Input
                  value={form.headquarters_address}
                  onChange={(e) => set("headquarters_address")(e.target.value)}
                  placeholder="123 Main St, Wilmington, DE 19801"
                  className={errors.headquarters_address ? inputErrorClass : inputClass}
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Manufacturing Facility Address" sub="Optional — if different from headquarters">
                <Input
                  value={form.manufacturing_facility_address}
                  onChange={(e) => set("manufacturing_facility_address")(e.target.value)}
                  placeholder="456 Lab Rd, Newark, DE 19711"
                  className={inputClass}
                />
              </Field>
            </div>
            <Field label="Title / Role" required error={errors.contact_title}>
              <Input
                value={form.contact_title}
                onChange={(e) => set("contact_title")(e.target.value)}
                placeholder="VP of Business Development"
                className={errors.contact_title ? inputErrorClass : inputClass}
              />
            </Field>
            <div className="md:col-span-2">
              <Field
                label="Ownership Structure &amp; Principals"
                required
                error={errors.ownership_principals}
                sub="List owners, founders, and key principals with their titles and ownership percentages"
              >
                <Textarea
                  value={form.ownership_principals}
                  onChange={(e) => set("ownership_principals")(e.target.value)}
                  placeholder="Jane Smith — CEO — 40%&#10;John Doe — CTO — 30%&#10;Investors — 30%"
                  className={errors.ownership_principals ? textareaErrorClass : textareaClass}
                />
              </Field>
            </div>
          </div>
        );

      /* ── Manufacturing ── */
      case "manufacturing":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <Field label="Peptide Synthesis Method" required error={errors.peptide_synthesis_method}
                sub="e.g., Solid-Phase Peptide Synthesis (SPPS), Fmoc, Boc, recombinant">
                <Textarea
                  value={form.peptide_synthesis_method}
                  onChange={(e) => set("peptide_synthesis_method")(e.target.value)}
                  placeholder="Fmoc SPPS using automated synthesizers..."
                  className={errors.peptide_synthesis_method ? textareaErrorClass : textareaClass}
                />
              </Field>
            </div>
            <Field label="Purity Levels Achieved" required error={errors.purity_levels_achieved}
              sub="e.g., ≥98% HPLC purity standard">
              <Input
                value={form.purity_levels_achieved}
                onChange={(e) => set("purity_levels_achieved")(e.target.value)}
                placeholder="≥98% HPLC"
                className={errors.purity_levels_achieved ? inputErrorClass : inputClass}
              />
            </Field>
            <Field label="Sterile Fill Capability" required error={errors.sterile_fill_capability}>
              <Select value={form.sterile_fill_capability} onValueChange={set("sterile_fill_capability")}>
                <SelectTrigger className={`${errors.sterile_fill_capability ? inputErrorClass : inputClass} w-full`}>
                  <SelectValue placeholder="Select capability" />
                </SelectTrigger>
                <SelectContent className="bg-[#111118] border border-neutral-700 text-neutral-200">
                  {["In-house sterile fill", "Third-party sterile fill partner", "No sterile fill capability"].map((o) => (
                    <SelectItem key={o} value={o} className="hover:bg-neutral-800 focus:bg-neutral-800">{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <div className="md:col-span-2">
              <Field label="Cold Chain / Storage Capabilities" sub="Optional — describe refrigeration, freezer, or controlled-temp storage">
                <Textarea
                  value={form.cold_chain_storage_capabilities}
                  onChange={(e) => set("cold_chain_storage_capabilities")(e.target.value)}
                  placeholder="2–8°C refrigerated storage, -20°C freezer capacity..."
                  className={textareaClass}
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Batch Documentation" required error={errors.batch_documentation}
                sub="Describe your batch record and traceability documentation practices">
                <Textarea
                  value={form.batch_documentation}
                  onChange={(e) => set("batch_documentation")(e.target.value)}
                  placeholder="Full batch records maintained per cGMP; lot-level traceability from raw material to finished product..."
                  className={errors.batch_documentation ? textareaErrorClass : textareaClass}
                />
              </Field>
            </div>
          </div>
        );

      /* ── Quality ── */
      case "quality":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Quality Management System" required error={errors.quality_management_system}>
              <Select value={form.quality_management_system} onValueChange={set("quality_management_system")}>
                <SelectTrigger className={`${errors.quality_management_system ? inputErrorClass : inputClass} w-full`}>
                  <SelectValue placeholder="Select QMS" />
                </SelectTrigger>
                <SelectContent className="bg-[#111118] border border-neutral-700 text-neutral-200">
                  {["cGMP", "ISO 9001", "ISO 13485", "ICH Q10", "None", "Other"].map((o) => (
                    <SelectItem key={o} value={o} className="hover:bg-neutral-800 focus:bg-neutral-800">{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Third-Party Testing" required error={errors.third_party_testing}>
              <Select value={form.third_party_testing} onValueChange={set("third_party_testing")}>
                <SelectTrigger className={`${errors.third_party_testing ? inputErrorClass : inputClass} w-full`}>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent className="bg-[#111118] border border-neutral-700 text-neutral-200">
                  {["Yes — every batch", "Yes — on request", "No"].map((o) => (
                    <SelectItem key={o} value={o} className="hover:bg-neutral-800 focus:bg-neutral-800">{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Testing Lab Name" required error={errors.testing_lab_name}>
              <Input
                value={form.testing_lab_name}
                onChange={(e) => set("testing_lab_name")(e.target.value)}
                placeholder="Eurofins, Alcami, Intertek..."
                className={errors.testing_lab_name ? inputErrorClass : inputClass}
              />
            </Field>
            <Field label="COA Lot / Batch-Specific" required error={errors.coa_lot_specific}>
              <Select value={form.coa_lot_specific} onValueChange={set("coa_lot_specific")}>
                <SelectTrigger className={`${errors.coa_lot_specific ? inputErrorClass : inputClass} w-full`}>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent className="bg-[#111118] border border-neutral-700 text-neutral-200">
                  {["Yes — lot-specific COA", "Generic COA only", "No COA available"].map((o) => (
                    <SelectItem key={o} value={o} className="hover:bg-neutral-800 focus:bg-neutral-800">{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="COA Publicly Viewable Before Purchase" required error={errors.coa_publicly_viewable}>
              <Select value={form.coa_publicly_viewable} onValueChange={set("coa_publicly_viewable")}>
                <SelectTrigger className={`${errors.coa_publicly_viewable ? inputErrorClass : inputClass} w-full`}>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent className="bg-[#111118] border border-neutral-700 text-neutral-200">
                  {["Yes", "On request only", "No"].map((o) => (
                    <SelectItem key={o} value={o} className="hover:bg-neutral-800 focus:bg-neutral-800">{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="COA Public Link" sub="Optional — URL to your public COA page or sample COA">
              <Input
                type="url"
                value={form.coa_public_link}
                onChange={(e) => set("coa_public_link")(e.target.value)}
                placeholder="https://acmepeptides.com/coa"
                className={inputClass}
              />
            </Field>
            <Field label="Identity Confirmation Method" required error={errors.identity_confirmation_method}
              sub="How do you confirm peptide identity? e.g., HPLC, MS, NMR">
              <Input
                value={form.identity_confirmation_method}
                onChange={(e) => set("identity_confirmation_method")(e.target.value)}
                placeholder="HPLC + LC-MS/MS"
                className={errors.identity_confirmation_method ? inputErrorClass : inputClass}
              />
            </Field>
            <Field label="Stability Testing Program" required error={errors.stability_testing_program}>
              <Select value={form.stability_testing_program} onValueChange={set("stability_testing_program")}>
                <SelectTrigger className={`${errors.stability_testing_program ? inputErrorClass : inputClass} w-full`}>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent className="bg-[#111118] border border-neutral-700 text-neutral-200">
                  {["ICH-compliant stability program", "Accelerated stability testing", "Basic shelf-life testing", "None"].map((o) => (
                    <SelectItem key={o} value={o} className="hover:bg-neutral-800 focus:bg-neutral-800">{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <div className="md:col-span-2">
              <Field
                label="Testing Protocols"
                required
                error={errors.testing_protocols}
                sub="Describe your full testing methodology. Include mass spectrometry methods if applicable — this earns a 5-point bonus."
              >
                <Textarea
                  value={form.testing_protocols}
                  onChange={(e) => set("testing_protocols")(e.target.value)}
                  placeholder="HPLC purity analysis, LC-MS/MS identity confirmation, endotoxin testing by LAL, residual solvent analysis by GC-MS..."
                  className={`${errors.testing_protocols ? textareaErrorClass : textareaClass} min-h-[130px]`}
                />
              </Field>
            </div>
          </div>
        );

      /* ── Commercial ── */
      case "commercial":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Payment Terms" required error={errors.payment_terms}>
              <Select value={form.payment_terms} onValueChange={set("payment_terms")}>
                <SelectTrigger className={`${errors.payment_terms ? inputErrorClass : inputClass} w-full`}>
                  <SelectValue placeholder="Select terms" />
                </SelectTrigger>
                <SelectContent className="bg-[#111118] border border-neutral-700 text-neutral-200">
                  {["Net 30", "Net 60", "Net 90", "Prepayment required", "50% deposit / 50% on delivery", "Custom"].map((o) => (
                    <SelectItem key={o} value={o} className="hover:bg-neutral-800 focus:bg-neutral-800">{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <div className="md:col-span-2">
              <Field label="Existing Distribution Channels" sub="Optional — who do you currently sell to?">
                <Textarea
                  value={form.existing_distribution_channels}
                  onChange={(e) => set("existing_distribution_channels")(e.target.value)}
                  placeholder="Compounding pharmacies, research institutions, direct-to-consumer..."
                  className={textareaClass}
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="References" required error={errors.references}
                sub="Provide 2–3 business references (name, company, email/phone)">
                <Textarea
                  value={form.references}
                  onChange={(e) => set("references")(e.target.value)}
                  placeholder="Dr. Jane Smith, Acme Pharmacy, jane@acmepharmacy.com&#10;John Doe, BioResearch Inc., +1 (555) 000-0000"
                  className={errors.references ? textareaErrorClass : textareaClass}
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Pricing for Top Compounds" required error={errors.pricing_for_top_compounds}
                sub="Provide pricing for your top 3–5 compounds (compound, unit size, price/unit, MOQ tier)">
                <Textarea
                  value={form.pricing_for_top_compounds}
                  onChange={(e) => set("pricing_for_top_compounds")(e.target.value)}
                  placeholder="BPC-157: 1g = $X, 10g = $Y, 100g = $Z&#10;TB-500: 1g = $X, 10g = $Y..."
                  className={`${errors.pricing_for_top_compounds ? textareaErrorClass : textareaClass} min-h-[120px]`}
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Full Price List / Catalog" sub="Optional — paste or describe your full catalog, or note if you can provide a file">
                <Textarea
                  value={form.full_price_list_catalog}
                  onChange={(e) => set("full_price_list_catalog")(e.target.value)}
                  placeholder="Full catalog available on request / see uploaded document..."
                  className={textareaClass}
                />
              </Field>
            </div>
          </div>
        );

      /* ── Regulatory ── */
      case "regulatory":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="FDA Registration Number" sub="Optional — if applicable">
              <Input
                value={form.fda_registration_number}
                onChange={(e) => set("fda_registration_number")(e.target.value)}
                placeholder="FDA Establishment ID or Registration #"
                className={inputClass}
              />
            </Field>
            <Field label="DEA Registration" required error={errors.dea_registration}>
              <Select value={form.dea_registration} onValueChange={set("dea_registration")}>
                <SelectTrigger className={`${errors.dea_registration ? inputErrorClass : inputClass} w-full`}>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent className="bg-[#111118] border border-neutral-700 text-neutral-200">
                  {["Registered — Schedule I", "Registered — Schedule II", "Registered — Schedule III–V", "Not applicable", "Pending registration"].map((o) => (
                    <SelectItem key={o} value={o} className="hover:bg-neutral-800 focus:bg-neutral-800">{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <div className="md:col-span-2">
              <Field label="State Licenses" sub="Optional — list relevant state-level manufacturing or distribution licenses">
                <Textarea
                  value={form.state_licenses}
                  onChange={(e) => set("state_licenses")(e.target.value)}
                  placeholder="Delaware Pharmacy License #12345, California Drug Manufacturer License #67890..."
                  className={textareaClass}
                />
              </Field>
            </div>
            <Field label="Buyer Eligibility" required error={errors.buyer_eligibility}
              sub="Who are you authorized to sell to?">
              <Select value={form.buyer_eligibility} onValueChange={set("buyer_eligibility")}>
                <SelectTrigger className={`${errors.buyer_eligibility ? inputErrorClass : inputClass} w-full`}>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent className="bg-[#111118] border border-neutral-700 text-neutral-200">
                  {["Licensed healthcare providers only", "Compounding pharmacies only", "Research institutions only", "Licensed professionals + research", "All of the above", "Other"].map((o) => (
                    <SelectItem key={o} value={o} className="hover:bg-neutral-800 focus:bg-neutral-800">{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Shipping Jurisdictions" required error={errors.shipping_jurisdictions}>
              <Select value={form.shipping_jurisdictions} onValueChange={set("shipping_jurisdictions")}>
                <SelectTrigger className={`${errors.shipping_jurisdictions ? inputErrorClass : inputClass} w-full`}>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent className="bg-[#111118] border border-neutral-700 text-neutral-200">
                  {["US only", "US + Canada", "US + EU", "North America", "Global", "Other"].map((o) => (
                    <SelectItem key={o} value={o} className="hover:bg-neutral-800 focus:bg-neutral-800">{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Last FDA Inspection Date" sub="Optional">
              <Input
                type="date"
                value={form.last_fda_inspection_date}
                onChange={(e) => set("last_fda_inspection_date")(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="FDA Inspection Outcome" sub="Optional">
              <Select value={form.fda_inspection_outcome} onValueChange={set("fda_inspection_outcome")}>
                <SelectTrigger className={`${inputClass} w-full`}>
                  <SelectValue placeholder="Select outcome" />
                </SelectTrigger>
                <SelectContent className="bg-[#111118] border border-neutral-700 text-neutral-200">
                  {["No Action Indicated (NAI)", "Voluntary Action Indicated (VAI)", "Official Action Indicated (OAI)", "Warning Letter issued", "Not yet inspected"].map((o) => (
                    <SelectItem key={o} value={o} className="hover:bg-neutral-800 focus:bg-neutral-800">{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <div className="md:col-span-2">
              <Field label="Manufacturing Certifications" sub="Optional — list all relevant certifications (ISO, USP, NSF, etc.)">
                <Textarea
                  value={form.manufacturing_certifications}
                  onChange={(e) => set("manufacturing_certifications")(e.target.value)}
                  placeholder="ISO 9001:2015, USP <797>, NSF GMP..."
                  className={textareaClass}
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Warning Letters / Regulatory Disclosure" sub="Optional — disclose any FDA warning letters, import alerts, or consent decrees in the past 5 years">
                <Textarea
                  value={form.warning_letters_regulatory_disclosure}
                  onChange={(e) => set("warning_letters_regulatory_disclosure")(e.target.value)}
                  placeholder="None / Describe any relevant regulatory actions..."
                  className={textareaClass}
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Insurance Coverage" required error={errors.insurance_coverage}
                sub="Describe your product liability and general liability insurance coverage">
                <Textarea
                  value={form.insurance_coverage}
                  onChange={(e) => set("insurance_coverage")(e.target.value)}
                  placeholder="$5M product liability, $2M general liability — Carrier: XYZ Insurance..."
                  className={errors.insurance_coverage ? textareaErrorClass : textareaClass}
                />
              </Field>
            </div>
          </div>
        );

      /* ── Uploads ── */
      case "upload":
        return (
          <div className="grid grid-cols-1 gap-5">
            <p className="text-sm text-neutral-400 -mt-2 mb-2">
              Accepted formats: PDF, DOC, DOCX, JPG, PNG. Maximum 16 MB per file.
              Files marked <span className="text-[#D4B96A]/60">*</span> are required.
            </p>
            <UploadField
              label="Certificate of Analysis (COA)"
              required
              sub="A representative lot-specific COA for one of your primary peptides"
              fieldName="upload_coa"
              token={token}
              value={form.upload_coa}
              onChange={set("upload_coa")}
              error={errors.upload_coa}
            />
            <UploadField
              label="cGMP / Quality Certification"
              required
              sub="Your current GMP certificate or equivalent quality certification"
              fieldName="upload_cgmp_cert"
              token={token}
              value={form.upload_cgmp_cert}
              onChange={set("upload_cgmp_cert")}
              error={errors.upload_cgmp_cert}
            />
            <UploadField
              label="FDA Registration Documentation"
              sub="Optional — FDA establishment registration or drug listing documentation"
              fieldName="upload_fda_docs"
              token={token}
              value={form.upload_fda_docs}
              onChange={set("upload_fda_docs")}
            />
            <UploadField
              label="Certificate of Insurance"
              required
              sub="Current certificate of insurance showing product and general liability coverage"
              fieldName="upload_insurance_cert"
              token={token}
              value={form.upload_insurance_cert}
              onChange={set("upload_insurance_cert")}
              error={errors.upload_insurance_cert}
            />
            <UploadField
              label="Sample SOP Document"
              sub="Optional — a representative Standard Operating Procedure for manufacturing or QC"
              fieldName="upload_sop"
              token={token}
              value={form.upload_sop}
              onChange={set("upload_sop")}
            />
            <UploadField
              label="Additional Documentation"
              sub="Optional — any other supporting documents (audit reports, third-party test results, etc.)"
              fieldName="upload_additional"
              token={token}
              value={form.upload_additional}
              onChange={set("upload_additional")}
            />
          </div>
        );
    }
  };

  /* ─── Render ─── */
  return (
    <div className="min-h-screen bg-[#0A0A10] text-neutral-200">
      {/* Header */}
      <div className="border-b border-neutral-800 bg-[#0D0D14]">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-6 h-6 text-[#D4B96A]" />
            <span className="font-mono text-xs tracking-[0.2em] text-[#D4B96A] uppercase">
              Vendor Application — Stage 2
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-neutral-100 mb-3">
            Full Vendor Profile
          </h1>
          {record && (
            <p className="text-neutral-400 text-sm mb-1">
              Completing profile for{" "}
              <span className="text-neutral-200 font-medium">
                {(record as Record<string, unknown>).legal_entity_name as string}
              </span>
            </p>
          )}
          <p className="text-xs text-neutral-600">
            Your progress is saved automatically every 60 seconds.
            {lastSaved && (
              <span className="ml-2 text-[#D4B96A]/50">
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Step bar */}
      <div className="border-b border-neutral-800 bg-[#0D0D14]">
        <div className="max-w-3xl mx-auto px-6 py-3">
          <StepBar />
        </div>
      </div>

      {/* Form body */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Section header */}
        <div className="mb-8">
          <h2 className="font-mono text-xs tracking-[0.2em] text-[#D4B96A] uppercase mb-1">
            Step {stepIdx + 1} of {STEPS.length}
          </h2>
          <h3 className="font-serif text-2xl text-neutral-100">
            {STEPS[stepIdx].label}
          </h3>
        </div>

        {/* Step fields */}
        {renderStep()}

        {/* Navigation */}
        <div className="mt-10 pt-6 border-t border-neutral-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {stepIdx > 0 && (
              <Button
                variant="outline"
                onClick={goPrev}
                className="border-neutral-700 text-neutral-400 hover:text-neutral-200 hover:border-neutral-500 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <Button
              variant="outline"
              onClick={saveProgress}
              disabled={isSaving}
              className="border-neutral-700 text-neutral-400 hover:text-neutral-200 hover:border-neutral-500 bg-transparent"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Progress
            </Button>
          </div>

          {stepIdx < STEPS.length - 1 ? (
            <Button
              onClick={goNext}
              className="bg-[#D4B96A] hover:bg-[#C4A95A] text-[#0A0A10] font-semibold px-8 py-3 rounded-lg flex items-center gap-2"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || submitMutation.isPending}
              className="bg-[#D4B96A] hover:bg-[#C4A95A] text-[#0A0A10] font-semibold px-8 py-3 rounded-lg flex items-center gap-2"
            >
              {isSubmitting || submitMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  Submit Full Profile
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
