import { LeadsTable } from "@/components/leads-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLeads } from "@/lib/data";
import { profiles } from "@/lib/demo-data";

export default async function LeadsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const leads = getLeads();
  const initialQuery = params.q ?? "";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Alle leads</CardTitle>
          <CardDescription>Filtrer på status, kampagner og medarbejdere. Klik på et lead for alle detaljer og historik.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div className="rounded-[1.5rem] border bg-white/65 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Aktive leads</p>
            <p className="mt-2 font-serif text-4xl">{leads.filter((lead) => !["Solgt", "Tabt"].includes(lead.status)).length}</p>
          </div>
          <div className="rounded-[1.5rem] border bg-white/65 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Bookede</p>
            <p className="mt-2 font-serif text-4xl">{leads.filter((lead) => lead.status === "Booket").length}</p>
          </div>
          <div className="rounded-[1.5rem] border bg-white/65 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Ingen reminder</p>
            <p className="mt-2 font-serif text-4xl">{leads.filter((lead) => !lead.reminder_at).length}</p>
          </div>
          <div className="rounded-[1.5rem] border bg-white/65 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Teammedlemmer</p>
            <p className="mt-2 font-serif text-4xl">{profiles.filter((profile) => profile.active).length}</p>
          </div>
        </CardContent>
      </Card>

      <LeadsTable leads={leads} employees={profiles} initialQuery={initialQuery} />
    </div>
  );
}
