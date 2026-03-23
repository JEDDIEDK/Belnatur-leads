import { redirect } from "next/navigation";
import { LockKeyhole, Sparkles } from "lucide-react";
import { getCurrentSession, signInAction } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function LoginPage() {
  const user = await getCurrentSession();

  if (user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="glass-panel rounded-[2rem] p-10">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Belnatur</p>
          <h1 className="mt-4 font-serif text-6xl leading-none text-foreground">
            Et eksklusivt workspace til leads, opfølgning og rolige beslutninger.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">
            Designet til klinikker med høj servicefølelse. Elegant i udtryk, hurtigt i drift og bygget til både ejer og medarbejdere.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <Feature title="Supabase auth klar" text="Projektet er forberedt til rigtig auth, men kører også med demo-login fra start." />
            <Feature title="Lead reminders" text="Næste handlinger, opfølgningsdatoer og in-app notifikationer samlet ét sted." />
          </div>
        </div>

        <Card className="page-gradient">
          <CardContent className="p-8 md:p-10">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Login</p>
                <h2 className="mt-2 font-serif text-4xl">Velkommen tilbage</h2>
              </div>
              <div className="rounded-full bg-white/70 p-3 text-primary">
                <LockKeyhole className="h-5 w-5" />
              </div>
            </div>

            <form action={signInAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" name="email" defaultValue="sofie@belnatur.dk" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" defaultValue="demo1234" required />
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <p>Demo-bruger: `sofie@belnatur.dk`</p>
                <a href="/forgot-password" className="hover:text-foreground">Glemt password?</a>
              </div>
              <Button type="submit" className="w-full">
                <Sparkles className="mr-2 h-4 w-4" />
                Log ind
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/40 bg-white/60 p-5">
      <p className="font-medium text-foreground">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}
