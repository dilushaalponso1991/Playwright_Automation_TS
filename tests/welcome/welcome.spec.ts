
import {test , expect } from "@playwright/test";
import { WelcomePage} from "../../pages/welcomePage";

test("TC_COM_001: Welcome page loads correctly", async ({page})=> {

    const welcomePage =new WelcomePage(page);

    await welcomePage.goto()

     // 1. Verify the current URL is correct
  await welcomePage.verifyUrl();

  // 2. Verify the heading "Welcome to SkilledUp Life" is visible
  await welcomePage.verifyHeadingVisible();

  // 3. Verify the Log In button is visible and enabled
  await welcomePage.verifyLoginButtonEnabled();

  // 4. Verify the Register button is visible and enabled
  await welcomePage.verifyRegisterButtonEnabled();

  // 5. Verify the SkilledUp Life logo is displayed
  await welcomePage.verifyLogoDisplayed();


}
)


