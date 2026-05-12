import { test, expect } from '../fixtures/auth.fixture';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

test.describe('Carrinho', () => {
  test('carrinho está vazio no primeiro acesso após login', async ({ authenticatedPage: page }) => {
    const cart = new CartPage(page);
    await cart.goto();
    expect(await cart.getItemCount()).toBe(0);
  });

  test('itens adicionados aparecem no carrinho', async ({ authenticatedPage: page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addItemToCartByName('Sauce Labs Backpack');

    const cart = new CartPage(page);
    await cart.goto();
    const names = await cart.getItemNames();
    expect(names).toContain('Sauce Labs Backpack');
  });

  test('itens mantêm nome e preço corretos no carrinho', async ({ authenticatedPage: page }) => {
    const inventory = new InventoryPage(page);
    const prices = await inventory.getItemPrices();
    await inventory.addItemToCartByName('Sauce Labs Backpack');

    const cart = new CartPage(page);
    await cart.goto();
    const cartPrices = await cart.getItemPrices();
    expect(cartPrices[0]).toBe(prices[0]);
  });

  test('remover item da página do carrinho o remove da lista', async ({ authenticatedPage: page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addItemToCartByName('Sauce Labs Backpack');

    const cart = new CartPage(page);
    await cart.goto();
    expect(await cart.getItemCount()).toBe(1);
    await cart.removeItemByName('Sauce Labs Backpack');
    expect(await cart.getItemCount()).toBe(0);
  });

  test('remover todos os itens deixa carrinho vazio', async ({ authenticatedPage: page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addItemToCartByName('Sauce Labs Backpack');
    await inventory.addItemToCartByName('Sauce Labs Bike Light');

    const cart = new CartPage(page);
    await cart.goto();
    await cart.removeAllItems();
    expect(await cart.getItemCount()).toBe(0);
  });

  test('badge desaparece quando o carrinho está vazio', async ({ authenticatedPage: page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addItemToCartByName('Sauce Labs Backpack');
    expect(await inventory.getCartBadgeCount()).toBe(1);

    const cart = new CartPage(page);
    await cart.goto();
    await cart.removeItemByName('Sauce Labs Backpack');

    await page.goto('/inventory.html');
    expect(await inventory.getCartBadgeCount()).toBe(0);
    await expect(page.locator('.shopping_cart_badge')).toBeHidden();
  });

  test('Continue Shopping retorna ao inventário', async ({ authenticatedPage: page }) => {
    const cart = new CartPage(page);
    await cart.goto();
    await cart.continueShopping();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('itens persistem ao navegar para inventário e voltar', async ({ authenticatedPage: page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addItemToCartByName('Sauce Labs Backpack');

    const cart = new CartPage(page);
    await cart.goto();
    await cart.continueShopping();
    await cart.goto();
    expect(await cart.getItemCount()).toBe(1);
  });

  test('badge no carrinho reflete o número de itens adicionados', async ({ authenticatedPage: page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addAllItemsToCart();
    expect(await inventory.getCartBadgeCount()).toBe(6);
  });
});
