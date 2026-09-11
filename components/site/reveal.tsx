"use client";

import { useEffect } from "react";

/**
 * Turns on the `[data-reveal]` entrance animations declared in `app/site.css`.
 *
 * One IntersectionObserver for the whole page rather than a wrapper component
 * per element: the elements that animate are ordinary markup in Server
 * Components, and wrapping each one would push the entire page into the client
 * bundle to buy a CSS class. Elements are unobserved once revealed, so nothing
 * re-animates on the way back up.
 *
 * The CSS already renders every element in its final state when
 * `prefers-reduced-motion: reduce` is set, so the observer simply doesn't run
 * there.
 */
export function Reveal() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    if (reduce) {
      for (const node of nodes) node.classList.add("is-in");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      // A little before the element is fully on screen, so the motion finishes
      // as the reader arrives at it rather than starting then.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    for (const node of nodes) io.observe(node);
    return () => io.disconnect();
  }, []);

  return null;
}
