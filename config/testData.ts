import type { CompanyRegistrationData } from "../pages/register/techCompanyRegistrationPage";
import type { StripeTestCardData } from "../pages/payments/stripeCheckoutPage";
import type { CompanyBasicInfoData } from "../pages/company/companyProfilePage";
import type { CompanySocialMediaData } from "../pages/company/companySocialMediaPage";
import type {
    BusinessPlansData,
    CompanyBackgroundData
} from "../pages/company/companyOnboardingPage";

const registrationIdentityKeys = [
    "E2E_COMPANY_EMAIL",
    "E2E_COMPANY_PASSWORD"
] as const;

function requiredValue(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(
            `${name} is required. Add it to the local .env file or the CI ` +
            "secret environment before running this test."
        );
    }

    return value;
}

function requiredMinimumLength(name: string, minimum: number): string {
    const value = requiredValue(name);

    if (value.length < minimum) {
        throw new Error(
            `${name} must contain at least ${minimum} characters; received ` +
            `${value.length}.`
        );
    }

    return value;
}

function renderTemplate(value: string, runId: string): string {
    return value.replaceAll("{timestamp}", runId);
}

export function hasCompanyRegistrationIdentity(): boolean {
    return registrationIdentityKeys.every((name) => Boolean(process.env[name]));
}

export function companyRegistrationData(): CompanyRegistrationData {
    const runId = String(Date.now());
    const usernameTemplate = process.env.E2E_COMPANY_USERNAME ??
        "e2e-company-{timestamp}";
    const companyNameTemplate = process.env.E2E_COMPANY_NAME ??
        "E2E Regression {timestamp}";

    return {
        username: renderTemplate(usernameTemplate, runId),
        firstName: process.env.E2E_COMPANY_FIRST_NAME ?? "E2E",
        lastName: process.env.E2E_COMPANY_LAST_NAME ?? "Regression",
        companyName: renderTemplate(companyNameTemplate, runId),
        email: renderTemplate(requiredValue("E2E_COMPANY_EMAIL"), runId),
        password: requiredValue("E2E_COMPANY_PASSWORD"),
        country: process.env.E2E_COMPANY_COUNTRY ?? "Albania",
        category: process.env.E2E_COMPANY_CATEGORY ?? "AdTech"
    };
}

export function stripeSandboxCardData(): StripeTestCardData {
    return {
        cardNumber: requiredValue("E2E_STRIPE_CARD"),
        expiry: requiredValue("E2E_STRIPE_EXPIRY"),
        cvc: requiredValue("E2E_STRIPE_CVC"),
        cardholderName: requiredValue("E2E_STRIPE_CARDHOLDER"),
        country: requiredValue("E2E_STRIPE_COUNTRY")
    };
}

export function hasCompanyBasicInfoData(): boolean {
    return [
        "E2E_PROFILE_COMPANY_NAME",
        "E2E_PROFILE_CITY",
        "E2E_PROFILE_MOBILE_NUMBER",
        "E2E_PROFILE_WEBSITE",
        "E2E_PROFILE_YOUTUBE_PITCH"
    ].every((name) => Boolean(process.env[name]));
}

export function companyBasicInfoData(): CompanyBasicInfoData {
    return {
        companyName: requiredValue("E2E_PROFILE_COMPANY_NAME"),
        city: requiredValue("E2E_PROFILE_CITY"),
        mobileNumber: requiredValue("E2E_PROFILE_MOBILE_NUMBER"),
        website: requiredValue("E2E_PROFILE_WEBSITE"),
        youtubePitch: requiredValue("E2E_PROFILE_YOUTUBE_PITCH")
    };
}

export function hasCompanySocialMediaData(): boolean {
    return [
        "E2E_PROFILE_SOCIAL_PLATFORM",
        "E2E_PROFILE_SOCIAL_URL"
    ].every((name) => Boolean(process.env[name]));
}

export function companySocialMediaData(): CompanySocialMediaData {
    return {
        platform: requiredValue("E2E_PROFILE_SOCIAL_PLATFORM"),
        url: requiredValue("E2E_PROFILE_SOCIAL_URL")
    };
}

export function hasCompanyBackgroundProfileData(): boolean {
    return [
        "E2E_PROFILE_COMPANY_STAGE",
        "E2E_PROFILE_TEAM_SIZE",
        "E2E_PROFILE_TEAM_STRUCTURE",
        "E2E_PROFILE_FUNDING_SOURCE",
        "E2E_PROFILE_DISCOVERY_SOURCE"
    ].every((name) => Boolean(process.env[name]));
}

export function companyBackgroundProfileData(): CompanyBackgroundData {
    return {
        companyStage: requiredValue("E2E_PROFILE_COMPANY_STAGE"),
        teamSize: requiredValue("E2E_PROFILE_TEAM_SIZE"),
        teamStructure: requiredMinimumLength(
            "E2E_PROFILE_TEAM_STRUCTURE",
            300
        ),
        fundingSource: requiredValue("E2E_PROFILE_FUNDING_SOURCE"),
        discoverySource: requiredValue("E2E_PROFILE_DISCOVERY_SOURCE")
    };
}

export function hasBusinessBackgroundProfileData(): boolean {
    return [
        "E2E_PROFILE_BUSINESS_DESCRIPTION",
        "E2E_PROFILE_PROGRESS_DESCRIPTION",
        "E2E_PROFILE_NEXT_18_MONTHS_PLAN"
    ].every((name) => Boolean(process.env[name]));
}

export function businessBackgroundProfileData(): BusinessPlansData {
    return {
        businessDescription: requiredMinimumLength(
            "E2E_PROFILE_BUSINESS_DESCRIPTION",
            300
        ),
        progressDescription: requiredMinimumLength(
            "E2E_PROFILE_PROGRESS_DESCRIPTION",
            300
        ),
        next18MonthsPlan: requiredMinimumLength(
            "E2E_PROFILE_NEXT_18_MONTHS_PLAN",
            300
        )
    };
}
