import { Icon } from "@/components/ui/icon";
import { Btn, Ph } from "@/components/ui/primitives";
import { Screen } from "@/components/ui/screen";

/** 1.7 Work submission (upload). */
export function ScreenSubmit() {
  return (
    <Screen
      bg="var(--paper)"
      header={
        <div style={{ padding: "2px 20px 14px", display: "flex", alignItems: "center", gap: 14 }}>
          <Icon name="chevL" size={24} c="var(--ink)" />
          <span style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: 18 }}>Submit your work</span>
        </div>
      }
      footer={
        <div style={{ padding: "14px 20px 30px" }}>
          <Btn full size="lg" iconR="send">
            Submit for review
          </Btn>
        </div>
      }
    >
      <div className="rs-eyebrow" style={{ marginBottom: 8 }}>
        FOR · CHAPTER 2 SECTIONING
      </div>
      <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.5, margin: "0 0 18px" }}>
        Upload 2–3 photos or a short clip of your sectioning. Rae will review within 48h.
      </p>
      <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
        <Ph
          icon="image"
          style={{ flex: 1, height: 130, borderRadius: 18 }}
          kids={
            <div
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 24,
                height: 24,
                borderRadius: 99,
                background: "rgba(0,0,0,.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="x" size={14} c="#fff" />
            </div>
          }
        />
        <div
          style={{
            flex: 1,
            height: 130,
            borderRadius: 18,
            border: "2px dashed var(--line-2)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            background: "var(--surface)",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              background: "var(--clay-tint)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="plus" size={22} c="var(--clay)" />
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-2)" }}>Add media</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <Btn kind="soft" icon="camera" full>
          Camera
        </Btn>
        <Btn kind="ghost" icon="image" full>
          Library
        </Btn>
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink-2)", marginBottom: 8 }}>
        Notes for your educator (optional)
      </div>
      <div
        style={{
          minHeight: 80,
          borderRadius: 14,
          background: "var(--surface)",
          boxShadow: "inset 0 0 0 1.5px var(--line-2)",
          padding: "13px 16px",
          fontSize: 14,
          color: "var(--ink-3)",
        }}
      >
        I struggled with the crown section — feedback welcome.
      </div>
    </Screen>
  );
}
