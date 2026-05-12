import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { SidebarComponent } from '../pages/SidebarComponent';
import { USERS } from '../data/users';

async function doLogin(page: Parameters<typeof test>[1] extends { page: infer P } ? P : never) {
  const p = page as Parameters<typeof doLogin>[0];
  const loginPage = new LoginPage(p);
  await loginPage.goto();
  await loginPage.loginAs(USERS.standard);
  await p.waitForURL(/inventory\.html/);
}

test.describe('Responsividade (Mobile)', () => {
  test('página de login renderiza corretamente no mobile', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await page.screenshot({ path: 'test-results/screenshots/mobile-login.png', fullPage: true });
  });

  test('página de inventário renderiza itens no mobile', async ({ page }) => {
    await doLogin(page);
    const inventory = new InventoryPage(page);
    expect(await inventory.getItemCount()).toBe(6);
    await page.screenshot({ path: 'test-results/screenshots/mobile-inventory.png', fullPage: true });
  });

  test('dropdown de ordenação é utilizável no mobile', async ({ page }) => {
    await doLogin(page);
    const inventory = new InventoryPage(page);
    await inventory.sortBy('za');
    const names = await inventory.getItemNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  test('sidebar é acessível no mobile', async ({ page }) => {
    await doLogin(page);
    const sidebar = new SidebarComponent(page);
    await sidebar.open();
    await expect(page.locator('#inventory_sidebar_link')).toBeVisible();
    await page.screenshot({ path: 'test-results/screenshots/mobile-sidebar.png', fullPage: true });
    await sidebar.close();
  });

  test('página do carrinho renderiza corretamente no mobile', async ({ page }) => {
    await doLogin(page);
    const inventory = new InventoryPage(page);
    await inventory.addItemToCartByName('Sauce Labs Backpack');
    await inventory.goToCart();
    await expect(page).toHaveURL(/cart\.html/);
    await page.screenshot({ path: 'test-results/screenshots/mobile-cart.png', fullPage: true });
  });

  test('formulário de checkout é utilizável no mobile', async ({ page }) => {
    await doLogin(page);
    const inventory = new InventoryPage(page);
    await inventory.addItemToCartByName('Sauce Labs Backpack');
    await inventory.goToCart();
    await new CartPage(page).proceedToCheckout();

    const step1 = new CheckoutStepOnePage(page);
    await expect(step1.firstNameInput).toBeVisible();
    await expect(step1.lastNameInput).toBeVisible();
    await expect(step1.zipInput).toBeVisible();
    await page.screenshot({ path: 'test-results/screenshots/mobile-checkout-step1.png', fullPage: true });
  });

  test('imagens de produtos são visíveis no mobile', async ({ page }) => {
    await doLogin(page);
    const images = page.locator('.inventory_item_img img');
    expect(await images.count()).toBe(6);
    for (let i = 0; i < await images.count(); i++) {
      await expect(images.nth(i)).toBeVisible();
    }
  });

  test('fluxo completo de compra funciona no mobile (E2E)', async ({ page }) => {
    test.setTimeout(90_000);
    await doLogin(page);

    const inventory = new InventoryPage(page);
    await inventory.addItemToCartByName('Sauce Labs Backpack');
    await inventory.goToCart();

    await new CartPage(page).proceedToCheckout();

    const step1 = new CheckoutStepOnePage(page);
    await step1.fillForm('João', 'Silva', '01310-100');
    await step1.continueToNextStep();

    await new CheckoutStepTwoPage(page).finish();

    const complete = new CheckoutCompletePage(page);
    expect(await complete.isOrderComplete()).toBe(true);
    await page.screenshot({ path: 'test-results/screenshots/mobile-order-complete.png', fullPage: true });
  });

  test('badge do carrinho é visível no mobile', async ({ page }) => {
    await doLogin(page);
    const inventory = new InventoryPage(page);
    await inventory.addItemToCartByName('Sauce Labs Backpack');
    await expect(page.locator('.shopping_cart_badge')).toBeVisible();
  });

  test('página de confirmação renderiza corretamente no mobile', async ({ page }) => {
    await doLogin(page);

    const inventory = new InventoryPage(page);
    await inventory.addItemToCartByName('Sauce Labs Backpack');
    await inventory.goToCart();
    await new CartPage(page).proceedToCheckout();

    const step1 = new CheckoutStepOnePage(page);
    await step1.fillForm('João', 'Silva', '01310-100');
    await step1.continueToNextStep();
    await new CheckoutStepTwoPage(page).finish();

    const complete = new CheckoutCompletePage(page);
    await expect(complete.completeHeader).toBeVisible();
    await expect(complete.backHomeButton).toBeVisible();
    await page.screenshot({ path: 'test-results/screenshots/mobile-complete.png', fullPage: true });
  });
});
