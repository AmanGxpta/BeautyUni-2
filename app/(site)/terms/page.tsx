import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/site/legal-page";
import { CONTACT } from "@/lib/content";

const title = "Terms of use";
const description =
  "The terms that apply to the BeautyUni website, its content, programme enquiries and third-party links.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/terms" },
  // A legal page has nothing to rank for and would only compete with the
  // pages that do.
  robots: { index: false, follow: true },
};

const SECTIONS: readonly LegalSection[] = [
  {
    id: "about",
    heading: "About these terms",
    body: (
      <p>
        By using the BeautyUni website you agree to these terms. If you do not
        agree, please do not use the site.
      </p>
    ),
  },
  {
    id: "content",
    heading: "Content",
    body: (
      <p>
        The content on this site is provided for general information about
        BeautyUni&rsquo;s education, programmes and podcast. We try to keep it
        accurate and up to date but make no warranties that it is complete or
        current. Programme dates, faculty, pricing and availability may change.
      </p>
    ),
  },
  {
    id: "intellectual-property",
    heading: "Intellectual property",
    body: (
      <p>
        The BeautyUni and From Passion to Profit names, logos and brand assets,
        and the text, design and graphics on this site, are owned by BeautyUni
        or its partners and may not be reproduced without permission. Podcast
        video is hosted on and subject to the terms of the relevant third-party
        platform.
      </p>
    ),
  },
  {
    id: "links",
    heading: "Links",
    body: (
      <p>
        The site links to third-party sites and services, for example YouTube.
        We are not responsible for their content or practices.
      </p>
    ),
  },
  {
    id: "registrations",
    heading: "Registrations and enquiries",
    body: (
      <p>
        Submitting the community form or a programme enquiry does not create a
        binding registration. Places on paid programmes are confirmed
        separately.
      </p>
    ),
  },
  {
    id: "liability",
    heading: "Liability",
    body: (
      <p>
        To the extent permitted by law, BeautyUni is not liable for any loss
        arising from use of, or reliance on, this site.
      </p>
    ),
  },
  {
    id: "contact",
    heading: "Contact",
    body: (
      <p>
        Questions about these terms:{" "}
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
      </p>
    ),
  },
];

export default function Page() {
  return (
    <LegalPage
      eyebrow="Legal"
      heading="Terms of use"
      status="Draft — pending legal review"
      updated="11 September 2026"
      sections={SECTIONS}
      footnote="Placeholder wording provided for launch. Have this reviewed by a qualified adviser before relying on it."
    />
  );
}
