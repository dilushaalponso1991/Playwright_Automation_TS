import { expect, Locator, Page } from "@playwright/test";

export interface CompanyBasicInfoData {
    companyName: string;
    city: string;
    mobileNumber: string;
    website: string;
    youtubePitch: string;
}

function inputAfterLabel(page: Page, label: string): Locator {
    const accessibleInput = page.getByLabel(label, { exact: true });
    const visualLabelInput = page.getByText(label, { exact: true })
        .locator("xpath=following::input[1]");

    return accessibleInput.or(visualLabelInput).first();
}

export class CompanyProfilePage {
    readonly page: Page;
    readonly heading: Locator;
    readonly basicInfoTab: Locator;
    readonly socialMediaTab: Locator;
    readonly companyBackgroundTab: Locator;
    readonly businessBackgroundTab: Locator;
    readonly teamMemberTab: Locator;
    readonly viewPublicProfileButton: Locator;
    readonly companyNameInput: Locator;
    readonly countryControl: Locator;
    readonly cityInput: Locator;
    readonly tagsControl: Locator;
    readonly categoryControl: Locator;
    readonly companyLogoDropzone: Locator;
    readonly countryCodeControl: Locator;
    readonly mobileNumberInput: Locator;
    readonly languageControl: Locator;
    readonly companyWebsiteInput: Locator;
    readonly youtubePitchInput: Locator;
    readonly saveChangesButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByText("Company Profile", { exact: true }).last();
        this.basicInfoTab = page.getByText("Basic Info", { exact: true }).first();
        this.socialMediaTab = page.getByText("Social Media", { exact: true });
        this.companyBackgroundTab = page.getByText("Company Background", {
            exact: true
        });
        this.businessBackgroundTab = page.getByText("Business Background", {
            exact: true
        });
        this.teamMemberTab = page.getByText("Team Member", { exact: true });
        this.viewPublicProfileButton = page.getByRole("button", {
            name: /View Public Profile/i
        }).or(page.getByRole("link", { name: /View Public Profile/i }));
        this.companyNameInput = inputAfterLabel(page, "Company Name");
        this.countryControl = page.getByText("Country", { exact: true });
        this.cityInput = inputAfterLabel(page, "City");
        this.tagsControl = page.getByText("Tags", { exact: true });
        this.categoryControl = page.getByText("Category", { exact: true });
        this.companyLogoDropzone = page.getByText(/Drag and Drop file here/i);
        this.countryCodeControl = page.getByText("Country Code", { exact: true });
        this.mobileNumberInput = inputAfterLabel(page, "Mobile Number");
        this.languageControl = page.getByText("Language", { exact: true });
        this.companyWebsiteInput = page.getByLabel("Company Website", {
            exact: true
        }).or(page.getByPlaceholder("Enter a URL").nth(0)).first();
        this.youtubePitchInput = page.getByLabel("YouTube Video Pitch", {
            exact: true
        }).or(page.getByPlaceholder("Enter a URL").nth(1)).first();
        this.saveChangesButton = page.getByRole("button", {
            name: "Save Changes"
        });
    }

    async verifyBasicInfoDisplayed() {
        await expect(this.heading).toBeVisible();
        await expect(this.basicInfoTab).toBeVisible();
        await expect(this.socialMediaTab).toBeVisible();
        await expect(this.companyBackgroundTab).toBeVisible();
        await expect(this.businessBackgroundTab).toBeVisible();
        await expect(this.teamMemberTab).toBeVisible();
        await expect(this.viewPublicProfileButton).toBeVisible();
        await expect(this.companyNameInput).toBeVisible();
        await expect(this.countryControl).toBeVisible();
        await expect(this.cityInput).toBeVisible();
        await expect(this.tagsControl).toBeVisible();
        await expect(this.categoryControl).toBeVisible();
        await expect(this.companyLogoDropzone).toBeVisible();
        await expect(this.countryCodeControl).toBeVisible();
        await expect(this.mobileNumberInput).toBeVisible();
        await expect(this.languageControl).toBeVisible();
        await expect(this.companyWebsiteInput).toBeVisible();
        await expect(this.youtubePitchInput).toBeVisible();
        await expect(this.saveChangesButton).toBeVisible();
    }

    async openSocialMedia() {
        await this.socialMediaTab.click();
        await expect(this.page.getByText("Add Social Media full links", {
            exact: true
        })).toBeVisible();
    }

    async openCompanyBackground() {
        await this.companyBackgroundTab.click();
        await expect(this.page.getByText("How is your team structured?", {
            exact: true
        })).toBeVisible();
    }

    async openBusinessBackground() {
        await this.businessBackgroundTab.click();
        await expect(this.page.getByText("Describe your business", {
            exact: true
        })).toBeVisible();
    }

    async updateAndSaveBasicInfo(data: CompanyBasicInfoData) {
        await this.companyNameInput.fill(data.companyName);
        await this.cityInput.fill(data.city);
        await this.mobileNumberInput.fill(data.mobileNumber);
        await this.companyWebsiteInput.fill(data.website);
        await this.youtubePitchInput.fill(data.youtubePitch);
        await expect(this.saveChangesButton).toBeEnabled();

        const saveResponsePromise = this.page.waitForResponse((response) => {
            const method = response.request().method();
            return ["POST", "PUT", "PATCH"].includes(method) && response.ok();
        });

        await this.saveChangesButton.click();
        const saveResponse = await saveResponsePromise;
        expect(saveResponse.ok()).toBeTruthy();

        await this.page.reload({ waitUntil: "domcontentloaded" });
        await this.verifySavedBasicInfo(data);
    }

    async verifySavedBasicInfo(data: CompanyBasicInfoData) {
        await expect(this.companyNameInput).toHaveValue(data.companyName);
        await expect(this.cityInput).toHaveValue(data.city);
        await expect(this.mobileNumberInput).toHaveValue(data.mobileNumber);
        await expect(this.companyWebsiteInput).toHaveValue(data.website);
        await expect(this.youtubePitchInput).toHaveValue(data.youtubePitch);
    }
}
