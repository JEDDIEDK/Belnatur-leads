import { formatDistanceToNow } from "date-fns";
import { da } from "date-fns/locale";
import { Bell, Search } from "lucide-react";
import { getNotifications } from "@/lib/data";
import { SignOutButton } from "@/components/sign-out-button";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { Profile } from "@/types";

export function Topbar({ user }: { user: Profile }) {
  const notifications = getNotifications();
  const unread = notifications.filter((item) => !item.read).length;

  return (
    <header className="glass-panel flex flex-col gap-4 rounded-[2rem] p-4 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full max-w-xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Søg på navn, telefon, mail eller kampagne" className="pl-11" />
      </div>

      <div className="flex items-center gap-3 self-end md:self-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              {unread ? (
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-status-lost" />
              ) : null}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {notifications.map((item) => (
              <DropdownMenuItem key={item.id} className="flex flex-col items-start gap-1">
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.message}</p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: da })}
                </p>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="rounded-full border border-white/40 bg-white/70 px-4 py-2 text-right">
          <p className="text-sm font-medium">{user.full_name}</p>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{user.role}</p>
        </div>
        <SignOutButton />
      </div>
    </header>
  );
}
