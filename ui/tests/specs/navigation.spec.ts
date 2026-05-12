import { test, expect } from '../fixtures/auth.fixture';
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SidebarComponent } from '../pages/SidebarComponent';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Navegação', () => {
  test('sidebar abre e fecha corretamente', async ({ authenticatedPage: page }) => {
    const sidebar = new SidebarComponent(page);
    await sidebar.open();
    await expect(page.locator('#inventory_sidebar_link')).toBeVisible();
    await sidebar.close();
    // aria-hidden="true" é o sinal de fechamento do react-burger-menu (funciona em Chromium e Firefox)
    await expect(page.locator('.bm-menu-wrap')).toHaveAttribute('aria-hidden', 'true');
  });

  test('link All Items navega para o inventário', async ({ authenticatedPage: page }) => {
    await page.goto('/cart.html');
    const sidebar = new SidebarComponent(page);
    await sidebar.goToAllItems();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('link About navega para saucelabs.com', async ({ authenticatedPage: page }) => {
    const sidebar = new SidebarComponent(page);
    await sidebar.open();
    await sidebar.aboutLink.click();
    await expect(page).toHaveURL(/saucelabs\.com/, { timeout: 15_000 });
  });

  test('Reset App State limpa o carrinho', async ({ authenticatedPage: page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addItemToCartByName('Sauce Labs Backpack');
    expect(await inventory.getCartBadgeCount()).toBe(1);

    const sidebar = new SidebarComponent(page);
    await sidebar.resetAppState();
    expect(await inventory.getCartBadgeCount()).toBe(0);
  });

  test('ícone do carrinho está presente na página de inventário', async ({ authenticatedPage: page }) => {
    await expect(page.locator('.shopping_cart_link')).toBeVisible();
  });

  test('ícone do carrinho está presente na página do carrinho', async ({ authenticatedPage: page }) => {
    await page.goto('/cart.html');
    await expect(page.locator('.shopping_cart_link')).toBeVisible();
  });

  test('botão voltar do detalhe do produto retorna ao inventário', async ({ authenticatedPage: page }) => {
    await page.locator('.inventory_item_name').first().click();
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('acesso não autenticado a /inventory.html redireciona ao login', async ({ page: newPage }) => {
    await newPage.goto('/inventory.html');
    await expect(newPage).toHaveURL('/');
  });

  test('acesso não autenticado a /cart.html redireciona ao login', async ({ page: newPage }) => {
    await newPage.goto('/cart.html');
    await expect(newPage).toHaveURL('/');
  });

  test('ícone do carrinho leva à página do carrinho', async ({ authenticatedPage: page }) => {
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(/cart\.html/);
  });
});
