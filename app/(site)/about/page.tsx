import type { Metadata } from "next";
import Image from "next/image";
import { CtaBand } from "@/components/site/cta-band";
import { Ic } from "@/components/site/icons";
import { Shell } from "@/components/site/shell";
import { CAPABILITIES, FOUNDERS } from "@/lib/content";

const title = "About";
const description =
  "BeautyUni is a capability-first education platform for beauty, wellness and medaesthetics, built on decades of experience in education, industry development and professional standards.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `${title} · BeautyUni`,
    description,
    url: "/about",
    type: "website",
  },
};

export default function Page() {
  return (
    <Shell>
      <section className="s-pagehead">
        <div className="s-pagehead__bg" aria-hidden="true" />
        <div className="s-wrap s-pagehead__grid">
          <div>
            <p className="s-eyebrow s-enter">About us</p>
            <h1
              className="s-serif s-h1 s-enter"
              style={{ "--d": "100ms" } as React.CSSProperties}
            >
              We are not another <em>training company.</em>
            </h1>
            <p
              className="s-lede s-enter"
              style={{ "--d": "180ms" } as React.CSSProperties}
            >
              BeautyUni is a place for the industry to learn, share ideas and
              grow, through education with real depth and purpose. It was
              created to help professionals go beyond learning techniques and
              build the capabilities that make careers and businesses last.
            </p>
          </div>
          <div
            className="s-pagehead__aside s-enter"
            style={{ "--d": "240ms" } as React.CSSProperties}
          >
            <div className="s-stat">
              <span className="s-stat__n">30+</span>
              <span className="s-stat__l">
                Years of beauty education across India and the United States
              </span>
            </div>
            <div className="s-stat">
              <span className="s-stat__n">04</span>
              <span className="s-stat__l">
                Capabilities taught as one subject, not four
              </span>
            </div>
            <div className="s-stat">
              <span className="s-stat__n">2</span>
              <span className="s-stat__l">
                Continents the founders build across: Mumbai and London
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── The belief ────────────────────────────────────────────── */}
      <section className="s-sec s-sec--sand">
        <div className="s-wrap s-belief">
          <div data-reveal="left">
            <p className="s-eyebrow">The belief</p>
            <h2 className="s-serif s-h2">Skill is essential. It is not enough.</h2>
          </div>
          <div className="s-belief__body" data-reveal>
            <p className="s-lede">
              Today&rsquo;s professionals need to consult effectively,
              communicate with confidence, create memorable client experiences,
              lead teams and build visibility in a crowded market.
            </p>
            <p className="s-body">
              BeautyUni combines technical education with business strategy,
              consultation and communication, guest experience, leadership
              development and digital visibility. Much of industry training is
              built around products, trends, individual techniques or one-off
              demonstrations. BeautyUni takes a broader approach: understanding
              the principles behind the craft, building genuine technical
              mastery, earning client trust, developing people, and thinking
              commercially.
            </p>
            <p className="s-body">
              We deliver it through live events, workshops, podcasts, digital
              learning, industry conversations and community-building,
              supporting professionals, salon and skin-clinic owners, educators,
              artists, brands, manufacturers, suppliers and emerging industry
              leaders.
            </p>
          </div>
        </div>
      </section>

      {/* ── The model ─────────────────────────────────────────────── */}
      <section className="s-sec" id="model">
        <div className="s-wrap">
          <div className="s-head" data-reveal>
            <div>
              <p className="s-eyebrow">The model</p>
              <h2 className="s-serif s-h2">
                The areas that actually move performance.
              </h2>
            </div>
            <p className="s-lede s-head__side">
              Four interconnected capabilities that define a successful modern
              beauty professional and business. Each one makes the others worth
              more.
            </p>
          </div>

          <div className="s-model">
            {CAPABILITIES.map((cap, i) => (
              <article
                className="s-model__item"
                key={cap.n}
                data-reveal
                style={{ "--d": `${i * 80}ms` } as React.CSSProperties}
              >
                <span className="s-model__n">{cap.n}</span>
                <div>
                  <h3 className="s-serif s-model__t">{cap.title}</h3>
                  <p className="s-model__p">{cap.kicker}</p>
                  <p className="s-model__p">{cap.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── The founders ──────────────────────────────────────────── */}
      <section className="s-sec s-sec--sand">
        <div className="s-wrap">
          <div className="s-head s-head--stack" data-reveal>
            <div>
              <p className="s-eyebrow">The founders</p>
              <h2 className="s-serif s-h2">The people behind BeautyUni.</h2>
              <p className="s-lede">
                BeautyUni is built on decades of experience in beauty education,
                industry development and professional standards.
              </p>
            </div>
          </div>

          <div className="s-founders s-founders--about">
            {FOUNDERS.map((f) => (
              <article className="s-founder" key={f.name} data-reveal>
                <div className="s-founder__img">
                  <Image
                    src={f.portrait}
                    alt={f.name}
                    width={820}
                    height={1025}
                    sizes="(max-width: 860px) 80vw, 32vw"
                  />
                </div>
                <div>
                  <p className="s-founder__role">{f.role}</p>
                  <h3 className="s-serif s-founder__name">{f.name}</h3>
                  <div className="s-founder__bio">
                    {f.long.map((para) => (
                      <p key={para}>{para}</p>
                    ))}
                  </div>
                  <ul className="s-founder__facts">
                    {f.facts.map((fact) => (
                      <li key={fact}>{fact}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          <div className="s-who__callout" style={{ marginTop: 48 }} data-reveal>
            <span className="s-who__callout-ic" aria-hidden="true">
              <Ic n="compass" size={20} />
            </span>
            <p>
              Roopa&rsquo;s two decades of education experience in the United
              States, combined with Vikas&rsquo;s work across international
              beauty platforms, give BeautyUni{" "}
              <b>a global outlook with a practical focus on real-world results.</b>
            </p>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Learn with us"
        title={
          <>
            Learn with us. Grow <em>with the industry.</em>
          </>
        }
        body="Education, live events and the From Passion to Profit podcast, for professionals across beauty, wellness and medaesthetics."
        secondary={{ href: "/programmes", label: "See programmes" }}
      />
    </Shell>
  );
}
