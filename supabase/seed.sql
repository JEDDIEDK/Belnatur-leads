insert into profiles (id, full_name, email, role)
values
  ('8efcf949-697f-4ef6-809e-0308fe5ddb10', 'Sofie Larsen', 'sofie@belnatur.dk', 'admin'),
  ('bbceacb4-8f57-47be-9f95-50ec5a24fd31', 'Camilla Madsen', 'camilla@belnatur.dk', 'medarbejder')
on conflict (email) do nothing;

insert into campaigns (id, name, source)
values
  ('8ca4107f-b715-4c7d-b0d3-d995eff0127a', 'Hydra Glow Spring', 'Meta Ads'),
  ('60c57f6c-c8bf-42e4-ba32-b4fb8496624b', 'Lip Balance Signature', 'Meta Ads')
on conflict do nothing;

insert into lead_forms (id, name, campaign_id)
values
  ('01a0f294-df94-478d-934d-317ef70f2b44', 'Gratis hudanalyse', '8ca4107f-b715-4c7d-b0d3-d995eff0127a'),
  ('4e95ebdb-fceb-44d1-9d3a-a1f4bd2f5db8', 'Eksklusiv konsultation', '60c57f6c-c8bf-42e4-ba32-b4fb8496624b')
on conflict do nothing;

insert into leads (
  full_name,
  phone,
  email,
  campaign_id,
  lead_form_id,
  status,
  notes,
  next_action,
  reminder_at,
  assigned_to,
  meta_lead_id,
  raw_payload
)
values
  (
    'Emma Nørgaard',
    '+4522334455',
    'emma@example.com',
    '8ca4107f-b715-4c7d-b0d3-d995eff0127a',
    '01a0f294-df94-478d-934d-317ef70f2b44',
    'Nyt lead',
    'Har udfyldt formularen via spring kampagne.',
    'Ring op',
    now() + interval '3 hours',
    'bbceacb4-8f57-47be-9f95-50ec5a24fd31',
    'meta-lead-001',
    '{"source":"meta","campaign":"Hydra Glow Spring"}'::jsonb
  );
