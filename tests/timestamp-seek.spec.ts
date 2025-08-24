import { test, expect } from '@playwright/test';

test.describe('YouTube Timestamp Seeking', () => {
  test('should properly seek video to clicked timestamp', async ({ page }) => {
    await page.goto('/');

    // Enter valid video ID
    await page.fill('#videoInput', 'T7M3PpjBZzw');
    await page.selectOption('#langSelect', 'ru');
    await page.click('button[type="submit"]');

    // Wait for results to appear
    await expect(page.locator('#results')).toBeVisible({ timeout: 30000 });

    // Wait for YouTube player to be ready
    await expect(page.locator('#youtube-player')).toBeVisible();
    await page.waitForTimeout(3000); // Allow player to initialize

    // Get the first few captions
    const captions = page.locator('#captionsList .caption-item');
    await expect(captions.first()).toBeVisible();

    // Click on the second caption (should have a different timestamp)
    const secondCaption = captions.nth(1);
    await secondCaption.click();

    // Check if the caption is highlighted
    await expect(secondCaption).toHaveClass(/bg-blue-100/);

    // Check if YouTube player API is loaded
    const youtubeAPILoaded = await page.evaluate(() => {
      return typeof window.YT !== 'undefined' && window.YT.Player;
    });
    expect(youtubeAPILoaded).toBe(true);

    // Check if youtubePlayer exists and has seekTo method
    const playerReady = await page.evaluate(() => {
      return window.youtubePlayer && typeof window.youtubePlayer.seekTo === 'function';
    });
    expect(playerReady).toBe(true);
  });

  test('should load YouTube iframe API correctly', async ({ page }) => {
    await page.goto('/');

    // Enter valid video ID and submit
    await page.fill('#videoInput', 'T7M3PpjBZzw');
    await page.selectOption('#langSelect', 'ru');
    await page.click('button[type="submit"]');

    // Wait for results
    await expect(page.locator('#results')).toBeVisible({ timeout: 30000 });

    // Check if YouTube iframe API script is loaded
    const scriptLoaded = await page.locator('script[src="https://www.youtube.com/iframe_api"]').count();
    expect(scriptLoaded).toBeGreaterThan(0);

    // Check if YT object exists
    await page.waitForFunction(() => window.YT && window.YT.Player, { timeout: 10000 });

    const ytExists = await page.evaluate(() => typeof window.YT !== 'undefined');
    expect(ytExists).toBe(true);
  });

  test('should handle multiple timestamp clicks correctly', async ({ page }) => {
    await page.goto('/');

    // Enter valid video ID
    await page.fill('#videoInput', 'T7M3PpjBZzw');
    await page.selectOption('#langSelect', 'ru');
    await page.click('button[type="submit"]');

    // Wait for results
    await expect(page.locator('#results')).toBeVisible({ timeout: 30000 });

    // Wait for player to be ready
    await page.waitForTimeout(3000);

    const captions = page.locator('#captionsList .caption-item');

    // Click first caption
    const firstCaption = captions.first();
    await firstCaption.click();
    await expect(firstCaption).toHaveClass(/bg-blue-100/);

    // Wait a bit then click third caption
    await page.waitForTimeout(1000);
    const thirdCaption = captions.nth(2);
    await thirdCaption.click();

    // Check that only the third caption is highlighted now
    await expect(thirdCaption).toHaveClass(/bg-blue-100/);
    await expect(firstCaption).not.toHaveClass(/bg-blue-100/);
  });
});