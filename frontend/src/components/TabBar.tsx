import { C, TABS } from "../constants";
import type { TabId } from "../types";

interface Props {
  activeTab: TabId;
  content: Partial<Record<TabId, string>>;
  onSelect: (id: TabId) => void;
}

export function TabBar({ activeTab, content, onSelect }: Props) {
  return (
    <div
      className="tab-bar"
      style={{
        background: C.card,
        borderRadius: 20,
        padding: 6,
        display: "flex",
        gap: 4,
        marginBottom: 18,
        boxShadow: "0 2px 12px rgba(44,26,14,0.06)",
      }}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const val = content[tab.id];
        const ok = val && !val.startsWith("__");
        const isError = val === "__ERROR__";
        const isLoading = val === "__LOADING__";

        return (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            className={`tab-btn${isActive ? " is-active" : ""}`}
            style={{
              background: isActive ? `linear-gradient(135deg,${C.gold},${C.accent})` : undefined,
              border: "none",
              padding: "9px 13px",
              borderRadius: 11,
              cursor: "pointer",
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontWeight: isActive ? 700 : 400,
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {ok && <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green }} />}
            {isError && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#e74c3c" }} />}
            {isLoading && <span className="spin" style={{ width: 6, height: 6, borderRadius: "50%", background: C.gold, display: "inline-block" }} />}
          </button>
        );
      })}
    </div>
  );
}
