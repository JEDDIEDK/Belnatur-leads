import { AppShell } from "@/components/app-shell";
import { requireAuth } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth();

  return <AppShell user={user}>{children}</AppShell>;
}
