import { ImageResponse } from "next/og";
export const alt = "MONARDAS — Intelligence. Systems. Ownership.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#11110F",
        color: "#F3F0E8",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "65px 80px",
        justifyContent: "space-between",
      }}
    >
      <div style={{ fontSize: 26, letterSpacing: 7 }}>MONARDAS</div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 80,
          lineHeight: 1.08,
        }}
      >
        <span>Intelligence.</span>
        <span>Systems.</span>
        <span style={{ color: "#B89B5E" }}>Ownership.</span>
      </div>
      <div style={{ fontSize: 18, color: "#A7A39A", letterSpacing: 3 }}>
        BUILD. AUTOMATE. SCALE. OWN.
      </div>
    </div>,
    size,
  );
}
