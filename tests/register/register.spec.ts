import { test } from "@playwright/test";
import { WelcomePage } from "../../pages/welcomePage";
import { RegisterPage } from "../../pages/register/registerPage";

test("TC_COM_002: Registration type selection page loads correctly",
    async ({ page }) => {
        const welcomePage = new WelcomePage(page);
        const registerPage = new RegisterPage(page);

        await welcomePage.goto();
        await welcomePage.clickRegister();
        await registerPage.verifyRegistrationElements();
        await registerPage.verifyInitialSelectionState();
    }
);
