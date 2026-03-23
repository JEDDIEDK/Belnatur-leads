"use client";

import { format } from "date-fns";
import { da } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CalendarClock, Mail, Phone, UserRound } from "lucide-react";
import { useAuditLog } from "@/hooks/use-audit-log";
import type { LeadWithRelations } from "@/types";
import { useAppSettings } from "@/hooks/use-app-settings";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/status-badge";

const formSchema = z.object({
  status: z.string(),
  notes: z.string().min(2),
  next_action: z.string(),
  reminder_at: z.string().optional(),
  assigned_to: z.string()
});

export function LeadDetailDrawer({
  lead,
  employees,
  actorName
}: {
  lead: LeadWithRelations;
  employees: { id: string; full_name: string }[];
  actorName: string;
}) {
  const { settings } = useAppSettings();
  const { log } = useAuditLog();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: lead.status,
      notes: lead.notes,
      next_action: lead.next_action,
      reminder_at: lead.reminder_at ? lead.reminder_at.slice(0, 16) : "",
      assigned_to: lead.assigned_to
    }
  });

  const onSubmit = form.handleSubmit((values) => {
    toast.success("Lead opdateret", {
      description: "Ændringerne er gemt i demo-mode og klar til Supabase integration."
    });
    log({
      actor: actorName,
      action: "Lead opdateret",
      context: `${lead.full_name} · ${values.status} · ${values.next_action}`
    });
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Åbn</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{lead.full_name}</DialogTitle>
          <DialogDescription>{lead.campaign.name} · {lead.lead_form.name}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="grid gap-3 rounded-[1.75rem] border bg-white/70 p-5 sm:grid-cols-2">
              <InfoItem icon={Phone} label="Telefon" value={lead.phone} />
              <InfoItem icon={Mail} label="E-mail" value={lead.email} />
              <InfoItem icon={CalendarClock} label="Oprettet" value={format(new Date(lead.created_at), "d. MMM yyyy, HH:mm", { locale: da })} />
              <InfoItem icon={UserRound} label="Ansvarlig" value={lead.assignee.full_name} />
            </div>

            <div className="rounded-[1.75rem] border bg-white/70 p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl">Aktivitetslog</h3>
                <StatusBadge status={lead.status} />
              </div>
              <div className="mt-4 space-y-3">
                {lead.activities.map((activity) => (
                  <div key={activity.id} className="rounded-2xl border border-border/70 bg-background/70 p-4">
                    <p className="text-sm text-foreground">{activity.description}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {format(new Date(activity.created_at), "d. MMM yyyy, HH:mm", { locale: da })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <form className="space-y-4 rounded-[1.75rem] border bg-white/70 p-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select defaultValue={lead.status} onValueChange={(value) => form.setValue("status", value)}>
                <SelectTrigger><SelectValue placeholder="Vælg status" /></SelectTrigger>
                <SelectContent>
                  {settings.statuses.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Næste handling</Label>
              <Select defaultValue={lead.next_action} onValueChange={(value) => form.setValue("next_action", value)}>
                <SelectTrigger><SelectValue placeholder="Vælg handling" /></SelectTrigger>
                <SelectContent>
                  {settings.nextActions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Reminder</Label>
              <Input type="datetime-local" {...form.register("reminder_at")} />
            </div>

            <div className="space-y-2">
              <Label>Ansvarlig medarbejder</Label>
              <Select defaultValue={lead.assigned_to} onValueChange={(value) => form.setValue("assigned_to", value)}>
                <SelectTrigger><SelectValue placeholder="Vælg medarbejder" /></SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>{employee.full_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Interne noter</Label>
              <Textarea {...form.register("notes")} />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="submit">Gem ændringer</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  {
                    toast.success("Lead markeret som kontaktet", {
                      description: "Statusændringen er registreret i demo-flowet."
                    });
                    log({ actor: actorName, action: "Lead markeret som kontaktet", context: lead.full_name });
                  }
                }
              >
                Marker som kontaktet
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function LeadDetailDrawerCard({
  lead,
  employees,
  actorName,
  children
}: {
  lead: LeadWithRelations;
  employees: { id: string; full_name: string }[];
  actorName: string;
  children: React.ReactNode;
}) {
  const { settings } = useAppSettings();
  const { log } = useAuditLog();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: lead.status,
      notes: lead.notes,
      next_action: lead.next_action,
      reminder_at: lead.reminder_at ? lead.reminder_at.slice(0, 16) : "",
      assigned_to: lead.assigned_to
    }
  });

  const onSubmit = form.handleSubmit((values) => {
    toast.success("Lead opdateret", {
      description: "Ændringerne er gemt i demo-mode og klar til Supabase integration."
    });
    log({
      actor: actorName,
      action: "Lead opdateret",
      context: `${lead.full_name} · ${values.status} · ${values.next_action}`
    });
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{lead.full_name}</DialogTitle>
          <DialogDescription>{lead.campaign.name} · {lead.lead_form.name}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="grid gap-3 rounded-[1.75rem] border bg-white/70 p-5 sm:grid-cols-2">
              <InfoItem icon={Phone} label="Telefon" value={lead.phone} />
              <InfoItem icon={Mail} label="E-mail" value={lead.email} />
              <InfoItem icon={CalendarClock} label="Oprettet" value={format(new Date(lead.created_at), "d. MMM yyyy, HH:mm", { locale: da })} />
              <InfoItem icon={UserRound} label="Ansvarlig" value={lead.assignee.full_name} />
            </div>

            <div className="rounded-[1.75rem] border bg-white/70 p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl">Aktivitetslog</h3>
                <StatusBadge status={lead.status} />
              </div>
              <div className="mt-4 space-y-3">
                {lead.activities.map((activity) => (
                  <div key={activity.id} className="rounded-2xl border border-border/70 bg-background/70 p-4">
                    <p className="text-sm text-foreground">{activity.description}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {format(new Date(activity.created_at), "d. MMM yyyy, HH:mm", { locale: da })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <form className="space-y-4 rounded-[1.75rem] border bg-white/70 p-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select defaultValue={lead.status} onValueChange={(value) => form.setValue("status", value)}>
                <SelectTrigger><SelectValue placeholder="Vælg status" /></SelectTrigger>
                <SelectContent>
                  {settings.statuses.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Næste handling</Label>
              <Select defaultValue={lead.next_action} onValueChange={(value) => form.setValue("next_action", value)}>
                <SelectTrigger><SelectValue placeholder="Vælg handling" /></SelectTrigger>
                <SelectContent>
                  {settings.nextActions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Reminder</Label>
              <Input type="datetime-local" {...form.register("reminder_at")} />
            </div>

            <div className="space-y-2">
              <Label>Ansvarlig medarbejder</Label>
              <Select defaultValue={lead.assigned_to} onValueChange={(value) => form.setValue("assigned_to", value)}>
                <SelectTrigger><SelectValue placeholder="Vælg medarbejder" /></SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>{employee.full_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Interne noter</Label>
              <Textarea {...form.register("notes")} />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="submit">Gem ændringer</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  {
                    toast.success("Lead markeret som kontaktet", {
                      description: "Statusændringen er registreret i demo-flowet."
                    });
                    log({ actor: actorName, action: "Lead markeret som kontaktet", context: lead.full_name });
                  }
                }
              >
                Marker som kontaktet
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs uppercase tracking-[0.2em]">{label}</span>
      </div>
      <p className="mt-3 text-sm text-foreground">{value}</p>
    </div>
  );
}
