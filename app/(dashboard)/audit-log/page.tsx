import { format } from "date-fns";
import { da } from "date-fns/locale";
import { requireAdmin } from "@/lib/auth";
import { leads } from "@/lib/demo-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AuditLogPage() {
  await requireAdmin();

  const entries = leads
    .flatMap((lead) =>
      lead.activities.map((activity) => ({
        ...activity,
        leadName: lead.full_name
      }))
    )
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hændelseslog</CardTitle>
        <CardDescription>Denne side er kun synlig for admins og viser hvem der gjorde hvad og hvornår.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {entries.map((entry) => (
          <div key={entry.id} className="rounded-[1.5rem] border bg-white/60 p-5">
            <p className="font-medium text-foreground">{entry.description}</p>
            <p className="mt-2 text-sm text-muted-foreground">Lead: {entry.leadName}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {format(new Date(entry.created_at), "d. MMM yyyy, HH:mm", { locale: da })}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
