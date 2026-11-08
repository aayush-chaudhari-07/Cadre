import { test, expect } from '@playwright/test';

test.describe('Route Guard & Unauthenticated Access', () => {
  test('signed-out visit to /app/leads redirects to /login with redirect parameter', async ({ page }) => {
    // Intercept any Supabase auth check to ensure caller is signed out
    await page.route('**/auth/v1/user', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'unauthorized', message: 'No valid session' }),
      });
    });

    // Clear any existing session in localStorage
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());

    // Navigate directly to protected route
    await page.goto('/app/leads');

    // Verify redirected to /login with redirect query param
    await page.waitForURL(/\/login\?redirect=.*app.*leads.*/);
    expect(page.url()).toContain('/login');
    expect(page.url()).toContain('redirect=');

    // Verify login form is visible
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();

    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();

    const submitBtn = page.getByRole('button', { name: /sign in/i });
    await expect(submitBtn).toBeVisible();
  });
});

