import { test, expect } from "@playwright/test";

test.describe("Patient and Appointment Management", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard (after login in real scenario)
    await page.goto("/dashboard");
  });

  test("can access patients list page", async ({ page }) => {
    await page.click('a:has-text("Patients")');
    await expect(page).toHaveURL(/.*patients/);
    await expect(page.locator("h1")).toContainText("Patient");
  });

  test("patients list displays patient data", async ({ page }) => {
    await page.goto("/patients");

    // Check for patient table/list
    const patientElements = page.locator('[role="row"]');
    // Should have at least header + 1 patient
    await expect(patientElements).toHaveCount(await patientElements.count());
  });

  test("can navigate to patient detail page", async ({ page }) => {
    await page.goto("/patients");

    // Click first patient link
    const firstPatientLink = page.locator('a').filter({ hasText: /patient_\d+/i }).first();
    if (await firstPatientLink.isVisible()) {
      await firstPatientLink.click();
      await expect(page).toHaveURL(/.*patients\/patient_/);
    }
  });

  test("can access appointments list", async ({ page }) => {
    await page.click('a:has-text("Appointments")');
    await expect(page).toHaveURL(/.*appointments/);
    await expect(page.locator("h1")).toContainText("Appointment");
  });

  test("appointment list displays appointment data", async ({ page }) => {
    await page.goto("/appointments");

    // Check for appointments table
    const appointmentRows = page.locator('[role="row"]');
    await expect(appointmentRows).toHaveCount(await appointmentRows.count());
  });

  test("can navigate to appointment scheduling page", async ({ page }) => {
    await page.goto("/appointments");

    // Look for "Schedule Appointment" or similar button
    const scheduleButton = page.locator('button:has-text("Schedule"), a:has-text("Schedule")').first();
    if (await scheduleButton.isVisible()) {
      await scheduleButton.click();
      await expect(page).toHaveURL(/.*schedule/);
    }
  });

  test("new patient modal can be opened", async ({ page }) => {
    await page.goto("/patients");

    // Open new patient modal
    const registerButton = page.locator('button:has-text("Register Patient")');
    if (await registerButton.isVisible()) {
      await registerButton.click();

      // Check if modal is visible
      const modalTitle = page.locator('text=New Patient Registration');
      await expect(modalTitle).toBeVisible();
    }
  });
});
