"use client";

import { useEffect, useState } from "react";
import { appendAuditLog, AuditLogEntry, readAuditLog } from "@/lib/audit-log";

export function useAuditLog(initialEntries: AuditLogEntry[] = []) {
  const [entries, setEntries] = useState<AuditLogEntry[]>(initialEntries);

  useEffect(() => {
    setEntries([...readAuditLog(), ...initialEntries]);
  }, [initialEntries]);

  function log(entry: Omit<AuditLogEntry, "id" | "created_at">) {
    appendAuditLog(entry);
    setEntries((current) => [readAuditLog()[0], ...current]);
  }

  return {
    entries,
    log
  };
}
