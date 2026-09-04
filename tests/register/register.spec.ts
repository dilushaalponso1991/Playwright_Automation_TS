import { test } from "@playwright/test";
import { WelcomePage} from "../../pages/welcomePage";
import { RegisterPage } from "../../pages/registerPage";

test("TC_COM_002: Welcome page loads correctly", async ({page})=> {


    const welcomePage = new WelcomePage(page);
    const registerPage = new RegisterPage(page);

    // Navigate to Welcome Page
    await welcomePage.goto();

    // Click Register button
    await welcomePage.clickRegister();

    //Verify Registration page elements
   await registerPage.verifyRegistrationElements();


}
)

