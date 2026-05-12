import { Page, Locator } from '@playwright/test';

export class CheckoutCompletePage {
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;
  readonly ponyExpressImage: Locator;

  constructor(private page: Page) {
    this.completeHeader    = page.locator('[data-test="complete-header"]');
    this.completeText      = page.locator('[data-test="complete-text"]');
    this.backHomeButton    = page.locator('[data-test="back-to-products"]');
    this.ponyExpressImage  = page.locator('.pony_express');
  }

  async getCompleteHeaderText(): Promise<string> {
    return (await this.completeHeader.textContent()) ?? '';
  }

  async isOrderComplete(): Promise<boolean> {
    return this.completeHeader.isVisible();
  }

  async goBackHome() {
    await this.backHomeButton.click();
  }
}
