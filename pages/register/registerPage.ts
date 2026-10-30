import { expect, Locator, Page } from "@playwright/test";

export class RegisterPage {
    readonly page: Page;
    readonly registrationHeading: Locator;
    readonly volunteerOption: Locator;
    readonly techCompanyOption: Locator;
    readonly createAccountButton: Locator;
    readonly loginLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.registrationHeading = page.getByRole("heading", {
            name: "Join as a Volunteer or Tech Company"
        });
        this.volunteerOption = page.getByText("I'm a Volunteer", {
            exact: true
        });
        this.techCompanyOption = page.getByText("I'm a Tech Company", {
            exact: true
        });
        this.createAccountButton = page.getByRole("button", {
            name: "Create Account"
        });
        this.loginLink = page.getByRole("link", { name: "Login" });
    }

    async continueAsTechCompany() {
        await this.techCompanyOption.click();
        await expect(this.createAccountButton).toBeEnabled();
        await this.createAccountButton.click();
        await expect(this.page).toHaveURL(
            /user-registration\?isVolunteer=false/
        );
    }

    async verifyInitialSelectionState() {
        await expect(this.createAccountButton).toBeDisabled();
    }

    async verifyRegistrationElements() {
        await expect(this.registrationHeading).toBeVisible();
        await expect(this.volunteerOption).toBeVisible();
        await expect(this.techCompanyOption).toBeVisible();
        await expect(this.createAccountButton).toBeVisible();
        await expect(this.loginLink).toBeVisible();
    }
}
