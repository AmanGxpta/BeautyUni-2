/**
 * The site's icon set — inline SVG paths, one component.
 *
 * Separate from `components/ui/icon.tsx`, which draws the Rockstar landing
 * page's set at its own stroke weight and sizing. These are hairline (1.5) to
 * sit next to the serif display face without competing with it.
 */

const PATHS = {
  arrowR: "M5 12h14M13 6l6 6-6 6",
  arrowUpR: "M7 17 17 7M8 7h9v9",
  chevD: "M6 9l6 6 6-6",
  play: "M8 5.5v13l11-6.5-11-6.5Z",
  check: "M4.5 12.5l5 5L19.5 7",
  spark: "M12 3l1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z",
  users: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM2.5 20a6.5 6.5 0 0 1 13 0M16 11.5a3 3 0 0 0 0-6M17.5 20h4a6 6 0 0 0-3.5-5.5",
  mic: "M12 15a3.5 3.5 0 0 0 3.5-3.5v-5a3.5 3.5 0 1 0-7 0v5A3.5 3.5 0 0 0 12 15ZM5.5 11.5a6.5 6.5 0 0 0 13 0M12 18.5V22",
  cal: "M4 8h16M7 3v3M17 3v3M5 6h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z",
  pin: "M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11ZM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  mail: "M3.5 6.5h17v11h-17v-11ZM3.5 7l8.5 6 8.5-6",
  phone: "M7 3.5 9 8l-2 1.5a11 11 0 0 0 5.5 5.5L14 13l4.5 2v4a1.5 1.5 0 0 1-1.7 1.5C9.3 19.6 4.4 14.7 3.5 6.2A1.5 1.5 0 0 1 5 4.5h2Z",
  layers: "M12 3 3 8l9 5 9-5-9-5ZM3 13l9 5 9-5M3 17.5 12 22l9-4.5",
  compass: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM15.5 8.5l-2 5-5 2 2-5 5-2Z",
  trend: "M3 17l5.5-5.5 3.5 3.5L21 6M15 6h6v6",
  shield: "M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6l8-3ZM9 12l2 2 4-4",
  quote: "M9.5 6C6.5 7.5 5 10 5 13v5h6v-6H8c0-2 .5-3.5 2.5-4.5L9.5 6ZM19 6c-3 1.5-4.5 4-4.5 7v5h6v-6h-3c0-2 .5-3.5 2.5-4.5L19 6Z",
  book: "M4 4.5h6a3 3 0 0 1 3 3V20a2.5 2.5 0 0 0-2.5-2.5H4v-13ZM20 4.5h-6a3 3 0 0 0-3 3V20a2.5 2.5 0 0 1 2.5-2.5H20v-13Z",
  x: "M6 6l12 12M18 6 6 18",
} as const;

export type IconName = keyof typeof PATHS;

export function Ic({
  n,
  size = 18,
  stroke = 1.5,
  fill,
  className,
}: {
  n: IconName;
  size?: number;
  stroke?: number;
  /** For the solid glyphs — `play` is the only one drawn filled. */
  fill?: boolean;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill ? "currentColor" : "none"}
      stroke={fill ? "none" : "currentColor"}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[n]} />
    </svg>
  );
}

/**
 * The rotating seal on the hero card — a ring of type around a centre mark,
 * drawn rather than set as an image so it inherits `currentColor` and stays
 * crisp at any size.
 */
export function Seal({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <path
          id="s-seal-path"
          d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1 -88 0"
        />
      </defs>
      <circle cx="60" cy="60" r="59" stroke="currentColor" strokeWidth="1" opacity=".35" />
      <circle cx="60" cy="60" r="46" stroke="currentColor" strokeWidth="1" opacity=".2" />
      <text
        fill="currentColor"
        fontSize="9.4"
        letterSpacing="3.1"
        fontWeight="600"
        fontFamily="var(--s-sans)"
      >
        <textPath href="#s-seal-path" startOffset="0">
          DEPTH OVER DEMONSTRATIONS · DEPTH OVER DEMONSTRATIONS ·
        </textPath>
      </text>
      <path
        d="M60 44l3.4 10.6L74 58l-10.6 3.4L60 72l-3.4-10.6L46 58l10.6-3.4L60 44Z"
        fill="currentColor"
      />
    </svg>
  );
}
