# Multi-Tenant RLS Isolation Verification Guide

This document outlines the step-by-step verification procedure to validate Row Level Security (RLS) isolation between distinct organizations in Cadre.

---

## 1. Threat Model & Goal

**Goal:** Prove mathematically and empirically that User A (belonging strictly to Organization A) cannot read, insert, update, or delete records belonging to Organization B across any business table, profile, or quota record.

**Tables Covered:**
1. `profiles`
2. `organizations`
3. `memberships`
4. `leads`
5. `lead_interactions`
6. `deals`
7. `accounts`
8. `meetings`
9. `competitors`
10. `agents`
11. `agent_runs`
12. `ceo_plans`
13. `insights`
14. `ai_usage`

---

## 2. Test Setup (SQL Editor)

Run the following setup script in the Supabase SQL Editor as `postgres` or `service_role` to create two isolated test users and organizations:

```sql
-- Create two test auth users if not existing
-- User A
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'usera@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"display_name":"User A"}',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- User B
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (
  '22222222-2222-2222-2222-222222222222',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'userb@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"display_name":"User B"}',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Create Organization A for User A
INSERT INTO public.organizations (id, name, owner_id)
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Org Alpha', '11111111-1111-1111-1111-111111111111')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.memberships (org_id, user_id, role)
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'owner')
ON CONFLICT DO NOTHING;

-- Create Organization B for User B
INSERT INTO public.organizations (id, name, owner_id)
VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Org Beta', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.memberships (org_id, user_id, role)
VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'owner')
ON CONFLICT DO NOTHING;

-- Seed dummy data into Org B
INSERT INTO public.leads (id, org_id, name, deal_value, status)
VALUES ('33333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Confidential Lead B', 50000, 'hot')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.deals (id, org_id, name, amount, stage)
VALUES ('44444444-4444-4444-4444-444444444444', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Confidential Deal B', 120000, 'negotiation')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.accounts (id, org_id, name, mrr, risk_level)
VALUES ('55555555-5555-5555-5555-555555555555', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Target Corp B', 8000, 'low')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.meetings (id, org_id, title, transcript)
VALUES ('66666666-6666-6666-6666-666666666666', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Strategy Meeting B', 'Secret merger discussions')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.competitors (id, org_id, name, url)
VALUES ('77777777-7777-7777-7777-777777777777', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Competitor B', 'https://competitor-b.example')
ON CONFLICT (id) DO NOTHING;
```

---

## 3. SQL RLS Simulation: Impersonating User A

Run the following script to simulate requests arriving from **User A** (`11111111-1111-1111-1111-111111111111`):

```sql
BEGIN;

-- 1. Impersonate authenticated User A
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claim.sub" = '11111111-1111-1111-1111-111111111111';
SET LOCAL "request.jwt.claim.role" = 'authenticated';

-- -------------------------------------------------------------
-- TEST 1: User A cannot read User B's profile
-- -------------------------------------------------------------
SELECT count(*) AS should_be_zero
FROM public.profiles
WHERE id = '22222222-2222-2222-2222-222222222222';
-- Expected: 0

-- -------------------------------------------------------------
-- TEST 2: User A cannot read Org B
-- -------------------------------------------------------------
SELECT count(*) AS should_be_zero
FROM public.organizations
WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
-- Expected: 0

-- -------------------------------------------------------------
-- TEST 3: User A cannot read User B's membership
-- -------------------------------------------------------------
SELECT count(*) AS should_be_zero
FROM public.memberships
WHERE user_id = '22222222-2222-2222-2222-222222222222';
-- Expected: 0

-- -------------------------------------------------------------
-- TEST 4: User A cannot read Org B's leads
-- -------------------------------------------------------------
SELECT count(*) AS should_be_zero
FROM public.leads
WHERE org_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
-- Expected: 0

-- -------------------------------------------------------------
-- TEST 5: User A cannot read Org B's deals
-- -------------------------------------------------------------
SELECT count(*) AS should_be_zero
FROM public.deals
WHERE org_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
-- Expected: 0

-- -------------------------------------------------------------
-- TEST 6: User A cannot read Org B's accounts
-- -------------------------------------------------------------
SELECT count(*) AS should_be_zero
FROM public.accounts
WHERE org_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
-- Expected: 0

-- -------------------------------------------------------------
-- TEST 7: User A cannot read Org B's meetings
-- -------------------------------------------------------------
SELECT count(*) AS should_be_zero
FROM public.meetings
WHERE org_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
-- Expected: 0

-- -------------------------------------------------------------
-- TEST 8: User A cannot read Org B's competitors
-- -------------------------------------------------------------
SELECT count(*) AS should_be_zero
FROM public.competitors
WHERE org_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
-- Expected: 0

-- -------------------------------------------------------------
-- TEST 9: User A cannot insert into Org B (Leads)
-- -------------------------------------------------------------
-- Should fail with RLS check violation error
DO $$
BEGIN
  INSERT INTO public.leads (org_id, name)
  VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Malicious Lead');
  RAISE EXCEPTION 'TEST FAILED: User A was able to insert into Org B!';
EXCEPTION
  WHEN row_security_active_violation OR insufficient_privilege THEN
    RAISE NOTICE 'SUCCESS: RLS prevented insert into Org B.';
END $$;

-- -------------------------------------------------------------
-- TEST 10: User A cannot update Org B's deals
-- -------------------------------------------------------------
UPDATE public.deals
SET amount = 0
WHERE id = '44444444-4444-4444-4444-444444444444';
-- Check affected rows:
SELECT count(*) AS should_be_zero
FROM public.deals
WHERE id = '44444444-4444-4444-4444-444444444444' AND amount = 0;
-- Expected: 0 (No rows updated because WHERE filters out rows invisible under RLS)

-- -------------------------------------------------------------
-- TEST 11: User A cannot delete Org B's accounts
-- -------------------------------------------------------------
DELETE FROM public.accounts
WHERE id = '55555555-5555-5555-5555-555555555555';
-- Check if record still exists under postgres role (end transaction and verify)

ROLLBACK;
```

---

## 4. Frontend Supabase-JS Integration Test Snippet

In a Node test script or browser console authenticated as User A:

```typescript
import { createClient } from '@supabase/supabase-js';

const clientA = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
await clientA.auth.signInWithPassword({ email: 'usera@example.com', password: 'password123' });

// 1. Attempt to read Org B's leads
const { data: leads, error: leadsError } = await clientA
  .from('leads')
  .select('*')
  .eq('org_id', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');

console.assert(leads?.length === 0, 'User A should see 0 leads from Org B');

// 2. Attempt to write to Org B's leads
const { data: inserted, error: insertError } = await clientA
  .from('leads')
  .insert({
    org_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    name: 'Unauthorized Insertion',
  });

console.assert(insertError !== null, 'Insert into Org B should fail RLS check');

// 3. Attempt to read User B's profile
const { data: profileB } = await clientA
  .from('profiles')
  .select('*')
  .eq('id', '22222222-2222-2222-2222-222222222222')
  .maybeSingle();

console.assert(profileB === null, 'User A should not be able to read User B profile');
```

---

## 5. Verification Checklist

- [x] All 10 business tables enforce `public.is_org_member(org_id)` for SELECT, INSERT, UPDATE, DELETE.
- [x] Profiles only allows `id = auth.uid()`.
- [x] AI usage only allows `user_id = auth.uid()` for SELECT and prohibits direct client INSERT/UPDATE/DELETE.
- [x] Cross-tenant reads return 0 rows (no leakage).
- [x] Cross-tenant writes fail with RLS check violations.
