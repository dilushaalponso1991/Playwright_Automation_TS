import { expect, Locator, Page } from "@playwright/test";

export function controlAfterLabel(
    page: Page,
    label: string,
    xpathCondition: string
): Locator {
    const accessibleControl = page.getByLabel(label, { exact: true });
    const visualLabelControl = page.getByText(label, { exact: true })
        .locator(`xpath=following::*[${xpathCondition}][1]`);

    return accessibleControl.or(visualLabelControl).first();
}

export async function selectTextOption(
    page: Page,
    control: Locator,
    option: string
) {
    const tagName = await control.evaluate((element) => element.tagName);

    if (tagName === "SELECT") {
        await control.selectOption({ label: option });
        return;
    }

    const clickTarget = await control.getAttribute("readonly") === null
        ? control
        : control.locator("..");

    await clickTarget.click();
    const matchingOption = page.getByText(option, { exact: true }).last();
    await expect(matchingOption).toBeVisible();
    await matchingOption.click();
}

export async function expectSelectedText(control: Locator, value: string) {
    await expect.poll(async () => control.evaluate((element) => {
        const formControl = element as unknown as {
            tagName: string;
            value?: string;
            textContent?: string | null;
            selectedOptions?: ArrayLike<{ textContent?: string | null }>;
        };

        if (formControl.tagName === "SELECT") {
            return formControl.selectedOptions?.[0]?.textContent?.trim() ?? "";
        }

        if (formControl.tagName === "INPUT") {
            return formControl.value ?? "";
        }

        return formControl.textContent?.trim() ?? "";
    })).toContain(value);
}

export async function saveChanges(page: Page, button: Locator) {
    const saveResponsePromise = page.waitForResponse((response) => {
        const method = response.request().method();
        return ["POST", "PUT", "PATCH"].includes(method) && response.ok();
    });

    await button.click();
    const saveResponse = await saveResponsePromise;
    expect(saveResponse.ok()).toBeTruthy();
}
