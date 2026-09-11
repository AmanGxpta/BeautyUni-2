import Image from "next/image";
import Link from "next/link";
import { CONTACT } from "@/lib/content";

const EXPLORE = [
  { href: "/about", label: "About us" },
  { href: "/podcast", label: "Podcast" },
  { href: "/programmes", label: "Programmes" },
  { href: "/join", label: "Join" },
] as const;

const LEGAL = [
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms" },
] as const;

export function SiteFooter() {
  return (
    <footer className="s-footer">
      <div className="s-wrap s-footer__in">
        <div>
          <Link
            className="s-footer__logo"
            href="/"
            aria-label="BeautyUni — home"
          >
            <Image
              src="/site/logo-footer.png"
              alt="BeautyUni"
              width={1125}
              height={240}
            />
          </Link>
          <p className="s-footer__tag">
            Learn the craft. Then learn the <em>business</em> behind it.
          </p>
          <p className="s-footer__blurb">
            Capability-first education for beauty, wellness and medaesthetics.
          </p>
        </div>

        <nav className="s-footer__col" aria-label="Explore">
          <h2 className="s-footer__t">Explore</h2>
          {EXPLORE.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <nav className="s-footer__col" aria-label="Legal">
          <h2 className="s-footer__t">Legal</h2>
          {LEGAL.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="s-footer__col">
          <h2 className="s-footer__t">Contact</h2>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>
          <span>Mumbai · London</span>
        </div>
      </div>
    </footer>
  );
}
