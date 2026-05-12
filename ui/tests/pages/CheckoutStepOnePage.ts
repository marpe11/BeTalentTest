import { Page, Locator } from '@playwright/test';

export class CheckoutStepOnePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly zipInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  constructor(private page: Page) {
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput  = page.locator('[data-test="lastName"]');
    this.zipInput       = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton   = page.locator('[data-test="cancel"]');
    this.errorMessage   = page.locator('[data-test="error"]');
  }

  async fillForm(firstName: string, lastName: string, zip: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.zipInput.fill(zip);
  }

  async continueToNextStep() {
    await this.continueButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? '';
  }

  async isLastNameFieldEditable(): Promise<boolean> {
    await this.lastNameInput.fill('test');
    const value = await this.lastNameInput.inputValue();
    await this.lastNameInput.fill('');
    return value === 'test';
  }
}
