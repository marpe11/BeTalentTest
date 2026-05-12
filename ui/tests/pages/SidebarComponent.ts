import { Page, Locator } from '@playwright/test';

export class SidebarComponent {
  readonly menuButton: Locator;
  readonly closeButton: Locator;
  readonly allItemsLink: Locator;
  readonly aboutLink: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;

  constructor(private page: Page) {
    this.menuButton        = page.locator('#react-burger-menu-btn');
    this.closeButton       = page.locator('#react-burger-cross-btn');
    this.allItemsLink      = page.locator('#inventory_sidebar_link');
    this.aboutLink         = page.locator('#about_sidebar_link');
    this.logoutLink        = page.locator('#logout_sidebar_link');
    this.resetAppStateLink = page.locator('#reset_sidebar_link');
  }

  async open() {
    await this.menuButton.click();
    await this.allItemsLink.waitFor({ state: 'visible' });
  }

  async close() {
    // JS click bypassa diferenças de timing de animação CSS entre Chromium e Firefox
    await this.page.evaluate(() => {
      (document.getElementById('react-burger-cross-btn') as HTMLElement)?.click();
    });
    // Aguarda aria-hidden="true" no wrapper — sinal confiável de fechamento
    await this.page.waitForFunction(() =>
      document.querySelector('.bm-menu-wrap')?.getAttribute('aria-hidden') === 'true'
    );
  }

  async logout() {
    await this.open();
    await this.logoutLink.click();
  }

  async resetAppState() {
    await this.open();
    await this.resetAppStateLink.click();
    await this.close();
  }

  async goToAllItems() {
    await this.open();
    await this.allItemsLink.click();
  }

  async goToAbout() {
    await this.open();
    await this.aboutLink.click();
  }
}
