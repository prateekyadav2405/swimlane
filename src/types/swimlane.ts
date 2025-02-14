export interface Block {
  id: string;
  title: string;
  description: string;
  state: string;
  attributes: Record<string, string>;
  transitions?: Transition[];
  created_by_email?: { email: string };
  updated_by_email?: { email: string };
  created_at?: string;
  updated_at?: string;
  completionDate?: string;
  reviewer?: string;
  startDate?: string;
}

export interface Transition {
  id: string;
  fromState: string;
  toState: string;
  timestamp: string;
  data: Record<string, string>;
}

export interface Lane {
  id: string;
  title: string;
  allowedTransitionsTo: string[];
  requiredFields: {
    name: string;
    label: string;
    type: "text" | "select" | "date";
    options?: string[];
  }[];
}

export interface SwimlaneConfig {
  lanes: Lane[];
}
