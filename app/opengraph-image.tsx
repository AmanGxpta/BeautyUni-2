import { ImageResponse } from "next/og";

export const alt = "Rockstar — learn the craft in thirty seconds";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          background: "#111111",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -120,
            width: 780,
            height: 780,
            borderRadius: 999,
            background: "radial-gradient(circle, rgba(140,26,26,0.55), rgba(17,17,17,0) 70%)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "#8C1A1A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#F0EDE8",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            R
          </div>
          <div
            style={{
              color: "#B8B4AE",
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            Rockstar
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#F0EDE8",
              fontSize: 84,
              lineHeight: 1.02,
              letterSpacing: -2,
              maxWidth: 900,
            }}
          >
            Your next skill is thirty seconds away.
          </div>
          <div style={{ color: "#B8B4AE", fontSize: 30, marginTop: 28, maxWidth: 800 }}>
            A pocket-sized apprenticeship for stylists. Now taking names.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
