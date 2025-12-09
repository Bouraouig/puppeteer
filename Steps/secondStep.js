import { nextButtonClick } from "../nextButtonClick.js";

export const secondStep = async (page, data) => {
  console.log("Running secondStep...");
  const nationality = process.env.CITY_OF_ISSUED || "";

  try {
    const inputSelector = 'input[placeholder="City of Issued"]';
    await page.waitForSelector(inputSelector, { visible: true });
    await page.type(inputSelector, nationality, { delay: 100 });
    console.log("Filled City of Issued with Tunis");

    // Passport Type - select second option
    console.log("Selecting Passport Type second option...");
    try {
      const passportDropdownTrigger =
        'p-dropdown[formcontrolname="passportTypeId"] .p-dropdown-trigger';
      await page.waitForSelector(passportDropdownTrigger, { visible: true });
      await page.click(passportDropdownTrigger);

      const ulSelector = "ul.p-dropdown-items";
      await page.waitForSelector(ulSelector, { visible: true });

      const items = await page.$$('ul.p-dropdown-items li[role="option"]');
      if (items.length >= 2) {
        await items[1].click();
        console.log("✅ Selected second Passport Type option");
      } else {
        console.log("❌ Less than two items found in Passport Type dropdown");
      }
    } catch (err) {
      console.error("Error selecting Passport Type:", err);
    }

    const inputDateSelector = 'input[placeholder="Release Date"]';
    await page.waitForSelector(inputDateSelector, { visible: true });
    await page.type(inputDateSelector, data.passportDeliveryDate, {
      delay: 100,
    });
    console.log("✅ Passport Issue Date selected");

    await page.keyboard.press("Enter");

    await nextButtonClick(page);
  } catch (err) {
    console.error("Error in secondStep:", err);
  }
};
