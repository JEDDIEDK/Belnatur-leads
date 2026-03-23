"use client";

import { format } from "date-fns";
import { da } from "date-fns/locale";
import type { AuditLogEntry } from "@/lib/audit-log";
import { useAuditLog } from "@/hooks/use-audit-log";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AuditLogList({ initialEntries }: { initialEntries: AuditLogEntry[] }) {
  const { entries } = useAuditLog(initialEntries);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hændelseslog</CardTitle>
        <CardDescription>Denne side er kun synlig for admins og viser hvem der gjorde hvad og hvornår.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {entries.map((entry) => (
          <div key={entry.id} className="rounded-[1.5rem] border bg-white/60 p-5">
            <p className="font-medium text-foreground">{entry.action}</p>
            <p className="mt-2 text-sm text-muted-foreground">{entry.actor}</p>
            {entry.context ? <p className="mt-1 text-sm text-muted-foreground">{entry.context}</p> : null}
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {format(new Date(entry.created_at), "d. MMM yyyy, HH:mm", { locale: da })}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
