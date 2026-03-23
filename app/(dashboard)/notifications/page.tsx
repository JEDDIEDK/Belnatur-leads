import { format } from "date-fns";
import { da } from "date-fns/locale";
import { getNotifications } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotificationsPage() {
  const notifications = getNotifications();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifikationer</CardTitle>
        <CardDescription>Nyt lead, tildelinger, reminders og statusændringer i ét samlet flow.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.map((item) => (
          <div key={item.id} className="rounded-[1.5rem] border bg-white/60 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.message}</p>
              </div>
              <div className={`h-3 w-3 rounded-full ${item.read ? "bg-border" : "bg-status-new"}`} />
            </div>
            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {format(new Date(item.created_at), "d. MMM yyyy, HH:mm", { locale: da })}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
