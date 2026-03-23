import { requireAdmin } from "@/lib/auth";
import { leads } from "@/lib/demo-data";
import { AuditLogList } from "@/components/audit-log-list";

export default async function AuditLogPage() {
  await requireAdmin();

  const entries = leads
    .flatMap((lead) =>
      lead.activities.map((activity) => ({
        id: activity.id,
        actor: `Bruger: ${activity.user_id}`,
        action: activity.description,
        context: `Lead: ${lead.full_name}`,
        created_at: activity.created_at
      }))
    )
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return <AuditLogList initialEntries={entries} />;
}
