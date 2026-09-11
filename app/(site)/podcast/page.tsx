import type { Metadata } from "next";
import type { Viewport } from "next";
import Image from "next/image";
import { CtaBand } from "@/components/site/cta-band";
import { EpisodeItem } from "@/components/site/episode";
import { Ic } from "@/components/site/icons";
import { Shell } from "@/components/site/shell";
import { EPISODES } from "@/lib/content";

const title = "From Passion to Profit — the podcast";
const description =
  "Candid, long-form conversations with the artists, founders, educators and business leaders shaping beauty, wellness and medaesthetics. Not just the success — the decisions, systems, setbacks and habits behind it.";

export const metadata: Metadata = {
  title: { absolute: `${title} · BeautyUni` },
  description,
  alternates: { canonical: "/podcast" },
  openGraph: {
    title: { absolute: `${title} · BeautyUni` },
    description,
    url: "/podcast",
    type: "website",
  },
};

// This page opens on the ink surface rather than the cream one, so the browser
// chrome above it matches instead of cutting a pale line across the top.
export const viewport: Viewport = {
  themeColor: "#1E1713",
  colorScheme: "light",
};

export default function Page() {
  return (
    <Shell onDark>
      <section className="s-pagehead s-pagehead--dark s-on-dark s-pod">
        <div className="s-pagehead__bg" aria-hidden="true" />
        <div className="s-wrap s-pagehead__grid">
          <div>
            <p className="s-eyebrow s-enter">The BeautyUni podcast</p>
            <h1
              className="s-serif s-h1 s-enter"
              style={{ "--d": "100ms" } as React.CSSProperties}
            >
              From Passion <em>to Profit.</em>
            </h1>
            <p
              className="s-lede s-enter"
              style={{ "--d": "180ms" } as React.CSSProperties}
            >
              Candid, long-form conversations with the artists, founders,
              educators and business leaders shaping beauty, wellness and
              medaesthetics. Not just the success — the decisions, systems,
              setbacks and habits behind the long road to it.
            </p>
            <div
              className="s-pod__platforms s-enter"
              style={{ "--d": "260ms" } as React.CSSProperties}
            >
              <a
                className="s-pill"
                href="https://www.youtube.com/@FromPassionToProfitPodcast"
                target="_blank"
                rel="noreferrer noopener"
              >
                <Ic n="play" size={14} fill />
                Watch on YouTube
              </a>
              <span className="s-pill">
                <Ic n="mic" size={15} />
                Season 1 · {EPISODES.length} episodes
              </span>
            </div>
          </div>

          <div
            className="s-pagehead__aside s-enter"
            style={{ "--d": "220ms" } as React.CSSProperties}
            aria-hidden="true"
          >
            <Image
              className="s-pod__badge"
              src="/site/fptp-badge.png"
              alt=""
              width={420}
              height={420}
              priority
              style={{ width: "min(220px, 60%)", marginLeft: "auto" }}
            />
          </div>
        </div>
      </section>

      <section className="s-sec s-sec--dark s-on-dark">
        <div className="s-wrap">
          <div className="s-head s-head--stack" data-reveal>
            <div>
              <p className="s-eyebrow">Episodes</p>
              <h2 className="s-serif s-h2">Season one.</h2>
            </div>
          </div>

          <div className="s-eplist">
            {EPISODES.map((ep, i) => (
              <EpisodeItem
                key={ep.youtubeId}
                ep={ep}
                variant="row"
                priority={i === 0}
              />
            ))}
          </div>

          <p className="s-note" style={{ marginTop: 34 }}>
            Produced with PodPalette Podcast Productions LLP.
          </p>
        </div>
      </section>

      <CtaBand
        eyebrow="Never miss a conversation"
        title={
          <>
            Hear each one <em>as it lands.</em>
          </>
        }
        body="Join the BeautyUni community to hear about new episodes, live recordings and events first."
        secondary={{ href: "/about", label: "About BeautyUni" }}
      />
    </Shell>
  );
}
