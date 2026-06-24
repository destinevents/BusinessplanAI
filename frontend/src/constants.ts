import type { Tab, Question } from "./types";

export const C = {
  bg: "#EDE0CC",
  card: "#FAF4E8",
  border: "#DDD0B0",
  brown: "#2C1A0E",
  mid: "#7A4A18",
  light: "#B89060",
  gold: "#C9A84C",
  accent: "#B87A30",
  dark: "#160802",
  green: "#27ae60",
} as const;

export const TABS: Tab[] = [
  { id: "overview",   label: "Overview",    icon: "🏢" },
  { id: "market",     label: "Market",      icon: "📊" },
  { id: "operations", label: "Operations",  icon: "⚙️"  },
  { id: "marketing",  label: "Marketing",   icon: "📣" },
  { id: "financials", label: "Financials",  icon: "💰" },
  { id: "action",     label: "Action Plan", icon: "🗓️" },
  { id: "pitchdeck",  label: "Pitch Deck",  icon: "🎯" },
];

export const QUESTIONS: Question[] = [
  { id: "business", req: true,  label: "Anong klase ng negosyo ang gusto mong simulan?", ph: "e.g. milk tea shop, online bakery, carwash, tutoring center..." },
  { id: "location", req: true,  label: "Saan mo ito itatayo o ilulunsad?",               ph: "e.g. Baguio City, online (Philippines-wide), Quezon City..." },
  { id: "audience", req: true,  label: "Sino ang iyong target customers?",               ph: "e.g. college students, families, working professionals..." },
  { id: "budget",   req: true,  label: "Magkano ang startup budget mo? (PHP)",           ph: "e.g. ₱10,000  ·  ₱50,000  ·  ₱200,000..." },
  { id: "edge",     req: false, label: "Ano ang magiging special sa iyong negosyo?",     ph: "e.g. mas mura, eco-friendly, may delivery... (optional)" },
];
