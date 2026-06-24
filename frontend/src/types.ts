export type TabId =
  | "overview"
  | "market"
  | "operations"
  | "marketing"
  | "financials"
  | "action"
  | "pitchdeck";

export interface FormData {
  business: string;
  location: string;
  audience: string;
  budget: string;
  edge: string;
}

export interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

export interface Question {
  id: keyof FormData;
  req: boolean;
  label: string;
  ph: string;
}
