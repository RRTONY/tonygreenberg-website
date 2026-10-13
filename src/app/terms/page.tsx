import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/marketing/legal-page";

// New page (no legacy source; team review 2026-10-14, which asked for health
// and investment disclaimers). The ownership wording matches the site
// footer's copyright notice. Josh (legal) to review before launch.
export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms for using tonygreenberg.com, including why the health, wellness and investment content here is not professional advice.",
  alternates: { canonical: "/terms" },
};

const CONTACT_EMAIL = "t@ramprate.com";

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Terms of Use"
      updated="October 14, 2026"
      intro={
        <p>
          These terms apply to everyone who uses tonygreenberg.com (&ldquo;the site&rdquo;), run by Tony Greenberg and
          RampRate, Inc. By using the site you agree to them. If you don&apos;t agree, please don&apos;t use the site.
        </p>
      }
    >
      <LegalSection title="Opinions and education, not professional advice">
        <p>
          The essays, assessments, encyclopedias, scorecards and tools on this site share Tony Greenberg&apos;s
          research, experience and opinions. They are for education and reflection only.
        </p>
        <p>
          <strong>Health and wellness.</strong> Content about peptides, diet, sleep, movement, therapy, kava,
          psychedelics, ibogaine or any other substance or practice is not medical advice, diagnosis or treatment.
          Assessment results are prompts for reflection, not clinical findings. Some substances discussed here are
          unapproved, restricted or illegal where you live, and some carry serious risks. Talk to a qualified
          healthcare professional before starting, stopping or changing anything, and never ignore professional
          advice because of something you read here. In an emergency, call your local emergency number.
        </p>
        <p>
          <strong>Investment and business.</strong> Nothing on the site is an offer to sell, or a request to buy, any
          security or investment. Joining a waitlist or expressing interest commits neither you nor us to anything.
          Content about companies, funds, markets, pricing or suppliers is not financial, investment, tax or legal
          advice. Do your own research and speak with a licensed advisor before making decisions.
        </p>
        <p>
          <strong>Rankings and scorecards</strong> (for example coffee, charity, clinic, supplier or peptide vendor
          ratings) reflect our methods and judgment at the time they were written, and may be out of date.
        </p>
      </LegalSection>

      <LegalSection title="Your account">
        <p>
          If you create a member account, keep your password private and tell us if you think someone else is using
          your account. We may suspend accounts that break these terms.
        </p>
      </LegalSection>

      <LegalSection title="What you post">
        <p>
          You are responsible for the comments and submissions you send. Don&apos;t post anything unlawful, abusive,
          misleading, someone else&apos;s private information, or spam. By posting, you let us show, store and edit
          (for length or clarity) what you submitted on the site. We may remove anything at our discretion.
        </p>
      </LegalSection>

      <LegalSection title="Who owns the content">
        <p>
          All essays, frameworks, assessments, data and other content on the site belong to Tony Greenberg and/or
          RampRate, Inc. You&apos;re welcome to read, share links to and quote short passages with credit and a link
          back. Copying, scraping, mirroring or republishing the site or large parts of it without written permission
          is not allowed.
        </p>
      </LegalSection>

      <LegalSection title="Links to other sites">
        <p>
          The site links to other websites and services we don&apos;t control. We aren&apos;t responsible for their
          content, products or privacy practices.
        </p>
      </LegalSection>

      <LegalSection title="No warranty">
        <p>
          The site is provided &ldquo;as is.&rdquo; We work hard to keep it accurate, but we don&apos;t promise that
          any content is complete, current or error-free, or that the site will always be available.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          To the fullest extent the law allows, Tony Greenberg and RampRate, Inc. are not liable for any loss or harm
          that comes from using the site or relying on its content, including health, financial or business
          decisions you make.
        </p>
      </LegalSection>

      <LegalSection title="Governing law">
        <p>These terms are governed by the laws of the State of California, United States.</p>
      </LegalSection>

      <LegalSection title="Changes and contact">
        <p>
          We may update these terms; the date at the top shows the latest version. Questions go to{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. See also our{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
