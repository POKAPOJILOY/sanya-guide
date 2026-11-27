import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Санья Гид — Хайнань: курс-путеводитель";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #FFF7F9 0%, #FFDCE8 70%, #F2689C 140%)",
        }}
      >
        <div style={{ display: "flex", fontSize: 84 }}>🌴🥥</div>
        <div
          style={{
            marginTop: 28,
            fontSize: 74,
            fontWeight: 700,
            color: "#3D2233",
            textAlign: "center",
          }}
        >
          Хайнань — курс-путеводитель
        </div>
        <div
          style={{
            marginTop: 22,
            fontSize: 36,
            color: "#D63D7C",
            textAlign: "center",
          }}
        >
          Интерактивная карта и честные гайды по Хайнаню
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            padding: "14px 32px",
            borderRadius: 999,
            background: "#FFFFFF",
            fontSize: 30,
            fontWeight: 700,
            color: "#8A6B7A",
          }}
        >
          Карта, гайды и чек-листы · доступ навсегда · 599 руб
        </div>
      </div>
    ),
    size
  );
}
