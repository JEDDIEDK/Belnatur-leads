import { requireAuth } from "@/lib/auth";
import { SettingsManager } from "@/components/settings-manager";
import { UserManagementPanel } from "@/components/user-management-panel";

export default async function SettingsPage() {
  const user = await requireAuth();

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
      <SettingsManager actorName={user.full_name} />
      <UserManagementPanel actorName={user.full_name} />
    </div>
  );
}
