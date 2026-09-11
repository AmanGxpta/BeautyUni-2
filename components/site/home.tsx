import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { CtaBand } from "./cta-band";
import { EpisodeItem } from "./episode";
import { Ic } from "./icons";
import {
  AUDIENCE,
  CAPABILITIES,
  EPISODES,
  FOUNDERS,
  PHILOSOPHY_CLOSE,
  PHILOSOPHY_LADDER,
  PROGRAMME,
} from "@/lib/content";

/** The band that runs under the hero — the marketing copy's own three words. */
const MARQUEE = [
  "Depth over demonstrations",
  "Technical mastery",
  "Consultation & communication",
  "Leadership & teams",
  "Visibility & commercial thinking",
  "Beauty · Wellness · Medaesthetics",
];

export function Home() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="s-hero">
        <div className="s-hero__bg" aria-hidden="true">
          <Image
            className="s-hero__image"
            src="/hero-texture.png"
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="s-wrap s-hero__grid">
          <div>
            <p className="s-eyebrow s-enter" style={{ "--d": "60ms" } as React.CSSProperties}>
              Beauty · Wellness · Medaesthetics
            </p>
            <h1
              className="s-serif s-h1 s-hero__h1 s-enter"
              style={{ "--d": "140ms" } as React.CSSProperties}
            >
              <span className="s-line">Learn the craft.</span>
              <span className="s-line">
                Then learn the <em>business</em>
              </span>
              <span className="s-line">behind it.</span>
            </h1>
            <p
              className="s-lede s-hero__lede s-enter"
              style={{ "--d": "220ms" } as React.CSSProperties}
            >
              BeautyUni is a capability-first education platform for the beauty,
              wellness and medaesthetics industry — built to help professionals
              go beyond technique and develop the capabilities that make careers
              and businesses last.
            </p>
            <div
              className="s-hero__cta s-enter"
              style={{ "--d": "300ms" } as React.CSSProperties}
            >
              <Link className="s-btn s-btn--lg" href="/programmes">
                Explore programmes
                <span className="s-btn__arr">
                  <Ic n="arrowR" size={17} />
                </span>
              </Link>
              <Link className="s-btn s-btn--lg s-btn--ghost" href="/podcast">
                Hear the podcast
                <span className="s-btn__arr">
                  <Ic n="arrowR" size={17} />
                </span>
              </Link>
            </div>
            <p
              className="s-hero__note s-enter"
              style={{ "--d": "380ms" } as React.CSSProperties}
            >
              Founded by <b>Roopa Ambekar</b> and <b>Vikas Vij</b>
            </p>
          </div>

          {/* The contents card sits over the product plinth in the supplied
              hero artwork, turning the image into a useful editorial index. */}
          <div className="s-index s-enter" style={{ "--d": "260ms" } as React.CSSProperties}>
            <div className="s-index__card">
              <div className="s-index__top">
                <span>What we teach</span>
                <span>Four capabilities</span>
              </div>
              <h2 className="s-index__title">
                Education that goes <em>beyond technique</em>
              </h2>
              <div className="s-index__list">
                {CAPABILITIES.map((cap) => (
                  <Link className="s-index__row" key={cap.n} href="/about">
                    <span>{cap.n}</span>
                    <span>{cap.title}</span>
                    <Ic n="arrowR" size={16} />
                  </Link>
                ))}
              </div>
              <p className="s-index__foot">
                Craft, clients, people and business — brought together in one
                place rather than taught as four unrelated subjects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee ───────────────────────────────────────────────── */}
      <div className="s-marquee" aria-hidden="true">
        {/* The list is rendered twice and the track is translated by half its
            own width, so the loop closes on itself with no visible seam. */}
        <div className="s-marquee__track">
          {[0, 1].map((copy) => (
            <div className="s-marquee__group" key={copy}>
              {MARQUEE.map((word) => (
                <span className="s-marquee__item" key={word}>
                  {word === "Depth over demonstrations" ? <i>{word}</i> : word}
                  <span className="s-marquee__dot" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Manifesto ─────────────────────────────────────────────── */}
      <section className="s-sec">
        <div className="s-wrap s-manifesto">
          <div className="s-manifesto__aside" data-reveal="left">
            <p className="s-eyebrow">The belief</p>
            <p>
              Knowing <i>how</i> to do something is only part of the journey.
            </p>
          </div>
          <div data-reveal>
            <h2 className="s-serif s-manifesto__quote">
              Much of industry training is built around products, trends and
              one-off demonstrations. BeautyUni takes a <em>broader approach</em>.
            </h2>
            <div className="s-manifesto__body">
              <p>
                Understanding the principles behind the craft. Building genuine
                technical mastery. Communicating with confidence. Earning client
                trust. Developing people, and thinking commercially.
              </p>
              <p>
                It is education designed not simply to show professionals{" "}
                <b>what to do</b>, but to help them understand{" "}
                <b>why it works</b> — and how to turn that capability into
                lasting professional success.
              </p>
              <p>
                That is the whole of it. Not a course catalogue, and not a feed
                of techniques: a way of learning that treats the craft, the
                client, the team and the business as one subject.
              </p>
            </div>
            <p className="s-manifesto__sig">Depth over demonstrations.</p>
          </div>
        </div>
      </section>

      {/* ── Capabilities ──────────────────────────────────────────── */}
      <section className="s-sec s-sec--sand">
        <div className="s-wrap">
          <div className="s-head" data-reveal>
            <div>
              <p className="s-eyebrow">What we teach</p>
              <h2 className="s-serif s-h2">
                Four capabilities that define a modern professional.
              </h2>
            </div>
            <p className="s-lede s-head__side">
              BeautyUni brings together the four interconnected capabilities
              behind a successful modern beauty professional and business. Each
              one makes the others worth more.
            </p>
          </div>

          <div className="s-caps">
            {/* Links, not cards: each one carries an arrow, and an arrow that
                goes nowhere is a promise the page does not keep. */}
            {CAPABILITIES.map((cap, i) => (
              <Link
                className={`s-cap${i === 0 ? " s-cap--lead" : ""}`}
                href="/about#model"
                key={cap.n}
                data-reveal
                style={{ "--d": `${i * 90}ms` } as React.CSSProperties}
              >
                <p className="s-cap__n">{cap.n}</p>
                <span className="s-cap__arr" aria-hidden="true">
                  <Ic n="arrowUpR" size={15} />
                </span>
                <h3 className="s-cap__t">{cap.title}</h3>
                <p className="s-cap__k">{cap.kicker}</p>
                <p className="s-cap__b">{cap.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who it's for ──────────────────────────────────────────── */}
      <section className="s-sec">
        <div className="s-wrap s-who">
          <div data-reveal="left">
            <p className="s-eyebrow">Who it&rsquo;s for</p>
            <h2 className="s-serif s-h2" style={{ marginTop: 18 }}>
              Built for the whole profession.
            </h2>
            <p className="s-lede" style={{ marginTop: 22 }}>
              From the individual artist to the multi-location operator.
              BeautyUni is designed for the breadth of the beauty and wellness
              profession.
            </p>
            <div className="s-who__callout">
              <span className="s-who__callout-ic" aria-hidden="true">
                <Ic n="users" size={20} />
              </span>
              <p>
                <b>Particularly relevant to independent salon and skin-clinic
                owners</b>{" "}
                who have to balance technical quality, people, retention,
                operations and growth simultaneously.
              </p>
            </div>
            <p className="s-who__foot">
              Different roles face different challenges. Meaningful growth still
              comes from the same four dimensions — craft, clients, people and
              business.
            </p>
          </div>

          <ul className="s-roles" data-reveal>
            {AUDIENCE.map((role, i) => (
              <li className="s-role" key={role}>
                <span className="s-role__n">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{role}</span>
                <span className="s-role__dot" aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Podcast ───────────────────────────────────────────────── */}
      <section className="s-sec s-sec--dark s-on-dark s-pod">
        <div className="s-wrap">
          <div className="s-pod__head" data-reveal>
            <Image
              className="s-pod__badge"
              src="/site/fptp-badge.png"
              alt=""
              width={420}
              height={420}
            />
            <div>
              <p className="s-eyebrow">The podcast</p>
              <h2 className="s-serif s-h2">From Passion to Profit</h2>
              <p className="s-lede">
                Candid, long-form conversations with the founders, educators and
                leaders shaping the beauty industry — not just the visible
                success, but the decisions, systems, setbacks and habits behind
                it.
              </p>
            </div>
            <Link className="s-btn s-btn--ghost-light" href="/podcast">
              All episodes
              <span className="s-btn__arr">
                <Ic n="arrowR" size={16} />
              </span>
            </Link>
          </div>

          <div className="s-eps">
            {EPISODES.map((ep) => (
              <EpisodeItem key={ep.youtubeId} ep={ep} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured programme ────────────────────────────────────── */}
      <section className="s-sec">
        <div className="s-wrap">
          <div className="s-head" data-reveal>
            <div>
              <p className="s-eyebrow">Programmes</p>
              <h2 className="s-serif s-h2">The approach, in a room.</h2>
            </div>
            <p className="s-lede s-head__side">
              BeautyUni&rsquo;s featured programme is a two-day U.S.-certified
              masterclass, presented with Professional Beauty India.
            </p>
          </div>

          <div className="s-prog" data-reveal="scale">
            <div className="s-prog__art">
              <span className="s-prog__tag">{PROGRAMME.tag}</span>
              <h3 className="s-prog__name">
                Rock Star
                <br />
                <em>Success System</em>
              </h3>
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
              <p className="s-body s-body--lg">
                {PROGRAMME.intro}
              </p>
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
              </dl>
              <div className="s-prog__cta">
                <Link className="s-btn" href="/programmes">
                  Programme details
                  <span className="s-btn__arr">
                    <Ic n="arrowR" size={16} />
                  </span>
                </Link>
                <Link className="s-btn s-btn--ghost" href="/join">
                  Register interest
                  <span className="s-btn__arr">
                    <Ic n="arrowR" size={16} />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Founders ──────────────────────────────────────────────── */}
      <section className="s-sec s-sec--sand">
        <div className="s-wrap">
          <div className="s-head" data-reveal>
            <div>
              <p className="s-eyebrow">The people behind it</p>
              <h2 className="s-serif s-h2">
                Decades of standards, at global scale.
              </h2>
            </div>
            <p className="s-lede s-head__side">
              BeautyUni is built on decades of experience in beauty education,
              industry development and professional standards.
            </p>
          </div>

          <div className="s-founders">
            {FOUNDERS.map((f, i) => (
              <article
                className="s-founder"
                key={f.name}
                data-reveal
                style={{ "--d": `${i * 110}ms` } as React.CSSProperties}
              >
                <div className="s-founder__img">
                  <Image
                    src={f.portrait}
                    alt={f.name}
                    width={820}
                    height={1025}
                    sizes="(max-width: 860px) 70vw, 24vw"
                  />
                </div>
                <div>
                  <p className="s-founder__role">{f.role}</p>
                  <h3 className="s-serif s-founder__name">{f.name}</h3>
                  <p className="s-founder__bio">{f.short}</p>
                  <ul className="s-founder__facts">
                    {f.facts.map((fact) => (
                      <li key={fact}>{fact}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          <p style={{ marginTop: 40 }} data-reveal>
            <Link className="s-link s-link--terra" href="/about">
              More about BeautyUni
              <Ic n="arrowR" size={16} />
            </Link>
          </p>
        </div>
      </section>

      {/* ── Philosophy ────────────────────────────────────────────── */}
      <section className="s-sec s-sec--dark s-on-dark">
        <div className="s-wrap">
          <div className="s-ladder">
            <div className="s-ladder__intro" data-reveal="left">
              <p className="s-eyebrow">The philosophy</p>
              <h2 className="s-serif s-h2">
                Lasting success needs more than the latest technique.
              </h2>
              <p className="s-lede">
                The industry is constantly evolving — new products, trends,
                techniques and opportunities appear all the time. What holds
                steady is what sits underneath them.
              </p>
            </div>

            <ol className="s-ladder__list" data-reveal>
              {PHILOSOPHY_LADDER.map((line, i) => (
                <li className="s-rung" key={line}>
                  <span className="s-rung__n">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="s-serif">{line}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="s-close">
            {PHILOSOPHY_CLOSE.map((line, i) => (
              <span
                className="s-close__line"
                data-reveal="fade"
                key={line}
                style={{ "--d": `${i * 140}ms` } as React.CSSProperties}
              >
                {line}
              </span>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title={
          <>
            Come learn and grow <em>with BeautyUni.</em>
          </>
        }
        body="Education, live events and the From Passion to Profit podcast — for professionals across beauty, wellness and medaesthetics. Tell us who you are and the team will be in touch."
        secondary={{ href: "/programmes", label: "See programmes" }}
      />
    </>
  );
}
