import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import { SeminarFeedbackForm } from "@/components/seminar/seminar-feedback-form";

const title = "Seminar feedback · BeautyUni";
const description =
  "Tell us how the two-days seminar landed: ten questions on the content, the educators and the event, and what you'll put into practice next.";

export const metadata: Metadata = {
  // Absolute: the root layout's "%s · Rockstar" template is the landing
  // page's brand, and this page is BeautyUni's.
  title: { absolute: title },
  description,
  alternates: { canonical: "/seminar-feedback" },
  openGraph: {
    title: { absolute: title },
    description,
    url: "/seminar-feedback",
    type: "website",
    siteName: "BeautyUni",
  },
  // A one-off response page: useful to whoever holds the link, worth nothing
  // in a search result, and it would only compete with the landing page.
  robots: { index: false, follow: true },
};

// This page wears the BeautyUni light theme, not the site's charcoal one, so
// it overrides the root layout's dark browser chrome for its own route. The
// colour scheme matters beyond the address bar: it is what makes the native
// country picker and the scrollbars come back light instead of dark.
export const viewport: Viewport = {
  themeColor: "#FCF7F3",
  colorScheme: "light",
};

export default function Page() {
  return (
    // `lp` for the link colours and the horizontal-overflow clip, `bu` for the
    // BeautyUni palette (see app/globals.css); the page frame itself is
    // `sf-page`.
    <div className="rs lp bu sf-page">
      <div className="sf-glow" aria-hidden="true" />

      <header className="sf-bar">
        <Link className="sf-brand" href="/" aria-label="BeautyUni home">
          {/* The same header wordmark the site nav carries, so arriving here
              from a QR code lands on the brand the rest of the site wears. */}
          <Image
            className="bu-logo"
            src="/site/logo-header.png"
            alt="BeautyUni"
            width={1125}
            height={240}
            preload
          />
        </Link>
      </header>

      <main className="sf-wrap">
        <div className="sf-head">
          <h1 className="rs-display sf-h1">Tell Us How We Did</h1>
        </div>

        <SeminarFeedbackForm />
      </main>

      <footer className="sf-legal">
        <span>&copy; 2026 BeautyUni</span>
      </footer>
    </div>
  );
}
