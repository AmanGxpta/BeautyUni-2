import { Icon } from "@/components/ui/icon";
import { ProgressBar, SectionLabel } from "@/components/ui/primitives";
import { Screen } from "@/components/ui/screen";

const EARNED: [string, string, string][] = [
  ["Color Theory Essentials", "Nia Brooks", "Mar 2026"],
  ["Salon Fundamentals", "Theo Vance", "Jan 2026"],
];

/** 1.8 Certifications list. */
export function ScreenCerts() {
  return (
    <Screen
      bg="var(--paper)"
      header={
        <div style={{ padding: "2px 20px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Icon name="chevL" size={24} c="var(--ink)" />
            <span style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: 20 }}>Certifications</span>
          </div>
        </div>
      }
    >
      <div
        style={{
          background: "linear-gradient(135deg,#CF9A47,#6B1414)",
          borderRadius: "var(--r-card)",
          padding: "20px",
          color: "#fff",
          marginBottom: 20,
          position: "relative",
          overflow: "hidden",
          boxShadow: "var(--sh-2)",
        }}
      >
        <div style={{ position: "absolute", right: -20, top: -20, opacity: 0.18 }}>
          <Icon name="award" size={130} c="#fff" />
        </div>
        <Icon name="award" size={28} c="#fff" />
        <div style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: 24, marginTop: 30 }}>2 earned</div>
        <div style={{ fontSize: 13, opacity: 0.9 }}>1 more in progress</div>
      </div>
      <SectionLabel>Earned</SectionLabel>
      {EARNED.map(([t, e, d]) => (
        <div
          key={t}
          style={{
            background: "var(--surface)",
            borderRadius: "var(--r-card)",
            padding: 14,
            marginBottom: 12,
            boxShadow: "var(--sh-1)",
            display: "flex",
            gap: 13,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "var(--gold-tint)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon name="award" size={26} c="var(--gold)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{t}</div>
            <div style={{ fontSize: 12, color: "var(--ink-2)" }}>
              {e} · {d}
            </div>
          </div>
          <Icon name="download" size={20} c="var(--ink-3)" />
        </div>
      ))}
      <div
        style={{
          marginTop: 8,
          background: "var(--surface)",
          borderRadius: "var(--r-card)",
          padding: 14,
          boxShadow: "var(--sh-1)",
          display: "flex",
          gap: 13,
          alignItems: "center",
          opacity: 0.85,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: "var(--paper-2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon name="lock" size={22} c="var(--ink-3)" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Modern Balayage Foundations</div>
          <div style={{ fontSize: 12, color: "var(--ink-2)", marginBottom: 6 }}>38%, pass the exam to unlock</div>
          <ProgressBar value={38} />
        </div>
      </div>
    </Screen>
  );
}
