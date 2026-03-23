export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  context?: string;
  created_at: string;
}

export const AUDIT_LOG_STORAGE_KEY = "belnatur-audit-log";

export function readAuditLog(): AuditLogEntry[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(AUDIT_LOG_STORAGE_KEY);
  return raw ? (JSON.parse(raw) as AuditLogEntry[]) : [];
}

export function writeAuditLog(entries: AuditLogEntry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUDIT_LOG_STORAGE_KEY, JSON.stringify(entries));
}

export function appendAuditLog(entry: Omit<AuditLogEntry, "id" | "created_at">) {
  const nextEntry: AuditLogEntry = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    ...entry
  };

  const existing = readAuditLog();
  writeAuditLog([nextEntry, ...existing]);
}
