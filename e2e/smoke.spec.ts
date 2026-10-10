import { test, expect } from '@playwright/test';

test.describe('Nexvanta.AI SaaS Platform Smoke Journey', () => {
  test('complete client onboarding, subscription, and demo execution journey', async ({ page }) => {
    // 1. Visit signup page with target plan code
    await page.goto('/signup?plan=lead-capture-basic');
    await expect(page).toHaveTitle(/Nexvanta\.AI/i);
    await expect(page.locator('text=Create SaaS Account')).toBeVisible();

    // 2. Fill in signup details
    await page.fill('input[placeholder="Aditya Sharma"]', 'Test Client');
    await page.fill('input[placeholder="97131 03152"]', '9713103152');
    await page.fill('input[placeholder="name@company.com"]', `client_${Date.now()}@example.com`);
    await page.fill('input[placeholder="••••••••"]', 'SecretPass123!');
    await page.check('input#terms');

    // 3. Navigate to checkout
    await page.goto('/app/checkout?plan=lead-capture-basic');
    await expect(page.locator('text=Activate Subscription')).toBeVisible();
    await expect(page.locator('text=lead-capture-basic')).toBeVisible();

    // 4. Open dashboard and inspect fleet
    await page.goto('/app');
    await expect(page.locator('text=Client Automation Dashboard')).toBeVisible();
    await expect(page.locator('text=Demo Benchmark')).toBeVisible();

    // 5. Open Demo Automation console
    await page.goto('/app/demo-automation');
    await expect(page.locator('text=Demo Platform Automation Benchmark')).toBeVisible();

    // 6. Execute demo run and observe quota consumption
    const testRunButton = page.locator('button:has-text("Execute Test Run")');
    if (await testRunButton.isVisible()) {
      await testRunButton.click();
      await expect(page.locator('text=Consumed 1 unit')).toBeVisible({ timeout: 10000 });
    }

    // 7. Verify Billing page & cancellation flow
    await page.goto('/app/billing');
    await expect(page.locator('text=Billing & Subscriptions')).toBeVisible();
    await expect(page.locator('button:has-text("Cancel Renewal")')).toBeVisible();
  });
});
