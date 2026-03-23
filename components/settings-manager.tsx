"use client";

import { useState } from "react";
import { BellRing, Check, Mail, Pencil, Plus, RotateCcw, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useAppSettings } from "@/hooks/use-app-settings";
import { statusColorPresets, type StatusColorPreset } from "@/lib/status-colors";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SettingsManager() {
  const { settings, ready, saveSettings, resetSettings } = useAppSettings();
  const [statusDraft, setStatusDraft] = useState("");
  const [actionDraft, setActionDraft] = useState("");
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [editingAction, setEditingAction] = useState<string | null>(null);
  const [editingNotification, setEditingNotification] = useState<keyof typeof settings.notificationLabels | null>(null);
  const [editDraft, setEditDraft] = useState("");

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
    const nextStatusColors = { ...settings.statusColors };

    Object.keys(nextStatusColors).forEach((key) => {
      if (!statuses.includes(key)) delete nextStatusColors[key];
    });

    statuses.forEach((status) => {
      if (!nextStatusColors[status]) {
        nextStatusColors[status] = "sand";
      }
    });

    saveSettings({ ...settings, statuses, statusColors: nextStatusColors });
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

  function renameStatus(previous: string, nextValue: string) {
    const next = nextValue.trim();
    if (!next || previous === next) {
      setEditingStatus(null);
      setEditDraft("");
      return;
    }
    if (settings.statuses.includes(next)) {
      toast.error("Den status findes allerede");
      return;
    }
    const statuses = settings.statuses.map((status) => (status === previous ? next : status));
    const statusColors = { ...settings.statusColors };
    statusColors[next] = statusColors[previous] ?? "sand";
    delete statusColors[previous];
    saveSettings({ ...settings, statuses, statusColors });
    setEditingStatus(null);
    setEditDraft("");
    toast.success("Status opdateret");
  }

  function renameAction(previous: string, nextValue: string) {
    const next = nextValue.trim();
    if (!next || previous === next) {
      setEditingAction(null);
      setEditDraft("");
      return;
    }
    if (settings.nextActions.includes(next)) {
      toast.error("Den handling findes allerede");
      return;
    }
    saveSettings({
      ...settings,
      nextActions: settings.nextActions.map((action) => (action === previous ? next : action))
    });
    setEditingAction(null);
    setEditDraft("");
    toast.success("Næste handling opdateret");
  }

  function renameNotificationLabel(
    key: keyof typeof settings.notificationLabels,
    nextValue: string
  ) {
    const next = nextValue.trim();
    if (!next) {
      setEditingNotification(null);
      setEditDraft("");
      return;
    }
    saveSettings({
      ...settings,
      notificationLabels: {
        ...settings.notificationLabels,
        [key]: next
      }
    });
    setEditingNotification(null);
    setEditDraft("");
    toast.success("Notifikationstekst opdateret");
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
          description="Tilpas hvilke statusser teamet kan vælge på leads, og vælg farve for hver status."
          items={settings.statuses}
          statusColors={settings.statusColors}
          editingItem={editingStatus}
          draft={statusDraft}
          setDraft={setStatusDraft}
          addItem={addStatus}
          removeItem={(item) => updateStatuses(settings.statuses.filter((status) => status !== item))}
          onStartEdit={(item) => {
            setEditingStatus(item);
            setEditDraft(item);
          }}
          onCancelEdit={() => {
            setEditingStatus(null);
            setEditDraft("");
          }}
          onSaveEdit={(item) => renameStatus(item, editDraft)}
          editDraft={editDraft}
          setEditDraft={setEditDraft}
          onColorChange={(item, color) =>
            saveSettings({
              ...settings,
              statusColors: {
                ...settings.statusColors,
                [item]: color
              }
            })
          }
          placeholder="Tilføj ny status"
        />

        <EditableSection
          title="Næste handlinger"
          description="Disse valgmuligheder bruges i lead-opfølgning og reminders."
          items={settings.nextActions}
          editingItem={editingAction}
          draft={actionDraft}
          setDraft={setActionDraft}
          addItem={addAction}
          removeItem={(item) => updateActions(settings.nextActions.filter((action) => action !== item))}
          onStartEdit={(item) => {
            setEditingAction(item);
            setEditDraft(item);
          }}
          onCancelEdit={() => {
            setEditingAction(null);
            setEditDraft("");
          }}
          onSaveEdit={(item) => renameAction(item, editDraft)}
          editDraft={editDraft}
          setEditDraft={setEditDraft}
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
              label={settings.notificationLabels.newLead}
              enabled={settings.notifications.newLead}
              onToggle={() => toggleNotification("newLead")}
              onStartEdit={() => {
                setEditingNotification("newLead");
                setEditDraft(settings.notificationLabels.newLead);
              }}
              isEditing={editingNotification === "newLead"}
              editDraft={editDraft}
              setEditDraft={setEditDraft}
              onSaveEdit={() => renameNotificationLabel("newLead", editDraft)}
              onCancelEdit={() => {
                setEditingNotification(null);
                setEditDraft("");
              }}
            />
            <NotificationToggle
              label={settings.notificationLabels.reminderDue}
              enabled={settings.notifications.reminderDue}
              onToggle={() => toggleNotification("reminderDue")}
              onStartEdit={() => {
                setEditingNotification("reminderDue");
                setEditDraft(settings.notificationLabels.reminderDue);
              }}
              isEditing={editingNotification === "reminderDue"}
              editDraft={editDraft}
              setEditDraft={setEditDraft}
              onSaveEdit={() => renameNotificationLabel("reminderDue", editDraft)}
              onCancelEdit={() => {
                setEditingNotification(null);
                setEditDraft("");
              }}
            />
            <NotificationToggle
              label={settings.notificationLabels.statusChanged}
              enabled={settings.notifications.statusChanged}
              onToggle={() => toggleNotification("statusChanged")}
              onStartEdit={() => {
                setEditingNotification("statusChanged");
                setEditDraft(settings.notificationLabels.statusChanged);
              }}
              isEditing={editingNotification === "statusChanged"}
              editDraft={editDraft}
              setEditDraft={setEditDraft}
              onSaveEdit={() => renameNotificationLabel("statusChanged", editDraft)}
              onCancelEdit={() => {
                setEditingNotification(null);
                setEditDraft("");
              }}
            />
            <NotificationToggle
              label={settings.notificationLabels.leadAssigned}
              enabled={settings.notifications.leadAssigned}
              onToggle={() => toggleNotification("leadAssigned")}
              onStartEdit={() => {
                setEditingNotification("leadAssigned");
                setEditDraft(settings.notificationLabels.leadAssigned);
              }}
              isEditing={editingNotification === "leadAssigned"}
              editDraft={editDraft}
              setEditDraft={setEditDraft}
              onSaveEdit={() => renameNotificationLabel("leadAssigned", editDraft)}
              onCancelEdit={() => {
                setEditingNotification(null);
                setEditDraft("");
              }}
            />
            <NotificationToggle
              label={settings.notificationLabels.emailNotifications}
              enabled={settings.notifications.emailNotifications}
              onToggle={() => toggleNotification("emailNotifications")}
              icon={<Mail className="h-4 w-4" />}
              onStartEdit={() => {
                setEditingNotification("emailNotifications");
                setEditDraft(settings.notificationLabels.emailNotifications);
              }}
              isEditing={editingNotification === "emailNotifications"}
              editDraft={editDraft}
              setEditDraft={setEditDraft}
              onSaveEdit={() => renameNotificationLabel("emailNotifications", editDraft)}
              onCancelEdit={() => {
                setEditingNotification(null);
                setEditDraft("");
              }}
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
  statusColors,
  editingItem,
  draft,
  setDraft,
  addItem,
  removeItem,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  editDraft,
  setEditDraft,
  onColorChange,
  placeholder
}: {
  title: string;
  description: string;
  items: string[];
  statusColors?: Record<string, string>;
  editingItem?: string | null;
  draft: string;
  setDraft: (value: string) => void;
  addItem: () => void;
  removeItem: (item: string) => void;
  onStartEdit?: (item: string) => void;
  onCancelEdit?: () => void;
  onSaveEdit?: (item: string) => void;
  editDraft?: string;
  setEditDraft?: (value: string) => void;
  onColorChange?: (item: string, color: StatusColorPreset) => void;
  placeholder: string;
}) {
  return (
    <div className="rounded-[1.5rem] border bg-white/60 p-5">
      <p className="font-medium text-foreground">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex flex-col gap-3 rounded-[1.25rem] border bg-white p-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              {editingItem === item && setEditDraft ? (
                <Input
                  value={editDraft}
                  onChange={(event) => setEditDraft(event.target.value)}
                  className="w-[220px]"
                />
              ) : (
                <Badge
                  variant="outline"
                  className={statusColors ? statusColorPresets[(statusColors[item] as StatusColorPreset) ?? "sand"].className : ""}
                >
                  {item}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {statusColors && onColorChange ? (
                <Select
                  value={(statusColors[item] as StatusColorPreset) ?? "sand"}
                  onValueChange={(value) => onColorChange(item, value as StatusColorPreset)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Farve" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusColorPresets).map(([key, preset]) => (
                      <SelectItem key={key} value={key}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : null}
              {editingItem === item ? (
                <>
                  <button type="button" onClick={() => onSaveEdit?.(item)} className="text-muted-foreground hover:text-foreground">
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={onCancelEdit} className="text-muted-foreground hover:text-foreground">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </>
              ) : (
                <button type="button" onClick={() => onStartEdit?.(item)} className="text-muted-foreground hover:text-foreground">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
              <button type="button" onClick={() => removeItem(item)} className="text-muted-foreground hover:text-foreground">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
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
  icon,
  onStartEdit,
  isEditing,
  editDraft,
  setEditDraft,
  onSaveEdit,
  onCancelEdit
}: {
  label: string;
  enabled: boolean;
  onToggle: () => void;
  icon?: React.ReactNode;
  onStartEdit: () => void;
  isEditing: boolean;
  editDraft: string;
  setEditDraft: (value: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
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
        {isEditing ? (
          <Input
            value={editDraft}
            onChange={(event) => setEditDraft(event.target.value)}
            onClick={(event) => event.stopPropagation()}
            className="w-[190px]"
          />
        ) : (
          label
        )}
      </span>
      <span className="flex items-center gap-2">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onSaveEdit();
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onCancelEdit();
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onStartEdit();
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
        <span className={`rounded-full px-2 py-1 text-xs ${enabled ? "bg-primary text-white" : "bg-white text-muted-foreground"}`}>
          {enabled ? "Til" : "Fra"}
        </span>
      </span>
    </button>
  );
}
