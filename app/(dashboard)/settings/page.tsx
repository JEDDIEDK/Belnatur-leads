import { profiles } from "@/lib/demo-data";
import { SettingsManager } from "@/components/settings-manager";
import { UserManagementPanel } from "@/components/user-management-panel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
      <SettingsManager />
      <UserManagementPanel />
    </div>
  );
}
