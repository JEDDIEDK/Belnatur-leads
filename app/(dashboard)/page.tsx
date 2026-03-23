import { format } from "date-fns";
import { da } from "date-fns/locale";
import { ArrowRight, CalendarClock, Sparkles } from "lucide-react";
import { CampaignChart, VolumeChart } from "@/components/chart-card";
import { KpiCard } from "@/components/kpi-card";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCampaignPerformance, getDashboardKpis, getLatestLeads, getSessionUser, getUpcomingReminders } from "@/lib/data";

export default function DashboardPage() {
  const user = getSessionUser();
  const kpis = getDashboardKpis();
  const performance = getCampaignPerformance();
  const latest = getLatestLeads();
  const reminders = getUpcomingReminders();

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-[2rem] p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge className="mb-4 bg-white/70 text-primary">Lead Atelier · {user.full_name}</Badge>
            <h1 className="font-serif text-5xl leading-none text-foreground md:text-6xl">
              Et roligt overblik over dagens vigtigste opfølgninger.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Dashboardet prioriterer nye leads, reminders og kampagnekvalitet, så teamet kan arbejde hurtigt uden admin-støj.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-white/40 bg-white/65 p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Fokus i dag</p>
            <p className="mt-3 text-sm text-foreground">3 leads bør kontaktes inden kl. 14:00 for højeste bookingrate.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {kpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <VolumeChart data={[
          { day: "man", leads: 3 },
          { day: "tir", leads: 2 },
          { day: "ons", leads: 5 },
          { day: "tor", leads: 4 },
          { day: "fre", leads: 6 },
          { day: "lør", leads: 2 },
          { day: "søn", leads: 1 }
        ]} />
        <CampaignChart data={performance} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Seneste leads</CardTitle>
              <CardDescription>De nyeste henvendelser, klar til første kontakt.</CardDescription>
            </div>
            <Button variant="ghost">Se alle <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {latest.map((lead) => (
              <div key={lead.id} className="flex flex-col gap-3 rounded-[1.5rem] border border-border/70 bg-white/60 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-foreground">{lead.full_name}</p>
                  <p className="text-sm text-muted-foreground">{lead.campaign.name} · {lead.lead_form.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={lead.status} />
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {format(new Date(lead.created_at), "d. MMM, HH:mm", { locale: da })}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kommende reminders</CardTitle>
            <CardDescription>Vises også som in-app notifikationer og kan senere udvides med e-mail.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {reminders.map((lead) => (
              <div key={lead.id} className="rounded-[1.5rem] border border-border/70 bg-white/60 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">{lead.full_name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{lead.next_action} · {lead.assignee.full_name}</p>
                  </div>
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarClock className="h-4 w-4" />
                  {lead.reminder_at ? format(new Date(lead.reminder_at), "d. MMM yyyy, HH:mm", { locale: da }) : "Ingen reminder"}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
