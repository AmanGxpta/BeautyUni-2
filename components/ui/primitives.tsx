import type { CSSProperties, ReactNode } from "react";
import { Icon, type IconName } from "./icon";

/* ── Button ────────────────────────────────────────────────────────── */

type BtnKind = "primary" | "deep" | "soft" | "ghost" | "gold" | "white";

const BTN_SIZES = {
  sm: { h: 36, px: 18, fs: 10, ic: 15 },
  md: { h: 48, px: 24, fs: 11, ic: 17 },
  lg: { h: 56, px: 28, fs: 11, ic: 18 },
} as const;

const BTN_KINDS: Record<BtnKind, CSSProperties> = {
  primary: { background: "var(--clay)", color: "#F0EDE8", boxShadow: "none" },
  deep: { background: "var(--surface)", color: "var(--ink)", boxShadow: "inset 0 0 0 1px var(--line-2)" },
  soft: { background: "var(--clay-tint)", color: "var(--clay-deep)" },
  ghost: { background: "transparent", color: "var(--ink)", boxShadow: "inset 0 0 0 1px var(--line-2)" },
  gold: { background: "var(--gold)", color: "#1A140A", boxShadow: "none" },
  white: { background: "#F0EDE8", color: "#1C1C1C", boxShadow: "none" },
};

export function Btn({
  children,
  kind = "primary",
  size = "md",
  icon,
  iconR,
  full,
  style,
}: {
  children?: ReactNode;
  kind?: BtnKind;
  size?: keyof typeof BTN_SIZES;
  icon?: IconName;
  iconR?: IconName;
  full?: boolean;
  style?: CSSProperties;
}) {
  const sz = BTN_SIZES[size];
  return (
    <button
      type="button"
      style={{
        height: sz.h,
        padding: `0 ${sz.px}px`,
        borderRadius: 999,
        border: "none",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 9,
        fontFamily: "var(--word)",
        fontWeight: 200,
        fontSize: sz.fs,
        letterSpacing: ".16em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        width: full ? "100%" : undefined,
        ...BTN_KINDS[kind],
        ...style,
      }}
    >
      {icon && <Icon name={icon} size={sz.ic} />}
      {children}
      {iconR && <Icon name={iconR} size={sz.ic} />}
    </button>
  );
}

/* ── Pill / Tag ────────────────────────────────────────────────────── */

export function Pill({
  children,
  active,
  icon,
  style,
}: {
  children?: ReactNode;
  active?: boolean;
  icon?: IconName;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 34,
        padding: "0 14px",
        borderRadius: 999,
        fontFamily: "var(--word)",
        fontSize: 10,
        fontWeight: 300,
        letterSpacing: ".14em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        background: active ? "var(--clay)" : "var(--surface)",
        color: active ? "#fff" : "var(--ink-2)",
        boxShadow: active ? "none" : "inset 0 0 0 1.5px var(--line)",
        ...style,
      }}
    >
      {icon && <Icon name={icon} size={15} />}
      {children}
    </span>
  );
}

export type Tone = "clay" | "gold" | "leaf" | "rose" | "berry" | "ink";

const TAG_TONES: Record<Tone, [string, string]> = {
  clay: ["var(--clay-tint)", "var(--clay-deep)"],
  gold: ["var(--gold-tint)", "#E0B878"],
  leaf: ["var(--leaf-tint)", "#7EC99A"],
  rose: ["var(--rose-tint)", "#E39A9A"],
  berry: ["var(--berry-tint)", "#C79ABA"],
  ink: ["var(--paper-2)", "var(--ink-2)"],
};

export function Tag({
  children,
  tone = "clay",
  style,
}: {
  children?: ReactNode;
  tone?: Tone;
  style?: CSSProperties;
}) {
  const t = TAG_TONES[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "4px 10px",
        borderRadius: 999,
        fontFamily: "var(--word)",
        fontWeight: 300,
        letterSpacing: ".14em",
        textTransform: "uppercase",
        background: t[0],
        color: t[1],
        ...style,
        fontSize: "10px",
      }}
    >
      {children}
    </span>
  );
}

/* ── Avatar (initials on warm gradient) ────────────────────────────── */

const AVATAR_SEEDS = [
  "linear-gradient(135deg,#A82020,#6B1414)",
  "linear-gradient(135deg,#8C1A1A,#2A0D0D)",
  "linear-gradient(135deg,#C96A6A,#8C1A1A)",
  "linear-gradient(135deg,#6B1414,#333333)",
];

export function Avatar({
  name = "Rae Mills",
  size = 40,
  ring,
  style,
}: {
  name?: string;
  size?: number;
  ring?: boolean;
  style?: CSSProperties;
}) {
  const init = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  const g = AVATAR_SEEDS[(name.charCodeAt(0) || 0) % AVATAR_SEEDS.length];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: g,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 700,
        fontSize: size * 0.38,
        boxShadow: ring ? "0 0 0 3px var(--paper), 0 0 0 5px var(--clay)" : "none",
        ...style,
      }}
    >
      {init}
    </div>
  );
}

/* ── Placeholder media ─────────────────────────────────────────────── */

export function Ph({
  label,
  icon = "image",
  dark,
  h,
  style,
  kids,
  radius = 0,
  src,
  pos = "center",
}: {
  label?: string;
  icon?: IconName;
  dark?: boolean;
  h?: number;
  style?: CSSProperties;
  kids?: ReactNode;
  radius?: number;
  src?: string;
  pos?: string;
}) {
  if (src) {
    return (
      <div
        className={"rs-ph" + (dark ? " rs-ph-dark" : "")}
        style={{ height: h, borderRadius: radius, overflow: "hidden", ...style }}
      >
        {/* Fixed-size decorative art inside a transform-scaled device mock —
            a plain <img> keeps the intrinsic layout the mockup was drawn to. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={label || ""}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: pos,
          }}
        />
        {kids}
      </div>
    );
  }

  return (
    <div
      className={"rs-ph" + (dark ? " rs-ph-dark" : "")}
      style={{ height: h, borderRadius: radius, ...style }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          color: dark ? "rgba(255,255,255,.85)" : "var(--clay-deep)",
        }}
      >
        <Icon name={icon} size={26} c={dark ? "rgba(255,255,255,.8)" : "var(--clay)"} sw={1.6} />
        {label && (
          <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".03em", opacity: 0.85 }}>
            {label}
          </span>
        )}
      </div>
      {kids}
    </div>
  );
}

/* ── Progress ──────────────────────────────────────────────────────── */

export function ProgressBar({
  value = 50,
  h = 8,
  c = "var(--clay)",
  track = "var(--paper-2)",
  style,
}: {
  value?: number;
  h?: number;
  c?: string;
  track?: string;
  style?: CSSProperties;
}) {
  return (
    <div style={{ height: h, borderRadius: 999, background: track, overflow: "hidden", width: "100%", ...style }}>
      <div style={{ width: `${value}%`, height: "100%", borderRadius: 999, background: c }} />
    </div>
  );
}

export function ProgressRing({
  value = 60,
  size = 54,
  sw = 6,
  c = "var(--clay)",
  track = "var(--paper-2)",
  children,
}: {
  value?: number;
  size?: number;
  sw?: number;
  c?: string;
  track?: string;
  children?: ReactNode;
}) {
  const r = (size - sw) / 2;
  const C = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={sw} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={c}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - value / 100)}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: size * 0.26,
          fontFamily: "var(--display)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function Stars({ val = 4.8, size = 13 }: { val?: number; size?: number }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
      <Icon name="star-f" size={size} c="var(--gold)" />
      <span style={{ fontWeight: 700, fontSize: size }}>{val}</span>
    </span>
  );
}

/* ── Misc ──────────────────────────────────────────────────────────── */

export function StatChip({
  icon,
  label,
  value,
  tone = "clay",
}: {
  icon: IconName;
  label: string;
  value: ReactNode;
  tone?: "clay" | "gold" | "leaf" | "berry";
}) {
  const c = { clay: "var(--clay)", gold: "var(--gold)", leaf: "var(--leaf)", berry: "var(--berry)" }[tone];
  return (
    <div
      style={{
        flex: 1,
        background: "var(--surface)",
        borderRadius: "var(--r-md)",
        padding: "13px 14px",
        boxShadow: "var(--sh-1)",
      }}
    >
      <Icon name={icon} size={18} c={c} />
      <div
        style={{
          fontFamily: "var(--display)",
          fontWeight: 800,
          fontSize: 22,
          marginTop: 7,
          letterSpacing: "-.02em",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 11.5, color: "var(--ink-2)", fontWeight: 600 }}>{label}</div>
    </div>
  );
}

export function SectionLabel({ children, action }: { children?: ReactNode; action?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", margin: "0 0 12px" }}>
      <h3
        style={{
          margin: 0,
          fontFamily: "var(--display)",
          fontWeight: 700,
          fontSize: 18,
          letterSpacing: "-.02em",
        }}
      >
        {children}
      </h3>
      {action && (
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--clay)", whiteSpace: "nowrap" }}>{action}</span>
      )}
    </div>
  );
}

export function Field({
  label,
  value,
  placeholder,
  icon,
  focus,
  style,
}: {
  label?: string;
  value?: string;
  placeholder?: string;
  icon?: IconName;
  focus?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div style={style}>
      {label && (
        <div
          style={{
            fontFamily: "var(--word)",
            fontWeight: 200,
            fontSize: 10,
            letterSpacing: ".16em",
            textTransform: "uppercase",
            color: "var(--ink-3)",
            marginBottom: 7,
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          height: 52,
          borderRadius: 14,
          background: "var(--surface)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 16px",
          boxShadow: focus ? "0 0 0 2px var(--clay)" : "inset 0 0 0 1.5px var(--line-2)",
        }}
      >
        {icon && <Icon name={icon} size={18} c="var(--ink-3)" />}
        <span
          style={{
            fontSize: 15,
            color: value ? "var(--ink)" : "var(--ink-3)",
            fontWeight: value ? 600 : 500,
          }}
        >
          {value || placeholder}
        </span>
        {focus && (
          <div style={{ width: 2, height: 20, background: "var(--clay)", marginLeft: "auto", borderRadius: 2 }} />
        )}
      </div>
    </div>
  );
}
