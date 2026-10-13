import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, LegalSection } from "@/components/marketing/legal-page";

// New page (no legacy source; team review 2026-10-14). Each section matches
// what the code really collects: Kit for the newsletter, Supabase for
// accounts, quiz results, comments/reactions and the site's forms, Resend
// for email to Tony, GA4 (production domain only), the `tg_visit_count` and
// visitor-session cookies. Update this page when any of that changes.
// Josh (legal) to review the wording before launch.
export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What tonygreenberg.com collects, why, who helps us run it, and how to see, change or delete your information.",
  alternates: { canonical: "/privacy" },
};

const CONTACT_EMAIL = "t@ramprate.com";

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy Policy"
      updated="October 14, 2026"
      intro={
        <p>
          This policy explains what tonygreenberg.com (&ldquo;the site,&rdquo; &ldquo;we&rdquo;) collects when you
          read, take an assessment, subscribe or write to us, and what we do with it. The short version: we collect
          only what a feature needs, we never sell your information, and you can ask us to delete it at any time.
        </p>
      }
    >
      <LegalSection title="Who we are">
        <p>
          The site is run by Tony Greenberg and RampRate, Inc., based in Santa Monica, California. Questions about
          this policy or your information go to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </LegalSection>

      <LegalSection title="What you give us">
        <ul>
          <li>
            <strong>Your email address</strong>, when you subscribe to the newsletter, join a waitlist, or ask for your
            assessment results by email.
          </li>
          <li>
            <strong>Account details</strong> (email and password), if you create a member account. Passwords are
            stored by our sign-in provider in scrambled form; we never see them.
          </li>
          <li>
            <strong>Assessment and quiz results</strong>, so you can come back to them and, for members, see your
            progress on any device. For the sexuality and religion assessments we record only that you finished, not
            your answers or result.
          </li>
          <li>
            <strong>Comments, reactions, ratings and highlights</strong> you leave on essays. Comments are public.
          </li>
          <li>
            <strong>What you write in a form</strong> (for example a correction, a submission or a check-in), which is
            saved and emailed to Tony so he can read and reply.
          </li>
          <li>
            <strong>Supplier or buyer details</strong> from the supplier intake form, which go to RampRate to answer
            your request.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="What we collect automatically">
        <ul>
          <li>
            <strong>Analytics.</strong> Google Analytics tells us which pages are read and roughly where visitors come
            from (country, device, referring site). It uses cookies. We use it only to understand what people read.
          </li>
          <li>
            <strong>Cookies the site needs.</strong> One keeps you signed in. One counts your visits to the home page
            so returning readers see a different welcome. One gives your browser an anonymous ID so we can save quiz
            results before you sign up and stop people flooding the forms.
          </li>
          <li>
            <strong>Your browser&apos;s own storage</strong>, for small things like a quiz result you just saw or
            whether you already closed the newsletter pop-up. This stays on your device.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="How we use it">
        <ul>
          <li>To send the essays and updates you asked for.</li>
          <li>To show you your assessment results and keep your progress.</li>
          <li>To read and reply to what you send us.</li>
          <li>To keep the site working, secure and free of spam.</li>
          <li>To understand which essays and tools people find useful.</li>
        </ul>
        <p>We do not sell, rent or trade your information, and we do not use it for advertising.</p>
      </LegalSection>

      <LegalSection title="Who helps us run the site">
        <p>A few service providers handle information for us, only to provide their service:</p>
        <ul>
          <li>Kit (ConvertKit): the newsletter mailing list.</li>
          <li>Supabase: member accounts, saved results, comments and form entries.</li>
          <li>Resend: emails the site sends, including the notes Tony receives.</li>
          <li>Google Analytics: visit statistics.</li>
          <li>Netlify: hosting the site.</li>
        </ul>
        <p>
          We may also share information if the law requires it, or to protect the site, its readers or others from
          harm.
        </p>
      </LegalSection>

      <LegalSection title="Your choices">
        <ul>
          <li>Every newsletter email has an unsubscribe link.</li>
          <li>
            You can ask us to show you, correct or delete the information we hold about you, including your account
            and saved results, by writing to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </li>
          <li>
            You can block or delete cookies in your browser. The site still works, though you may need to sign in
            again and saved quiz results may not carry over.
          </li>
        </ul>
        <p>
          If you live in California, the European Union or the United Kingdom, you may have further rights under your
          local law. Write to us and we will help.
        </p>
      </LegalSection>

      <LegalSection title="How long we keep it">
        <p>
          We keep your information while your subscription or account is active, or for as long as we need it for the
          reason you gave it to us. When you ask us to delete it, we do.
        </p>
      </LegalSection>

      <LegalSection title="Security">
        <p>
          The site uses encrypted connections (HTTPS), and stored information is protected by access controls at our
          providers. No system is perfectly secure, so please don&apos;t send us anything you&apos;d need to keep
          completely private.
        </p>
      </LegalSection>

      <LegalSection title="Children">
        <p>
          The site is not meant for children under 13, and we do not knowingly collect their information. If you
          think a child has given us information, write to us and we will delete it.
        </p>
      </LegalSection>

      <LegalSection title="Changes to this policy">
        <p>
          If we change this policy, we&apos;ll update the date at the top of this page. See also our{" "}
          <Link href="/terms">Terms of Use</Link> and <Link href="/contact">Contact</Link> page.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
