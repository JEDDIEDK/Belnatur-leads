import { profiles } from "@/lib/demo-data";
import { SettingsManager } from "@/components/settings-manager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
      <SettingsManager />

      <Card>
        <CardHeader>
          <CardTitle>Bruger- og medarbejderstyring</CardTitle>
          <CardDescription>Roller, aktive brugere og ansvarlige leads.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {profiles.map((profile) => (
            <div key={profile.id} className="rounded-[1.5rem] border bg-white/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{profile.full_name}</p>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{profile.role}</Badge>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {profile.active ? "Aktiv" : "Deaktiveret"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
