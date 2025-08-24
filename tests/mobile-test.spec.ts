import { test, expect } from '@playwright/test';

test.describe('Mobile Responsiveness Tests', () => {
  test('should work on iPhone SE size', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check if header is readable
    await expect(page.locator('h1')).toBeVisible();

    // Check if form elements stack properly
    const input = page.locator('#videoInput');
    const select = page.locator('#langSelect');
    const button = page.locator('button[type="submit"]');

    await expect(input).toBeVisible();
    await expect(select).toBeVisible();
    await expect(button).toBeVisible();

    // Button should not be cut off
    const buttonBox = await button.boundingBox();
    expect(buttonBox.x + buttonBox.width).toBeLessThanOrEqual(375);

    // Test functionality on mobile
    await page.fill('#videoInput', 'T7M3PpjBZzw');
    await page.selectOption('#langSelect', 'ru');
    await page.click('button[type="submit"]');

    // Should work on mobile
    await expect(page.locator('#results')).toBeVisible({ timeout: 30000 });
  });

  test('should work on tablet size', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // Test form layout on tablet
    await page.fill('#videoInput', 'T7M3PpjBZzw');
    await page.selectOption('#langSelect', 'ru');
    await page.click('button[type="submit"]');

    await expect(page.locator('#results')).toBeVisible({ timeout: 30000 });

    // On tablet, video and captions might be side by side or stacked
    const videoPlayer = page.locator('#videoPlayer');
    const captionsList = page.locator('#captionsList');

    await expect(videoPlayer).toBeVisible();
    await expect(captionsList).toBeVisible();
  });

  test('theme toggle should work on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 }); // iPhone 5 size
    await page.goto('/');

    const themeToggle = page.locator('#themeToggle');
    await expect(themeToggle).toBeVisible();

    // Should be able to tap theme toggle on small screen
    await themeToggle.click();

    const html = page.locator('html');
    const hasDarkTheme = await html.evaluate(el => el.classList.contains('dark'));
    expect(hasDarkTheme).toBe(true);
  });
});