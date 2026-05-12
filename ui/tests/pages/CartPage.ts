import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(private page: Page) {
    this.cartItems              = page.locator('.cart_item');
    this.checkoutButton         = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async goto() {
    await this.page.goto('/cart.html');
  }

  async getItemNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  async getItemPrices(): Promise<number[]> {
    const texts = await this.page.locator('.inventory_item_price').allTextContents();
    return texts.map(t => parseFloat(t.replace('$', '')));
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async removeItemByName(name: string) {
    const item = this.page.locator('.cart_item').filter({ hasText: name });
    await item.locator('[data-test^="remove"]').click();
  }

  async removeAllItems() {
    const removeButtons = this.page.locator('[data-test^="remove"]');
    while ((await removeButtons.count()) > 0) {
      await removeButtons.first().click();
    }
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}
