import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/site/legal-page";
import { CONTACT } from "@/lib/content";

const title = "Privacy policy";
const description =
  "What BeautyUni collects when you join the community, how it is used, where it is stored and how to have it removed.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacy" },
  // A legal page has nothing to rank for and would only compete with the
  // pages that do.
  robots: { index: false, follow: true },
};

const Mail = () => <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>;

const SECTIONS: readonly LegalSection[] = [
  {
    id: "who-we-are",
    heading: "Who we are",
    body: (
      <p>
        BeautyUni (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is an education and
        business-growth platform for professionals in beauty, wellness and
        medaesthetics. For questions about this policy or your data, contact{" "}
        <Mail />.
      </p>
    ),
  },
  {
    id: "what-we-collect",
    heading: "What we collect",
    body: (
      <>
        <p>
          When you submit the form at <Link href="/join">/join</Link> we collect
          only the information you provide: your full name, phone number,
          WhatsApp number, email address, city and professional role. We also
          record the date and time of your submission, the consent wording you
          agreed to, and a short source code from the link or QR code you used,
          so we can understand which of our materials people found useful.
        </p>
        <p>
          We do not collect your IP address, device fingerprint, or any other
          hidden information through this form.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-it",
    heading: "How we use it",
    body: (
      <p>
        We use your details only to contact you about BeautyUni&rsquo;s
        education programmes, events and the{" "}
        <Link href="/podcast">From Passion to Profit</Link> podcast, by email,
        phone or WhatsApp, on the basis of the consent you gave when submitting
        the form.
      </p>
    ),
  },
  {
    id: "where-it-is-stored",
    heading: "Where it is stored",
    body: (
      <p>
        Submissions are stored in a private database accessible only to
        authorised BeautyUni team members. We keep your details for as long as
        you remain in our community or until you ask us to remove them.
      </p>
    ),
  },
  {
    id: "sharing",
    heading: "Sharing",
    body: (
      <p>
        We do not sell your data. We share it only with the service providers
        who help us operate (our database host and our email provider) and
        where required by law.
      </p>
    ),
  },
  {
    id: "your-choices",
    heading: "Your choices and rights",
    body: (
      <p>
        You can withdraw your consent and ask us to correct or delete your data
        at any time by emailing <Mail />. We will act on your request within a
        reasonable period.
      </p>
    ),
  },
  {
    id: "changes",
    heading: "Changes",
    body: (
      <p>
        If we change this policy we will update the date above and, where the
        change is significant, let community members know.
      </p>
    ),
  },
];

export default function Page() {
  return (
    <LegalPage
      eyebrow="Legal"
      heading="Privacy policy"
      status="Draft, pending legal review"
      updated="11 September 2026"
      sections={SECTIONS}
      footnote="This is placeholder wording provided for launch. BeautyUni should have it reviewed against the Digital Personal Data Protection Act, 2023 and any other applicable law before relying on it."
    />
  );
}
