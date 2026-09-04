import {Page, Locator, expect} from "@playwright/test";

export class WelcomePage{

  readonly page: Page;
  readonly welcomeHeading: Locator;
  readonly loginButton: Locator;
  readonly registerButton: Locator;
  readonly skilledUpLogo: Locator;


  constructor (page:Page) {
    this.page= page;
    this.welcomeHeading = page.getByText("Welcome to SkilledUp Life", { exact: true });
    this.loginButton = page.getByRole("button", { name: "Log in" });
    this.registerButton = page.getByRole("button", { name: "Register" });
    this.skilledUpLogo = page.getByText("SkilledUp", { exact: false }).first();
  }

   async goto() {
    await this.page.goto("/");
  }

  async verifyUrl() {
    await expect(this.page).toHaveURL(/v2dev\.skilledup\.life/);
  }

  async verifyHeadingVisible() {
    await expect(this.welcomeHeading).toBeVisible();
  }

  async verifyLoginButtonEnabled() {
    await expect(this.loginButton).toBeVisible();
    await expect(this.loginButton).toBeEnabled();
  }

  async verifyRegisterButtonEnabled() {
    await expect(this.registerButton).toBeVisible();
    await expect(this.registerButton).toBeEnabled();
  }

  async verifyLogoDisplayed() {
    await expect(this.skilledUpLogo).toBeVisible();
  }

  async clickRegister() {
    await this.registerButton.click();
}

}