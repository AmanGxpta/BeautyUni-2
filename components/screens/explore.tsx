import { Icon } from "@/components/ui/icon";
import { Avatar, Ph, Pill, SectionLabel, Stars, Tag, type Tone } from "@/components/ui/primitives";
import { Screen } from "@/components/ui/screen";

function CourseCard({
  title,
  edu,
  tag,
  tone,
  lvl,
  mins,
  big,
}: {
  title: string;
  edu: string;
  tag: string;
  tone: Tone;
  lvl: string;
  mins: string;
  big?: boolean;
}) {
  return (
    <div
      style={{
        background: "var(--surface)",
        borderRadius: "var(--r-card)",
        overflow: "hidden",
        boxShadow: "var(--sh-1)",
      }}
    >
      <Ph icon="image" h={big ? 150 : 108} label={tag} />
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          <Tag tone={tone}>{lvl}</Tag>
          <Tag tone="ink">
            <Icon name="clock" size={11} c="var(--ink-2)" />
            {mins}
          </Tag>
        </div>
        <div
          style={{
            fontFamily: "var(--display)",
            fontWeight: 700,
            fontSize: big ? 17 : 14.5,
            letterSpacing: "-.02em",
            lineHeight: 1.2,
            marginBottom: 6,
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Avatar name={edu} size={20} />
          <span style={{ fontSize: 12, color: "var(--ink-2)", fontWeight: 600 }}>{edu}</span>
          <span style={{ marginLeft: "auto" }}>
            <Stars val={4.9} size={12} />
          </span>
        </div>
      </div>
    </div>
  );
}

const FILTERS: [string, boolean][] = [
  ["Color", true],
  ["Cutting", false],
  ["Styling", false],
  ["Barbering", false],
  ["Editorial", false],
];

/** 1.4 Explore / catalog. */
export function ScreenExplore() {
  return (
    <Screen
      tab
      tabActive="compass"
      header={
        <div style={{ padding: "4px 20px 14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h1 className="rs-display" style={{ fontSize: 26, margin: 0 }}>
              Explore
            </h1>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 999,
                background: "var(--surface)",
                boxShadow: "var(--sh-1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="bell" size={20} c="var(--ink-2)" />
            </div>
          </div>
          <div
            style={{
              height: 48,
              borderRadius: 14,
              background: "var(--surface)",
              boxShadow: "var(--sh-1)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "0 16px",
            }}
          >
            <Icon name="search" size={19} c="var(--ink-3)" />
            <span style={{ color: "var(--ink-3)", fontSize: 14.5 }}>Search courses, techniques…</span>
          </div>
        </div>
      }
    >
      <div style={{ display: "flex", gap: 9, overflowX: "auto", paddingBottom: 16 }} className="rs-noscroll">
        {FILTERS.map(([c, a]) => (
          <Pill key={c} active={a}>
            {c}
          </Pill>
        ))}
      </div>
      <SectionLabel action="See all">Featured</SectionLabel>
      <CourseCard
        big
        title="Modern Balayage Foundations"
        edu="Rae Mills"
        tag="HAIR · COLOR"
        tone="clay"
        lvl="Intermediate"
        mins="2h 10m"
      />
      <div style={{ height: 18 }} />
      <SectionLabel action="See all">Trending now</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, paddingBottom: 8 }}>
        <CourseCard title="Precision Bob & Lob" edu="Theo Vance" tag="CUTTING" tone="berry" lvl="Beginner" mins="1h 40m" />
        <CourseCard title="Editorial Updos" edu="Lena Park" tag="STYLING" tone="gold" lvl="Advanced" mins="2h 5m" />
      </div>
    </Screen>
  );
}
