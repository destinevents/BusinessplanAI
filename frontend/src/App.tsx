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
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <header
        className="app-header"
        style={{
          width: "100%",
          background: C.dark,
          padding: "20px 28px",
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <Logo color="#EDE0CC" accentColor={C.gold} width={200} />
        <CreditBadge />
      </header>

      {step === "form" && (
        <QuestionForm
          form={form}
          onChange={setForm}
          onSubmit={generateAll}
          credits={auth.credits}
        />
      )}

      {step === "loading" && <LoadingScreen genLabel={genLabel} progress={progress} />}

      {step === "result" && (
        <ResultView form={form} content={content} onRetry={retryTab} onReset={reset} />
      )}

      <footer
        style={{
          width: "100%",
          background: C.dark,
          padding: "28px 24px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          marginTop: "auto",
        }}
      >
        <Logo color="#EDE0CC" accentColor={C.gold} width={175} />
        <p style={{ fontSize: 11, color: "#4a2e18", textAlign: "center" }}>
          For Filipino entrepreneurs · Philippines 🇵🇭
        </p>
      </footer>
    </div>
  );
}
