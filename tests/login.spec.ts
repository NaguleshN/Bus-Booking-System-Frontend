import { test, expect } from '@playwright/test';
const BASE_URL = 'http://localhost:3000'; 
const LOGIN_URL = `${BASE_URL}/login`;

test.describe("Login Page", () => {
    test("should display login form", async ({ page }) => {
        await page.goto(LOGIN_URL);
        await expect(page.getByText("Login to Your Account")).toBeVisible();
        await expect(page.getByLabel("Email address")).toBeVisible();
        await expect(page.getByLabel("Password")).toBeVisible();
        await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
        await page.screenshot({ path: 'screenshots/login/login-form.png' });
    });
    test("should toggle password visibility", async ({ page }) => {
        await page.goto(LOGIN_URL);
        const passwordInput = page.getByLabel("Password");
        const toggleButton = page.getByTestId("toggle-password");

        await expect(passwordInput).toHaveAttribute("type", "password");
        await toggleButton.click();
        await expect(passwordInput).toHaveAttribute("type", "text");
        await toggleButton.click();
        await expect(passwordInput).toHaveAttribute("type", "password");
        await page.screenshot({ path: 'screenshots/login/password-visibility.png' });
    });

    test("should update form data on input change", async ({ page }) => {
        await page.goto(LOGIN_URL);
        const emailInput = page.getByLabel("Email address");
        const passwordInput = page.getByLabel("Password");

        await emailInput.fill("Nagulesh");
        await passwordInput.fill("Password123");
        await expect(emailInput).toHaveValue("Nagulesh");
        await expect(passwordInput).toHaveValue("Password123");
        await page.screenshot({ path: 'screenshots/login/form-data-update.png' });
    });

    test('should show error alert on login failure', async ({ page }) => {
        
        await page.goto(LOGIN_URL);
    
        page.on('dialog', async dialog => {
          expect(dialog.message()).toBe('User not Found');
          await dialog.dismiss();
        });
    
        await page.getByLabel('Email address').fill('wrong@example.com');
        await page.getByLabel('Password').fill('wrongpass');
        await page.getByRole('button', { name: 'Login' }).click();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'screenshots/login/login-failure.png' });
      });

      test('should login successfully and store auth token', async ({ page }) => {
        const mockResponse = {
          data: {
            message: 'Login successful',
            data: {
              token: 'mock-token',
              user: {
                role: 'user',
              },
            },
          },
        };
    
       
        await page.goto(LOGIN_URL);
    
        page.on('dialog', async dialog => {
          expect(dialog.message()).toBe('Login successful');
          await dialog.dismiss();
        });
    
        await page.getByLabel('Email address').fill('nagu@gmail.com');
        await page.getByLabel('Password').fill('123');
        await page.getByRole('button', { name: 'Login' }).click();
    
        await page.waitForURL(BASE_URL + '/');
    
        const token = await page.evaluate(() =>
          JSON.parse(localStorage.getItem('AuthToken') || '{}')
        );
    
        expect(token.token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
        expect(token.role).toBe('user');
        expect(token.expiry).toBeGreaterThan(Date.now());
        await page.screenshot({ path: 'screenshots/login/login-success.png' });
    });

    
})