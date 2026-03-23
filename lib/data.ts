import { endOfWeek, format, isSameDay, isThisWeek, startOfWeek } from "date-fns";
import { da } from "date-fns/locale";
import { campaigns, leads, notifications, profiles } from "@/lib/demo-data";
import type { DashboardKpi, LeadStatus, LeadWithRelations, Profile } from "@/types";

export function getSessionUser(): Profile {
  return profiles[0];
}

export function getLeads() {
  return leads;
}

export function getLeadById(id: string) {
  return leads.find((lead) => lead.id === id);
}

export function getNotifications() {
  return notifications;
}

export function getDashboardKpis(): DashboardKpi[] {
  const today = new Date("2026-03-23T10:15:00");
  const newToday = leads.filter((lead) => isSameDay(lead.created_at, today)).length;
  const thisWeek = leads.filter((lead) => isThisWeek(lead.created_at, { weekStartsOn: 1 })).length;
  const countByStatus = (status: LeadStatus) => leads.filter((lead) => lead.status === status).length;
  const withoutFollowUp = leads.filter(
    (lead) => !lead.reminder_at && !["Solgt", "Tabt"].includes(lead.status)
  ).length;

  return [
    { label: "Nye leads i dag", value: String(newToday), delta: "+18% mod i går" },
    { label: "Leads denne uge", value: String(thisWeek), delta: "+12% mod sidste uge" },
    { label: "Kontaktede", value: String(countByStatus("Kontaktet")), delta: "Stabil respons" },
    { label: "Bookede", value: String(countByStatus("Booket")), delta: "+2 denne uge" },
    { label: "Tabte", value: String(countByStatus("Tabt")), delta: "1 flere end normalt" },
    { label: "Uden opfølgning", value: String(withoutFollowUp), delta: "Kræver opmærksomhed" }
  ];
}

export function getLeadVolumeSeries() {
  const weekStart = startOfWeek(new Date("2026-03-23T10:15:00"), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date("2026-03-23T10:15:00"), { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, index) => new Date(weekStart.getTime() + index * 86400000));

  return days
    .filter((day) => day <= weekEnd)
    .map((day) => ({
      day: format(day, "EEE", { locale: da }),
      leads: leads.filter((lead) => isSameDay(new Date(lead.created_at), day)).length + (day.getDay() === 1 ? 1 : 0)
    }));
}

export function getCampaignPerformance() {
  return campaigns.map((campaign) => {
    const campaignLeads = leads.filter((lead) => lead.campaign_id === campaign.id);
    const booked = campaignLeads.filter((lead) => ["Booket", "Solgt"].includes(lead.status)).length;
    return {
      name: campaign.name,
      leads: campaignLeads.length,
      booked,
      conversion: campaignLeads.length ? (booked / campaignLeads.length) * 100 : 0
    };
  });
}

export function getUpcomingReminders() {
  return leads
    .filter((lead) => lead.reminder_at)
    .sort((a, b) => new Date(a.reminder_at!).getTime() - new Date(b.reminder_at!).getTime())
    .slice(0, 5);
}

export function getLatestLeads() {
  return [...leads]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);
}

export function exportableLeadRows(items: LeadWithRelations[]) {
  return items.map((lead) => ({
    navn: lead.full_name,
    telefon: lead.phone,
    mail: lead.email,
    kampagne: lead.campaign.name,
    formular: lead.lead_form.name,
    status: lead.status,
    medarbejder: lead.assignee.full_name,
    naeste_handling: lead.next_action,
    reminder: lead.reminder_at ?? ""
  }));
}
