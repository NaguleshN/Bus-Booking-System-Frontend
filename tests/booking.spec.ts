import { test, expect } from '@playwright/test';

test('Should able to book the seats', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('nagu@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('123');
  await page.getByRole('textbox', { name: 'Password' }).press('Enter');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'screenshots/bookingPage/trip-search-page.png' });
  await page.getByRole('button', { name: 'Search Trips' }).click();
  await page.screenshot({ path: 'screenshots/bookingPage/trip-booking-page.png' });
  await page.locator('div').filter({ hasText: /^₹12003 seats leftBook Now$/ }).getByRole('button').click();
  await page.getByRole('button', { name: '8' }).click();
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'screenshots/bookingPage/booking-page-alert.png' });
  page.once('dialog', dialog => {
      console.log(`Dialog message: ${dialog.message()}`);
      dialog.dismiss().catch(() => {});
    });
    await page.getByRole('button', { name: 'Confirm Booking' }).click();
    await page.screenshot({ path: 'screenshots/bookingPage/booking-confirm-alert.png' });
});