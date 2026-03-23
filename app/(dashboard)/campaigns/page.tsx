import { formatPercent } from "@/lib/utils";
import { getCampaignPerformance } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CampaignsPage() {
  const campaigns = getCampaignPerformance();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Kampagneoversigt</CardTitle>
          <CardDescription>Antal leads, bookinger og konvertering fordelt på kampagner og formularer.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {campaigns.map((campaign) => (
            <div key={campaign.name} className="rounded-[1.75rem] border bg-white/60 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-foreground">{campaign.name}</p>
                  <p className="text-sm text-muted-foreground">Meta Ads · premium leadform performance</p>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <Metric label="Leads" value={String(campaign.leads)} />
                  <Metric label="Bookede" value={String(campaign.booked)} />
                  <Metric label="Konvertering" value={formatPercent(campaign.conversion)} />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-background/70 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-serif text-3xl">{value}</p>
    </div>
  );
}
