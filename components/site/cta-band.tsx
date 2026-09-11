import Link from "next/link";
import { Ic } from "./icons";

/**
 * The closing invitation, used at the foot of every page.
 *
 * @param tone `terra` is the default warm band; `dark` is for pages whose last
 *   section is already terracotta, so the two don't stack into one long block
 *   of the same colour.
 */
export function CtaBand({
  eyebrow = "Join the community",
  title,
  body,
  primary = { href: "/join", label: "Join the community" },
  secondary,
  tone = "terra",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  body: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
  tone?: "terra" | "dark";
}) {
  return (
    <section className="s-sec s-sec--tight">
      <div className="s-wrap">
        <div
          className={`s-cta${tone === "dark" ? " s-cta--dark" : ""}`}
          data-reveal="scale"
        >
          <div>
            <p className="s-eyebrow">{eyebrow}</p>
            <h2 className="s-cta__h">{title}</h2>
            <p className="s-cta__p">{body}</p>
          </div>
          <div className="s-cta__actions">
            <Link
              className={`s-btn s-btn--lg ${tone === "dark" ? "" : "s-btn--cream"}`}
              href={primary.href}
            >
              {primary.label}
              <span className="s-btn__arr">
                <Ic n="arrowR" size={17} />
              </span>
            </Link>
            {secondary && (
              <Link className="s-btn s-btn--lg s-btn--ghost-light" href={secondary.href}>
                {secondary.label}
                <span className="s-btn__arr">
                  <Ic n="arrowR" size={17} />
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
