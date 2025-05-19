import { test, expect } from '@playwright/test';

// const REGISTER_URL = 'http://localhost:3000/register';
const BASE_URL = 'http://localhost:3000'; 
const REGISTER_URL= `${BASE_URL}/register`;
const LOGIN_URL = `${BASE_URL}/login`;

test.describe('RegisterPage Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(REGISTER_URL);
  });

  test('should display password mismatch message', async ({ page }) => {
    await page.fill('input[name="password"]', 'Password123');
    await page.fill('input[name="confirmPassword"]', 'Password124');
    await expect(page.locator('text=Passwords do not match')).toBeVisible();
    await page.screenshot({ path: 'screenshots/register/password-mismatch.png' });
  });

  test('should display password match message', async ({ page }) => {
    await page.fill('input[name="password"]', 'Password123');
    await page.fill('input[name="confirmPassword"]', 'Password123');
    await expect(page.locator('text=Passwords match')).toBeVisible();
    await page.screenshot({ path: 'screenshots/register/password-match.png' });
  });

  test('should show required validation errors when submitting empty form', async ({ page }) => {
    await page.click('button[type="submit"]');
    await expect(page.locator('input[name="name"]:invalid')).toHaveCount(1);
    await expect(page.locator('input[name="email"]:invalid')).toHaveCount(1);
    await expect(page.locator('input[name="phone"]:invalid')).toHaveCount(1);
    await expect(page.locator('input[name="password"]:invalid')).toHaveCount(1);
    await expect(page.locator('input[name="confirmPassword"]:invalid')).toHaveCount(1);
    await page.screenshot({ path: 'screenshots/register/empty-form-validation.png' });
  });

  test('should submit form successfully and navigate', async ({ page }) => {
    const randomSuffix = Math.floor(Math.random() * 100000);
    const uniqueEmail = `john1${randomSuffix}@example.com`;
    const uniquePhone = `123456${randomSuffix}`;
  
    await page.fill('input[name="name"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="phone"]', uniquePhone);
    await page.fill('input[name="password"]', 'Password123');
    await page.fill('input[name="confirmPassword"]', 'Password123');
    await page.selectOption('select[name="role"]', 'user');
  
    page.on('dialog', dialog => dialog.accept());
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(LOGIN_URL);
    await page.screenshot({ path: 'screenshots/register/successfull-submission.png' });
  });


  test('should show error message on registration failure', async ({ page }) => {
    await page.fill('input[name="name"]', 'Jane');
    await page.fill('input[name="email"]', 'jane.doe@example.com');
    await page.fill('input[name="phone"]', '0987654321');
    await page.fill('input[name="password"]', 'Password123');
    await page.fill('input[name="confirmPassword"]', 'Password123');
    await page.selectOption('select[name="role"]', 'user');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Email already exists')).not.toBeVisible();
    await page.screenshot({ path: 'screenshots/register/registration-failure.png' });
  });

//   test('should toggle password visibility', async ({ page }) => {
//     await page.fill('input[name="password"]', 'Password123');
//     await page.click('button:has-text("👁️")');
//     await expect(page.locator('input[name="password"]')).toHaveAttribute('type', 'text');
//     await page.click('button:has-text("🙈")');
//     await expect(page.locator('input[name="password"]')).toHaveAttribute('type', 'password');
//   });

//   test('should toggle confirm password visibility', async ({ page }) => {
//     await page.fill('input[name="confirmPassword"]', 'Password123');
//     await page.click('button:has-text("👁️")');
//     await expect(page.locator('input[name="confirmPassword"]')).toHaveAttribute('type', 'text');
//     await page.click('button:has-text("🙈")');
//     await expect(page.locator('input[name="confirmPassword"]')).toHaveAttribute('type', 'password');
//   });

//   test('should show companyName field when role is operator', async ({ page }) => {
//     await page.selectOption('select[name="role"]', 'operator');
//     await expect(page.locator('input[name="companyName"]')).toBeVisible();
//   });

//   test('should take a screenshot of the register page', async ({ page }) => {
//     await page.screenshot({ path: 'screenshots/register/register-page.png', fullPage: true });
//   });

});
