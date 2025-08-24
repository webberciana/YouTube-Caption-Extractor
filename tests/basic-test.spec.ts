import { test, expect } from '@playwright/test';

test.describe('Basic YouTube Caption Extractor Tests', () => {
  test('should load the application correctly', async ({ page }) => {
    await page.goto('/');

    // Check if the title is correct
    await expect(page).toHaveTitle('YouTube Caption Extractor');

    // Check if main heading is visible
    await expect(page.locator('h1')).toContainText('YouTube Caption Extractor');

    // Check if form elements are present
    await expect(page.locator('#videoInput')).toBeVisible();
    await expect(page.locator('#langSelect')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show error for empty input', async ({ page }) => {
    await page.goto('/');

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // HTML5 validation should prevent submission
    const isValid = await page.locator('#videoInput').evaluate((input: HTMLInputElement) => input.validity.valid);
    expect(isValid).toBe(false);
  });

  test('should attempt to fetch captions for valid video ID', async ({ page }) => {
    await page.goto('/');

    // Enter valid video ID (using the example from the requirements)
    await page.fill('#videoInput', 'T7M3PpjBZzw');
    await page.selectOption('#langSelect', 'ru');
    await page.click('button[type="submit"]');

    // Wait for loading to appear
    await expect(page.locator('#loading')).toBeVisible();

    // Wait a bit for the API call to complete
    await page.waitForTimeout(10000);

    // Either results or error should be visible
    const resultsVisible = await page.locator('#results').isVisible();
    const errorVisible = await page.locator('#error').isVisible();

    expect(resultsVisible || errorVisible).toBeTruthy();

    if (resultsVisible) {
      // If results are shown, check basic structure
      await expect(page.locator('#videoPlayer')).toBeVisible();
      await expect(page.locator('#videoTitle')).toBeVisible();
      await expect(page.locator('#captionsList')).toBeVisible();
    }
  });
});