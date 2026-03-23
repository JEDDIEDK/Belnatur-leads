export type UserRole = "admin" | "medarbejder";

export type LeadStatus =
  | "Nyt lead"
  | "Ikke kontaktet"
  | "Kontaktet"
  | "Afventer svar"
  | "Booket"
  | "Solgt"
  | "Tabt";

export type NextActionType =
  | "Ring op"
  | "Send sms"
  | "Send mail"
  | "Book behandling"
  | "Folg op senere";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  created_at: string;
  active: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  source: string;
  created_at: string;
}

export interface LeadForm {
  id: string;
  name: string;
  campaign_id: string;
  created_at: string;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  user_id: string;
  type: "status" | "note" | "assignment" | "reminder" | "import" | "booking";
  description: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface Lead {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  campaign_id: string;
  lead_form_id: string;
  created_at: string;
  status: LeadStatus;
  notes: string;
  next_action: NextActionType;
  reminder_at: string | null;
  assigned_to: string;
  meta_lead_id: string;
  raw_payload: Record<string, unknown>;
}

export interface LeadWithRelations extends Lead {
  campaign: Campaign;
  lead_form: LeadForm;
  assignee: Profile;
  activities: LeadActivity[];
}

export interface DashboardKpi {
  label: string;
  value: string;
  delta: string;
}
