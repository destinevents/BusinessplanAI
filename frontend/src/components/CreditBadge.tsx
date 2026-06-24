import { C } from "../constants";
import { useAuth } from "../lib/auth";

export function CreditBadge() {
  const { credits, email, logout } = useAuth();
  const hasCredits = credits > 0;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          background: hasCredits ? `${C.gold}22` : "#e74c3c22",
          border: `1px solid ${hasCredits ? C.gold : "#e74c3c"}55`,
          borderRadius: 20,
          padding: "6px 14px",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ fontSize: 12, color: hasCredits ? C.gold : "#e74c3c" }}>✦</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: hasCredits ? C.gold : "#e74c3c" }}>
          {credits} credit{credits !== 1 ? "s" : ""}
        </span>
      </div>
      {email && (
        <span className="header-email" style={{ fontSize: 11, color: "#5a3a1a", letterSpacing: ".03em" }}>
          {email}
        </span>
      )}
      <button
        onClick={logout}
        style={{
          background: "transparent",
          border: `1px solid #4a2e1844`,
          color: "#6a4a28",
          borderRadius: 8,
          padding: "5px 11px",
          fontSize: 11,
          cursor: "pointer",
          letterSpacing: ".06em",
        }}
      >
        Sign out
      </button>
    </div>
  );
}
