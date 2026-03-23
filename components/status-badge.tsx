"use client";

import { useAppSettings } from "@/hooks/use-app-settings";
import { statusStyles } from "@/lib/constants";
import { statusColorPresets, type StatusColorPreset } from "@/lib/status-colors";
import type { LeadStatus } from "@/types";
import { cn } from "@/lib/utils";

export function StatusBadge({ status, className }: { status: LeadStatus; className?: string }) {
  const { settings } = useAppSettings();
  const presetKey = (settings.statusColors[status] as StatusColorPreset | undefined) ?? null;
  const style = statusStyles[status] ?? {
    label: status,
    className: "bg-primary/10 text-primary border-primary/20",
    icon: statusStyles["Nyt lead"].icon
  };
  const Icon = style.icon;
  const colorClassName = presetKey ? statusColorPresets[presetKey]?.className : style.className;

  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium", colorClassName, className)}>
      <Icon className="h-3.5 w-3.5" />
      {style.label}
    </span>
  );
}
