import { C, QUESTIONS } from "../constants";
import type { FormData } from "../types";

interface Props {
  form: FormData;
  onChange: (form: FormData) => void;
  onSubmit: () => void;
  credits: number;
}

export function QuestionForm({ form, onChange, onSubmit, credits }: Props) {
  const card = {
    background: C.card,
    borderRadius: 20,
    padding: 28,
    boxShadow: "0 2px 12px rgba(44,26,14,0.06)",
  };

  const required = form.business && form.location && form.audience && form.budget;
  const canGenerate = !!required && credits > 0;

  return (
    <div style={{ maxWidth: 680, width: "100%", padding: "40px 24px" }}>
      <div style={{ ...card, textAlign: "center", marginBottom: 28 }}>
        <h1
          style={{
            fontSize: 32,
            fontFamily: "'Playfair Display',serif",
            fontWeight: 700,
            color: C.brown,
            marginBottom: 8,
          }}
        >
          Business Plan <em style={{ color: C.gold }}>In A Day</em>
        </h1>
        <p style={{ fontSize: 14, color: C.mid, fontStyle: "italic" }}>
          Answer 5 questions and get a complete business plan in minutes! 🚀
        </p>
      </div>

      <div style={{ ...card }}>
        {QUESTIONS.map((q, i) => (
          <div key={q.id} style={{ marginBottom: i < QUESTIONS.length - 1 ? 24 : 0 }}>
            <label
              style={{ display: "block", fontSize: 14, fontWeight: 600, color: C.brown, marginBottom: 8 }}
            >
              {q.label}{" "}
              {q.req && <span style={{ color: "#e74c3c" }}>*</span>}
            </label>
            <input
              type="text"
              placeholder={q.ph}
              value={form[q.id]}
              onChange={(e) => onChange({ ...form, [q.id]: e.target.value })}
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: 14,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                background: "white",
                color: C.brown,
                outline: "none",
              }}
            />
          </div>
        ))}

        {credits === 0 && (
          <div
            style={{
              marginTop: 20,
              padding: "12px 16px",
              background: "#e74c3c11",
              border: "1px solid #e74c3c44",
              borderRadius: 12,
              fontSize: 13,
              color: "#c0392b",
              textAlign: "center",
            }}
          >
            You're out of credits. Contact @DisenyoDigitals to top up. 💛
          </div>
        )}

        <button
          onClick={onSubmit}
          disabled={!canGenerate}
          style={{
            width: "100%",
            marginTop: 28,
            background: `linear-gradient(135deg,${C.gold},${C.accent})`,
            color: "#fff",
            border: "none",
            borderRadius: 14,
            padding: "13px 26px",
            fontSize: 14,
            fontWeight: 700,
            cursor: canGenerate ? "pointer" : "not-allowed",
            opacity: canGenerate ? 1 : 0.5,
            transition: "transform .15s",
          }}
        >
          ✨ Generate Business Plan
        </button>

        <p style={{ textAlign: "center", fontSize: 12, color: C.light, marginTop: 10 }}>
          Uses 1 credit · You have {credits} credit{credits !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
