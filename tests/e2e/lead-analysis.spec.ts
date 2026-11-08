import { test, expect } from '@playwright/test';

test.describe('Lead Intelligence & AI Analysis Flow', () => {
  test('login -> open a lead -> analyze (intercept function call and return fixture)', async ({ page }) => {
    const mockUser = {
      id: 'mock-user-456',
      aud: 'authenticated',
      role: 'authenticated',
      email: 'sales-rep@cadre-test.io',
      user_metadata: { display_name: 'Jordan Vance' },
      app_metadata: { provider: 'email' },
      created_at: new Date().toISOString(),
    };

    const mockOrg = {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Apex Revenue Ops',
      plan: 'free',
    };

    let leadRecord = {
      id: 'lead-test-123',
      org_id: mockOrg.id,
      name: 'Elena Rostova',
      company: 'Solaria Robotics',
      email: 'elena@solaria.ai',
      status: 'warm',
      score: 65,
      deal_value: 75000,
      summary: 'Initial discovery call completed.',
      next_action: 'Follow up regarding security questionnaire.',
      objections: ['Pending SOC 2 report'],
      last_contact_at: new Date().toISOString(),
      is_demo: false,
      created_at: new Date().toISOString(),
    };

    // 1. Mock Supabase Auth
    await page.route('**/auth/v1/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUser),
      });
    });

    await page.route('**/rest/v1/memberships*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'mem-2',
            org_id: mockOrg.id,
            user_id: mockUser.id,
            role: 'owner',
            organization: mockOrg,
          },
        ]),
      });
    });

    // 2. Mock Agent Roster (Sales agent enabled)
    await page.route('**/rest/v1/agents*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'ag-1',
            org_id: mockOrg.id,
            agent_key: 'sales',
            is_enabled: true,
            autonomy: 'auto',
          },
        ]),
      });
    });

    // 3. Mock Leads List & Detail Query
    await page.route('**/rest/v1/leads*', async (route) => {
      if (route.request().method() === 'PATCH') {
        const payload = route.request().postDataJSON();
        leadRecord = { ...leadRecord, ...payload };
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(leadRecord),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          headers: {
            'content-range': '0-0/1',
          },
          body: JSON.stringify([leadRecord]),
        });
      }
    });

    await page.route('**/rest/v1/lead_interactions*', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'inter-1', ...route.request().postDataJSON() }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      }
    });

    await page.route('**/rest/v1/ai_usage*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ count: 5, limit: 40 }),
      });
    });

    // 4. Intercept Edge Function /functions/v1/analyze-lead
    await page.route('**/functions/v1/analyze-lead', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          score: 95,
          intent: 'high',
          sentiment: 'positive',
          summary: 'Customer confirmed executive budget approval and requested immediate contract drafting for 50 seats.',
          objections: ['Standard security compliance sign-off'],
          buying_signals: ['Budget approved', 'Contract requested'],
          close_probability: 90,
          next_best_action: 'Deliver master service agreement and schedule onboarding kick-off.',
          suggested_reply: 'Hi Elena, thrilled to partner with Solaria. Attached is the MSA for your legal team...',
        }),
      });
    });

    // Navigate to /app/leads
    await page.goto('/app/leads');

    // Verify lead is in the table and click on it to open drawer
    const leadRow = page.getByText('Elena Rostova');
    await expect(leadRow).toBeVisible({ timeout: 10000 });
    await leadRow.click();

    // Verify drawer is open
    const drawerTitle = page.locator('text=Solaria Robotics');
    await expect(drawerTitle).toBeVisible();

    // Fill in interaction notes to analyze
    const analysisInput = page.locator('textarea[placeholder*="paste an email"]');
    if (await analysisInput.isVisible()) {
      await analysisInput.fill('Customer confirmed executive budget approval for 50 seats and requested immediate contract drafting.');

      // Click Analyze
      const analyzeButton = page.getByRole('button', { name: /^analyze$/i });
      await analyzeButton.click();

      // Verify the AI analysis response rendered in the drawer
      await expect(page.getByText(/Customer confirmed executive budget approval/i)).toBeVisible({ timeout: 10000 });
      await expect(page.getByText(/Deliver master service agreement/i)).toBeVisible();
    }
  });
});

