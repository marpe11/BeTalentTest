import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SidebarComponent } from '../pages/SidebarComponent';
import { USERS } from '../data/users';

test.describe('Logout', () => {
  async function loginAs(page: Parameters<typeof test>[1] extends { page: infer P } ? P : never, user: typeof USERS[keyof typeof USERS]) {
    const loginPage = new LoginPage(page as Parameters<typeof loginAs>[0]);
    await loginPage.goto();
    await loginPage.loginAs(user);
    await (page as Parameters<typeof loginAs>[0]).waitForURL(/inventory\.html/);
  }

  test('logout via sidebar redireciona para login', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.loginAs(USERS.standard);
    await page.waitForURL(/inventory\.html/);

    const sidebar = new SidebarComponent(page);
    await sidebar.logout();
    await expect(page).toHaveURL('/');
    await expect(new LoginPage(page).loginButton).toBeVisible();
  });

  test('após logout, navegar para /inventory.html redireciona ao login', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.loginAs(USERS.standard);
    await page.waitForURL(/inventory\.html/);

    const sidebar = new SidebarComponent(page);
    await sidebar.logout();

    await page.goto('/inventory.html');
    await expect(page).toHaveURL('/');
  });

  test('formulário de login aparece limpo após logout', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.loginAs(USERS.standard);
    await page.waitForURL(/inventory\.html/);

    const sidebar = new SidebarComponent(page);
    await sidebar.logout();

    await expect(login.usernameInput).toHaveValue('');
    await expect(login.passwordInput).toHaveValue('');
  });

  test('todos os usuários válidos conseguem fazer logout', async ({ page }) => {
    const usersToTest = [USERS.standard, USERS.problem, USERS.error, USERS.visual] as const;

    for (const user of usersToTest) {
      const login = new LoginPage(page);
      await login.goto();
      await login.loginAs(user);
      await page.waitForURL(/inventory\.html/);

      const sidebar = new SidebarComponent(page);
      await sidebar.logout();
      await expect(page).toHaveURL('/');
    }
  });
});
