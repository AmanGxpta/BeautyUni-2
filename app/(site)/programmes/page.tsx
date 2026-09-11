import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { CtaBand } from "@/components/site/cta-band";
import { Ic } from "@/components/site/icons";
import { Shell } from "@/components/site/shell";
import { CONTACT, PROGRAMME } from "@/lib/content";
import seminarLandscape from "@/public/seminar-landscape.png";

const title = "Programmes";
const description =
  "Programmes that combine technical education with the consultation, communication and career skills that turn ability into a business. Featuring the Rock Star Success System masterclass in Mumbai, 2–3 September 2026.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/programmes" },
  openGraph: {
    title: `${title} · BeautyUni`,
    description,
    url: "/programmes",
    type: "website",
  },
};

/** What the two days actually cover — the programme's own three strands. */
const STRANDS = [
  {
    n: "01",
    t: "Cut & colour",
    p: "Contemporary technical education from five U.S. hairdressers, focused on the principles behind the work rather than a sequence of steps to copy.",
  },
  {
    n: "02",
    t: "Consultation",
    p: "The conversation before the service: how to hear what a client is actually asking for, and how to set expectations you can meet.",
  },
  {
    n: "03",
    t: "Career & business",
    p: "Turning technical ability into client trust, loyalty and opportunity — the part of the craft that decides whether a career compounds.",
  },
];

/** The four things that characterise every BeautyUni programme — the strip
 *  that closes the hero, under the two calls to action. */
const HERO_FEATURES = [
  { i: "cap", l1: "Expert-led", l2: "sessions" },
  { i: "users", l1: "Small,", l2: "select cohorts" },
  { i: "case", l1: "Practical tools", l2: "& frameworks" },
  { i: "bars", l1: "Real-world", l2: "application" },
] as const;

export default function Page() {
  return (
    <Shell>
      <section className="s-pagehead s-pagehead--programmes">
        <div className="s-pagehead__bg" aria-hidden="true">
          <Image
            className="s-pagehead__image"
            src={seminarLandscape}
            alt=""
            fill
            preload
            sizes="100vw"
          />
        </div>
        <div className="s-wrap s-pagehead__grid s-pagehead__grid--programmes">
          <div className="s-pagehead__content">
            <p className="s-eyebrow s-enter">Programmes</p>
            <h1
              className="s-serif s-h1 s-enter"
              style={{ "--d": "100ms" } as React.CSSProperties}
            >
              Education with depth, built to <em>change how you work.</em>
            </h1>
            <p
              className="s-lede s-enter"
              style={{ "--d": "180ms" } as React.CSSProperties}
            >
              Programmes that combine technical education with the consultation,
              communication and career skills that turn ability into a business.
            </p>
            <div
              className="s-pagehead__actions s-enter"
              style={{ "--d": "240ms" } as React.CSSProperties}
            >
              <a
                className="s-btn s-btn--lg"
                href="#rock-star-success-system"
              >
                View Upcoming Dates
                <span className="s-btn__arr">
                  <Ic n="arrowR" size={17} />
                </span>
              </a>
              <a
                className="s-btn s-btn--lg s-btn--ghost"
                href={`mailto:${CONTACT.email}?subject=BeautyUni%20programmes%20—%20enquiry`}
              >
                Speak to our team
                <span className="s-btn__arr">
                  <Ic n="arrowR" size={17} />
                </span>
              </a>
            </div>
            <ul
              className="s-feats s-enter"
              style={{ "--d": "320ms" } as React.CSSProperties}
            >
              {HERO_FEATURES.map((f) => (
                <li className="s-feat" key={f.l1 + f.l2}>
                  <span className="s-feat__ic">
                    <Ic n={f.i} size={23} />
                  </span>
                  <span className="s-feat__t">
                    {f.l1}
                    <br />
                    {f.l2}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── The featured programme ────────────────────────────────── */}
      <section className="s-sec s-sec--tight">
        <div className="s-wrap">
          <div className="s-prog" data-reveal="scale" id="rock-star-success-system">
            <div className="s-prog__art">
              <span className="s-prog__tag">Launch masterclass</span>
              <h2 className="s-prog__name">
                Rock Star
                <br />
                <em>Success System</em>
              </h2>
              <p className="s-prog__sub">{PROGRAMME.subtitle}</p>
              <p className="s-prog__eq">
                {PROGRAMME.equation.map((part, i) => (
                  <Fragment key={part}>
                    {i > 0 && <span className="s-prog__eq-p">+</span>}
                    <span className="s-prog__eq-i">{part}</span>
                  </Fragment>
                ))}
              </p>
            </div>

            <div className="s-prog__copy">
              <p className="s-eyebrow">In practice</p>
              <p className="s-body s-body--lg" style={{ marginTop: 16 }}>
                {PROGRAMME.intro}
              </p>
              <dl className="s-facts">
                <div className="s-fact">
                  <dt>Dates</dt>
                  <dd>{PROGRAMME.dates}</dd>
                </div>
                <div className="s-fact">
                  <dt>Format</dt>
                  <dd>{PROGRAMME.format}</dd>
                </div>
                <div className="s-fact">
                  <dt>Venue</dt>
                  <dd>{PROGRAMME.venue}</dd>
                </div>
                <div className="s-fact">
                  <dt>With</dt>
                  <dd>{PROGRAMME.partner}</dd>
                </div>
              </dl>
              <div className="s-prog__cta">
                <Link className="s-btn s-btn--lg" href="/join?p=rock-star">
                  Register your interest
                  <span className="s-btn__arr">
                    <Ic n="arrowR" size={17} />
                  </span>
                </Link>
                <a
                  className="s-btn s-btn--lg s-btn--ghost"
                  href={`mailto:${CONTACT.email}?subject=Rock%20Star%20Success%20System%20—%20enquiry`}
                >
                  Email the team
                  <span className="s-btn__arr">
                    <Ic n="arrowR" size={17} />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Detail + booking card ─────────────────────────────────── */}
      <section className="s-sec s-sec--tight">
        <div className="s-wrap s-prog-detail">
          <div className="s-prog-detail__body" data-reveal>
            <p className="s-eyebrow">The programme</p>
            <h2 className="s-serif s-h3" style={{ margin: "16px 0 20px" }}>
              Two days, five U.S. hairdressers, one system.
            </h2>
            {PROGRAMME.detail.map((para) => (
              <p className="s-body s-body--lg" key={para}>
                {para}
              </p>
            ))}

            <blockquote className="s-quote">
              <p>{PROGRAMME.quote}</p>
              <cite>— {PROGRAMME.quoteBy}</cite>
            </blockquote>

            <div className="s-days" style={{ marginTop: 40 }}>
              {STRANDS.map((s) => (
                <article className="s-day" key={s.n}>
                  <span className="s-day__n">{s.n}</span>
                  <h3 className="s-serif s-day__t">{s.t}</h3>
                  <p className="s-day__p">{s.p}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="s-card" data-reveal>
            <p className="s-card__t">Seminar information</p>
            <dl className="s-facts">
              <div className="s-fact">
                <dt>Dates</dt>
                <dd>{PROGRAMME.dates}</dd>
              </div>
              <div className="s-fact">
                <dt>Venue</dt>
                <dd>{PROGRAMME.venue}</dd>
              </div>
              <div className="s-fact">
                <dt>Format</dt>
                <dd>{PROGRAMME.format}</dd>
              </div>
              <div className="s-fact">
                <dt>Places</dt>
                <dd>{PROGRAMME.places}</dd>
              </div>
              <div className="s-fact">
                <dt>Presented with</dt>
                <dd>{PROGRAMME.partner}</dd>
              </div>
            </dl>
            <div className="s-card__cta">
              <Link className="s-btn" href="/join?p=rock-star">
                Register your interest
                <span className="s-btn__arr">
                  <Ic n="arrowR" size={16} />
                </span>
              </Link>
            </div>
            <p className="s-card__note">
              Registration and enquiries: Roopa Ambekar ·{" "}
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> ·{" "}
              <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>
            </p>
            <p className="s-card__note">
              Submitting the form is an expression of interest, not a booking.
              Places on paid programmes are confirmed separately.
            </p>
          </aside>
        </div>
      </section>

      {/* ── What's next ───────────────────────────────────────────── */}
      <section className="s-sec s-sec--sand">
        <div className="s-wrap s-head" data-reveal>
          <div>
            <p className="s-eyebrow">More to come</p>
            <h2 className="s-serif s-h2">A programme calendar is being built.</h2>
          </div>
          <div className="s-head__side">
            <p className="s-lede">
              BeautyUni is developing workshops and courses across technical
              standards, consultation and guest experience, leadership and team
              development, and commercial growth.
            </p>
            <p style={{ marginTop: 24 }}>
              <Link className="s-link s-link--terra" href="/join">
                Join the community to hear new dates first
                <Ic n="arrowR" size={16} />
              </Link>
            </p>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Get involved"
        title="Be part of the next cohort."
        body="Share a few details and we’ll reach out with upcoming programme dates, eligibility and next steps."
        primary={{
          href: "/join?p=rock-star#join-form",
          label: "Apply for a programme",
        }}
        secondary={{ href: "/podcast", label: "Explore our podcast" }}
      />
    </Shell>
  );
}
