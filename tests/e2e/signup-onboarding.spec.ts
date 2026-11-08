import { test, expect } from '@playwright/test';

test.describe('Sign Up & Onboarding Flow', () => {
  test('sign up -> onboarding -> sample data visible on the Command Center', async ({ page }) => {
    const mockUser = {
      id: 'mock-user-123',
      aud: 'authenticated',
      role: 'authenticated',
      email: 'founder@northwind.io',
      user_metadata: {
        display_name: 'Alex Northwind',
      },
      app_metadata: { provider: 'email' },
      created_at: new Date().toISOString(),
    };

    const mockSession = {
      access_token: 'mock-access-token-12345',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'mock-refresh-token',
      user: mockUser,
    };

    // 1. Mock Supabase Auth Sign Up
    await page.route('**/auth/v1/signup', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: mockUser,
          session: mockSession,
        }),
      });
    });

    // 2. Mock Supabase Auth Session
    await page.route('**/auth/v1/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUser),
      });
    });

    // 3. Mock Organizations Query
    let createdOrg: { id: string; name: string; plan: string } | null = null;

    await page.route('**/rest/v1/memberships*', async (route) => {
      if (createdOrg) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 'mem-1',
              org_id: createdOrg.id,
              user_id: mockUser.id,
              role: 'owner',
              organization: createdOrg,
            },
          ]),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      }
    });

    // 4. Mock RPC create_organization & seed_demo_data
    await page.route('**/rest/v1/rpc/create_organization', async (route) => {
      createdOrg = {
        id: '00000000-0000-0000-0000-000000000001',
        name: 'Northwind Growth Labs',
        plan: 'free',
      };
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(createdOrg.id),
      });
    });

    await page.route('**/rest/v1/rpc/seed_demo_data', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, count: 24 }),
      });
    });

    // 5. Mock Command Center Data Queries
    await page.route('**/rest/v1/leads*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'lead-1',
            org_id: '00000000-0000-0000-0000-000000000001',
            name: 'Sophia Patel',
            company: 'Starlight Robotics',
            status: 'hot',
            score: 94,
            deal_value: 48000,
            is_demo: true,
            created_at: new Date().toISOString(),
          },
        ]),
      });
    });

    await page.route('**/rest/v1/deals*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'deal-1',
            org_id: '00000000-0000-0000-0000-000000000001',
            name: 'Annual Platform License',
            amount: 48000,
            stage: 'negotiation',
            probability: 80,
            is_demo: true,
          },
        ]),
      });
    });

    await page.route('**/rest/v1/accounts*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'acc-1',
            org_id: '00000000-0000-0000-0000-000000000001',
            name: 'Hyperion Labs',
            plan: 'Enterprise',
            mrr: 5000,
            risk_level: 'high',
            health_score: 45,
            is_demo: true,
          },
        ]),
      });
    });

    await page.route('**/rest/v1/agent_runs*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.route('**/rest/v1/ai_usage*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ count: 2, limit: 40 }),
      });
    });

    // Navigate to Sign Up page
    await page.goto('/signup');

    // Fill in sign up form
    await page.fill('#signup-name', 'Alex Northwind');
    await page.fill('#signup-email', 'founder@northwind.io');
    await page.fill('#signup-password', 'Password123!*');

    // Click Create account
    await page.click('button[type="submit"]');

    // Wait for redirect to /onboarding
    await page.waitForURL(/\/onboarding/);
    expect(page.url()).toContain('/onboarding');

    // Fill in workspace name
    const orgInput = page.locator('#workspace-name');
    await orgInput.fill('Northwind Growth Labs');

    // Submit onboarding form
    const enterBtn = page.getByRole('button', { name: /create workspace/i });
    await enterBtn.click();

    // Verify successful arrival at Command Center
    await page.waitForURL(/\/app/);
    expect(page.url()).toContain('/app');

    // Verify sample data lead is rendered on the Command Center
    await expect(page.getByText('Starlight Robotics')).toBeVisible({ timeout: 10000 });
  });
});

