-- Cadre: initial schema
-- Run this once in a NEW Supabase project (SQL editor, or `npx supabase db push`).
-- Every business table has an org_id, and row level security limits rows
-- to members of that organization.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------------------------------------------------------------
-- People and workspaces
-- ---------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  owner_id uuid not null references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'pro', 'scale')),
  created_at timestamptz not null default now()
);
create index organizations_owner_idx on public.organizations(owner_id);

create table public.memberships (
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);
create index memberships_user_idx on public.memberships(user_id);

create or replace function public.is_org_member(p_org uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.memberships
    where org_id = p_org and user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------
-- Business tables
-- ---------------------------------------------------------------
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  company text,
  email text,
  source text,
  status text not null default 'new' check (status in ('new', 'hot', 'warm', 'cold', 'won', 'lost')),
  score int check (score between 0 and 100),
  deal_value numeric(12, 2) not null default 0,
  probability int check (probability between 0 and 100),
  intent text check (intent in ('high', 'medium', 'low')),
  summary text,
  next_action text,
  objections jsonb not null default '[]',
  last_contact_at timestamptz,
  is_demo boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index leads_org_idx on public.leads(org_id, created_at desc);

create table public.lead_interactions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  channel text not null default 'note' check (channel in ('email', 'chat', 'call', 'note')),
  content text not null check (char_length(content) <= 20000),
  analysis jsonb,
  created_at timestamptz not null default now()
);
create index lead_interactions_lead_idx on public.lead_interactions(lead_id, created_at desc);
create index lead_interactions_org_idx on public.lead_interactions(org_id, created_at desc);

create table public.deals (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  name text not null,
  amount numeric(12, 2) not null default 0,
  stage text not null default 'prospecting'
    check (stage in ('prospecting', 'qualified', 'proposal', 'negotiation', 'won', 'lost')),
  probability int not null default 10 check (probability between 0 and 100),
  expected_close date,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index deals_org_idx on public.deals(org_id, stage);
create index deals_lead_idx on public.deals(lead_id);

create table public.accounts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  plan text,
  mrr numeric(12, 2) not null default 0,
  health_score int check (health_score between 0 and 100),
  risk_level text check (risk_level in ('low', 'medium', 'high', 'critical')),
  signals jsonb not null default '[]',
  last_analysis jsonb,
  renewal_date date,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index accounts_org_idx on public.accounts(org_id);

create table public.meetings (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  company text,
  held_at timestamptz not null default now(),
  transcript text not null check (char_length(transcript) <= 60000),
  summary text,
  sentiment text check (sentiment in ('positive', 'neutral', 'negative')),
  action_items jsonb not null default '[]',
  objections jsonb not null default '[]',
  analysis jsonb,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);
create index meetings_org_idx on public.meetings(org_id, held_at desc);

create table public.competitors (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  url text not null,
  last_scanned_at timestamptz,
  analysis jsonb,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index competitors_org_idx on public.competitors(org_id);

create table public.agents (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  key text not null,
  name text not null,
  role text,
  autonomy text not null default 'suggest' check (autonomy in ('off', 'suggest', 'auto')),
  enabled boolean not null default true,
  config jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, key)
);

create table public.agent_runs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  agent_key text not null,
  action text not null,
  status text not null default 'done' check (status in ('done', 'failed')),
  summary text,
  output jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index agent_runs_org_idx on public.agent_runs(org_id, created_at desc);

create table public.ceo_plans (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  command text not null check (char_length(command) <= 2000),
  plan jsonb not null,
  status text not null default 'draft' check (status in ('draft', 'approved', 'done')),
  created_at timestamptz not null default now()
);
create index ceo_plans_org_idx on public.ceo_plans(org_id, created_at desc);

create table public.insights (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  for_date date not null default current_date,
  content jsonb not null,
  created_at timestamptz not null default now(),
  unique (org_id, for_date)
);

-- ---------------------------------------------------------------
-- AI usage (keeps us inside the Gemini free tier)
-- ---------------------------------------------------------------
create table public.ai_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_date date not null default current_date,
  calls int not null default 0,
  primary key (user_id, usage_date)
);

create or replace function public.consume_ai_quota(p_limit int default 40)
returns boolean language plpgsql security definer set search_path = public as $$
declare
  v_calls int;
begin
  if auth.uid() is null then
    return false;
  end if;

  insert into public.ai_usage (user_id, usage_date, calls)
  values (auth.uid(), current_date, 1)
  on conflict (user_id, usage_date) do update set calls = public.ai_usage.calls + 1
  returning calls into v_calls;

  if v_calls > p_limit then
    update public.ai_usage set calls = calls - 1
    where user_id = auth.uid() and usage_date = current_date;
    return false;
  end if;
  return true;
end $$;

-- ---------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['profiles', 'leads', 'deals', 'accounts', 'competitors', 'agents'] loop
    execute format(
      'create trigger %I before update on public.%I for each row execute function public.set_updated_at()',
      t || '_updated_at', t
    );
  end loop;
end $$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    display_name = coalesce(excluded.display_name, profiles.display_name),
    avatar_url = coalesce(excluded.avatar_url, profiles.avatar_url);
  return new;
end $$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.memberships enable row level security;
alter table public.ai_usage enable row level security;

create policy profiles_select_own on public.profiles for select to authenticated using (id = auth.uid());
create policy profiles_insert_own on public.profiles for insert to authenticated
  with check (id = auth.uid());
create policy profiles_update_own on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

create policy organizations_select on public.organizations for select to authenticated
  using (public.is_org_member(id));
create policy organizations_update_owner on public.organizations for update to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy memberships_select_own on public.memberships for select to authenticated
  using (user_id = auth.uid());

create policy ai_usage_select_own on public.ai_usage for select to authenticated
  using (user_id = auth.uid());

do $$
declare t text;
begin
  foreach t in array array[
    'leads', 'lead_interactions', 'deals', 'accounts', 'meetings',
    'competitors', 'agents', 'agent_runs', 'ceo_plans', 'insights'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy %I on public.%I for select to authenticated using (public.is_org_member(org_id))', t || '_select', t);
    execute format('create policy %I on public.%I for insert to authenticated with check (public.is_org_member(org_id))', t || '_insert', t);
    execute format('create policy %I on public.%I for update to authenticated using (public.is_org_member(org_id)) with check (public.is_org_member(org_id))', t || '_update', t);
    execute format('create policy %I on public.%I for delete to authenticated using (public.is_org_member(org_id))', t || '_delete', t);
  end loop;
end $$;

-- ---------------------------------------------------------------
-- Workspace creation (called once after sign up)
-- ---------------------------------------------------------------
create or replace function public.create_organization(p_name text)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_org uuid;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  insert into public.organizations (name, owner_id) values (trim(p_name), auth.uid())
  returning id into v_org;

  insert into public.memberships (org_id, user_id, role) values (v_org, auth.uid(), 'owner');

  insert into public.agents (org_id, key, name, role)
  select v_org, k.key, k.name, k.role
  from (values
    ('ceo',        'AI CEO',                'Coordinates the other agents and turns goals into plans'),
    ('sales',      'AI Sales Manager',      'Scores leads and drafts follow-ups'),
    ('support',    'AI Support Manager',    'Watches customer health and churn risk'),
    ('marketing',  'AI Marketing Manager',  'Tracks competitors and positioning'),
    ('operations', 'AI Operations Manager', 'Turns meetings into action items'),
    ('finance',    'AI Finance Director',   'Forecasts revenue and pipeline')
  ) as k(key, name, role);

  return v_org;
end $$;

-- ---------------------------------------------------------------
-- Sample data so a new workspace is never empty (USD, fictional companies)
-- ---------------------------------------------------------------
create or replace function public.seed_demo_data(p_org uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_org_member(p_org) then
    raise exception 'not allowed';
  end if;

  insert into public.leads (org_id, name, company, email, source, status, score, deal_value, probability, intent, summary, next_action, is_demo) values
    (p_org, 'Maya Chen',     'Northwind Labs',   'maya@northwind.example',  'Website',  'hot',  92, 48000, 78, 'high',   'Asked for security docs and a quote for 40 seats.',        'Send security overview and book a pricing call', true),
    (p_org, 'Daniel Okafor', 'Brightpath',       'daniel@brightpath.example','Referral', 'hot',  88, 36000, 70, 'high',   'Champion inside the team, wants a pilot this quarter.',     'Share pilot plan with success criteria',         true),
    (p_org, 'Sofia Ramirez', 'Lumen Retail',     'sofia@lumen.example',     'Outbound', 'warm', 64, 22000, 40, 'medium', 'Interested, but comparing with two other vendors.',        'Send comparison one-pager',                      true),
    (p_org, 'Liam Foster',   'Harbor Freight Co','liam@harbor.example',     'Webinar',  'warm', 58, 18000, 35, 'medium', 'Attended the webinar and replied once about pricing.',     'Follow up with a short case study',              true),
    (p_org, 'Aiko Tanaka',   'Kite Studio',      'aiko@kite.example',       'Website',  'cold', 31,  6000, 12, 'low',    'Downloaded the guide, no reply to two emails.',             'Add to nurture sequence',                        true),
    (p_org, 'Noah Berg',     'Fjord Systems',    'noah@fjord.example',      'Outbound', 'lost', 12, 15000,  0, 'low',    'Chose an in-house solution after the demo.',                'Check back in 90 days',                          true);

  insert into public.deals (org_id, name, amount, stage, probability, expected_close, is_demo) values
    (p_org, 'Northwind Labs, 40 seats', 48000, 'negotiation', 78, current_date + 21, true),
    (p_org, 'Brightpath pilot',         36000, 'proposal',    70, current_date + 35, true),
    (p_org, 'Lumen Retail rollout',     22000, 'qualified',   40, current_date + 50, true),
    (p_org, 'Harbor Freight Co',        18000, 'prospecting', 20, current_date + 70, true),
    (p_org, 'Orbit Media renewal',      30000, 'won',        100, current_date - 12, true);

  insert into public.accounts (org_id, name, plan, mrr, health_score, risk_level, signals, renewal_date, is_demo) values
    (p_org, 'Orbit Media',     'Scale', 2500, 91, 'low',      '["Weekly active usage up 18%", "Added 4 new seats"]',                 current_date + 300, true),
    (p_org, 'Pinecrest Labs',  'Pro',   1200, 72, 'medium',   '["Support tickets doubled this month"]',                              current_date + 90,  true),
    (p_org, 'Vantage Health',  'Scale', 3100, 54, 'high',     '["Champion left the company", "Logins down 40%"]',                    current_date + 45,  true),
    (p_org, 'Saffron Foods',   'Pro',    900, 38, 'critical', '["Asked about cancellation terms", "No logins in 3 weeks"]',          current_date + 20,  true),
    (p_org, 'Delta Logistics', 'Pro',   1500, 80, 'low',      '["Completed onboarding checklist"]',                                  current_date + 200, true);

  insert into public.meetings (org_id, title, company, held_at, transcript, summary, sentiment, action_items, objections, is_demo) values
    (p_org, 'Discovery call: Northwind Labs', 'Northwind Labs', now() - interval '2 days',
     'Maya: We are growing fast and our reps spend hours on follow-ups. Rep: What does your current process look like? Maya: Spreadsheets, honestly. Security is a big deal for us, our board asked about SOC 2. Rep: We can share our security overview today. Maya: Great. Budget is approved for this quarter, we just need to see pricing for 40 seats.',
     'Strong fit. Budget is approved, security review is the main gate.', 'positive',
     '[{"owner":"Rep","task":"Send security overview","due":"Tomorrow"},{"owner":"Rep","task":"Send 40 seat quote","due":"This week"}]',
     '["Needs SOC 2 evidence for the board"]', true),
    (p_org, 'Pricing call: Lumen Retail', 'Lumen Retail', now() - interval '6 days',
     'Sofia: We like the product, but two other vendors are cheaper. Rep: What matters most to you? Sofia: Setup time and support. Price is a factor but not the only one. Rep: We can show you a two week setup plan. Sofia: Send it over and I will discuss it with my CFO.',
     'Price sensitive, but setup speed and support can win the deal.', 'neutral',
     '[{"owner":"Rep","task":"Send two week setup plan","due":"Friday"}]',
     '["Competitors are cheaper"]', true);

  insert into public.competitors (org_id, name, url, is_demo) values
    (p_org, 'Rivalytics',     'https://example.com/rivalytics', true),
    (p_org, 'Outbound Owl',   'https://example.com/outbound-owl', true),
    (p_org, 'Quotient',       'https://example.com/quotient', true);
end $$;

create or replace function public.clear_demo_data(p_org uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_org_member(p_org) then
    raise exception 'not allowed';
  end if;
  delete from public.deals where org_id = p_org and is_demo;
  delete from public.leads where org_id = p_org and is_demo;
  delete from public.accounts where org_id = p_org and is_demo;
  delete from public.meetings where org_id = p_org and is_demo;
  delete from public.competitors where org_id = p_org and is_demo;
end $$;

-- Only signed-in users may call these
revoke execute on function public.is_org_member(uuid) from public, anon;
revoke execute on function public.create_organization(text) from public, anon;
revoke execute on function public.consume_ai_quota(int) from public, anon;
revoke execute on function public.seed_demo_data(uuid) from public, anon;
revoke execute on function public.clear_demo_data(uuid) from public, anon;
grant execute on function public.is_org_member(uuid) to authenticated;
grant execute on function public.create_organization(text) to authenticated;
grant execute on function public.consume_ai_quota(int) to authenticated;
grant execute on function public.seed_demo_data(uuid) to authenticated;
grant execute on function public.clear_demo_data(uuid) to authenticated;
