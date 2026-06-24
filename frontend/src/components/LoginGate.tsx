import { useState, CSSProperties } from "react";
import { C } from "../constants";
import { Logo } from "./Logo";
import { useAuth } from "../lib/auth";

export function LoginGate() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) return;
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: CSSProperties = {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: `1.5px solid ${C.gold}`,
    color: "#EDE0CC",
    fontSize: 15,
    textAlign: "center",
    padding: "10px 8px",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    transition: "border-color .2s",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#1a0800",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        animation: "gateIn 0.55s cubic-bezier(.22,.68,0,1.2) both",
      }}
    >
      <div style={{ marginBottom: 36 }}>
        <Logo color="#EDE0CC" accentColor={C.gold} width={230} />
      </div>

      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 10,
          letterSpacing: ".32em",
          textTransform: "uppercase",
          color: C.gold,
          fontWeight: 600,
          marginBottom: 28,
          textAlign: "center",
        }}
      >
        Business Plan Studio ·{" "}
        {mode === "login" ? "Sign In" : "Create Account"}
      </p>

      <div style={{ width: 52, height: 1.5, background: C.gold, opacity: 0.45, marginBottom: 28 }} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: 300 }}>
        <input
          style={inputStyle}
          type="email"
          placeholder="EMAIL ADDRESS"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          autoComplete="email"
          autoFocus
        />
        <input
          style={inputStyle}
          type="password"
          placeholder="PASSWORD (min. 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
        />

        <div style={{ minHeight: 16, textAlign: "center" }}>
          {error && (
            <p style={{ color: "#e07070", fontSize: 11, letterSpacing: ".08em" }}>{error}</p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !email || !password}
          style={{
            width: "100%",
            background: C.gold,
            color: "#1a0800",
            border: "none",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: ".22em",
            textTransform: "uppercase",
            padding: "13px 44px",
            cursor: loading || !email || !password ? "not-allowed" : "pointer",
            opacity: loading || !email || !password ? 0.55 : 1,
            transition: "background .2s, transform .15s",
          }}
        >
          {loading ? "..." : mode === "login" ? "Sign In" : "Create Account"}
        </button>

        <button
          onClick={() => {
            setMode((m) => (m === "login" ? "register" : "login"));
            setError("");
          }}
          style={{
            background: "transparent",
            border: "none",
            color: `${C.gold}88`,
            fontSize: 11,
            letterSpacing: ".1em",
            cursor: "pointer",
            marginTop: 2,
          }}
        >
          {mode === "login"
            ? "Wala pang account? Gumawa ng isa →"
            : "May account ka na? Sign in →"}
        </button>

        {mode === "register" && (
          <p style={{ color: `${C.gold}66`, fontSize: 10, textAlign: "center", letterSpacing: ".05em" }}>
            New accounts get 3 free credits ✦
          </p>
        )}
      </div>
    </div>
  );
}
