import { BellRing, BookHeart, CircleDashed, Clock3, PhoneCall, Sparkles, XCircle } from "lucide-react";
import type { LeadStatus, NextActionType } from "@/types";

export const leadStatuses: LeadStatus[] = [
  "Nyt lead",
  "Ikke kontaktet",
  "Kontaktet",
  "Afventer svar",
  "Booket",
  "Solgt",
  "Tabt"
];

export const statusStyles: Record<
  LeadStatus,
  { label: string; className: string; icon: typeof Sparkles }
> = {
  "Nyt lead": {
    label: "Nyt lead",
    className: "bg-status-new/15 text-status-new border-status-new/20",
    icon: Sparkles
  },
  "Ikke kontaktet": {
    label: "Ikke kontaktet",
    className: "bg-status-pending/15 text-status-pending border-status-pending/20",
    icon: CircleDashed
  },
  Kontaktet: {
    label: "Kontaktet",
    className: "bg-status-contacted/15 text-status-contacted border-status-contacted/20",
    icon: PhoneCall
  },
  "Afventer svar": {
    label: "Afventer svar",
    className: "bg-status-waiting/15 text-status-waiting border-status-waiting/20",
    icon: Clock3
  },
  Booket: {
    label: "Booket",
    className: "bg-status-booked/15 text-status-booked border-status-booked/20",
    icon: BookHeart
  },
  Solgt: {
    label: "Solgt",
    className: "bg-status-won/15 text-status-won border-status-won/20",
    icon: BellRing
  },
  Tabt: {
    label: "Tabt",
    className: "bg-status-lost/15 text-status-lost border-status-lost/20",
    icon: XCircle
  }
};

export const nextActionOptions: NextActionType[] = [
  "Ring op",
  "Send sms",
  "Send mail",
  "Book behandling",
  "Folg op senere"
];
