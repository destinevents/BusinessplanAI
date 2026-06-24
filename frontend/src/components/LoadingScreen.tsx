import { C } from "../constants";

interface Props {
  genLabel: string;
  progress: number;
}

export function LoadingScreen({ genLabel, progress }: Props) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        width: "100%",
      }}
    >
      <div
        className="loading-card"
        style={{
          background: C.card,
          borderRadius: 20,
          padding: "52px 40px",
          boxShadow: "0 2px 12px rgba(44,26,14,0.06)",
          maxWidth: 480,
          width: "100%",
          textAlign: "center",
        }}
      >
        <span className="spin" style={{ fontSize: 36, color: C.gold, display: "block", marginBottom: 16 }}>
          ✦
        </span>
        <h2
          style={{
            fontSize: 21,
            fontFamily: "'Playfair Display',serif",
            fontWeight: 700,
            marginBottom: 8,
            color: C.brown,
          }}
        >
          Generating your business plan...
        </h2>
        <p style={{ fontSize: 14, color: C.mid, marginBottom: 22 }}>
          Now generating: <strong style={{ color: C.gold }}>{genLabel}</strong>
        </p>
        <div
          style={{
            background: `${C.gold}22`,
            borderRadius: 100,
            height: 8,
            overflow: "hidden",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: 100,
              background: `linear-gradient(90deg,${C.gold},${C.accent})`,
              width: `${progress}%`,
              transition: "width .6s ease",
            }}
          />
        </div>
        <p style={{ fontSize: 13, color: C.gold }}>{progress}%</p>
      </div>
    </div>
  );
}
