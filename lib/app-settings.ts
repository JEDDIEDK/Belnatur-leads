import type { Profile, UserRole } from "@/types";

export interface NotificationSettings {
  newLead: boolean;
  reminderDue: boolean;
  statusChanged: boolean;
  leadAssigned: boolean;
  emailNotifications: boolean;
}

export interface NotificationLabels {
  newLead: string;
  reminderDue: string;
  statusChanged: string;
  leadAssigned: string;
  emailNotifications: string;
}

export interface AppSettings {
  statuses: string[];
  statusColors: Record<string, string>;
  nextActions: string[];
  notifications: NotificationSettings;
  notificationLabels: NotificationLabels;
  customUsers: Profile[];
}

export const SETTINGS_STORAGE_KEY = "belnatur-app-settings";

export const defaultAppSettings: AppSettings = {
  statuses: [
    "Nyt lead",
    "Ikke kontaktet",
    "Kontaktet",
    "Afventer svar",
    "Booket",
    "Solgt",
    "Tabt"
  ],
  statusColors: {
    "Nyt lead": "amber",
    "Ikke kontaktet": "sand",
    Kontaktet: "teal",
    "Afventer svar": "bronze",
    Booket: "sage",
    Solgt: "emerald",
    Tabt: "rose"
  },
  nextActions: ["Ring op", "Send sms", "Send mail", "Book behandling", "Folg op senere"],
  notifications: {
    newLead: true,
    reminderDue: true,
    statusChanged: true,
    leadAssigned: true,
    emailNotifications: false
  },
  notificationLabels: {
    newLead: "Nyt lead",
    reminderDue: "Reminder udløber",
    statusChanged: "Status ændret",
    leadAssigned: "Lead tildelt",
    emailNotifications: "E-mail notifikationer"
  },
  customUsers: []
};

export function normalizeSettings(input: Partial<AppSettings> | null | undefined): AppSettings {
  return {
    statuses: sanitizeList(input?.statuses, defaultAppSettings.statuses),
    statusColors: normalizeStatusColors(input?.statusColors),
    nextActions: sanitizeList(input?.nextActions, defaultAppSettings.nextActions),
    notifications: {
      ...defaultAppSettings.notifications,
      ...(input?.notifications ?? {})
    },
    notificationLabels: {
      ...defaultAppSettings.notificationLabels,
      ...(input?.notificationLabels ?? {})
    },
    customUsers: normalizeUsers(input?.customUsers)
  };
}

function sanitizeList(input: string[] | undefined, fallback: string[]) {
  if (!input?.length) return fallback;

  const cleaned = input
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item, index, array) => array.indexOf(item) === index);

  return cleaned.length ? cleaned : fallback;
}

function normalizeUsers(input: Profile[] | undefined) {
  if (!input?.length) return [];

  return input.map((user) => ({
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    role: (user.role as UserRole) ?? "medarbejder",
    created_at: user.created_at,
    active: Boolean(user.active)
  }));
}

function normalizeStatusColors(input: Record<string, string> | undefined) {
  return {
    ...defaultAppSettings.statusColors,
    ...(input ?? {})
  };
}
