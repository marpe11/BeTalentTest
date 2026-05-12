import { test, expect } from '../fixtures/auth.fixture';
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { USERS } from '../data/users';

test.describe('Inventário e Produtos', () => {
  test('página exibe 6 produtos', async ({ authenticatedPage: page }) => {
    const inventory = new InventoryPage(page);
    expect(await inventory.getItemCount()).toBe(6);
  });

  test('todos os produtos têm nome, preço, descrição e imagem', async ({ authenticatedPage: page }) => {
    const names        = await page.locator('.inventory_item_name').allTextContents();
    const prices       = await page.locator('.inventory_item_price').allTextContents();
    const descriptions = await page.locator('.inventory_item_desc').allTextContents();
    const images       = await page.locator('.inventory_item_img img').count();

    expect(names.length).toBe(6);
    expect(prices.length).toBe(6);
    expect(descriptions.length).toBe(6);
    expect(images).toBe(6);

    for (const price of prices) {
      expect(price).toMatch(/^\$\d+\.\d{2}$/);
    }
  });

  test('ordenação A-Z produz ordem alfabética correta', async ({ authenticatedPage: page }) => {
    const inventory = new InventoryPage(page);
    await inventory.sortBy('az');
    const names = await inventory.getItemNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('ordenação Z-A produz ordem alfabética inversa', async ({ authenticatedPage: page }) => {
    const inventory = new InventoryPage(page);
    await inventory.sortBy('za');
    const names = await inventory.getItemNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  test('ordenação Price Low-High produz preços crescentes', async ({ authenticatedPage: page }) => {
    const inventory = new InventoryPage(page);
    await inventory.sortBy('lohi');
    const prices = await inventory.getItemPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('ordenação Price High-Low produz preços decrescentes', async ({ authenticatedPage: page }) => {
    const inventory = new InventoryPage(page);
    await inventory.sortBy('hilo');
    const prices = await inventory.getItemPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  test('adicionar item incrementa badge do carrinho para 1', async ({ authenticatedPage: page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addItemToCartByName('Sauce Labs Backpack');
    expect(await inventory.getCartBadgeCount()).toBe(1);
  });

  test('adicionar múltiplos itens reflete contagem correta no badge', async ({ authenticatedPage: page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addItemToCartByName('Sauce Labs Backpack');
    await inventory.addItemToCartByName('Sauce Labs Bike Light');
    await inventory.addItemToCartByName('Sauce Labs Bolt T-Shirt');
    expect(await inventory.getCartBadgeCount()).toBe(3);
  });

  test('botão muda de Add to Cart para Remove após clique', async ({ authenticatedPage: page }) => {
    const item = page.locator('.inventory_item').first();
    const btn  = item.locator('button');
    await expect(btn).toHaveText('Add to cart');
    await btn.click();
    await expect(btn).toHaveText('Remove');
  });

  test('remover item no inventário decrementa o badge', async ({ authenticatedPage: page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addItemToCartByName('Sauce Labs Backpack');
    expect(await inventory.getCartBadgeCount()).toBe(1);
    await inventory.removeItemFromCartByName('Sauce Labs Backpack');
    expect(await inventory.getCartBadgeCount()).toBe(0);
  });

  test('clicar no nome do produto navega para a página de detalhe', async ({ authenticatedPage: page }) => {
    const inventory = new InventoryPage(page);
    const name = (await inventory.getItemNames())[0];
    await inventory.clickItemByName(name);
    await expect(page).toHaveURL(/inventory-item\.html/);
    await expect(page.locator('.inventory_details_name')).toHaveText(name);
  });

  test('clicar na imagem do produto navega para a página de detalhe', async ({ authenticatedPage: page }) => {
    await page.locator('.inventory_item_img').first().click();
    await expect(page).toHaveURL(/inventory-item\.html/);
  });

  test('problem_user: imagens de produtos são incorretas [BUG]', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAs(USERS.problem);
    await page.waitForURL(/inventory\.html/);

    const images = await page.locator('.inventory_item_img img').evaluateAll(
      (imgs: Element[]) => (imgs as HTMLImageElement[]).map(img => img.src)
    );

    const uniqueImages = new Set(images);
    // BUG: problem_user exibe a mesma imagem para todos os produtos
    expect(uniqueImages.size).toBeLessThan(images.length);
  });
});
