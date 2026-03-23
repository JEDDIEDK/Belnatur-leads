"use client";

import { useState } from "react";
import { BellRing, Mail, Plus, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAppSettings } from "@/hooks/use-app-settings";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function SettingsManager() {
  const { settings, ready, saveSettings, resetSettings } = useAppSettings();
  const [statusDraft, setStatusDraft] = useState("");
  const [actionDraft, setActionDraft] = useState("");

  if (!ready) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Systemindstillinger</CardTitle>
          <CardDescription>Indlæser gemte indstillinger...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  function updateStatuses(statuses: string[]) {
    saveSettings({ ...settings, statuses });
  }

  function updateActions(nextActions: string[]) {
    saveSettings({ ...settings, nextActions });
  }

  function addStatus() {
    const next = statusDraft.trim();
    if (!next) return;
    if (settings.statuses.includes(next)) {
      toast.error("Status findes allerede");
      return;
    }
    updateStatuses([...settings.statuses, next]);
    setStatusDraft("");
    toast.success("Status tilføjet");
  }

  function addAction() {
    const next = actionDraft.trim();
    if (!next) return;
    if (settings.nextActions.includes(next)) {
      toast.error("Handling findes allerede");
      return;
    }
    updateActions([...settings.nextActions, next]);
    setActionDraft("");
    toast.success("Næste handling tilføjet");
  }

  function toggleNotification(key: keyof typeof settings.notifications) {
    saveSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key]
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Systemindstillinger</CardTitle>
        <CardDescription>Admin kan finjustere statusser, handlinger, notifikationer og standardvisning.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <EditableSection
          title="Statusser"
          description="Tilpas hvilke statusser teamet kan vælge på leads."
          items={settings.statuses}
          draft={statusDraft}
          setDraft={setStatusDraft}
          addItem={addStatus}
          removeItem={(item) => updateStatuses(settings.statuses.filter((status) => status !== item))}
          placeholder="Tilføj ny status"
        />

        <EditableSection
          title="Næste handlinger"
          description="Disse valgmuligheder bruges i lead-opfølgning og reminders."
          items={settings.nextActions}
          draft={actionDraft}
          setDraft={setActionDraft}
          addItem={addAction}
          removeItem={(item) => updateActions(settings.nextActions.filter((action) => action !== item))}
          placeholder="Tilføj ny handling"
        />

        <div className="rounded-[1.5rem] border bg-white/60 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-foreground">Notifikationer</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Vælg hvilke hændelser der skal give in-app og senere e-mail-notifikationer.
              </p>
            </div>
            <BellRing className="h-5 w-5 text-primary" />
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <NotificationToggle
              label="Nyt lead"
              enabled={settings.notifications.newLead}
              onToggle={() => toggleNotification("newLead")}
            />
            <NotificationToggle
              label="Reminder udløber"
              enabled={settings.notifications.reminderDue}
              onToggle={() => toggleNotification("reminderDue")}
            />
            <NotificationToggle
              label="Status ændret"
              enabled={settings.notifications.statusChanged}
              onToggle={() => toggleNotification("statusChanged")}
            />
            <NotificationToggle
              label="Lead tildelt"
              enabled={settings.notifications.leadAssigned}
              onToggle={() => toggleNotification("leadAssigned")}
            />
            <NotificationToggle
              label="E-mail notifikationer"
              enabled={settings.notifications.emailNotifications}
              onToggle={() => toggleNotification("emailNotifications")}
              icon={<Mail className="h-4 w-4" />}
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={() => toast.success("Indstillinger gemt", { description: "Dine valg bruges nu i appens klient-side flow." })}
            >
              Gem præferencer
            </Button>
            <ThemeToggle />
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                resetSettings();
                toast.success("Indstillinger nulstillet");
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Gendan standard
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EditableSection({
  title,
  description,
  items,
  draft,
  setDraft,
  addItem,
  removeItem,
  placeholder
}: {
  title: string;
  description: string;
  items: string[];
  draft: string;
  setDraft: (value: string) => void;
  addItem: () => void;
  removeItem: (item: string) => void;
  placeholder: string;
}) {
  return (
    <div className="rounded-[1.5rem] border bg-white/60 p-5">
      <p className="font-medium text-foreground">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-sm">
            <Badge variant="outline">{item}</Badge>
            <button type="button" onClick={() => removeItem(item)} className="text-muted-foreground hover:text-foreground">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
      </div>
      <div className="mt-4 flex gap-3">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={placeholder}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addItem();
            }
          }}
        />
        <Button type="button" onClick={addItem}>
          <Plus className="mr-2 h-4 w-4" />
          Tilføj
        </Button>
      </div>
    </div>
  );
}

function NotificationToggle({
  label,
  enabled,
  onToggle,
  icon
}: {
  label: string;
  enabled: boolean;
  onToggle: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center justify-between rounded-[1.25rem] border p-4 text-left transition ${
        enabled ? "border-primary/20 bg-primary/5" : "border-border bg-background/40"
      }`}
    >
      <span className="flex items-center gap-2 text-sm font-medium text-foreground">
        {icon}
        {label}
      </span>
      <span className={`rounded-full px-2 py-1 text-xs ${enabled ? "bg-primary text-white" : "bg-white text-muted-foreground"}`}>
        {enabled ? "Til" : "Fra"}
      </span>
    </button>
  );
}
