import { useState } from "react";
import { C, TABS } from "./constants";
import type { FormData, TabId } from "./types";
import { useAuth } from "./lib/auth";
import { api } from "./lib/api";
import { LoginGate } from "./components/LoginGate";
import { Logo } from "./components/Logo";
import { CreditBadge } from "./components/CreditBadge";
import { QuestionForm } from "./components/QuestionForm";
import { LoadingScreen } from "./components/LoadingScreen";
import { ResultView } from "./components/ResultView";

type Step = "form" | "loading" | "result";

const EMPTY_FORM: FormData = { business: "", location: "", audience: "", budget: "", edge: "" };

export function App() {
  const auth = useAuth();
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [content, setContent] = useState<Partial<Record<TabId, string>>>({});
  const [genLabel, setGenLabel] = useState("");
  const [progress, setProgress] = useState(0);
  const [planId, setPlanId] = useState<string | null>(null);

  // Show nothing while verifying saved token
  if (auth.loading) return null;

  // Show login/register gate when not authenticated
  if (!auth.token) return <LoginGate />;

  const reset = () => {
    setStep("form");
    setForm(EMPTY_FORM);
    setContent({});
    setProgress(0);
    setPlanId(null);
  };

  const generateAll = async () => {
    setStep("loading");
    setProgress(0);

    // Deduct credit and get a planId — atomic on the server
    let newPlanId: string;
    try {
      const result = await api.startPlan(form);
      newPlanId = result.planId;
      setPlanId(newPlanId);
      auth.setCredits(auth.credits - 1);
    } catch (err: unknown) {
      setStep("form");
      const msg = err instanceof Error ? err.message : "Failed to start plan. Please try again.";
      alert(msg);
      return;
    }

    // Generate each section sequentially — retries are free (planId already paid for)
    const newContent: Partial<Record<TabId, string>> = {};

    for (let i = 0; i < TABS.length; i++) {
      const tab = TABS[i];
      setGenLabel(tab.label);
      setProgress(Math.round((i / TABS.length) * 100));

      try {
        const result = await api.generateSection(newPlanId, tab.id);
        newContent[tab.id] = result.content;
      } catch {
        newContent[tab.id] = "__ERROR__";
      }

      // Spread so React sees a new object reference on each update
      setContent({ ...newContent });
    }

    setProgress(100);
    setStep("result");
  };

  const retryTab = async (tabId: TabId) => {
    if (!planId) return;
    setContent((prev) => ({ ...prev, [tabId]: "__LOADING__" }));
    try {
      const result = await api.generateSection(planId, tabId);
      setContent((prev) => ({ ...prev, [tabId]: result.content }));
    } catch {
      setContent((prev) => ({ ...prev, [tabId]: "__ERROR__" }));
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header className="app-header">
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            paddingTop: 16,
            paddingBottom: 16,
          }}
        >
          <Logo color="#EDE0CC" accentColor={C.gold} width={190} />
          <CreditBadge />
        </div>
      </header>

      <main
        style={{
          flex: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {step === "form" && (
          <div key="form" className="fadein" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <QuestionForm form={form} onChange={setForm} onSubmit={generateAll} credits={auth.credits} />
          </div>
        )}

        {step === "loading" && (
          <div key="loading" className="fadein" style={{ width: "100%", flex: 1, display: "flex" }}>
            <LoadingScreen genLabel={genLabel} progress={progress} />
          </div>
        )}

        {step === "result" && (
          <div key="result" className="fadein" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <ResultView form={form} content={content} onRetry={retryTab} onReset={reset} />
          </div>
        )}
      </main>

      <footer
        style={{
          width: "100%",
          background: "linear-gradient(180deg,#1c0d04,#160802)",
          borderTop: "1px solid rgba(201,168,76,0.22)",
          marginTop: "auto",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            paddingTop: 30,
            paddingBottom: 30,
          }}
        >
          <Logo color="#EDE0CC" accentColor={C.gold} width={160} />
          <p style={{ fontSize: 12, color: "rgba(201,168,76,0.78)", textAlign: "center", letterSpacing: ".04em" }}>
            For Filipino entrepreneurs · Philippines 🇵🇭
          </p>
        </div>
      </footer>
    </div>
  );
}
