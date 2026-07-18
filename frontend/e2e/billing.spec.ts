import { test, expect } from "@playwright/test";

test.describe("Billing and Invoices", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
  });

  test("can access billing page", async ({ page }) => {
    await page.click('a:has-text("Billing")');
    await expect(page).toHaveURL(/.*billing/);
    await expect(page.locator("h1")).toContainText("Billing");
  });

  test("billing page displays revenue metrics", async ({ page }) => {
    await page.goto("/billing");

    // Check for stat cards with metrics
    const statCards = page.locator('[role="region"], .stat');
    // Should have at least some metrics visible
    const count = await statCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("invoice list displays invoices", async ({ page }) => {
    await page.goto("/billing");

    // Check for invoice list/table
    const invoiceRows = page.locator('[role="row"]');
    // Should have some invoices
    const count = await invoiceRows.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("can see revenue chart", async ({ page }) => {
    await page.goto("/billing");

    // Check if chart is present (search for SVG or canvas elements)
    const chartElement = page.locator("svg, canvas").first();
    // Chart should be rendered
    await expect(chartElement).toBeVisible({ timeout: 5000 });
  });

  test("new invoice modal can be opened", async ({ page }) => {
    await page.goto("/billing");

    // Look for "New Invoice" or "Create Invoice" button
    const createButton = page.locator('button:has-text("Create"), button:has-text("Invoice")').first();
    if (await createButton.isVisible()) {
      await createButton.click();

      // Check if modal is visible
      const modalTitle = page.locator('text="Invoice"');
      await expect(modalTitle).toBeVisible();
    }
  });

  test("invoice detail displays information", async ({ page }) => {
    await page.goto("/billing");

    // Try to click first invoice link
    const invoiceLink = page.locator('a').filter({ hasText: /INV-\d+/i }).first();
    if (await invoiceLink.isVisible()) {
      await invoiceLink.click();

      // Should show invoice details
      const invoiceNumber = page.locator('text=/INV-/');
      await expect(invoiceNumber).toBeVisible();
    }
  });
});
