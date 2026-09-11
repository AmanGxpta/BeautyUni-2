import type { ReactNode } from "react";
import { Reveal } from "./reveal";
import { SiteFooter } from "./site-footer";
import { SiteNav } from "./site-nav";

/**
 * The frame every BeautyUni page sits in: skip link, header, main, footer,
 * and the one scroll observer that drives the entrance animations.
 *
 * A component rather than a route-group `layout.tsx` because `onDark` varies
 * per page — a layout would have to read the pathname on the client to know
 * which header treatment a page wants, and that is the page's own fact.
 */
export function Shell({
  children,
  onDark = false,
}: {
  children: ReactNode;
  onDark?: boolean;
}) {
  return (
    <div className="s-root">
      <a className="s-skip" href="#main">
        Skip to content
      </a>
      <SiteNav onDark={onDark} />
      <main id="main">{children}</main>
      <SiteFooter />
      <Reveal />
    </div>
  );
}
