import { test, expect } from '@playwright/test';

test('Ticket booking cancellation', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('nagu@gmail.com');
  await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('123');
  await page.getByRole('textbox', { name: 'Password' }).press('Enter');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('link', { name: 'My Bookings' }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#row-9').getByRole('button', { name: 'Download' }).click();
  const download = await downloadPromise;
  await page.locator('#row-9').getByRole('button', { name: 'Cancel' }).click();
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'screenshots/downloadCancellation/cancellation-page.png' });
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.screenshot({ path: 'screenshots/downloadCancellation/download-cancellation.png' });
  
});