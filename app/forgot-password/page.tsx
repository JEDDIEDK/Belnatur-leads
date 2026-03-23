import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-xl">
        <CardContent className="p-8">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Glemt password</p>
          <h1 className="mt-3 font-serif text-4xl">Send nyt login-link</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Denne side er klar til at blive koblet på Supabase reset password flow.
          </p>
          <form className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">E-mail</Label>
              <Input id="reset-email" type="email" placeholder="navn@belnatur.dk" />
            </div>
            <Button type="button" className="w-full">Send link</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
