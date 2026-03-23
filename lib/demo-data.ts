import { addDays, addHours, subDays } from "date-fns";
import type {
  Campaign,
  LeadActivity,
  LeadForm,
  LeadStatus,
  LeadWithRelations,
  NotificationItem,
  Profile
} from "@/types";

const now = new Date("2026-03-23T10:15:00");

export const profiles: Profile[] = [
  {
    id: "profile-1",
    full_name: "Sofie Larsen",
    email: "sofie@belnatur.dk",
    role: "admin",
    created_at: subDays(now, 120).toISOString(),
    active: true
  },
  {
    id: "profile-2",
    full_name: "Camilla Madsen",
    email: "camilla@belnatur.dk",
    role: "medarbejder",
    created_at: subDays(now, 75).toISOString(),
    active: true
  },
  {
    id: "profile-3",
    full_name: "Laura Holm",
    email: "laura@belnatur.dk",
    role: "medarbejder",
    created_at: subDays(now, 40).toISOString(),
    active: false
  }
];

export const campaigns: Campaign[] = [
  { id: "camp-1", name: "Hydra Glow Spring", source: "Meta Ads", created_at: subDays(now, 28).toISOString() },
  { id: "camp-2", name: "Lip Balance Signature", source: "Meta Ads", created_at: subDays(now, 18).toISOString() },
  { id: "camp-3", name: "Skin Reset Consultation", source: "Meta Ads", created_at: subDays(now, 12).toISOString() }
];

export const leadForms: LeadForm[] = [
  { id: "form-1", name: "Gratis hudanalyse", campaign_id: "camp-1", created_at: subDays(now, 28).toISOString() },
  { id: "form-2", name: "Eksklusiv konsultation", campaign_id: "camp-2", created_at: subDays(now, 18).toISOString() },
  { id: "form-3", name: "Spring refresh venteliste", campaign_id: "camp-3", created_at: subDays(now, 12).toISOString() }
];

function leadStatus(index: number): LeadStatus[] {
  return [
    "Nyt lead",
    "Ikke kontaktet",
    "Kontaktet",
    "Afventer svar",
    "Booket",
    "Solgt",
    "Tabt"
  ].slice(index, index + 1) as LeadStatus[];
}

const leadsBase = [
  ["lead-1", "Emma Nørgaard", "+4522334455", "emma@example.com", "camp-1", "form-1", 0, "Nyt lead", "Ring op", "profile-2"],
  ["lead-2", "Julie Andersen", "+4522667788", "julie@example.com", "camp-2", "form-2", 1, "Ikke kontaktet", "Send sms", "profile-2"],
  ["lead-3", "Freja Mikkelsen", "+4522991133", "freja@example.com", "camp-1", "form-1", 2, "Kontaktet", "Send mail", "profile-1"],
  ["lead-4", "Clara Jensen", "+4522110099", "clara@example.com", "camp-3", "form-3", 3, "Afventer svar", "Folg op senere", "profile-2"],
  ["lead-5", "Ida Brix", "+4522558866", "ida@example.com", "camp-2", "form-2", 4, "Booket", "Book behandling", "profile-1"],
  ["lead-6", "Alma Friis", "+4522446655", "alma@example.com", "camp-3", "form-3", 5, "Solgt", "Book behandling", "profile-1"],
  ["lead-7", "Mille Lund", "+4522229988", "mille@example.com", "camp-1", "form-1", 6, "Tabt", "Folg op senere", "profile-2"],
  ["lead-8", "Olivia Mogensen", "+4522331188", "olivia@example.com", "camp-3", "form-3", 0.3, "Nyt lead", "Ring op", "profile-2"]
] as const;

export const leads: LeadWithRelations[] = leadsBase.map((lead, index) => {
  const [id, full_name, phone, email, campaign_id, lead_form_id, daysAgo, status, next_action, assigned_to] = lead;
  const createdAt = addHours(subDays(now, Number(daysAgo)), index + 1).toISOString();
  const reminderAt =
    status === "Booket" || status === "Solgt" || status === "Tabt"
      ? null
      : addDays(new Date(createdAt), 1).toISOString();
  const campaign = campaigns.find((item) => item.id === campaign_id)!;
  const lead_form = leadForms.find((item) => item.id === lead_form_id)!;
  const assignee = profiles.find((item) => item.id === assigned_to)!;
  const activities: LeadActivity[] = [
    {
      id: `${id}-act-1`,
      lead_id: id,
      user_id: assigned_to,
      type: "import",
      description: "Lead importeret fra Meta lead ad webhook placeholder.",
      created_at: createdAt
    },
    {
      id: `${id}-act-2`,
      lead_id: id,
      user_id: assigned_to,
      type: "assignment",
      description: `${assignee.full_name} blev sat som ansvarlig medarbejder.`,
      created_at: addHours(new Date(createdAt), 2).toISOString()
    }
  ];

  return {
    id,
    full_name,
    phone,
    email,
    campaign_id,
    lead_form_id,
    created_at: createdAt,
    status: status as LeadStatus,
    notes:
      status === "Nyt lead"
        ? "Har udfyldt formularen via mobilannonce. Foretrak kontakt efter kl. 15."
        : "Virker meget interesseret i et roligt, personligt konsultationsforløb.",
    next_action: next_action as LeadWithRelations["next_action"],
    reminder_at: reminderAt,
    assigned_to,
    meta_lead_id: `meta-${id}`,
    raw_payload: { source: "meta", ad_id: `ad-${index + 11}` },
    campaign,
    lead_form,
    assignee,
    activities
  };
});

export const notifications: NotificationItem[] = [
  {
    id: "notif-1",
    user_id: "profile-1",
    title: "Nyt lead fra Hydra Glow Spring",
    message: "Emma Nørgaard kom ind for 12 minutter siden.",
    read: false,
    created_at: addHours(now, -1).toISOString()
  },
  {
    id: "notif-2",
    user_id: "profile-1",
    title: "Reminder udløber snart",
    message: "Clara Jensen skal følges op i dag kl. 14:30.",
    read: false,
    created_at: addHours(now, -3).toISOString()
  },
  {
    id: "notif-3",
    user_id: "profile-1",
    title: "Lead tildelt medarbejder",
    message: "Julie Andersen er tildelt Camilla Madsen.",
    read: true,
    created_at: subDays(now, 1).toISOString()
  }
];
