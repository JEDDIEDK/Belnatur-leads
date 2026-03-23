import { statusStyles } from "@/lib/constants";
import type { LeadStatus } from "@/types";
import { cn } from "@/lib/utils";

export function StatusBadge({ status, className }: { status: LeadStatus; className?: string }) {
  const style = statusStyles[status] ?? {
    label: status,
    className: "bg-primary/10 text-primary border-primary/20",
    icon: statusStyles["Nyt lead"].icon
  };
  const Icon = style.icon;

  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium", style.className, className)}>
      <Icon className="h-3.5 w-3.5" />
      {style.label}
    </span>
  );
}
