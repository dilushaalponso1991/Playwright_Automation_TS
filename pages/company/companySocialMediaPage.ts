import { expect, Locator, Page } from "@playwright/test";
import {
    controlAfterLabel,
    saveChanges,
    selectTextOption
} from "./companyProfileControls";

export interface CompanySocialMediaData {
    platform: string;
    url: string;
}

export class CompanySocialMediaPage {
    readonly page: Page;
    readonly heading: Locator;
    readonly platformControl: Locator;
    readonly urlInput: Locator;
    readonly addButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByText("Social Media", { exact: true }).last();
        this.platformControl = controlAfterLabel(
            page,
            "Add Social Media full links",
            "self::select or @role='combobox' or self::input"
        );
        this.urlInput = page.getByPlaceholder(/enter or paste a full link/i)
            .or(page.locator("input[type='url']")).first();
        this.addButton = page.getByRole("button", { name: "Add" });
    }

    async verifyPageDisplayed() {
        await expect(this.heading).toBeVisible();
        await expect(this.page.getByText(
            /Add or edit your company's social and professional links/i
        )).toBeVisible();
        await expect(this.page.getByText("Add Social Media full links", {
            exact: true
        })).toBeVisible();
        await expect(this.platformControl).toBeVisible();
        await expect(this.urlInput).toBeVisible();
        await expect(this.addButton).toBeVisible();
    }

    async addLink(data: CompanySocialMediaData) {
        await selectTextOption(this.page, this.platformControl, data.platform);
        await this.urlInput.fill(data.url);
        await expect(this.addButton).toBeEnabled();
        await saveChanges(this.page, this.addButton);
    }

    async verifyLinkPersisted(data: CompanySocialMediaData) {
        await expect.poll(async () => {
            const visibleText = this.page.getByText(data.url, { exact: true });

            if (await visibleText.first().isVisible()) {
                return true;
            }

            return this.page.locator("input").evaluateAll(
                (elements, expectedUrl) => elements.some((element) => {
                    const input = element as unknown as { value?: string };
                    return input.value === expectedUrl;
                }),
                data.url
            );
        }).toBe(true);
    }
}
