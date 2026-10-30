import { expect, Locator, Page } from "@playwright/test";
import type { CompanyBackgroundData } from "./companyOnboardingPage";
import {
    controlAfterLabel,
    expectSelectedText,
    saveChanges,
    selectTextOption
} from "./companyProfileControls";

export class CompanyBackgroundProfilePage {
    readonly page: Page;
    readonly heading: Locator;
    readonly companyStageControl: Locator;
    readonly teamSizeControl: Locator;
    readonly teamStructureInput: Locator;
    readonly fundingSourceControl: Locator;
    readonly discoverySourceControl: Locator;
    readonly saveChangesButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByText("Company Background", {
            exact: true
        }).last();
        this.companyStageControl = controlAfterLabel(
            page,
            "Company Stage",
            "self::select or @role='combobox' or self::input"
        );
        this.teamSizeControl = controlAfterLabel(
            page,
            "Team Size",
            "self::select or @role='combobox' or self::input"
        );
        this.teamStructureInput = controlAfterLabel(
            page,
            "How is your team structured?",
            "self::textarea"
        );
        this.fundingSourceControl = controlAfterLabel(
            page,
            "How is your business funded?",
            "self::select or @role='combobox' or self::input"
        );
        this.discoverySourceControl = controlAfterLabel(
            page,
            "How did you find us?",
            "self::select or @role='combobox' or self::input"
        );
        this.saveChangesButton = page.getByRole("button", {
            name: "Save Changes"
        });
    }

    async verifyPageDisplayed() {
        await expect(this.heading).toBeVisible();
        await expect(this.companyStageControl).toBeVisible();
        await expect(this.teamSizeControl).toBeVisible();
        await expect(this.teamStructureInput).toBeVisible();
        await expect(this.fundingSourceControl).toBeVisible();
        await expect(this.discoverySourceControl).toBeVisible();
        await expect(this.saveChangesButton).toBeVisible();
    }

    async updateAndSave(data: CompanyBackgroundData) {
        await selectTextOption(
            this.page,
            this.companyStageControl,
            data.companyStage
        );
        await selectTextOption(this.page, this.teamSizeControl, data.teamSize);
        await this.teamStructureInput.fill(data.teamStructure);
        await selectTextOption(
            this.page,
            this.fundingSourceControl,
            data.fundingSource
        );
        await selectTextOption(
            this.page,
            this.discoverySourceControl,
            data.discoverySource
        );
        await expect(this.saveChangesButton).toBeEnabled();
        await saveChanges(this.page, this.saveChangesButton);
    }

    async verifySavedData(data: CompanyBackgroundData) {
        await expectSelectedText(this.companyStageControl, data.companyStage);
        await expectSelectedText(this.teamSizeControl, data.teamSize);
        await expect(this.teamStructureInput).toHaveValue(data.teamStructure);
        await expectSelectedText(
            this.fundingSourceControl,
            data.fundingSource
        );
        await expectSelectedText(
            this.discoverySourceControl,
            data.discoverySource
        );
    }
}
