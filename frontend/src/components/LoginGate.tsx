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

  const wrapper: CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    background:
      "radial-gradient(900px 520px at 50% 0%, #2a1206 0%, rgba(42,18,6,0) 60%), #190a02",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    animation: "gateIn 0.55s cubic-bezier(.22,.68,0,1.2) both",
  };

  const panel: CSSProperties = {
    width: "min(360px, 92vw)",
    background: "rgba(237,224,204,0.045)",
    border: "1px solid rgba(201,168,76,0.22)",
    borderRadius: 22,
    padding: "30px 30px 26px",
    boxShadow: "0 26px 60px rgba(0,0,0,0.45)",
  };

  if (mode === "check-email") {
    return (
      <div style={wrapper}>
        <div style={{ marginBottom: 30 }}>
          <Logo color="#EDE0CC" accentColor={C.gold} width={220} />
        </div>
        <div style={{ ...panel, textAlign: "center" }}>
          <div style={{ fontSize: 46, marginBottom: 8 }}>📧</div>
          <p className="eyebrow" style={{ color: C.gold }}>Check Your Email</p>
          <div style={{ width: 48, height: 1.5, background: C.gold, opacity: 0.4, margin: "14px auto 16px" }} />
          <p style={{ color: "#EDE0CC", fontSize: 14, lineHeight: 1.7 }}>
            We sent a verification link to{" "}
            <strong style={{ color: C.gold }}>{registeredEmail}</strong>.
            <br />
            Click the link in your email to activate your account.
          </p>
          <p style={{ color: `${C.gold}88`, fontSize: 12, marginTop: 12 }}>
            The link expires in 24 hours. Check your spam folder if you don't see it.
          </p>
          <button
            onClick={() => {
              setMode("login");
              setEmail(registeredEmail);
              setPassword("");
            }}
            className="btn btn-gold-solid"
            style={{ marginTop: 20, padding: "13px 44px", fontSize: 11, letterSpacing: ".22em", textTransform: "uppercase" }}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={wrapper}>
      <div style={{ marginBottom: 30 }}>
        <Logo color="#EDE0CC" accentColor={C.gold} width={220} />
      </div>

      <div style={panel}>
        <p className="eyebrow" style={{ color: C.gold, textAlign: "center" }}>
          Business Plan Studio · {mode === "login" ? "Sign In" : "Create Account"}
        </p>
        <div style={{ width: 48, height: 1.5, background: C.gold, opacity: 0.4, margin: "16px auto 22px" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input
            className="input-line"
            type="email"
            placeholder="EMAIL ADDRESS"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            autoComplete="email"
            autoFocus
          />
          <input
            className="input-line"
            type="password"
            placeholder="PASSWORD (min. 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />

          <div style={{ minHeight: 16, textAlign: "center" }}>
            {error && (
              <p style={{ color: "#e98c8c", fontSize: 11, letterSpacing: ".08em" }}>{error}</p>
            )}
            {success && !error && (
              <p style={{ color: "#86d086", fontSize: 11, letterSpacing: ".08em" }}>{success}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !email || !password}
            className="btn btn-gold-solid"
            style={{ width: "100%", padding: "13px 44px", fontSize: 11, letterSpacing: ".22em", textTransform: "uppercase" }}
          >
            {loading ? "..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>

          <button
            onClick={() => {
              setMode((m) => (m === "login" ? "register" : "login"));
              setError("");
              setSuccess("");
            }}
            className="link-btn"
            style={{ color: `${C.gold}99`, fontSize: 11, letterSpacing: ".1em", marginTop: 2 }}
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
    </div>
  );
}
