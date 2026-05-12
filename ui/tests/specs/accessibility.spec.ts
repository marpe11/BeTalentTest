import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { SidebarComponent } from '../pages/SidebarComponent';
import { USERS } from '../data/users';
import { runAccessibilityScan } from '../helpers/axe-helper';

async function login(page: Parameters<typeof test>[1] extends { page: infer P } ? P : never) {
  const p = page as Parameters<typeof login>[0];
  const loginPage = new LoginPage(p);
  await loginPage.goto();
  await loginPage.loginAs(USERS.standard);
  await p.waitForURL(/inventory\.html/);
}

test.describe('Acessibilidade (WCAG 2.1 AA)', () => {
  test('página de login não tem violações de acessibilidade', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    const results = await runAccessibilityScan(page);
    expect(results.violations).toEqual([]);
  });

  test('estado de erro no login não tem violações', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginButton.click();
    const results = await runAccessibilityScan(page);
    expect(results.violations).toEqual([]);
  });

  test('página de inventário não tem violações de acessibilidade', async ({ page }) => {
    await login(page);
    const results = await runAccessibilityScan(page);
    expect(results.violations).toEqual([]);
  });

  test('sidebar aberta não tem violações de acessibilidade', async ({ page }) => {
    await login(page);
    const sidebar = new SidebarComponent(page);
    await sidebar.open();
    const results = await runAccessibilityScan(page);
    expect(results.violations).toEqual([]);
    await sidebar.close();
  });

  test('página de detalhe do produto não tem violações', async ({ page }) => {
    await login(page);
    await page.locator('.inventory_item_name').first().click();
    const results = await runAccessibilityScan(page);
    expect(results.violations).toEqual([]);
  });

  test('página do carrinho não tem violações de acessibilidade', async ({ page }) => {
    await login(page);
    const inventory = new InventoryPage(page);
    await inventory.addItemToCartByName('Sauce Labs Backpack');
    await inventory.goToCart();
    const results = await runAccessibilityScan(page);
    expect(results.violations).toEqual([]);
  });

  test('checkout Step 1 não tem violações de acessibilidade', async ({ page }) => {
    await login(page);
    const inventory = new InventoryPage(page);
    await inventory.addItemToCartByName('Sauce Labs Backpack');
    await inventory.goToCart();
    await new CartPage(page).proceedToCheckout();
    const results = await runAccessibilityScan(page);
    expect(results.violations).toEqual([]);
  });

  test('checkout Step 2 não tem violações de acessibilidade', async ({ page }) => {
    await login(page);
    const inventory = new InventoryPage(page);
    await inventory.addItemToCartByName('Sauce Labs Backpack');
    await inventory.goToCart();
    await new CartPage(page).proceedToCheckout();
    const step1 = new CheckoutStepOnePage(page);
    await step1.fillForm('João', 'Silva', '01310-100');
    await step1.continueToNextStep();
    const results = await runAccessibilityScan(page);
    expect(results.violations).toEqual([]);
  });

  test('página de confirmação não tem violações de acessibilidade', async ({ page }) => {
    await login(page);
    const inventory = new InventoryPage(page);
    await inventory.addItemToCartByName('Sauce Labs Backpack');
    await inventory.goToCart();
    await new CartPage(page).proceedToCheckout();
    const step1 = new CheckoutStepOnePage(page);
    await step1.fillForm('João', 'Silva', '01310-100');
    await step1.continueToNextStep();
    await new CheckoutStepTwoPage(page).finish();
    const results = await runAccessibilityScan(page);
    expect(results.violations).toEqual([]);
  });

  test('contraste de cores atende WCAG AA no inventário', async ({ page }) => {
    await login(page);
    const results = await runAccessibilityScan(page, { rules: ['color-contrast'] });
    expect(results.violations).toEqual([]);
  });
});
