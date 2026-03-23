import { profiles } from "@/lib/demo-data";
import { leadStatuses, nextActionOptions } from "@/lib/constants";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
      <Card>
        <CardHeader>
          <CardTitle>Systemindstillinger</CardTitle>
          <CardDescription>Admin kan finjustere statusser, handlinger, notifikationer og standardvisning.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Section title="Statusser" items={leadStatuses} />
          <Section title="Næste handlinger" items={nextActionOptions} />
          <div className="rounded-[1.5rem] border bg-white/60 p-5">
            <p className="font-medium text-foreground">Notifikationer</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge>Nyt lead</Badge>
              <Badge>Reminder udløber</Badge>
              <Badge>Status ændret</Badge>
              <Badge>Lead tildelt</Badge>
            </div>
            <div className="mt-4 flex gap-3">
              <Button>Gem præferencer</Button>
              <ThemeToggle />
            </div>
          </div>
        </CardContent>
      </Card>

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

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[1.5rem] border bg-white/60 p-5">
      <p className="font-medium text-foreground">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge key={item} variant="outline">{item}</Badge>
        ))}
      </div>
    </div>
  );
}
