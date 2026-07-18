import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("user can navigate to login page", async ({ page }) => {
    await page.goto("/");
    await page.click('text=Sign In');
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator("h1")).toContainText("Sign In");
  });

  test("login form displays validation errors", async ({ page }) => {
    await page.goto("/login");

    // Try to submit without email
    await page.click('button:has-text("Sign In")');
    await expect(page.locator("text=Email is required")).toBeVisible();
  });

  test("register form displays validation errors", async ({ page }) => {
    await page.goto("/register");

    // Try to submit without fields
    await page.click('button:has-text("Create Account")');
    await expect(page.locator("text=is required")).toBeVisible();
  });

  test("forgot password form works", async ({ page }) => {
    await page.goto("/forgot-password");

    await page.fill('input[type="email"]', "test@example.com");
    await page.click('button:has-text("Send Reset Link")');

    // Should show success message or redirect
    await expect(page.locator("text=Check your email")).toBeVisible();
  });

  test("user can navigate between auth pages", async ({ page }) => {
    await page.goto("/login");

    // Navigate to register
    await page.click('text=Create an account');
    await expect(page).toHaveURL(/.*register/);

    // Navigate to forgot password
    await page.click('text=Forgot your password');
    await expect(page).toHaveURL(/.*forgot-password/);
  });
});
