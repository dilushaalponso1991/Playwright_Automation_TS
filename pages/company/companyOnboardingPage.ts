import { expect, Locator, Page } from "@playwright/test";

async function selectTextOption(
    page: Page,
    control: Locator,
    option: string
) {
    const clickTarget = await control.getAttribute("readonly") === null
        ? control
        : control.locator("..");

    await clickTarget.click();
    const matchingOption = page.getByText(option, { exact: true }).last();
    await expect(matchingOption).toBeVisible();
    await matchingOption.click();
}

export interface CompanyBackgroundData {
    companyStage: string;
    teamSize: string;
    teamStructure: string;
    fundingSource: string;
    discoverySource: string;
}

export interface CompanyDetailsData {
    countryCode: string;
    mobileNumber: string;
    city: string;
    role: string;
    language: string;
    tags: string[];
    website?: string;
    youtubePitch?: string;
}

export class CompanyOnboardingWelcomePage {
    readonly page: Page;
    readonly emailVerifiedHeading: Locator;
    readonly welcomeHeading: Locator;
    readonly companyHeading: Locator;
    readonly getStartedButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailVerifiedHeading = page.getByText("Email Verified!", {
            exact: true
        });
        this.welcomeHeading = page.getByRole("heading", {
            name: "Welcome to SkilledUp Life"
        });
        this.companyHeading = page.getByRole("heading", {
            name: "Get started as a Tech Company"
        });
        this.getStartedButton = page.getByRole("button", {
            name: /Get Started/i
        });
    }

    async verifyPageDisplayed() {
        await expect(this.emailVerifiedHeading).toBeVisible();
        await expect(this.welcomeHeading).toBeVisible();
        await expect(this.companyHeading).toBeVisible();
        await expect(this.page.getByText("Understanding your Tech Company", {
            exact: true
        })).toBeVisible();
        await expect(this.page.getByText("Tech Company details", {
            exact: true
        })).toBeVisible();
        await expect(this.page.getByText("Pricing plans and subscribing", {
            exact: true
        })).toBeVisible();
        await expect(this.page.getByText(
            "Understanding the business and your plans",
            { exact: true }
        )).toBeVisible();
    }

    async startOnboarding() {
        await this.getStartedButton.click();
        await expect(this.page.getByRole("heading", {
            name: "Understanding your Tech Company"
        })).toBeVisible();
    }
}

export class CompanyBackgroundPage {
    readonly page: Page;
    readonly heading: Locator;
    readonly companyStageInput: Locator;
    readonly teamSizeInput: Locator;
    readonly teamStructureInput: Locator;
    readonly fundingSourceInput: Locator;
    readonly discoverySourceInput: Locator;
    readonly saveAndContinueButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByRole("heading", {
            name: "Understanding your Tech Company"
        });
        this.companyStageInput = page.getByPlaceholder("Choose a level").nth(0);
        this.teamSizeInput = page.getByPlaceholder("Choose a level").nth(1);
        this.teamStructureInput = page.getByPlaceholder(
            /Please describe your team/i
        );
        this.fundingSourceInput = page.getByPlaceholder("Choose a fund source");
        this.discoverySourceInput = page.getByPlaceholder("Choose a source");
        this.saveAndContinueButton = page.getByRole("button", {
            name: /Save & Continue/i
        });
    }

    async complete(data: CompanyBackgroundData) {
        await expect(this.heading).toBeVisible();
        await selectTextOption(
            this.page,
            this.companyStageInput,
            data.companyStage
        );
        await selectTextOption(this.page, this.teamSizeInput, data.teamSize);
        await this.teamStructureInput.fill(data.teamStructure);
        await selectTextOption(
            this.page,
            this.fundingSourceInput,
            data.fundingSource
        );
        await selectTextOption(
            this.page,
            this.discoverySourceInput,
            data.discoverySource
        );
        await expect(this.saveAndContinueButton).toBeEnabled();
        await this.saveAndContinueButton.click();
    }
}

export class TechCompanyDetailsPage {
    readonly page: Page;
    readonly heading: Locator;
    readonly countryCodeInput: Locator;
    readonly mobileNumberInput: Locator;
    readonly cityInput: Locator;
    readonly roleInput: Locator;
    readonly languageInput: Locator;
    readonly tagInput: Locator;
    readonly websiteInput: Locator;
    readonly youtubePitchInput: Locator;
    readonly saveAndContinueButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByRole("heading", {
            name: "Tech Company details"
        });
        this.countryCodeInput = page.getByPlaceholder("Country");
        this.mobileNumberInput = page.getByPlaceholder(/Enter phone num/i);
        this.cityInput = page.getByPlaceholder("Enter your city");
        this.roleInput = page.getByPlaceholder("Enter your role");
        this.languageInput = page.getByPlaceholder(
            "Please select from the list"
        );
        this.tagInput = page.getByPlaceholder("Press Enter to create a new tag");
        this.websiteInput = page.getByPlaceholder("Enter a URL").nth(0);
        this.youtubePitchInput = page.getByPlaceholder("Enter a URL").nth(1);
        this.saveAndContinueButton = page.getByRole("button", {
            name: /Save & Continue/i
        });
    }

    async complete(data: CompanyDetailsData) {
        await expect(this.heading).toBeVisible();
        await selectTextOption(
            this.page,
            this.countryCodeInput,
            data.countryCode
        );
        await this.mobileNumberInput.fill(data.mobileNumber);
        await this.cityInput.fill(data.city);
        await this.roleInput.fill(data.role);
        await selectTextOption(this.page, this.languageInput, data.language);

        for (const tag of data.tags.slice(0, 3)) {
            await this.tagInput.fill(tag);
            await this.tagInput.press("Enter");
        }

        if (data.website) {
            await this.websiteInput.fill(data.website);
        }

        if (data.youtubePitch) {
            await this.youtubePitchInput.fill(data.youtubePitch);
        }

        await expect(this.saveAndContinueButton).toBeEnabled();
        await this.saveAndContinueButton.click();
    }
}

export class PricingPlanPage {
    readonly page: Page;
    readonly heading: Locator;
    readonly monthlyToggle: Locator;
    readonly yearlyToggle: Locator;
    readonly selectButtons: Locator;
    readonly starterPlan: Locator;
    readonly saveAndContinueButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByRole("heading", {
            name: "Select Pricing Plan"
        });
        this.monthlyToggle = page.getByText("Monthly", { exact: true });
        this.yearlyToggle = page.getByText("Yearly", { exact: true });
        this.selectButtons = page.getByRole("button", {
            name: /^Select(?:ed)?$/
        });
        this.starterPlan = page.getByText("Starter Plan", { exact: true });
        this.saveAndContinueButton = page.getByRole("button", {
            name: /Save & Continue/i
        });
    }

    async verifyPageDisplayed() {
        await expect(this.heading).toBeVisible();
        await expect(this.monthlyToggle).toBeVisible();
        await expect(this.yearlyToggle).toBeVisible();
        await expect(this.page.getByText("Starter Plan", {
            exact: true
        })).toBeVisible();
        await expect(this.page.getByText("Essential Plan", {
            exact: true
        })).toBeVisible();
        await expect(this.page.getByText("Advanced Plan", {
            exact: true
        })).toBeVisible();
        await expect(this.selectButtons).toHaveCount(3);
    }

    async selectStarterPlan() {
        const starterCard = this.starterPlan.locator(
            "xpath=ancestor::div[.//button[normalize-space()='Select' or " +
            "normalize-space()='Selected']][1]"
        );

        const selectedButton = starterCard.getByRole("button", {
            name: "Selected"
        });

        if (!await selectedButton.isVisible()) {
            await starterCard.getByRole("button", { name: "Select" }).click();
        }

        await expect(starterCard.getByRole("button", {
            name: "Selected"
        })).toBeVisible();
        await expect(this.saveAndContinueButton).toBeEnabled();
    }

    async continueToPayment() {
        await this.saveAndContinueButton.click();
        await expect(this.page.getByRole("heading", {
            name: "Payment Method"
        })).toBeVisible();
    }
}

export class PaymentMethodPage {
    readonly page: Page;
    readonly heading: Locator;
    readonly readyMessage: Locator;
    readonly stripeSecurityMessage: Locator;
    readonly proceedButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByRole("heading", { name: "Payment Method" });
        this.readyMessage = page.getByText(
            "Ready to complete your subscription",
            { exact: true }
        );
        this.stripeSecurityMessage = page.getByText(
            /processed securely by Stripe/i
        );
        this.proceedButton = page.getByRole("button", { name: /Proceed/i });
    }

    async verifyPageDisplayed() {
        await expect(this.heading).toBeVisible();
        await expect(this.readyMessage).toBeVisible();
        await expect(this.stripeSecurityMessage).toBeVisible();
        await expect(this.proceedButton).toBeEnabled();
    }

    async openConfirmation() {
        await this.proceedButton.click();
        await expect(this.page.getByRole("heading", {
            name: "Subscription Confirmation"
        })).toBeVisible();
    }
}

export class SubscriptionConfirmationModal {
    readonly page: Page;
    readonly heading: Locator;
    readonly planName: Locator;
    readonly monthlyPrice: Locator;
    readonly cancelButton: Locator;
    readonly confirmButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByRole("heading", {
            name: "Subscription Confirmation"
        });
        this.planName = page.getByText(/Your Plan:\s*Starter Plan/i);
        this.monthlyPrice = page.getByText(/£49\s*\/\s*monthly/i);
        this.cancelButton = page.getByRole("button", { name: "Cancel" });
        this.confirmButton = page.getByRole("button", { name: "Confirm" });
    }

    async verifyStarterPlan() {
        await expect(this.heading).toBeVisible();
        await expect(this.planName).toBeVisible();
        await expect(this.monthlyPrice).toBeVisible();
        await expect(this.cancelButton).toBeVisible();
        await expect(this.confirmButton).toBeEnabled();
    }

    async confirmAndOpenStripe() {
        await this.confirmButton.click();
        await this.page.waitForURL(/checkout\.stripe\.com/i, {
            timeout: 60_000
        });
    }
}

export interface BusinessPlansData {
    businessDescription: string;
    progressDescription: string;
    next18MonthsPlan: string;
}

export class BusinessPlansPage {
    readonly page: Page;
    readonly heading: Locator;
    readonly businessDescriptionInput: Locator;
    readonly progressDescriptionInput: Locator;
    readonly next18MonthsPlanInput: Locator;
    readonly saveAndContinueButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByRole("heading", {
            name: "Understanding the business and your plans"
        });
        this.businessDescriptionInput = page.getByPlaceholder(
            /Please describe your business in no less than 300 characters/i
        );
        this.progressDescriptionInput = page.getByPlaceholder(
            /Please describe your progress in no less than 300 characters/i
        );
        this.next18MonthsPlanInput = page.getByPlaceholder(
            /Please describe your plan for the next 12 to 18 months/i
        );
        this.saveAndContinueButton = page.getByRole("button", {
            name: /Save & Continue/i
        });
    }

    async complete(data: BusinessPlansData) {
        await expect(this.heading).toBeVisible();
        await this.businessDescriptionInput.fill(data.businessDescription);
        await this.progressDescriptionInput.fill(data.progressDescription);
        await this.next18MonthsPlanInput.fill(data.next18MonthsPlan);
        await expect(this.saveAndContinueButton).toBeEnabled();
        await this.saveAndContinueButton.click();
    }
}
