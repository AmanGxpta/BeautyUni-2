import type { Metadata } from "next";
import { Ic } from "@/components/site/icons";
import { JoinForm } from "@/components/site/join-form";
import { Shell } from "@/components/site/shell";
import { CONTACT } from "@/lib/content";

const title = "Join the community";
const description =
  "Education, live events and the From Passion to Profit podcast — for professionals across beauty, wellness and medaesthetics. Tell us who you are and the team will be in touch.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/join" },
  openGraph: {
    title: `${title} · BeautyUni`,
    description,
    url: "/join",
    type: "website",
  },
};

const PERKS = [
  {
    ic: "cal",
    t: "Programme dates first",
    p: "New workshops and masterclasses go to the community before anywhere else, and places are limited.",
  },
  {
    ic: "mic",
    t: "The podcast, as it lands",
    p: "New episodes of From Passion to Profit, plus live recordings and industry conversations.",
  },
  {
    ic: "layers",
    t: "Education with depth",
    p: "Technical standards, consultation, leadership and commercial thinking — taught as one subject.",
  },
  {
    ic: "shield",
    t: "Nothing you didn’t ask for",
    p: "We use your details only to reach you about BeautyUni. Withdraw any time by emailing the team.",
  },
] as const;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // A campaign link or QR code can carry `?p=…`; it lands on the row so a join
  // from the programme page can be told apart from one off the nav. Arrays are
  // what a repeated query key produces, and there is nothing sensible to store
  // for one.
  const raw = (await searchParams).p;
  const source = typeof raw === "string" && raw ? `join:${raw.slice(0, 40)}` : "join";

  return (
    <Shell>
      <section className="s-pagehead">
        <div className="s-pagehead__bg" aria-hidden="true" />
        <div className="s-wrap">
          <p className="s-eyebrow s-enter">Join the community</p>
          <h1
            className="s-serif s-h1 s-enter"
            style={{ "--d": "100ms", maxWidth: "16ch" } as React.CSSProperties}
          >
            Come learn and grow <em>with BeautyUni.</em>
          </h1>
        </div>
      </section>

      <section className="s-sec s-sec--tight" style={{ paddingTop: 0 }}>
        <div className="s-wrap s-join">
          <div className="s-join__aside" data-reveal="left">
            <p className="s-lede" style={{ marginTop: 0 }}>
              Education, live events and the{" "}
              <em style={{ fontStyle: "italic" }}>From Passion to Profit</em>{" "}
              podcast — for professionals across beauty, wellness and
              medaesthetics. Fill this in and the team will be in touch.
            </p>

            <ul className="s-perks">
              {PERKS.map((perk) => (
                <li className="s-perk" key={perk.t}>
                  <span className="s-perk__ic" aria-hidden="true">
                    <Ic n={perk.ic} size={19} />
                  </span>
                  <span>
                    <span className="s-perk__t">{perk.t}</span>
                    <span className="s-perk__p">{perk.p}</span>
                  </span>
                </li>
              ))}
            </ul>

            <p className="s-note">
              Prefer to talk? Email{" "}
              <a className="s-link s-link--terra" href={`mailto:${CONTACT.email}`}>
                {CONTACT.email}
              </a>
            </p>
          </div>

          <JoinForm source={source} />
        </div>
      </section>
    </Shell>
  );
}
