# Belnatur-leads

Et moderne, eksklusivt og Netlify-klar Next.js dashboard til intern håndtering af Meta Ads leads. Projektet er bygget som en demo-klar MVP med premium UI, demo-data, route-beskyttelse, leadliste, detaljer, notifikationer, reminders, kampagneoverblik og Supabase-klargøring.

## Stack

- Next.js 16 + App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-inspirerede komponenter
- Supabase-klargøring til auth og database
- React Hook Form + Zod
- TanStack Table
- Recharts
- date-fns
- Framer Motion klar som dependency til videre animationer

## Kom i gang

```bash
cd Belnatur-leads
npm install
npm run dev
```

Åbn `http://localhost:3000`.

Demo-login:

- E-mail: `sofie@belnatur.dk`
- Password: `demo1234`

## Demo-mode og Supabase

Projektet virker direkte i demo-mode uden Supabase, så UI og flows kan gennemgås med det samme. Samtidig ligger der Supabase-klargøring i:

- `supabase/schema.sql`
- `supabase/seed.sql`
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`

Det gør det let at skifte fra demo-data til rigtig database og auth.

## Environment variables

Forslag til `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
META_WEBHOOK_VERIFY_TOKEN=your-meta-verify-token
ENABLE_EMAIL_NOTIFICATIONS=false
```

## Funktioner i denne version

- Login-side og glemt password placeholder
- Beskyttede routes via middleware
- Dashboard med KPI-cards, graf-sektioner, reminders og seneste leads
- Leads-side med søgning, filtrering, pagination og CSV eksport
- Lead-drawer med status, noter, reminder, handling og aktivitetslog
- Notifikationscenter
- Kampagneoversigt
- Settings-side til statusser, næste handlinger og brugerstyring
- API placeholder endpoints:
  - `POST /api/meta/webhook`
  - `POST /api/leads/import`

## Netlify

Projektet kan deployes på Netlify som et standard Next.js site.

- Build command: `npm run build`
- Publish: håndteres af Next.js adapter/runtime på Netlify
- Node version: `20`

## Næste oplagte skridt

1. Kobl login-flowet til rigtig Supabase Auth.
2. Erstat demo-data i `lib/demo-data.ts` med queries mod Supabase.
3. Udbyg webhook-endpoint med verificering og inserts til `leads`.
4. Tilføj e-mail eller SMS notifikationer via edge functions eller eksterne services.
