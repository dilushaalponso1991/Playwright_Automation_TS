import { expect, Locator, Page } from "@playwright/test";

async function selectDropdownOption(
    page: Page,
    input: Locator,
    option: string
) {
    const dropdown = input.locator("..");

    await expect.poll(async () => {
        await dropdown.click();
        return page.locator(".dropdown-option").count();
    }, {
        message: `Wait for dropdown options before selecting ${option}`,
        timeout: 15_000
    }).toBeGreaterThan(0);

    await page.getByText(option, { exact: true }).last().click();
    await expect(input).toHaveValue(option);
}

export interface CompanyRegistrationData {
    username: string;
    firstName: string;
    lastName: string;
    companyName: string;
    email: string;
    password: string;
    country: string;
    category: string;
}

export class TechCompanyRegistrationPage {
    readonly page: Page;

    readonly heading: Locator;
    readonly usernameInput: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly companyNameInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly countryInput: Locator;
    readonly categoryInput: Locator;
    readonly companyConfirmationCheckbox: Locator;
    readonly termsCheckbox: Locator;
    readonly companyConfirmationLabel: Locator;
    readonly termsLabel: Locator;
    readonly createAccountButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.heading = page.getByRole("heading", {
            name: "Join as a Tech Company"
        });

        this.usernameInput = page.locator("#name");
        this.firstNameInput = page.locator("#firstName");
        this.lastNameInput = page.locator("#lastName");
        this.companyNameInput = page.locator("#companyName");
        this.emailInput = page.locator("#email");
        this.passwordInput = page.locator("#password");
        this.confirmPasswordInput = page.locator("#confirmPassword");

        this.countryInput = page.getByPlaceholder("Select your country");
        this.categoryInput = page.getByPlaceholder("Select category");

        this.companyConfirmationCheckbox =
            page.locator("#company-checkbox");

        this.termsCheckbox =
            page.locator("#terms-checkbox");
        this.companyConfirmationLabel = page.locator(
            'label[for="company-checkbox"]'
        );
        this.termsLabel = page.locator('label[for="terms-checkbox"]');

        this.createAccountButton = page.getByRole("button", {
            name: "Create an account"
        });
    }

    async goto() {
        await this.page.goto(
            "/registration/user-registration?isVolunteer=false"
        );
        await expect(this.heading).toBeVisible();
    }

    async verifyPageDisplayed() {
        await expect(this.heading).toBeVisible();
        await expect(this.usernameInput).toBeVisible();
        await expect(this.firstNameInput).toBeVisible();
        await expect(this.lastNameInput).toBeVisible();
        await expect(this.companyNameInput).toBeVisible();
        await expect(this.emailInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
        await expect(this.confirmPasswordInput).toBeVisible();
        await expect(this.countryInput).toBeVisible();
        await expect(this.categoryInput).toBeVisible();
        await expect(this.createAccountButton).toBeDisabled();
    }

    async fillTextFields(data: CompanyRegistrationData) {
        await this.usernameInput.fill(data.username);
        await this.firstNameInput.fill(data.firstName);
        await this.lastNameInput.fill(data.lastName);
        await this.companyNameInput.fill(data.companyName);
        await this.emailInput.fill(data.email);
        await this.passwordInput.fill(data.password);
        await this.confirmPasswordInput.fill(data.password);
    }

    async fillRegistrationForm(data: CompanyRegistrationData) {
        await selectDropdownOption(this.page, this.countryInput, data.country);
        await selectDropdownOption(this.page, this.categoryInput, data.category);
        await this.fillTextFields(data);
    }

    async acceptRequiredConsents() {
        await this.companyConfirmationLabel.locator("div").click();
        await this.termsLabel.locator("div").click();
        await expect(this.companyConfirmationCheckbox).toBeChecked();
        await expect(this.termsCheckbox).toBeChecked();
    }

    async completeRequiredRegistration(data: CompanyRegistrationData) {
        await this.fillRegistrationForm(data);
        await this.acceptRequiredConsents();
    }

    async verifyFormCanBeSubmitted() {
        await expect(this.createAccountButton).toBeEnabled();
    }

    async verifyFormCannotBeSubmitted() {
        await expect(this.createAccountButton).toBeDisabled();
    }

    async submit() {
        await expect(this.createAccountButton).toBeEnabled();
        await this.createAccountButton.click();
    }
}
