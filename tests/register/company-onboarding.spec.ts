import { test } from "@playwright/test";
import {
    CompanyBackgroundPage,
    CompanyOnboardingWelcomePage,
    PricingPlanPage,
    TechCompanyDetailsPage
} from "../../pages/company/companyOnboardingPage";

test.use({ viewport: { width: 1600, height: 1000 } });

function requiredEnvironmentValue(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`${name} is required for the verified onboarding test.`);
    }

    return value;
}

test("TC_COM_006: Verified company completes profile setup to pricing page",
    async ({ page }) => {
        test.skip(
            process.env.RUN_VERIFIED_ONBOARDING !== "true",
            "Set RUN_VERIFIED_ONBOARDING=true and provide a dedicated " +
            "verification/onboarding URL plus test data."
        );

        const welcomePage = new CompanyOnboardingWelcomePage(page);
        const backgroundPage = new CompanyBackgroundPage(page);
        const detailsPage = new TechCompanyDetailsPage(page);
        const pricingPage = new PricingPlanPage(page);

        await page.goto(requiredEnvironmentValue("E2E_COMPANY_ONBOARDING_URL"));
        await welcomePage.verifyPageDisplayed();
        await welcomePage.startOnboarding();

        await backgroundPage.complete({
            companyStage: requiredEnvironmentValue("E2E_COMPANY_STAGE"),
            teamSize: requiredEnvironmentValue("E2E_COMPANY_TEAM_SIZE"),
            teamStructure: process.env.E2E_COMPANY_TEAM_STRUCTURE ??
                "Our small product team combines engineering, design, " +
                "delivery and customer research experience for early growth.",
            fundingSource: requiredEnvironmentValue("E2E_COMPANY_FUNDING"),
            discoverySource: requiredEnvironmentValue("E2E_DISCOVERY_SOURCE")
        });

        const website = process.env.E2E_COMPANY_WEBSITE;
        const youtubePitch = process.env.E2E_COMPANY_YOUTUBE_PITCH;

        await detailsPage.complete({
            countryCode: requiredEnvironmentValue("E2E_COUNTRY_CODE"),
            mobileNumber: requiredEnvironmentValue("E2E_MOBILE_NUMBER"),
            city: process.env.E2E_COMPANY_CITY ?? "Auckland",
            role: process.env.E2E_COMPANY_ROLE ?? "Founder",
            language: process.env.E2E_COMPANY_LANGUAGE ?? "English",
            tags: (process.env.E2E_COMPANY_TAGS ?? "SaaS,Automation,Testing")
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
            ...(website ? { website } : {}),
            ...(youtubePitch ? { youtubePitch } : {})
        });

        // Regression intentionally stops before selecting a paid plan.
        await pricingPage.verifyPageDisplayed();
    }
);
