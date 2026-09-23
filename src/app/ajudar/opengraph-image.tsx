import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Ajude o MyPets a continuar vivo";
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
          background: "#10212b",
          color: "white",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <img
          src="https://mypets.lat/images/hero.jpg"
          width="1200"
          height="630"
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "1200px",
            height: "630px",
            objectFit: "cover",
            opacity: 0.72,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: "linear-gradient(90deg, rgba(7,17,24,.96) 0%, rgba(7,17,24,.86) 48%, rgba(7,17,24,.20) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "720px",
            padding: "64px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "34px" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "18px",
                background: "#ff6258",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
              }}
            >
              ♥
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "30px", fontWeight: 800, lineHeight: 1 }}>MyPets</div>
              <div style={{ marginTop: "7px", fontSize: "13px", fontWeight: 700, letterSpacing: "2px", color: "rgba(255,255,255,.65)" }}>
                PESSOAS · ANIMAIS · IMPACTO REAL
              </div>
            </div>
          </div>
          <div style={{ fontSize: "68px", fontWeight: 900, lineHeight: 1.02, letterSpacing: "-3px" }}>
            Ajude o MyPets a
            <span style={{ color: "#4ade80" }}> continuar vivo.</span>
          </div>
          <div style={{ marginTop: "28px", fontSize: "25px", lineHeight: 1.35, color: "rgba(255,255,255,.82)", maxWidth: "650px" }}>
            Mais estrutura para encontrar projetos reais e levar mais cuidado a animais que precisam.
          </div>
          <div
            style={{
              marginTop: "34px",
              display: "flex",
              alignItems: "center",
              width: "fit-content",
              borderRadius: "999px",
              background: "#22c55e",
              padding: "16px 26px",
              fontSize: "20px",
              fontWeight: 800,
            }}
          >
            Apoie por Pix · mypets.lat/ajudar
          </div>
        </div>
      </div>
    ),
    size,
  );
}
