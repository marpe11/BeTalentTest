import { Page, Locator } from '@playwright/test';

export class ProductDetailPage {
  readonly productName: Locator;
  readonly productDescription: Locator;
  readonly productPrice: Locator;
  readonly productImage: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;
  readonly backButton: Locator;

  constructor(private page: Page) {
    this.productName        = page.locator('.inventory_details_name');
    this.productDescription = page.locator('.inventory_details_desc');
    this.productPrice       = page.locator('.inventory_details_price');
    this.productImage       = page.locator('.inventory_details_img');
    this.addToCartButton    = page.locator('[data-test^="add-to-cart"]');
    this.removeButton       = page.locator('[data-test^="remove"]');
    this.backButton         = page.locator('[data-test="back-to-products"]');
  }

  async getProductName(): Promise<string> {
    return (await this.productName.textContent()) ?? '';
  }

  async getProductPrice(): Promise<number> {
    const text = (await this.productPrice.textContent()) ?? '0';
    return parseFloat(text.replace('$', ''));
  }

  async getProductDescription(): Promise<string> {
    return (await this.productDescription.textContent()) ?? '';
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async removeFromCart() {
    await this.removeButton.click();
  }

  async goBack() {
    await this.backButton.click();
  }
}
