import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { USERS } from '../data/users';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('standard_user faz login com sucesso', async ({ page }) => {
    await loginPage.loginAs(USERS.standard);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('locked_out_user recebe mensagem de bloqueio', async () => {
    await loginPage.loginAs(USERS.locked);
    expect(await loginPage.isErrorDisplayed()).toBe(true);
    expect(await loginPage.getErrorMessage()).toContain('locked out');
  });

  test('problem_user faz login e acessa inventário', async ({ page }) => {
    await loginPage.loginAs(USERS.problem);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('performance_glitch_user faz login com atraso', async ({ page }) => {
    test.setTimeout(40_000);
    await loginPage.loginAs(USERS.glitch);
    await expect(page).toHaveURL(/inventory\.html/, { timeout: 30_000 });
  });

  test('error_user faz login com sucesso', async ({ page }) => {
    await loginPage.loginAs(USERS.error);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('visual_user faz login com sucesso', async ({ page }) => {
    await loginPage.loginAs(USERS.visual);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('credenciais em branco exibem erro', async () => {
    await loginPage.loginButton.click();
    expect(await loginPage.isErrorDisplayed()).toBe(true);
    expect(await loginPage.getErrorMessage()).toContain('Username is required');
  });

  test('apenas senha preenchida exibe erro de username', async () => {
    await loginPage.passwordInput.fill('secret_sauce');
    await loginPage.loginButton.click();
    expect(await loginPage.getErrorMessage()).toContain('Username is required');
  });

  test('apenas username preenchido exibe erro de senha', async () => {
    await loginPage.usernameInput.fill('standard_user');
    await loginPage.loginButton.click();
    expect(await loginPage.getErrorMessage()).toContain('Password is required');
  });

  test('senha errada exibe erro de credenciais inválidas', async () => {
    await loginPage.login('standard_user', 'wrong_password');
    expect(await loginPage.getErrorMessage()).toContain('Username and password do not match');
  });

  test('mensagem de erro pode ser fechada com botão X', async () => {
    await loginPage.loginButton.click();
    expect(await loginPage.isErrorDisplayed()).toBe(true);
    await loginPage.dismissError();
    expect(await loginPage.isErrorDisplayed()).toBe(false);
  });

  test('página de login possui título e elementos corretos', async ({ page }) => {
    await expect(page).toHaveTitle(/Swag Labs/);
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });
});
