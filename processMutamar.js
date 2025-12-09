import { nextButtonClick } from "./nextButtonClick.js";
import { firstStep } from "./Steps/firstStep.js";
import { secondStep } from "./Steps/secondStep.js";
import { thirdStep } from "./Steps/thirdStep.js";

export const processMutamar = async (page, data) => {
  try {
    console.log("Starting Puppeteer workflow for POST data:", data);
    await firstStep(page, data);
    await secondStep(page, data);
    await thirdStep(page, data);
    await nextButtonClick(page);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // fifthStep
    await nextButtonClick(page);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await newMutamarAdd(page);
    console.log("Finished Puppeteer workflow for this POST");
    return "success";
  } catch (err) {
    return err;
  }
};
export const newMutamarAdd = async (page) => {
  await page.waitForSelector("button");

  const buttons = await page.$$("button");

  for (const button of buttons) {
    const buttonText = await page.evaluate(
      (el) => el.textContent?.trim(),
      button
    );

    if (buttonText === "Add Another Mutamer") {
      await button.click();
      console.log("Clicked Add Another Mutamer");
      break;
    }
  }
};
