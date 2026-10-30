import { expect, Locator, Page } from "@playwright/test";

export class EmailVerificationPage {
    readonly page: Page;
    readonly heading: Locator;
    readonly thankYouMessage: Locator;
    readonly verificationInstructions: Locator;
    readonly resendEmailButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByRole("heading", {
            name: "Verify your email address"
        });
        this.thankYouMessage = page.getByText("Thank you for signing up!", {
            exact: true
        });
        this.verificationInstructions = page.getByText(
            /please verify your email address/i
        );
        this.resendEmailButton = page.getByRole("button", {
            name: "Resend email"
        });
    }

    async verifyPageDisplayed() {
        await expect(this.heading).toBeVisible();
        await expect(this.thankYouMessage).toBeVisible();
        await expect(this.verificationInstructions).toBeVisible();
        await expect(this.resendEmailButton).toBeVisible();
        await expect(this.resendEmailButton).toBeEnabled();
    }
}
