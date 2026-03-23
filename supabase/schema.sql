create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  role text not null check (role in ('admin', 'medarbejder')),
  created_at timestamptz not null default now()
);

create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  source text not null default 'Meta Ads',
  created_at timestamptz not null default now()
);

create table if not exists lead_forms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  campaign_id uuid not null references campaigns(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  email text,
  campaign_id uuid references campaigns(id) on delete set null,
  lead_form_id uuid references lead_forms(id) on delete set null,
  created_at timestamptz not null default now(),
  status text not null default 'Nyt lead',
  notes text not null default '',
  next_action text not null default 'Ring op',
  reminder_at timestamptz,
  assigned_to uuid references profiles(id) on delete set null,
  meta_lead_id text,
  raw_payload jsonb not null default '{}'::jsonb
);

create table if not exists lead_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  type text not null,
  description text not null,
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_leads_status on leads(status);
create index if not exists idx_leads_created_at on leads(created_at desc);
create index if not exists idx_leads_campaign_id on leads(campaign_id);
create index if not exists idx_leads_assigned_to on leads(assigned_to);
create index if not exists idx_notifications_user on notifications(user_id, read);
