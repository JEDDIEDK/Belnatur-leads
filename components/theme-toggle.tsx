"use client";

import { useEffect, useState } from "react";
import { MoonStar, SunMedium } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "belnatur-theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "soft-rose">("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as "light" | "soft-rose" | null;
    const nextTheme = stored ?? "light";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "soft-rose" : "light";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    toast.success("Tema opdateret", {
      description: nextTheme === "soft-rose" ? "Blød rose-tone aktiveret." : "Standardtema aktiveret."
    });
  }

  return (
    <Button type="button" variant="secondary" onClick={toggleTheme}>
      {theme === "light" ? <MoonStar className="mr-2 h-4 w-4" /> : <SunMedium className="mr-2 h-4 w-4" />}
      {theme === "light" ? "Skift tema" : "Lyst tema"}
    </Button>
  );
}
