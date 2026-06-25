import { C } from "../constants";
import { useAuth } from "../lib/auth";

export function CreditBadge() {
  const { credits, email, logout } = useAuth();
  const hasCredits = credits > 0;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          background: hasCredits ? `${C.gold}1f` : "#e74c3c22",
          border: `1px solid ${hasCredits ? C.gold : "#e74c3c"}66`,
          borderRadius: 999,
          padding: "6px 14px",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span style={{ fontSize: 12, color: hasCredits ? C.gold : "#ef8a82" }}>✦</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: hasCredits ? C.gold : "#ef8a82" }}>
          {credits} credit{credits !== 1 ? "s" : ""}
        </span>
      </div>
      {email && (
        <span
          className="header-email"
          style={{ fontSize: 12, color: "rgba(237,224,204,0.62)", letterSpacing: ".03em" }}
        >
          {email}
        </span>
      )}
      <button
        onClick={logout}
        className="btn btn-outline-dark"
        style={{ borderRadius: 10, padding: "6px 14px", fontSize: 11, fontWeight: 600, letterSpacing: ".06em" }}
      >
        Sign out
      </button>
    </div>
  );
}
