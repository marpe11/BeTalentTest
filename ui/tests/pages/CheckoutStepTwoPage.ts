import { Page, Locator } from '@playwright/test';

export class CheckoutStepTwoPage {
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;

  constructor(private page: Page) {
    this.finishButton   = page.locator('[data-test="finish"]');
    this.cancelButton   = page.locator('[data-test="cancel"]');
    this.subtotalLabel  = page.locator('.summary_subtotal_label');
    this.taxLabel       = page.locator('.summary_tax_label');
    this.totalLabel     = page.locator('.summary_total_label');
  }

  private parsePrice(text: string): number {
    const match = text.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  }

  async getItemNames(): Promise<string[]> {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  async getItemTotal(): Promise<number> {
    return this.parsePrice((await this.subtotalLabel.textContent()) ?? '0');
  }

  async getTax(): Promise<number> {
    return this.parsePrice((await this.taxLabel.textContent()) ?? '0');
  }

  async getOrderTotal(): Promise<number> {
    return this.parsePrice((await this.totalLabel.textContent()) ?? '0');
  }

  async finish() {
    await this.finishButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }
}
