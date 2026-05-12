import { Page, Locator } from '@playwright/test';
import { UserCredentials } from '../data/users';

export class LoginPage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly errorCloseButton: Locator;

  constructor(private page: Page) {
    this.usernameInput    = page.locator('[data-test="username"]');
    this.passwordInput    = page.locator('[data-test="password"]');
    this.loginButton      = page.locator('[data-test="login-button"]');
    this.errorMessage     = page.locator('[data-test="error"]');
    this.errorCloseButton = page.locator('[data-test="error"] button');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginAs(user: UserCredentials) {
    await this.login(user.username, user.password);
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent()) ?? '';
  }

  async isErrorDisplayed(): Promise<boolean> {
    return this.errorMessage.isVisible();
  }

  async dismissError() {
    await this.errorCloseButton.click();
  }
}
