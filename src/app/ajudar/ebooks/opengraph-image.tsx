import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "1 eBook = 1 kg · MyPets";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "1200px", height: "630px", display: "flex", position: "relative", overflow: "hidden", background: "#0f241b", color: "white", fontFamily: "Arial, sans-serif" }}>
        <img src="https://mypets.lat/images/card-alimentou.jpg" width="1200" height="630" alt="" style={{ position: "absolute", inset: 0, width: "1200px", height: "630px", objectFit: "cover", opacity: 0.5 }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", background: "linear-gradient(90deg, rgba(7,25,17,.98) 0%, rgba(7,25,17,.88) 52%, rgba(7,25,17,.42) 100%)" }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", width: "760px", padding: "64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "20px", fontWeight: 800, color: "#86efac" }}>MyPets · campanha solidária</div>
          <div style={{ marginTop: "26px", fontSize: "88px", fontWeight: 900, lineHeight: .95, letterSpacing: "-4px" }}>1 eBook <span style={{ color: "#86efac" }}>= Ração.</span></div>
          <div style={{ marginTop: "28px", fontSize: "28px", lineHeight: 1.35, color: "rgba(255,255,255,.82)" }}>Escolha um guia digital e transforme R$ 12,90 em 1 kg de ração a financiar.</div>
          <div style={{ marginTop: "34px", display: "flex", width: "fit-content", borderRadius: "999px", background: "#22c55e", padding: "16px 26px", fontSize: "20px", fontWeight: 800 }}>R$ 12,90 · 1 kg · mypets.lat/ajudar/ebooks</div>
        </div>
      </div>
    ),
    size,
  );
}
