import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/icon";
import { Avatar, Ph, Tag } from "@/components/ui/primitives";
import { Btn } from "@/components/ui/primitives";
import { Screen } from "@/components/ui/screen";
import { LESSON_THUMB } from "./lesson-media";

/**
 * 1.3 Home feed — signature vertical player (immersive, dark).
 * Shared shell behind both the plain feed and the inline quiz overlay.
 */
function FeedShell({ children }: { children?: ReactNode }) {
  return (
    <Screen dark pad={false} bg="#141414" tab tabActive="home">
      <div style={{ position: "absolute", inset: 0 }}>
        <Ph dark icon="video" src={LESSON_THUMB} pos="46% center" style={{ position: "absolute", inset: 0 }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,.45) 0%, transparent 22%, transparent 52%, rgba(0,0,0,.82) 100%)",
          }}
        />
      </div>
      {/* module progress segments (story-style) */}
      <div style={{ position: "absolute", top: 58, left: 16, right: 16, display: "flex", gap: 5, zIndex: 5 }}>
        {[100, 100, 62, 0, 0].map((v, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 99,
              background: "rgba(255,255,255,.28)",
              overflow: "hidden",
            }}
          >
            <div style={{ width: `${v}%`, height: "100%", background: "#fff" }} />
          </div>
        ))}
      </div>
      {children}
    </Screen>
  );
}

const RAIL: [IconName, string][] = [
  ["heart-f", "2.4k"],
  ["comment", "188"],
  ["bookmark", "Save"],
  ["share", "Share"],
];

export function ScreenFeed() {
  return (
    <FeedShell>
      {/* top chip */}
      <div
        style={{
          position: "absolute",
          top: 74,
          left: 16,
          zIndex: 6,
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(0,0,0,.35)",
          backdropFilter: "blur(10px)",
          padding: "7px 12px 7px 8px",
          borderRadius: 999,
        }}
      >
        <Icon name="layers" size={15} c="#fff" />
        <span style={{ color: "#fff", fontSize: 12.5, fontWeight: 700 }}>Module 3 · Sectioning</span>
      </div>

      {/* right rail */}
      <div
        style={{
          position: "absolute",
          right: 14,
          bottom: 150,
          zIndex: 6,
          display: "flex",
          flexDirection: "column",
          gap: 22,
          alignItems: "center",
        }}
      >
        {RAIL.map(([ic, l]) => (
          <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <Icon name={ic} size={29} c={ic === "heart-f" ? "var(--rose)" : "#fff"} />
            <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{l}</span>
          </div>
        ))}
      </div>

      {/* bottom meta + inline learn prompt */}
      <div style={{ position: "absolute", left: 16, right: 74, bottom: 132, zIndex: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 11 }}>
          <Avatar name="Rae Mills" size={36} ring />
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Rae Mills</div>
            <div style={{ color: "rgba(255,255,255,.7)", fontSize: 11.5 }}>Master Colorist</div>
          </div>
          <span
            style={{
              marginLeft: 6,
              padding: "5px 11px",
              borderRadius: 999,
              border: "1.5px solid rgba(255,255,255,.5)",
              color: "#fff",
              fontSize: 11.5,
              fontWeight: 700,
            }}
          >
            Follow
          </span>
        </div>
        <p style={{ color: "#fff", fontSize: 14, lineHeight: 1.45, margin: "0 0 14px", fontWeight: 500 }}>
          The 3-zone sectioning that keeps your balayage seamless. Watch the angle of the brush 👀
        </p>
        {/* inline learn prompt — the novel part */}
        <div
          style={{
            background: "rgba(255,255,255,.14)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,.2)",
            borderRadius: 16,
            padding: "12px 14px",
            display: "flex",
            alignItems: "center",
            gap: 11,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "var(--clay)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon name="zap" size={18} c="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>Quick check unlocked</div>
            <div style={{ color: "rgba(255,255,255,.72)", fontSize: 11.5 }}>Tap to lock in what you just learned</div>
          </div>
          <Icon name="chevR" size={20} c="#fff" />
        </div>
      </div>
    </FeedShell>
  );
}

const QUIZ_OPTS: [string, string, boolean][] = [
  ["A", "Roots first, mid-lengths last", false],
  ["B", "Diagonal sections, ends up", true],
  ["C", "Random freehand sweeps", false],
];

/** 1.3 / 1.6 — inline quiz overlay on the feed, the signature interaction. */
export function ScreenFeedQuiz() {
  return (
    <FeedShell>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(10,6,5,.55)",
          backdropFilter: "blur(3px)",
          zIndex: 6,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 14,
          right: 14,
          bottom: 104,
          zIndex: 7,
          background: "var(--surface)",
          borderRadius: 26,
          padding: "20px 18px 18px",
          boxShadow: "var(--sh-3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <Tag tone="clay">
            <Icon name="zap" size={12} c="var(--clay)" /> QUICK CHECK
          </Tag>
          <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 700, color: "var(--ink-3)" }}>+15 XP</span>
        </div>
        <h3
          style={{
            fontFamily: "var(--display)",
            fontWeight: 700,
            fontSize: 19,
            margin: "0 0 16px",
            letterSpacing: "-.02em",
            lineHeight: 1.2,
          }}
        >
          Which sectioning keeps a balayage seamless?
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {QUIZ_OPTS.map(([k, t, correct]) => (
            <div
              key={k}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "13px 14px",
                borderRadius: 14,
                background: correct ? "var(--leaf-tint)" : "var(--paper)",
                boxShadow: correct ? "inset 0 0 0 2px var(--leaf)" : "inset 0 0 0 1.5px var(--line)",
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 8,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: correct ? "var(--leaf)" : "var(--surface)",
                  color: correct ? "#fff" : "var(--ink-2)",
                  fontWeight: 800,
                  fontSize: 13,
                  boxShadow: correct ? "none" : "inset 0 0 0 1.5px var(--line-2)",
                }}
              >
                {correct ? <Icon name="check" size={16} c="#fff" /> : k}
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: correct ? "var(--leaf)" : "var(--ink)" }}>{t}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16 }}>
          <Btn full kind="primary" iconR="chevR">
            Continue watching
          </Btn>
        </div>
      </div>
    </FeedShell>
  );
}
