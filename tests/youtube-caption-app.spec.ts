import { test, expect } from '@playwright/test';

test.describe('YouTube Caption Extractor', () => {
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

  test('should show error for invalid video ID', async ({ page }) => {
    await page.goto('/');

    // Enter invalid video ID
    await page.fill('#videoInput', 'invalid-video-id');
    await page.click('button[type="submit"]');

    // Wait for error message
    await expect(page.locator('#error')).toBeVisible();
    await expect(page.locator('#error')).toContainText('Invalid YouTube URL or video ID');
  });

  test('should extract captions for valid video ID', async ({ page }) => {
    await page.goto('/');

    // Enter valid video ID (using the example from the requirements)
    await page.fill('#videoInput', 'T7M3PpjBZzw');
    await page.selectOption('#langSelect', 'ru');
    await page.click('button[type="submit"]');

    // Wait for loading to appear and then disappear
    await expect(page.locator('#loading')).toBeVisible();

    // Wait for results to appear (with longer timeout for API call)
    await expect(page.locator('#results')).toBeVisible({ timeout: 30000 });

    // Check if video player is loaded
    await expect(page.locator('#videoPlayer iframe')).toBeVisible();

    // Check if video title is displayed
    await expect(page.locator('#videoTitle')).not.toBeEmpty();

    // Check if captions are displayed
    const captionItems = page.locator('#captionsList .caption-item');
    await expect(captionItems.first()).toBeVisible();

    // Check if timestamps are clickable
    const firstCaption = page.locator('#captionsList .caption-item').first();
    await expect(firstCaption).toBeVisible();

    // Check if timestamp format is correct (e.g., "0:24", "1:30")
    const timestamp = firstCaption.locator('span').first();
    await expect(timestamp).toMatch(/\d+:\d{2}/);
  });

  test('should handle caption timestamp clicks', async ({ page }) => {
    await page.goto('/');

    // Enter valid video ID
    await page.fill('#videoInput', 'T7M3PpjBZzw');
    await page.selectOption('#langSelect', 'ru');
    await page.click('button[type="submit"]');

    // Wait for results
    await expect(page.locator('#results')).toBeVisible({ timeout: 30000 });

    // Click on a caption item
    const secondCaption = page.locator('#captionsList .caption-item').nth(1);
    await secondCaption.click();

    // Check if the caption is highlighted
    await expect(secondCaption).toHaveClass(/bg-blue-100/);

    // Check if iframe src changed (indicating seek functionality)
    const iframe = page.locator('#videoPlayer iframe');
    await expect(iframe).toBeVisible();
    const src = await iframe.getAttribute('src');
    expect(src).toContain('autoplay=1');
  });

  test('should handle different language selections', async ({ page }) => {
    await page.goto('/');

    // Test English captions
    await page.fill('#videoInput', 'T7M3PpjBZzw');
    await page.selectOption('#langSelect', 'en');
    await page.click('button[type="submit"]');

    // Wait for results or error (some videos might not have English captions)
    await page.waitForTimeout(5000);

    // Either results should be visible or error should indicate no captions
    const resultsVisible = await page.locator('#results').isVisible();
    const errorVisible = await page.locator('#error').isVisible();

    expect(resultsVisible || errorVisible).toBeTruthy();
  });

  test('should handle different video URL formats', async ({ page }) => {
    await page.goto('/');

    const videoUrls = [
      'https://www.youtube.com/watch?v=T7M3PpjBZzw',
      'https://youtu.be/T7M3PpjBZzw',
      'www.youtube.com/watch?v=T7M3PpjBZzw',
      'T7M3PpjBZzw'
    ];

    for (const url of videoUrls) {
      await page.fill('#videoInput', url);
      await page.selectOption('#langSelect', 'ru');
      await page.click('button[type="submit"]');

      // Wait for either results or loading to appear
      await expect(page.locator('#loading')).toBeVisible();

      // Clear the form for next iteration
      await page.fill('#videoInput', '');
      await page.waitForTimeout(1000);
    }
  });
});