import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { USERS } from '../data/users';

type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAs(USERS.standard);
    await page.waitForURL('**/inventory.html');
    await use(page);
  },
});

export { expect } from '@playwright/test';
