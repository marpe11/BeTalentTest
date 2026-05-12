import { test, expect } from '../fixtures/auth.fixture';
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { USERS } from '../data/users';

const CUSTOMER = { firstName: 'João', lastName: 'Silva', zip: '01310-100' };

test.use({ video: 'on' });

test.describe('Fluxo de Compra', () => {

  test('fluxo completo de compra com 1 item', async ({ authenticatedPage: page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addItemToCartByName('Sauce Labs Backpack');
    await inventory.goToCart();

    const cart = new CartPage(page);
    await cart.proceedToCheckout();

    const step1 = new CheckoutStepOnePage(page);
    await step1.fillForm(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.zip);
    await step1.continueToNextStep();

    const step2 = new CheckoutStepTwoPage(page);
    const items = await step2.getItemNames();
    expect(items).toContain('Sauce Labs Backpack');
    await step2.finish();

    const complete = new CheckoutCompletePage(page);
    expect(await complete.isOrderComplete()).toBe(true);
    expect(await complete.getCompleteHeaderText()).toContain('Thank you for your order');
  });

  test('fluxo completo de compra com múltiplos itens', async ({ authenticatedPage: page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addItemToCartByName('Sauce Labs Backpack');
    await inventory.addItemToCartByName('Sauce Labs Bike Light');
    await inventory.addItemToCartByName('Sauce Labs Bolt T-Shirt');
    await inventory.goToCart();

    const cart = new CartPage(page);
    expect(await cart.getItemCount()).toBe(3);
    await cart.proceedToCheckout();

    const step1 = new CheckoutStepOnePage(page);
    await step1.fillForm(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.zip);
    await step1.continueToNextStep();

    const step2 = new CheckoutStepTwoPage(page);
    await step2.finish();

    const complete = new CheckoutCompletePage(page);
    expect(await complete.isOrderComplete()).toBe(true);
  });

  test('total do pedido = subtotal + tax', async ({ authenticatedPage: page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addAllItemsToCart();
    await inventory.goToCart();

    const cart = new CartPage(page);
    await cart.proceedToCheckout();

    const step1 = new CheckoutStepOnePage(page);
    await step1.fillForm(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.zip);
    await step1.continueToNextStep();

    const step2 = new CheckoutStepTwoPage(page);
    const subtotal = await step2.getItemTotal();
    const tax      = await step2.getTax();
    const total    = await step2.getOrderTotal();

    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  test('página de confirmação exibe imagem e botão Back Home', async ({ authenticatedPage: page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addItemToCartByName('Sauce Labs Backpack');
    await inventory.goToCart();

    const cart = new CartPage(page);
    await cart.proceedToCheckout();

    const step1 = new CheckoutStepOnePage(page);
    await step1.fillForm(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.zip);
    await step1.continueToNextStep();

    const step2 = new CheckoutStepTwoPage(page);
    await step2.finish();

    const complete = new CheckoutCompletePage(page);
    await expect(complete.ponyExpressImage).toBeVisible();
    await expect(complete.backHomeButton).toBeVisible();
  });

  test('Back Home retorna ao inventário após compra', async ({ authenticatedPage: page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addItemToCartByName('Sauce Labs Backpack');
    await inventory.goToCart();

    const cart = new CartPage(page);
    await cart.proceedToCheckout();

    const step1 = new CheckoutStepOnePage(page);
    await step1.fillForm(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.zip);
    await step1.continueToNextStep();

    await new CheckoutStepTwoPage(page).finish();
    await new CheckoutCompletePage(page).goBackHome();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('problem_user: campo lastname não é editável [BUG CRÍTICO]', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAs(USERS.problem);
    await page.waitForURL(/inventory\.html/);

    const inventory = new InventoryPage(page);
    await inventory.addItemToCartByName('Sauce Labs Backpack');
    await inventory.goToCart();

    const cart = new CartPage(page);
    await cart.proceedToCheckout();

    const step1 = new CheckoutStepOnePage(page);
    await step1.firstNameInput.fill('João');
    const isEditable = await step1.isLastNameFieldEditable();
    // BUG: problem_user não consegue preencher o campo lastname
    expect(isEditable).toBe(false);
  });

  test('cancelar no checkout Step 1 retorna ao carrinho', async ({ authenticatedPage: page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addItemToCartByName('Sauce Labs Backpack');
    await inventory.goToCart();

    const cart = new CartPage(page);
    await cart.proceedToCheckout();

    const step1 = new CheckoutStepOnePage(page);
    await step1.cancel();
    await expect(page).toHaveURL(/cart\.html/);
  });

  test('cancelar no checkout Step 2 retorna ao inventário', async ({ authenticatedPage: page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addItemToCartByName('Sauce Labs Backpack');
    await inventory.goToCart();

    const cart = new CartPage(page);
    await cart.proceedToCheckout();

    const step1 = new CheckoutStepOnePage(page);
    await step1.fillForm(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.zip);
    await step1.continueToNextStep();

    await new CheckoutStepTwoPage(page).cancel();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('checkout sem first name exibe erro de validação', async ({ authenticatedPage: page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addItemToCartByName('Sauce Labs Backpack');
    await inventory.goToCart();

    const cart = new CartPage(page);
    await cart.proceedToCheckout();

    const step1 = new CheckoutStepOnePage(page);
    await step1.fillForm('', CUSTOMER.lastName, CUSTOMER.zip);
    await step1.continueToNextStep();

    expect(await step1.getErrorMessage()).toContain('First Name is required');
  });

  test('checkout sem last name exibe erro de validação', async ({ authenticatedPage: page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addItemToCartByName('Sauce Labs Backpack');
    await inventory.goToCart();

    const cart = new CartPage(page);
    await cart.proceedToCheckout();

    const step1 = new CheckoutStepOnePage(page);
    await step1.fillForm(CUSTOMER.firstName, '', CUSTOMER.zip);
    await step1.continueToNextStep();

    expect(await step1.getErrorMessage()).toContain('Last Name is required');
  });

  test('checkout sem zip code exibe erro de validação', async ({ authenticatedPage: page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addItemToCartByName('Sauce Labs Backpack');
    await inventory.goToCart();

    const cart = new CartPage(page);
    await cart.proceedToCheckout();

    const step1 = new CheckoutStepOnePage(page);
    await step1.fillForm(CUSTOMER.firstName, CUSTOMER.lastName, '');
    await step1.continueToNextStep();

    expect(await step1.getErrorMessage()).toContain('Postal Code is required');
  });
});
