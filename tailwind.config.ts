import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./styles/**/*.{css}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        destructive: "hsl(var(--destructive))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))"
        },
        status: {
          new: "hsl(var(--status-new))",
          pending: "hsl(var(--status-pending))",
          contacted: "hsl(var(--status-contacted))",
          waiting: "hsl(var(--status-waiting))",
          booked: "hsl(var(--status-booked))",
          won: "hsl(var(--status-won))",
          lost: "hsl(var(--status-lost))"
        }
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem",
        "3xl": "2rem"
      },
      boxShadow: {
        glow: "0 18px 60px rgba(97, 74, 55, 0.14)",
        soft: "0 20px 55px rgba(86, 64, 47, 0.08)"
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"]
      },
      backgroundImage: {
        shell:
          "radial-gradient(circle at top left, rgba(214, 186, 159, 0.35), transparent 34%), radial-gradient(circle at right center, rgba(224, 198, 183, 0.28), transparent 28%), linear-gradient(180deg, rgba(255,255,255,0.98), rgba(247, 240, 233, 0.98))"
      }
    }
  },
  plugins: []
};

export default config;
