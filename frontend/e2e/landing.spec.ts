import { test, expect } from "@playwright/test";

test.describe("public landing page", () => {
  test("loads and links to sign in", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Panacea/i);
    await expect(page.getByRole("link", { name: /sign in/i }).first()).toBeVisible();
  });

  test("navigates to the login page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /sign in/i }).first().click();
    await expect(page).toHaveURL(/\/login$/);
  });
});
