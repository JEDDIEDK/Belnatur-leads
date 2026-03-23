import { LogOut } from "lucide-react";
import { signOutAction } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <Button type="submit" variant="ghost" size="sm">
        <LogOut className="mr-2 h-4 w-4" />
        Log ud
      </Button>
    </form>
  );
}
