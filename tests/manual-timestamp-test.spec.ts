import { test, expect } from '@playwright/test';

test('manual timestamp test', async ({ page }) => {
  // Enable console logging for debugging
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('/');

  // Enter valid video ID
  await page.fill('#videoInput', 'T7M3PpjBZzw');
  await page.selectOption('#langSelect', 'ru');
  await page.click('button[type="submit"]');

  // Wait for results to appear
  await expect(page.locator('#results')).toBeVisible({ timeout: 30000 });

  // Wait for the player div to appear
  await expect(page.locator('#youtube-player')).toBeVisible();

  // Wait a bit more for the YouTube API and player to initialize
  await page.waitForTimeout(5000);

  // Check if captions are loaded
  const captions = page.locator('#captionsList .caption-item');
  await expect(captions.first()).toBeVisible();

  const captionCount = await captions.count();
  console.log(`Found ${captionCount} captions`);
  expect(captionCount).toBeGreaterThan(0);

  // Try clicking on the second caption
  if (captionCount > 1) {
    const secondCaption = captions.nth(1);

    // Get the timestamp text before clicking
    const timestampElement = secondCaption.locator('span.text-blue-600').first();
    const timestampText = await timestampElement.textContent();
    console.log(`Clicking on timestamp: ${timestampText}`);

    await secondCaption.click();

    // Check if caption gets highlighted
    await expect(secondCaption).toHaveClass(/bg-blue-100/);
    console.log('Caption highlighted successfully');

    // Check if YouTube player object exists
    const playerExists = await page.evaluate(() => {
      return typeof window.youtubePlayer !== 'undefined' && window.youtubePlayer !== null;
    });

    console.log('YouTube player exists:', playerExists);

    if (playerExists) {
      // Check if seekTo method exists
      const hasSeekTo = await page.evaluate(() => {
        return typeof window.youtubePlayer.seekTo === 'function';
      });
      console.log('Player has seekTo method:', hasSeekTo);
      expect(hasSeekTo).toBe(true);
    }
  }
});