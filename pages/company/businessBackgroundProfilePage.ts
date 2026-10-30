import { expect, Locator, Page } from "@playwright/test";
import type { BusinessPlansData } from "./companyOnboardingPage";
import {
    controlAfterLabel,
    saveChanges
} from "./companyProfileControls";

export class BusinessBackgroundProfilePage {
    readonly page: Page;
    readonly heading: Locator;
    readonly businessDescriptionInput: Locator;
    readonly progressDescriptionInput: Locator;
    readonly next18MonthsPlanInput: Locator;
    readonly saveChangesButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByText("Business Background", {
            exact: true
        }).last();
        this.businessDescriptionInput = controlAfterLabel(
            page,
            "Describe your business",
            "self::textarea"
        );
        this.progressDescriptionInput = controlAfterLabel(
            page,
            "Describe your progress",
            "self::textarea"
        );
        this.next18MonthsPlanInput = controlAfterLabel(
            page,
            "Your plan for the next 12 to 18 months",
            "self::textarea"
        );
        this.saveChangesButton = page.getByRole("button", {
            name: "Save Changes"
        });
    }

    async verifyPageDisplayed() {
        await expect(this.heading).toBeVisible();
        await expect(this.businessDescriptionInput).toBeVisible();
        await expect(this.progressDescriptionInput).toBeVisible();
        await expect(this.next18MonthsPlanInput).toBeVisible();
        await expect(this.saveChangesButton).toBeVisible();
    }

    async updateAndSave(data: BusinessPlansData) {
        await this.businessDescriptionInput.fill(data.businessDescription);
        await this.progressDescriptionInput.fill(data.progressDescription);
        await this.next18MonthsPlanInput.fill(data.next18MonthsPlan);
        await expect(this.saveChangesButton).toBeEnabled();
        await saveChanges(this.page, this.saveChangesButton);
    }

    async verifySavedData(data: BusinessPlansData) {
        await expect(this.businessDescriptionInput)
            .toHaveValue(data.businessDescription);
        await expect(this.progressDescriptionInput)
            .toHaveValue(data.progressDescription);
        await expect(this.next18MonthsPlanInput)
            .toHaveValue(data.next18MonthsPlan);
    }
}
