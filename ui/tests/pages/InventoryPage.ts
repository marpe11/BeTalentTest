import { Page, Locator } from '@playwright/test';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

const SORT_VALUES: Record<SortOption, string> = {
  az:   'az',
  za:   'za',
  lohi: 'lohi',
  hilo: 'hilo',
};

export class InventoryPage {
  readonly sortDropdown: Locator;
  readonly inventoryItems: Locator;
  readonly cartBadge: Locator;
  readonly cartIcon: Locator;

  constructor(private page: Page) {
    this.sortDropdown   = page.locator('[data-test="product-sort-container"]');
    this.inventoryItems = page.locator('.inventory_item');
    this.cartBadge      = page.locator('.shopping_cart_badge');
    this.cartIcon       = page.locator('.shopping_cart_link');
  }

  async goto() {
    await this.page.goto('/inventory.html');
  }

  async sortBy(option: SortOption) {
    await this.sortDropdown.selectOption(SORT_VALUES[option]);
  }

  async getItemNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  async getItemPrices(): Promise<number[]> {
    const texts = await this.page.locator('.inventory_item_price').allTextContents();
    return texts.map(t => parseFloat(t.replace('$', '')));
  }

  async getItemImages(): Promise<string[]> {
    return this.page.locator('.inventory_item_img img').evaluateAll(
      imgs => (imgs as HTMLImageElement[]).map(img => img.getAttribute('src') ?? '')
    );
  }

  async getItemCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  async addItemToCartByName(name: string) {
    const item = this.page.locator('.inventory_item').filter({ hasText: name });
    await item.locator('button').click();
  }

  async removeItemFromCartByName(name: string) {
    const item = this.page.locator('.inventory_item').filter({ hasText: name });
    await item.locator('button').click();
  }

  async addAllItemsToCart() {
    const totalItems = await this.inventoryItems.count();
    for (let i = 0; i < totalItems; i++) {
      const firstAddButton = this.page.locator('[data-test^="add-to-cart"]').first();
      if ((await firstAddButton.count()) === 0) break;
      await firstAddButton.click();
    }
  }

  async getCartBadgeCount(): Promise<number> {
    if (!(await this.cartBadge.isVisible())) return 0;
    const text = await this.cartBadge.textContent();
    return parseInt(text ?? '0', 10);
  }

  async clickItemByName(name: string) {
    await this.page.locator('.inventory_item_name').filter({ hasText: name }).click();
  }

  async goToCart() {
    await this.cartIcon.click();
  }
}
