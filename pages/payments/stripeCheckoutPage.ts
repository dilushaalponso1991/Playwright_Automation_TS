import { expect, Locator, Page } from "@playwright/test";

export interface StripeTestCardData {
    cardNumber: string;
    expiry: string;
    cvc: string;
    cardholderName: string;
    country: string;
}

export class StripeCheckoutPage {
    readonly page: Page;
    readonly heading: Locator;
    readonly sandboxBadge: Locator;
    readonly starterPlanText: Locator;
    readonly cardNumberInput: Locator;
    readonly expiryInput: Locator;
    readonly cvcInput: Locator;
    readonly cardholderNameInput: Locator;
    readonly countryInput: Locator;
    readonly subscribeButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByRole("heading", { name: "Pay with card" });
        this.sandboxBadge = page.getByText("Sandbox", { exact: true });
        this.starterPlanText = page.getByText(/Subscribe to Starter Plan/i);
        this.cardNumberInput = page.getByLabel(/Card number/i);
        this.expiryInput = page.getByLabel(/Expiration|Expiry/i);
        this.cvcInput = page.getByLabel(/CVC|Security code/i);
        this.cardholderNameInput = page.getByLabel(/Cardholder name/i);
        this.countryInput = page.getByLabel(/Country or region/i);
        this.subscribeButton = page.getByRole("button", { name: "Subscribe" });
    }

    async verifySandboxCheckout() {
        await expect(this.page).toHaveURL(/checkout\.stripe\.com/i);
        await expect(this.heading).toBeVisible();
        await expect(this.sandboxBadge).toBeVisible();
        await expect(this.starterPlanText).toBeVisible();
    }

    async completeTestCard(data: StripeTestCardData) {
        await this.cardNumberInput.fill(data.cardNumber);
        await this.expiryInput.fill(data.expiry);
        await this.cvcInput.fill(data.cvc);
        await this.cardholderNameInput.fill(data.cardholderName);
        await this.countryInput.selectOption({ label: data.country });
        await expect(this.subscribeButton).toBeEnabled();
    }

    async subscribe() {
        await this.subscribeButton.click();
    }
}

export class PaymentSuccessPage {
    readonly page: Page;
    readonly heading: Locator;
    readonly confirmationText: Locator;
    readonly continueButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByRole("heading", {
            name: "Payment Successful!"
        });
        this.confirmationText = page.getByText(
            /subscription has been successfully activated/i
        );
        this.continueButton = page.getByRole("button", { name: "Continue" });
    }

    async verifyPageDisplayed() {
        await expect(this.heading).toBeVisible({ timeout: 60_000 });
        await expect(this.confirmationText).toBeVisible();
        await expect(this.continueButton).toBeEnabled();
    }

    async continueToBusinessPlans() {
        await this.continueButton.click();
        await expect(this.page.getByRole("heading", {
            name: "Understanding the business and your plans"
        })).toBeVisible();
    }
}
