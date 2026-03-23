import { ArrowUpRight } from "lucide-react";
import type { DashboardKpi } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

export function KpiCard({ item }: { item: DashboardKpi }) {
  return (
    <Card className="min-h-32">
      <CardContent className="flex h-full flex-col justify-between p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{item.label}</p>
          <div className="rounded-full bg-accent/60 p-2 text-primary">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
        <div>
          <p className="font-serif text-4xl text-foreground">{item.value}</p>
          <p className="mt-2 text-sm text-muted-foreground">{item.delta}</p>
        </div>
      </CardContent>
    </Card>
  );
}
