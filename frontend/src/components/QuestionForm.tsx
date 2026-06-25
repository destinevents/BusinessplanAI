import { C, QUESTIONS } from "../constants";
import type { FormData } from "../types";

interface Props {
  form: FormData;
  onChange: (form: FormData) => void;
  onSubmit: () => void;
  credits: number;
}

export function QuestionForm({ form, onChange, onSubmit, credits }: Props) {
  const required = form.business && form.location && form.audience && form.budget;
  const canGenerate = !!required && credits > 0;

  return (
    <div className="question-form" style={{ maxWidth: 680, width: "100%", padding: "44px 24px" }}>
      <div className="card" style={{ textAlign: "center", marginBottom: 20, padding: "30px 28px" }}>
        <p className="eyebrow" style={{ marginBottom: 12 }}>Business Plan Studio</p>
        <h1
          className="form-title"
          style={{
            fontSize: 32,
            fontFamily: "'Playfair Display',serif",
            fontWeight: 700,
            color: C.brown,
            marginBottom: 8,
          }}
        >
          Business Plan <em style={{ color: C.gold, fontStyle: "italic" }}>In A Day</em>
        </h1>
        <p style={{ fontSize: 14, color: C.mid, fontStyle: "italic" }}>
          Answer 5 questions and get a complete business plan in minutes! 🚀
        </p>
      </div>

      <div className="card" style={{ padding: 28 }}>
        {QUESTIONS.map((q, i) => (
          <div key={q.id} style={{ marginBottom: i < QUESTIONS.length - 1 ? 22 : 0 }}>
            <label
              htmlFor={`q-${q.id}`}
              style={{ display: "block", fontSize: 14, fontWeight: 600, color: C.brown, marginBottom: 8 }}
            >
              {q.label}{" "}
              {q.req && <span style={{ color: "#e74c3c" }}>*</span>}
            </label>
            <input
              id={`q-${q.id}`}
              className="input"
              type="text"
              placeholder={q.ph}
              value={form[q.id]}
              onChange={(e) => onChange({ ...form, [q.id]: e.target.value })}
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
          className="btn btn-primary"
          style={{ width: "100%", marginTop: 26, padding: "14px 26px", fontSize: 15 }}
        >
          ✨ Generate Business Plan
        </button>

        <p style={{ textAlign: "center", fontSize: 12, color: C.light, marginTop: 12 }}>
          Uses 1 credit · You have {credits} credit{credits !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
