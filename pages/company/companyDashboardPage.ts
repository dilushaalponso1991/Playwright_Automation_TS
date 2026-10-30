import { expect, Locator, Page } from "@playwright/test";

export class CompanyDashboardPage {
    readonly page: Page;
    readonly heading: Locator;
    readonly subscriptionBanner: Locator;
    readonly companyProfileNavigation: Locator;
    readonly postOpportunityButton: Locator;
    readonly currentPlan: Locator;
    readonly currentPrice: Locator;
    readonly managePlanButton: Locator;
    readonly noApplicantsMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByRole("heading", { name: "Dashboard" });
        this.subscriptionBanner = page.getByText(
            "Thank you for subscribing to SkilledUp Life.",
            { exact: true }
        );
        this.companyProfileNavigation = page.getByText("Company Profile", {
            exact: true
        }).first();
        this.postOpportunityButton = page.getByRole("button", {
            name: /Post an Opportunity/i
        }).or(page.getByRole("link", { name: /Post an Opportunity/i }));
        this.currentPlan = page.getByText("Starter Plan", { exact: true });
        this.currentPrice = page.getByText("£49.00", { exact: true });
        this.managePlanButton = page.getByRole("button", {
            name: /Manage Plan/i
        }).or(page.getByRole("link", { name: /Manage Plan/i }));
        this.noApplicantsMessage = page.getByText("No applicants found", {
            exact: true
        });
    }

    async verifySubscribedCompanyDashboard() {
        await expect(this.heading).toBeVisible();
        await expect(this.subscriptionBanner).toBeVisible();
        await expect(this.postOpportunityButton).toBeVisible();
        await expect(this.currentPlan).toBeVisible();
        await expect(this.currentPrice).toBeVisible();
        await expect(this.managePlanButton).toBeVisible();
        await expect(this.noApplicantsMessage).toBeVisible();

        for (const navigationItem of [
            "Company Profile",
            "Opportunities",
            "Volunteers",
            "Messages",
            "Payments",
            "Account Settings",
            "Guide"
        ]) {
            await expect(this.page.getByText(navigationItem, {
                exact: true
            }).first()).toBeVisible();
        }
    }

    async openCompanyProfile() {
        await this.companyProfileNavigation.click();
        await expect(this.page.getByText("Company Profile", {
            exact: true
        }).last()).toBeVisible();
    }
}
