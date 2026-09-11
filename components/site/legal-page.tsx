import type { ReactNode } from "react";
import { Shell } from "./shell";

export type LegalSection = { id: string; heading: string; body: ReactNode };

/**
 * The frame the privacy policy and the terms share.
 *
 * Both pages are the same shape — a head, a draft notice, a sticky table of
 * contents and a column of prose — so the shape lives here and each page
 * supplies only its sections.
 */
export function LegalPage({
  eyebrow,
  heading,
  updated,
  status,
  sections,
  footnote,
}: {
  eyebrow: string;
  heading: string;
  updated: string;
  status: string;
  sections: readonly LegalSection[];
  footnote: string;
}) {
  return (
    <Shell>
      <section className="s-pagehead">
        <div className="s-pagehead__bg" aria-hidden="true" />
        <div className="s-wrap">
          <p className="s-eyebrow s-enter">{eyebrow}</p>
          <h1
            className="s-serif s-h1 s-enter"
            style={{ "--d": "100ms", maxWidth: "14ch" } as React.CSSProperties}
          >
            {heading}
          </h1>
        </div>
      </section>

      <section className="s-sec s-sec--tight" style={{ paddingTop: 0 }}>
        <div className="s-wrap s-legal-grid">
          <div className="s-prose" data-reveal>
            <div className="s-prose__meta">
              <span>{status}</span>
              <span>Last updated {updated}</span>
            </div>

            {sections.map((section) => (
              <section key={section.id} id={section.id}>
                <h2>{section.heading}</h2>
                {section.body}
              </section>
            ))}

            <p className="s-note" style={{ marginTop: 40 }}>
              {footnote}
            </p>
          </div>

          <nav className="s-toc" aria-label="On this page">
            {sections.map((section) => (
              <a key={section.id} href={`#${section.id}`}>
                {section.heading}
              </a>
            ))}
          </nav>
        </div>
      </section>
    </Shell>
  );
}
