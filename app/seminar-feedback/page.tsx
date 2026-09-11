import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import { SeminarFeedbackForm } from "@/components/seminar/seminar-feedback-form";

const title = "Seminar feedback · BeautyUni";
const description =
  "Tell us how the two-day BeautyUni Seminar landed — nine questions on the content, the speakers and the event, and what you'll put into practice next.";

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
  themeColor: "#FFFFFF",
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
        <Link className="sf-brand" href="/" aria-label="BeautyUni — home">
          {/* The supplied artwork carries its own generous whitespace, so the
              box is taller than the wordmark and the negative margin takes
              that padding back out of the bar. */}
          <Image
            className="bu-logo"
            src="/beautyUni-website.png"
            alt="BeautyUni"
            width={2172}
            height={724}
            priority
          />
        </Link>
      </header>

      <main className="sf-wrap">
        <div className="sf-head">
          <div className="rs-eyebrow">BeautyUni 2-Day Seminar</div>
          <h1 className="rs-display sf-h1">Feedback Survey</h1>
          <p className="sf-lede">
            Nine questions about the two days &mdash; what worked, what you&rsquo;ll
            use, and what would make the next one better. It takes a few minutes,
            and every answer is read.
          </p>
        </div>

        <SeminarFeedbackForm />
      </main>

      <footer className="sf-legal">
        <span>&copy; 2026 BeautyUni</span>
      </footer>
    </div>
  );
}
