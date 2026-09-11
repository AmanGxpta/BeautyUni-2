import { ImageResponse } from "next/og";

export const alt =
  "BeautyUni — learn the craft, then learn the business behind it";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* The site palette. Hard-coded rather than read from `app/site.css`: the card
   is rendered by Satori in a worker that never loads the stylesheet. */
const CREAM = "#FCF7F3";
const INK = "#1E1713";
const INK_2 = "#4F443E";
const TERRA = "#C75C3C";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: CREAM,
          padding: "72px 80px",
          position: "relative",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -220,
            right: -160,
            width: 760,
            height: 760,
            borderRadius: 999,
            background:
              "radial-gradient(circle, rgba(199,92,60,0.30), rgba(252,247,243,0) 70%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: TERRA,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 27,
              fontWeight: 700,
            }}
          >
            B
          </div>
          <div
            style={{
              color: INK_2,
              fontSize: 21,
              letterSpacing: 5,
              textTransform: "uppercase",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            BeautyUni
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: INK,
              fontSize: 74,
              lineHeight: 1.04,
              letterSpacing: -2,
              maxWidth: 940,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Learn the craft.</span>
            <span>
              Then learn the{" "}
              <span style={{ color: TERRA, fontStyle: "italic" }}>business</span>{" "}
              behind it.
            </span>
          </div>
          <div
            style={{
              marginTop: 30,
              color: INK_2,
              fontSize: 26,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Capability-first education for beauty, wellness and medaesthetics
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            color: INK_2,
            fontSize: 20,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <span style={{ color: TERRA }}>Depth over demonstrations</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>Technical mastery</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>Consultation</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>Leadership</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>Commercial thinking</span>
        </div>
      </div>
    ),
    size,
  );
}
