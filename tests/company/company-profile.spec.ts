import { Page, test } from "@playwright/test";
import { CompanyDashboardPage } from "../../pages/company/companyDashboardPage";
import { CompanyProfilePage } from "../../pages/company/companyProfilePage";
import { CompanySocialMediaPage } from "../../pages/company/companySocialMediaPage";
import { CompanyBackgroundProfilePage } from "../../pages/company/companyBackgroundProfilePage";
import { BusinessBackgroundProfilePage } from "../../pages/company/businessBackgroundProfilePage";
import {
    businessBackgroundProfileData,
    companyBasicInfoData,
    companyBackgroundProfileData,
    companySocialMediaData,
    hasBusinessBackgroundProfileData,
    hasCompanyBackgroundProfileData,
    hasCompanyBasicInfoData,
    hasCompanySocialMediaData
} from "../../config/testData";

test.use({ viewport: { width: 1600, height: 1000 } });
test.describe.configure({ mode: "serial" });

const dashboardUrl = process.env.E2E_COMPANY_DASHBOARD_URL;
const storageStatePath = process.env.E2E_STORAGE_STATE;

if (storageStatePath) {
    test.use({ storageState: storageStatePath });
}

async function openCompanyProfile(page: Page): Promise<CompanyProfilePage> {
    await page.goto(dashboardUrl!);
    await new CompanyDashboardPage(page).openCompanyProfile();
    return new CompanyProfilePage(page);
}

function skipWithoutAuthenticatedCompany() {
    test.skip(
        !dashboardUrl || !storageStatePath,
        "Provide E2E_COMPANY_DASHBOARD_URL and E2E_STORAGE_STATE for the " +
        "authenticated Company Profile regression."
    );
}

function skipWithoutProfileMutationPermission(hasData: boolean) {
    test.skip(
        process.env.RUN_COMPANY_PROFILE_UPDATE !== "true",
        "Set RUN_COMPANY_PROFILE_UPDATE=true only for a dedicated test " +
        "company whose profile may be changed."
    );
    test.skip(
        !dashboardUrl || !storageStatePath || !hasData,
        "Configure the dashboard, authenticated state, and required " +
        "E2E_PROFILE_* values in .env."
    );
}

test("TC_COM_009: Company Profile Basic Info page displays correctly",
    async ({ page }) => {
        skipWithoutAuthenticatedCompany();

        const profilePage = await openCompanyProfile(page);
        await profilePage.verifyBasicInfoDisplayed();
    }
);

test("TC_COM_010: Company Profile Basic Info can be updated and saved",
    async ({ page }) => {
        skipWithoutProfileMutationPermission(hasCompanyBasicInfoData());

        const profilePage = await openCompanyProfile(page);
        await profilePage.verifyBasicInfoDisplayed();
        await profilePage.updateAndSaveBasicInfo(companyBasicInfoData());
    }
);

test("TC_COM_011: Company Profile Social Media page displays correctly",
    async ({ page }) => {
        skipWithoutAuthenticatedCompany();

        const profilePage = await openCompanyProfile(page);
        await profilePage.openSocialMedia();
        await new CompanySocialMediaPage(page).verifyPageDisplayed();
    }
);

test("TC_COM_012: Company Profile social-media link can be added",
    async ({ page }) => {
        skipWithoutProfileMutationPermission(hasCompanySocialMediaData());

        const profilePage = await openCompanyProfile(page);
        await profilePage.openSocialMedia();

        const socialMediaPage = new CompanySocialMediaPage(page);
        const data = companySocialMediaData();
        await socialMediaPage.verifyPageDisplayed();
        await socialMediaPage.addLink(data);

        await page.reload({ waitUntil: "domcontentloaded" });
        await profilePage.openSocialMedia();
        await socialMediaPage.verifyLinkPersisted(data);
    }
);

test("TC_COM_013: Company Profile Company Background displays correctly",
    async ({ page }) => {
        skipWithoutAuthenticatedCompany();

        const profilePage = await openCompanyProfile(page);
        await profilePage.openCompanyBackground();
        await new CompanyBackgroundProfilePage(page).verifyPageDisplayed();
    }
);

test("TC_COM_014: Company Background can be updated and saved",
    async ({ page }) => {
        skipWithoutProfileMutationPermission(
            hasCompanyBackgroundProfileData()
        );

        const profilePage = await openCompanyProfile(page);
        await profilePage.openCompanyBackground();

        const backgroundPage = new CompanyBackgroundProfilePage(page);
        const data = companyBackgroundProfileData();
        await backgroundPage.verifyPageDisplayed();
        await backgroundPage.updateAndSave(data);

        await page.reload({ waitUntil: "domcontentloaded" });
        await profilePage.openCompanyBackground();
        await backgroundPage.verifySavedData(data);
    }
);

test("TC_COM_015: Company Profile Business Background displays correctly",
    async ({ page }) => {
        skipWithoutAuthenticatedCompany();

        const profilePage = await openCompanyProfile(page);
        await profilePage.openBusinessBackground();
        await new BusinessBackgroundProfilePage(page).verifyPageDisplayed();
    }
);

test("TC_COM_016: Business Background can be updated and saved",
    async ({ page }) => {
        skipWithoutProfileMutationPermission(
            hasBusinessBackgroundProfileData()
        );

        const profilePage = await openCompanyProfile(page);
        await profilePage.openBusinessBackground();

        const backgroundPage = new BusinessBackgroundProfilePage(page);
        const data = businessBackgroundProfileData();
        await backgroundPage.verifyPageDisplayed();
        await backgroundPage.updateAndSave(data);

        await page.reload({ waitUntil: "domcontentloaded" });
        await profilePage.openBusinessBackground();
        await backgroundPage.verifySavedData(data);
    }
);
