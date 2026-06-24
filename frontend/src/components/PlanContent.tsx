import { C, TABS } from "../constants";
import type { TabId } from "../types";
import { markdownToHtml } from "../lib/markdown";

interface Props {
  activeTab: TabId;
  content: Partial<Record<TabId, string>>;
  onRetry: (tabId: TabId) => void;
}

export function PlanContent({ activeTab, content, onRetry }: Props) {
  const curTab = TABS.find((t) => t.id === activeTab);
  const curContent = content[activeTab] ?? "";
  const isLoading = curContent === "__LOADING__";
  const hasError = curContent === "__ERROR__";
  const hasContent = !!curContent && !curContent.startsWith("__");

  return (
    <div
      className="plan-content-box"
      style={{
        background: C.card,
        borderRadius: 20,
        minHeight: 440,
        boxShadow: "0 2px 12px rgba(44,26,14,0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 18,
          paddingBottom: 14,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <span style={{ fontSize: 24 }}>{curTab?.icon}</span>
        <span
          style={{
            fontSize: 17,
            fontFamily: "'Playfair Display',serif",
            fontStyle: "italic",
            fontWeight: 700,
            color: C.mid,
          }}
        >
          {curTab?.label}
        </span>
      </div>

      {isLoading && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 320,
            gap: 14,
            color: C.mid,
          }}
        >
          <span className="spin" style={{ fontSize: 32, color: C.gold }}>✦</span>
          <p style={{ fontSize: 14 }}>Generating {curTab?.label}...</p>
        </div>
      )}

      {hasError && !isLoading && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 320,
            gap: 16,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 40 }}>⚠️</div>
          <h3
            style={{
              fontSize: 16,
              color: C.mid,
              fontFamily: "'Playfair Display',serif",
              fontStyle: "italic",
            }}
          >
            Failed to generate {curTab?.label}
          </h3>
          <p style={{ fontSize: 14, color: C.light, maxWidth: 360 }}>
            There may be a connection issue. Click the button below to retry.
            <br />
            <em style={{ fontSize: 12 }}>Free retry — no credits will be deducted.</em>
          </p>
          <button
            onClick={() => onRetry(activeTab)}
            style={{
              background: `linear-gradient(135deg,${C.gold},${C.accent})`,
              color: "#fff",
              border: "none",
              borderRadius: 14,
              padding: "12px 28px",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            🔄 Retry {curTab?.label}
          </button>
        </div>
      )}

      {hasContent && !isLoading && (
        <div
          className="md fadein"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(curContent) }}
        />
      )}
    </div>
  );
}
