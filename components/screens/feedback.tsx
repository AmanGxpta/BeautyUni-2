import { Icon } from "@/components/ui/icon";
import { Avatar, Btn, Ph } from "@/components/ui/primitives";
import { Screen } from "@/components/ui/screen";

/** 1.7 Feedback detail. */
export function ScreenFeedback() {
  return (
    <Screen
      bg="var(--paper)"
      header={
        <div style={{ padding: "2px 20px 14px", display: "flex", alignItems: "center", gap: 14 }}>
          <Icon name="chevL" size={24} c="var(--ink)" />
          <span style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: 18 }}>Feedback</span>
        </div>
      }
    >
      <Ph icon="image" h={170} radius={18} label="YOUR SUBMISSION" style={{ marginBottom: 18 }} />
      <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 14 }}>
        <Avatar name="Rae Mills" size={42} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Rae Mills</div>
          <div style={{ fontSize: 12, color: "var(--ink-2)" }}>Reviewed your Chapter 2 work</div>
        </div>
        <div style={{ display: "flex", gap: 2 }}>
          {[1, 1, 1, 1, 0].map((s, i) => (
            <Icon key={i} name={s ? "star-f" : "star"} size={15} c="var(--gold)" />
          ))}
        </div>
      </div>
      <div
        style={{
          background: "var(--surface)",
          borderRadius: "var(--r-card)",
          padding: "16px 18px",
          boxShadow: "var(--sh-1)",
          marginBottom: 14,
        }}
      >
        <p style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.55, margin: 0 }}>
          Really nice progress, Mia. Your diagonal partings are far cleaner than last time and the tension is
          consistent. Next: keep your crown sections a touch narrower so saturation stays even. Try the technique from
          clip 4 again.
        </p>
      </div>
      <div
        style={{
          background: "var(--leaf-tint)",
          borderRadius: "var(--r-md)",
          padding: "14px 16px",
          display: "flex",
          gap: 11,
          alignItems: "center",
          marginBottom: 18,
        }}
      >
        <Icon name="zap" size={20} c="var(--leaf)" />
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--leaf)", flex: 1 }}>
          Suggested: rewatch “Crown sectioning” clip
        </span>
        <Icon name="chevR" size={18} c="var(--leaf)" />
      </div>
      <Btn full kind="ghost" icon="message">
        Reply to Rae
      </Btn>
    </Screen>
  );
}
