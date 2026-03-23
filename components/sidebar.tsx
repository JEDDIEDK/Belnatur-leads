"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Bell, LayoutDashboard, Settings, Users2 } from "lucide-react";
import { BelnaturLogo } from "@/components/belnatur-logo";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: Users2 },
  { href: "/campaigns", label: "Kampagner", icon: BarChart3 },
  { href: "/notifications", label: "Notifikationer", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass-panel hidden w-72 shrink-0 rounded-[2rem] p-5 lg:block">
      <div className="mb-10 px-3">
        <BelnaturLogo className="h-auto w-[180px] object-contain opacity-90" />
        <h1 className="mt-5 font-serif text-4xl text-foreground">Leads Atelier</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Et eksklusivt arbejdsrum til Meta leads, opfølgning og premium kunderejser.
        </p>
      </div>

      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all",
                active ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:bg-white/70 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-10 rounded-[1.5rem] border border-white/40 bg-white/60 p-4">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Klar til webhook</p>
        <p className="mt-2 text-sm text-foreground">
          `/api/meta/webhook` er forberedt til senere Meta Lead Ads integration.
        </p>
      </div>
    </aside>
  );
}
