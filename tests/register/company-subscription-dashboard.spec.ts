import { test } from "@playwright/test";
import { CompanyDashboardPage } from "../../pages/company/companyDashboardPage";
import {
    BusinessPlansPage,
    PaymentMethodPage,
    PricingPlanPage,
    SubscriptionConfirmationModal
} from "../../pages/company/companyOnboardingPage";
import {
    PaymentSuccessPage,
    StripeCheckoutPage
} from "../../pages/payments/stripeCheckoutPage";
import { stripeSandboxCardData } from "../../config/testData";

test.use({ viewport: { width: 1600, height: 1000 } });

const storageStatePath = process.env.E2E_STORAGE_STATE;

if (storageStatePath) {
    test.use({ storageState: storageStatePath });
}

function requiredEnvironmentValue(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`${name} is required for this regression test.`);
    }

    return value;
}

function longDescription(subject: string): string {
    return (
        `${subject} We validate customer needs, ship measurable product ` +
        "increments, document decisions, review delivery risks, and use " +
        "feedback to improve priorities. The team works transparently with " +
        "clear ownership, practical milestones, and regular progress reviews. "
    ).repeat(3);
}

test("TC_COM_007: Starter sandbox subscription completes and returns to dashboard",
    async ({ page }) => {
        test.skip(
            process.env.RUN_STRIPE_SANDBOX !== "true",
            "Set RUN_STRIPE_SANDBOX=true only for a dedicated Stripe " +
            "Sandbox account and authenticated test company."
        );

        const pricingPage = new PricingPlanPage(page);
        const paymentMethodPage = new PaymentMethodPage(page);
        const confirmationModal = new SubscriptionConfirmationModal(page);
        const stripeCheckout = new StripeCheckoutPage(page);
        const paymentSuccessPage = new PaymentSuccessPage(page);
        const businessPlansPage = new BusinessPlansPage(page);
        const dashboardPage = new CompanyDashboardPage(page);
        const testCard = stripeSandboxCardData();

        await page.goto(requiredEnvironmentValue("E2E_COMPANY_PRICING_URL"));
        await pricingPage.verifyPageDisplayed();
        await pricingPage.selectStarterPlan();
        await pricingPage.continueToPayment();

        await paymentMethodPage.verifyPageDisplayed();
        await paymentMethodPage.openConfirmation();
        await confirmationModal.verifyStarterPlan();
        await confirmationModal.confirmAndOpenStripe();

        await stripeCheckout.verifySandboxCheckout();
        await stripeCheckout.completeTestCard(testCard);
        await stripeCheckout.subscribe();

        await paymentSuccessPage.verifyPageDisplayed();
        await paymentSuccessPage.continueToBusinessPlans();
        await businessPlansPage.complete({
            businessDescription: process.env.E2E_BUSINESS_DESCRIPTION ??
                longDescription("Our test company builds workflow software."),
            progressDescription: process.env.E2E_PROGRESS_DESCRIPTION ??
                longDescription("The product has completed early validation."),
            next18MonthsPlan: process.env.E2E_NEXT_18_MONTHS_PLAN ??
                longDescription("Over the next 18 months the team will grow.")
        });

        await dashboardPage.verifySubscribedCompanyDashboard();
    }
);

test("TC_COM_008: Subscribed company dashboard shows active Starter plan",
    async ({ page }) => {
        test.skip(
            !process.env.E2E_COMPANY_DASHBOARD_URL || !storageStatePath,
            "Provide E2E_COMPANY_DASHBOARD_URL and E2E_STORAGE_STATE for an " +
            "authenticated, read-only dashboard regression."
        );

        await page.goto(requiredEnvironmentValue("E2E_COMPANY_DASHBOARD_URL"));
        await new CompanyDashboardPage(page)
            .verifySubscribedCompanyDashboard();
    }
);
