import { test, expect } from '@playwright/test';
const BASE_URL = 'http://localhost:3000';


test.describe('Trip Search Page', () => {
  test('should search for trips based on entered criteria', async ({ page }) => {

    await page.goto(BASE_URL);
    await page.getByLabel('Email').fill('nagu@gmail.com');
    await page.getByLabel('Password').fill('123');
    await page.getByRole('button', { name: /login/i }).click();
  
   
    await page.waitForURL(BASE_URL);

    await page.screenshot({ path: 'screenshots/searchTrip/before-searchTripPage.png' });
    
    const fromInput = page.getByLabel('from');
    await fromInput.fill('Chennai');
    
    
    const searchButton = page.getByRole('button', { name: /search trips/i });
    await searchButton.click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'screenshots/searchTrip/after-searchTripPage.png' });

    const bookingButton = page.getByRole('button', { name: /Book Now/i });
    await bookingButton.click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'screenshots/searchTrip/after-bookingPage.png' });
   
  });
});
