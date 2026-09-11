"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Ic } from "./icons";
import { NAV_LINKS } from "@/lib/content";

/**
 * The site header.
 *
 * Client-side for three reasons that all need the browser: the bar changes
 * appearance once the page has scrolled, it hides on the way down and returns
 * on the way up, and the mobile menu is a toggle. `usePathname` marks the
 * current section.
 *
 * @param onDark the page under the bar opens on an ink surface (the podcast
 *   page), so the bar starts in its light-on-dark colours and switches to the
 *   cream treatment once it becomes solid.
 */
export function SiteNav({ onDark = false }: { onDark?: boolean }) {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        setSolid(y > 12);
        // Only hide well past the fold, and never while the menu is open —
        // sliding the bar away would take the open menu's close button with it.
        setHidden(y > 360 && y > last + 4);
        last = y;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // The menu covers the page, so the page behind it must not scroll.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const classes = [
    "s-nav",
    onDark && "s-nav--on-dark",
    solid && "is-solid",
    hidden && !open && "is-hidden",
    open && "is-open",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <header className={classes}>
        <div className="s-wrap s-nav__in">
          <button
            className="s-nav__burger"
            type="button"
            aria-expanded={open}
            aria-controls="s-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>

          <Link className="s-nav__logo" href="/" aria-label="BeautyUni — home">
            {/* Two files rather than one tinted mark: the wordmark's dot is a
                fixed brand colour in both, and the lettering has to flip
                between ink and cream as the bar changes surface. */}
            <Image
              className="s-logo--ink"
              src="/site/logo-header.png"
              alt="BeautyUni"
              width={320}
              height={60}
              priority
            />
            <Image
              className="s-logo--cream"
              src="/site/logo-footer.png"
              alt=""
              width={320}
              height={60}
              priority
              aria-hidden="true"
            />
          </Link>

          <nav className="s-nav__links" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={isActive(link.href) ? "is-active" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link className="s-btn s-nav__cta" href="/join">
            Join the community
            <span className="s-btn__arr">
              <Ic n="arrowR" size={16} />
            </span>
          </Link>
        </div>
      </header>

      {/* The menu closes from the click that navigates rather than from a
          pathname effect: a tap on the link for the page you are already on
          produces no route change, and an effect keyed on the path would leave
          the panel covering the page. */}
      <div
        className={`s-nav__menu${open ? " is-open" : ""}`}
        id="s-menu"
        // `inert` rather than `hidden`: the panel animates out, so it must stay
        // in the layout while it fades, but nothing inside it may be focusable
        // or reachable by a screen reader once it is closed.
        inert={!open}
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={isActive(link.href) ? "is-active" : undefined}
            onClick={() => setOpen(false)}
          >
            {link.label}
            <Ic n="arrowUpR" size={22} />
          </Link>
        ))}
        <Link
          className="s-btn s-btn--lg"
          href="/join"
          onClick={() => setOpen(false)}
        >
          Join the community
          <span className="s-btn__arr">
            <Ic n="arrowR" size={16} />
          </span>
        </Link>
      </div>
    </>
  );
}
