import { useState, CSSProperties, useEffect } from "react";
import { C } from "../constants";
import { Logo } from "./Logo";
import { useAuth } from "../lib/auth";

export function LoginGate() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register" | "check-email">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("verified") === "true") {
      setSuccess("Email verified! You can now sign in.");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const handleSubmit = async () => {
    if (!email || !password) return;
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        const result = await register(email, password);
        if (result.verificationRequired) {
          setRegisteredEmail(email);
          setMode("check-email");
        }
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

  const wrapper: CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    background: "#1a0800",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    animation: "gateIn 0.55s cubic-bezier(.22,.68,0,1.2) both",
  };

  if (mode === "check-email") {
    return (
      <div style={wrapper}>
        <div style={{ marginBottom: 36 }}>
          <Logo color="#EDE0CC" accentColor={C.gold} width={230} />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            width: 320,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 48 }}>📧</div>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10,
              letterSpacing: ".32em",
              textTransform: "uppercase",
              color: C.gold,
              fontWeight: 600,
            }}
          >
            Check Your Email
          </p>
          <div style={{ width: 52, height: 1.5, background: C.gold, opacity: 0.45 }} />
          <p style={{ color: "#EDE0CC", fontSize: 14, lineHeight: 1.7 }}>
            We sent a verification link to{" "}
            <strong style={{ color: C.gold }}>{registeredEmail}</strong>.
            <br />
            Click the link in your email to activate your account.
          </p>
          <p style={{ color: `${C.gold}88`, fontSize: 12 }}>
            The link expires in 24 hours. Check your spam folder if you don't see it.
          </p>
          <button
            onClick={() => {
              setMode("login");
              setEmail(registeredEmail);
              setPassword("");
            }}
            style={{
              marginTop: 8,
              background: C.gold,
              color: "#1a0800",
              border: "none",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: ".22em",
              textTransform: "uppercase",
              padding: "13px 44px",
              cursor: "pointer",
            }}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={wrapper}>
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
          {success && !error && (
            <p style={{ color: "#7ecb7e", fontSize: 11, letterSpacing: ".08em" }}>{success}</p>
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
            setSuccess("");
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
            ? "Don't have an account? Create one →"
            : "Already have an account? Sign in →"}
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
