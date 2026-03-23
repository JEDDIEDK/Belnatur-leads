"use client";

import { useMemo, useState } from "react";
import { ShieldPlus, UserCog } from "lucide-react";
import { toast } from "sonner";
import { profiles } from "@/lib/demo-data";
import { useAppSettings } from "@/hooks/use-app-settings";
import type { UserRole } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function UserManagementPanel() {
  const { settings, ready, saveSettings } = useAppSettings();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("admin");

  const allUsers = useMemo(() => [...profiles, ...settings.customUsers], [settings.customUsers]);

  if (!ready) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bruger- og medarbejderstyring</CardTitle>
          <CardDescription>Indlæser brugere...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  function addUser() {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = fullName.trim();

    if (!normalizedName || !normalizedEmail) {
      toast.error("Udfyld navn og e-mail");
      return;
    }

    if (allUsers.some((user) => user.email.toLowerCase() === normalizedEmail)) {
      toast.error("Der findes allerede en bruger med den e-mail");
      return;
    }

    const nextUser = {
      id: `custom-${crypto.randomUUID()}`,
      full_name: normalizedName,
      email: normalizedEmail,
      role,
      active: true,
      created_at: new Date().toISOString()
    };

    saveSettings({
      ...settings,
      customUsers: [...settings.customUsers, nextUser]
    });

    setFullName("");
    setEmail("");
    setRole("admin");
    toast.success(role === "admin" ? "Ny admin oprettet" : "Ny medarbejder oprettet");
  }

  function updateUserRole(id: string, nextRole: UserRole) {
    saveSettings({
      ...settings,
      customUsers: settings.customUsers.map((user) => (user.id === id ? { ...user, role: nextRole } : user))
    });
    toast.success("Rolle opdateret");
  }

  function toggleUserActive(id: string) {
    saveSettings({
      ...settings,
      customUsers: settings.customUsers.map((user) => (user.id === id ? { ...user, active: !user.active } : user))
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bruger- og medarbejderstyring</CardTitle>
        <CardDescription>Opret nye admins eller medarbejdere og juster deres rolle og status.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-[1.5rem] border bg-white/60 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-foreground">Opret ny bruger</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Brug dette til hurtigt at oprette en ny admin i appens demo-flow.
              </p>
            </div>
            <ShieldPlus className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-4 grid gap-3">
            <div className="space-y-2">
              <Label>Fulde navn</Label>
              <Input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Fx Anna Jensen" />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="anna@belnatur.dk" />
            </div>
            <div className="space-y-2">
              <Label>Rolle</Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <SelectTrigger><SelectValue placeholder="Vælg rolle" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">admin</SelectItem>
                  <SelectItem value="medarbejder">medarbejder</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="button" onClick={addUser}>
              Opret bruger
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {allUsers.map((user) => {
            const editable = user.id.startsWith("custom-");
            return (
              <div key={user.id} className="rounded-[1.5rem] border bg-white/60 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="font-medium">{user.full_name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {editable ? (
                      <Select value={user.role} onValueChange={(value) => updateUserRole(user.id, value as UserRole)}>
                        <SelectTrigger className="w-[170px]">
                          <SelectValue placeholder="Rolle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">admin</SelectItem>
                          <SelectItem value="medarbejder">medarbejder</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="outline">{user.role}</Badge>
                    )}
                    <Button
                      type="button"
                      variant={user.active ? "secondary" : "outline"}
                      onClick={() => editable ? toggleUserActive(user.id) : toast.message("Demo-brugere kan ikke ændres")}
                    >
                      <UserCog className="mr-2 h-4 w-4" />
                      {user.active ? "Aktiv" : "Deaktiveret"}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
