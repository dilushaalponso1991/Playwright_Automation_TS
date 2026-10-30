import { test } from "@playwright/test";
import { WelcomePage } from "../../pages/welcomePage";
import { RegisterPage } from "../../pages/register/registerPage";
import { EmailVerificationPage } from "../../pages/register/emailVerificationPage";
import {
    TechCompanyRegistrationPage
} from "../../pages/register/techCompanyRegistrationPage";
import {
    companyRegistrationData,
    hasCompanyRegistrationIdentity
} from "../../config/testData";

test.use({ viewport: { width: 1440, height: 1400 } });

test.describe("Tech company registration regression", () => {
    test("TC_COM_003: Tech company registration page displays required fields",
        async ({ page }) => {
            const welcomePage = new WelcomePage(page);
            const registerPage = new RegisterPage(page);
            const companyPage = new TechCompanyRegistrationPage(page);

            await welcomePage.goto();
            await welcomePage.clickRegister();
            await registerPage.continueAsTechCompany();
            await companyPage.verifyPageDisplayed();
        }
    );

    test("TC_COM_004: Required company details enable account creation",
        async ({ page }) => {
            test.skip(
                !hasCompanyRegistrationIdentity(),
                "Configure E2E_COMPANY_EMAIL and E2E_COMPANY_PASSWORD in .env."
            );

            const companyPage = new TechCompanyRegistrationPage(page);

            await companyPage.goto();
            await companyPage.completeRequiredRegistration(
                companyRegistrationData()
            );
            await companyPage.verifyFormCanBeSubmitted();
        }
    );

    test("TC_COM_005: Company account creation shows email verification prompt",
        async ({ page }) => {
            test.skip(
                process.env.RUN_ACCOUNT_CREATION !== "true",
                "Set RUN_ACCOUNT_CREATION=true and dedicated test credentials."
            );

            const welcomePage = new WelcomePage(page);
            const registerPage = new RegisterPage(page);
            const companyPage = new TechCompanyRegistrationPage(page);
            const verificationPage = new EmailVerificationPage(page);

            await welcomePage.goto();
            await welcomePage.clickRegister();
            await registerPage.continueAsTechCompany();
            await companyPage.completeRequiredRegistration(
                companyRegistrationData()
            );
            await companyPage.submit();
            await verificationPage.verifyPageDisplayed();
        }
    );
});
