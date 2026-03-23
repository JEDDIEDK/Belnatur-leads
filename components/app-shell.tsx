import { ReactNode } from "react";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import type { Profile } from "@/types";

export function AppShell({
  user,
  children
}: {
  user: Profile;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen p-3 md:p-6">
      <div className="mx-auto flex max-w-[1600px] gap-6">
        <Sidebar user={user} />
        <div className="flex-1 space-y-6">
          <Topbar user={user} />
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
