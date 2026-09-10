import type { Metadata } from "next";
import Link from "next/link";
import { RSLogo } from "@/components/ui/logo";
import { SeminarFeedbackForm } from "@/components/seminar/seminar-feedback-form";

const title = "Seminar feedback";
const description =
  "Tell us how the two-day Rockstar Seminar landed — nine questions on the content, the speakers and the event, and what you'll put into practice next.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/seminar-feedback" },
  openGraph: { title, description, url: "/seminar-feedback", type: "website" },
  // A one-off response page: useful to whoever holds the link, worth nothing
  // in a search result, and it would only compete with the landing page.
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    // `lp` for the link colours and the horizontal-overflow clip; the page
    // frame itself is `sf-page`.
    <div className="rs lp sf-page">
      <div className="sf-glow" aria-hidden="true" />

      <header className="sf-bar">
        <Link className="sf-brand" href="/" aria-label="Rockstar — home">
          <RSLogo size={20} />
        </Link>
      </header>

      <main className="sf-wrap">
        <div className="sf-head">
          <div className="rs-eyebrow">Rockstar 2-Day Seminar</div>
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
        <span>&copy; 2026 Rockstar</span>
      </footer>
    </div>
  );
}
