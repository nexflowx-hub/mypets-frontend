import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PetsKids + MyPets";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#0b291b",
          color: "white",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <img
          src="https://mypets.lat/images/card-alimentou.jpg"
          width="1200"
          height="630"
          alt=""
          style={{ position: "absolute", inset: 0, width: "1200px", height: "630px", objectFit: "cover", opacity: 0.76 }}
        />
        <div style={{ position: "absolute", inset: 0, display: "flex", background: "linear-gradient(90deg, rgba(6,25,16,.97), rgba(6,25,16,.86) 52%, rgba(6,25,16,.18))" }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", width: "760px", padding: "64px" }}>
          <div style={{ fontSize: "18px", fontWeight: 800, letterSpacing: "2px", color: "#86efac" }}>PETSKIDS · CENTRO-OESTE DO BRASIL</div>
          <div style={{ marginTop: "22px", fontSize: "64px", fontWeight: 900, lineHeight: 1.02, letterSpacing: "-3px" }}>
            Duas crianças começaram com <span style={{ color: "#86efac" }}>sacos de ração.</span>
          </div>
          <div style={{ marginTop: "26px", fontSize: "24px", lineHeight: 1.38, color: "rgba(255,255,255,.82)" }}>
            Conheça a história e ajude o MyPets a dar estrutura a iniciativas reais como esta.
          </div>
          <div style={{ marginTop: "34px", display: "flex", width: "fit-content", borderRadius: "999px", background: "#22c55e", padding: "16px 26px", fontSize: "20px", fontWeight: 800 }}>
            mypets.lat/ajudar/petskids
          </div>
        </div>
      </div>
    ),
    size,
  );
}
