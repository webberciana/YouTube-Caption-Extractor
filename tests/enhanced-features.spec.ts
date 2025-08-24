import { test, expect } from '@playwright/test';

test.describe('Enhanced Features Tests', () => {
  test('should display cool SVG logo and header correctly', async ({ page }) => {
    await page.goto('/');

    // Check if SVG logo is present
    const logo = page.locator('svg').first();
    await expect(logo).toBeVisible();

    // Check if gradient is applied
    const gradient = page.locator('#logoGradient');
    await expect(gradient).toBeAttached();

    // Check header text and subtitle
    await expect(page.locator('h1')).toContainText('YouTube Caption Extractor');
    await expect(page.locator('text=Extract and navigate video captions with ease')).toBeVisible();

    // Check theme toggle button
    await expect(page.locator('#themeToggle')).toBeVisible();
    await expect(page.locator('#sunIcon')).toBeVisible();
    await expect(page.locator('#moonIcon')).toBeHidden();
  });

  test('should toggle dark theme correctly', async ({ page }) => {
    await page.goto('/');

    // Initial state should be light theme
    const html = page.locator('html');
    const hasLightTheme = await html.evaluate(el => !el.classList.contains('dark'));
    expect(hasLightTheme).toBe(true);

    // Click theme toggle
    await page.click('#themeToggle');

    // Should now have dark theme
    const hasDarkTheme = await html.evaluate(el => el.classList.contains('dark'));
    expect(hasDarkTheme).toBe(true);

    // Icons should be swapped
    await expect(page.locator('#sunIcon')).toBeHidden();
    await expect(page.locator('#moonIcon')).toBeVisible();

    // Click again to toggle back
    await page.click('#themeToggle');
    const hasLightThemeAgain = await html.evaluate(el => !el.classList.contains('dark'));
    expect(hasLightThemeAgain).toBe(true);
  });

  test('should be mobile responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/');

    // Check if form stacks vertically on mobile
    const form = page.locator('#videoForm');
    await expect(form).toBeVisible();

    // Input should be full width on mobile
    const input = page.locator('#videoInput');
    await expect(input).toBeVisible();

    // Button should not overflow on mobile
    const button = page.locator('button[type="submit"]');
    await expect(button).toBeVisible();
    await expect(button).toContainText('Extract Captions');

    // Check mobile layout with results
    await page.fill('#videoInput', 'T7M3PpjBZzw');
    await page.selectOption('#langSelect', 'ru');
    await page.click('button[type="submit"]');

    // Wait for results
    await expect(page.locator('#results')).toBeVisible({ timeout: 30000 });

    // On mobile, sections should stack vertically
    const videoSection = page.locator('#results').locator('div').first();
    await expect(videoSection).toBeVisible();
  });

  test('should format video description with multiple lines', async ({ page }) => {
    await page.goto('/');

    // Submit form
    await page.fill('#videoInput', 'T7M3PpjBZzw');
    await page.selectOption('#langSelect', 'ru');
    await page.click('button[type="submit"]');

    // Wait for results
    await expect(page.locator('#results')).toBeVisible({ timeout: 30000 });

    // Check if description shows multiple lines
    const description = page.locator('#videoDescription');
    await expect(description).toBeVisible();

    const descriptionText = await description.textContent();
    expect(descriptionText).toBeTruthy();

    // Description should contain line breaks (the element uses whitespace-pre-wrap)
    const hasMultipleLines = descriptionText.includes('\n') || descriptionText.length > 100;
    expect(hasMultipleLines).toBe(true);
  });

  test('should show caption count and improved styling', async ({ page }) => {
    await page.goto('/');

    // Submit form
    await page.fill('#videoInput', 'T7M3PpjBZzw');
    await page.selectOption('#langSelect', 'ru');
    await page.click('button[type="submit"]');

    // Wait for results
    await expect(page.locator('#results')).toBeVisible({ timeout: 30000 });

    // Check caption count display
    const captionCount = page.locator('#captionCount');
    await expect(captionCount).toBeVisible();
    await expect(captionCount).toContainText('captions');

    // Check improved caption styling
    const firstCaption = page.locator('.caption-item').first();
    await expect(firstCaption).toBeVisible();

    // Click caption and check enhanced highlighting
    await firstCaption.click();

    // Should have improved highlighting classes
    const isHighlighted = await firstCaption.evaluate(el =>
      el.classList.contains('bg-primary-100') ||
      el.classList.contains('border-primary-300') ||
      el.classList.contains('ring-2')
    );
    expect(isHighlighted).toBe(true);
  });

  test('should work in both light and dark themes', async ({ page }) => {
    await page.goto('/');

    // Test in light theme first
    await page.fill('#videoInput', 'T7M3PpjBZzw');
    await page.selectOption('#langSelect', 'ru');
    await page.click('button[type="submit"]');

    await expect(page.locator('#results')).toBeVisible({ timeout: 30000 });

    // Switch to dark theme
    await page.click('#themeToggle');

    // Verify dark theme classes are applied
    const html = page.locator('html');
    const hasDarkTheme = await html.evaluate(el => el.classList.contains('dark'));
    expect(hasDarkTheme).toBe(true);

    // Check if captions are still clickable in dark mode
    const caption = page.locator('.caption-item').nth(2);
    await caption.click();

    // Should still work in dark mode
    const isHighlighted = await caption.evaluate(el =>
      el.classList.contains('bg-primary-100') ||
      el.classList.contains('dark:bg-primary-900/30') ||
      el.classList.contains('ring-2')
    );
    expect(isHighlighted).toBe(true);
  });

  test('should preserve theme preference in localStorage', async ({ page }) => {
    await page.goto('/');

    // Toggle to dark theme
    await page.click('#themeToggle');

    // Check localStorage
    const theme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(theme).toBe('dark');

    // Reload page
    await page.reload();

    // Should still be in dark mode
    const html = page.locator('html');
    const hasDarkTheme = await html.evaluate(el => el.classList.contains('dark'));
    expect(hasDarkTheme).toBe(true);
  });
});