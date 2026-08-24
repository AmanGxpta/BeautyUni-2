import type { CSSProperties, ReactNode } from "react";
import { Icon, type IconName } from "./icon";

/* ── Mobile tab bar ────────────────────────────────────────────────── */

const TABS: [IconName, string][] = [
  ["home", "Home"],
  ["compass", "Explore"],
  ["play", "Learn"],
  ["message", "Inbox"],
  ["user", "Profile"],
];

export function TabBar({ active = "home", dark }: { active?: string; dark?: boolean }) {
  const base = dark ? "rgba(255,255,255,.55)" : "var(--ink-3)";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        position: "relative",
        zIndex: 20,
        padding: "10px 8px 26px",
        background: dark ? "rgba(10,10,10,.72)" : "rgba(17,17,17,.86)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: `1px solid ${dark ? "rgba(255,255,255,.08)" : "var(--line)"}`,
      }}
    >
      {TABS.map(([n, l]) => {
        const on = n === active;
        return (
          <div key={n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1 }}>
            <Icon name={n} size={23} c={on ? "var(--clay)" : base} sw={on ? 2.2 : 1.8} />
            <span style={{ fontSize: 10, fontWeight: on ? 700 : 600, color: on ? "var(--clay)" : base }}>{l}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Mobile status bar (drawn by us, for standalone screens) ───────── */

export function MobileStatus({ dark, time = "9:41" }: { dark?: boolean; time?: string }) {
  const c = dark ? "#fff" : "var(--ink)";
  return (
    <div
      style={{
        height: 54,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 26px 0 30px",
        position: "relative",
        zIndex: 30,
        pointerEvents: "none",
      }}
    >
      <span style={{ fontWeight: 700, fontSize: 15.5, letterSpacing: ".02em", color: c }}>{time}</span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
        <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true">
          <rect x="0" y="7" width="3" height="5" rx=".7" fill={c} />
          <rect x="5" y="4.5" width="3" height="7.5" rx=".7" fill={c} />
          <rect x="10" y="2" width="3" height="10" rx=".7" fill={c} />
          <rect x="15" y="0" width="3" height="12" rx=".7" fill={c} opacity=".35" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 17 12" fill={c} aria-hidden="true">
          <path d="M8.5 3C10.8 3 12.9 3.9 14.4 5.4L15.5 4.3C13.7 2.5 11.2 1.3 8.5 1.3S3.3 2.5 1.5 4.3L2.6 5.4C4.1 3.9 6.2 3 8.5 3Z" />
          <circle cx="8.5" cy="10" r="1.4" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" aria-hidden="true">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke={c} strokeOpacity=".35" fill="none" />
          <rect x="2" y="2" width="16" height="8" rx="1.6" fill={c} />
          <rect x="23" y="4" width="1.6" height="4" rx=".8" fill={c} fillOpacity=".4" />
        </svg>
      </span>
    </div>
  );
}

/* ── Screen scaffold — a 390x844 phone screen for the canvas ───────── */

/**
 * `chrome` draws our own status bar; pass `chrome={false}` when nesting inside
 * a real device frame (which supplies its own). The top inset is always
 * reserved so layout matches in both modes.
 */
export function Screen({
  children,
  bg = "var(--paper)",
  dark,
  chrome = true,
  tab,
  tabActive = "home",
  w = 390,
  h = 844,
  pad = true,
  header,
  footer,
  style,
}: {
  children?: ReactNode;
  bg?: string;
  dark?: boolean;
  chrome?: boolean;
  tab?: boolean;
  tabActive?: string;
  w?: number;
  h?: number;
  pad?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      className="rs"
      style={{
        width: w,
        height: h,
        background: bg,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        ...style,
      }}
    >
      {chrome ? <MobileStatus dark={dark} /> : <div style={{ height: 54, flexShrink: 0 }} />}
      {header}
      <div
        className="rs-noscroll"
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: pad ? "0 20px" : 0,
          minHeight: 0,
        }}
      >
        {children}
      </div>
      {footer}
      {tab && <TabBar active={tabActive} dark={dark} />}
    </div>
  );
}
