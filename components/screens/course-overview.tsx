import { Icon } from "@/components/ui/icon";
import { ProgressBar, ProgressRing } from "@/components/ui/primitives";
import { Screen } from "@/components/ui/screen";

const CHAPTERS = [
  { n: "01", t: "Foundations & tools", done: 5, total: 5 },
  { n: "02", t: "Sectioning the head", done: 4, total: 7 },
  { n: "03", t: "Painting technique", done: 0, total: 9 },
  { n: "04", t: "Saturation & processing", done: 0, total: 8 },
];

/** 1.5 Course overview (chapters → modules). */
export function ScreenCourseOverview() {
  return (
    <Screen
      bg="var(--paper)"
      header={
        <div style={{ padding: "2px 20px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Icon name="chevL" size={24} c="var(--ink)" />
            <Icon name="bookmark" size={21} c="var(--ink-2)" />
          </div>
          <div className="rs-eyebrow" style={{ marginBottom: 8 }}>
            Your course
          </div>
          <h1 className="rs-display" style={{ fontSize: 24, margin: "0 0 16px", lineHeight: 1.1 }}>
            Modern Balayage Foundations
          </h1>
          <div
            style={{
              background: "var(--surface)",
              borderRadius: "var(--r-md)",
              padding: 14,
              boxShadow: "var(--sh-1)",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <ProgressRing value={38} size={56}>
              38%
            </ProgressRing>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>9 of 48 clips done</div>
              <div style={{ fontSize: 12, color: "var(--ink-2)" }}>Keep going — exam unlocks at 100%</div>
            </div>
          </div>
        </div>
      }
    >
      <div style={{ paddingTop: 6 }}>
        {CHAPTERS.map((c) => {
          const active = c.done > 0 && c.done < c.total;
          return (
            <div
              key={c.n}
              style={{
                background: "var(--surface)",
                borderRadius: "var(--r-md)",
                padding: "15px 16px",
                marginBottom: 12,
                boxShadow: active ? "var(--sh-2)" : "var(--sh-1)",
                border: active ? "1.5px solid var(--clay-tint)" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                <div
                  style={{
                    fontFamily: "var(--display)",
                    fontWeight: 800,
                    fontSize: 20,
                    color: c.done ? "var(--clay)" : "var(--ink-3)",
                    width: 30,
                  }}
                >
                  {c.n}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{c.t}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-2)", marginTop: 2 }}>
                    {c.done}/{c.total} clips · {c.done === c.total ? "Complete" : active ? "In progress" : "Locked"}
                  </div>
                </div>
                {c.done === c.total ? (
                  <Icon name="check" size={20} c="var(--leaf)" />
                ) : active ? (
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 999,
                      background: "var(--clay)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name="play" size={17} c="#fff" />
                  </div>
                ) : (
                  <Icon name="lock" size={18} c="var(--ink-3)" />
                )}
              </div>
              {c.done > 0 && (
                <div style={{ marginTop: 12 }}>
                  <ProgressBar value={(c.done / c.total) * 100} />
                </div>
              )}
            </div>
          );
        })}
        <div
          style={{
            marginTop: 6,
            marginBottom: 8,
            padding: "15px 16px",
            borderRadius: "var(--r-md)",
            background: "var(--paper-2)",
            display: "flex",
            alignItems: "center",
            gap: 13,
          }}
        >
          <div style={{ width: 30, display: "flex", justifyContent: "center" }}>
            <Icon name="award" size={22} c="var(--gold)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Final exam</div>
            <div style={{ fontSize: 12, color: "var(--ink-2)" }}>Pass to earn your certificate</div>
          </div>
          <Icon name="lock" size={18} c="var(--ink-3)" />
        </div>
      </div>
    </Screen>
  );
}
