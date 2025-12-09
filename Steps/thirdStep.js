import { uploadAttachmentByLabel } from "../addFile.js";
import { getAttachmentPath } from "../attachmentPath.js";
import { nextButtonClick } from "../nextButtonClick.js";
// import { updateUserStatus } from "../helpers/updateUser";

export const thirdStep = async (page, data) => {
  console.log("Running thirdStep...");
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const fileOriginPath = process.env.PASSPORTS_FILE_PATH;
  const mutamarEmail = process.env.MUTAMAR_EMAIL;

  try {
    // Arabic First Name
    const firstNameArSelector = 'input[placeholder="First Name (Arabic)"]';
    await page.waitForSelector(firstNameArSelector, { visible: true });
    const firstNameValue = await page.$eval(
      firstNameArSelector,
      (el) => el.value
    );
    if (!firstNameValue || firstNameValue.trim() === "") {
      await page.type(firstNameArSelector, data.firstNameAr, { delay: 100 });
    } else {
      console.log("Arabic First Name already has a value:", firstNameValue);
    }

    // Arabic Family Name
    const familyNameArSelector = 'input[placeholder="Family Name (Arabic)"]';
    await page.waitForSelector(familyNameArSelector, { visible: true });
    const familyNameValue = await page.$eval(
      familyNameArSelector,
      (el) => el.value
    );
    if (!familyNameValue || familyNameValue.trim() === "") {
      await page.type(familyNameArSelector, data.lastNameAr, { delay: 100 });
      console.log(`Filled Arabic Family Name with ${data.lastNameAr}`);
    } else {
      console.log("Arabic Family Name already has a value:", familyNameValue);
    }

    // Profession
    const professionSelector = 'input[placeholder="Profession"]';
    await page.waitForSelector(professionSelector, { visible: true });
    const professionValue = await page.$eval(
      professionSelector,
      (el) => el.value
    );
    if (!professionValue || professionValue.trim() === "") {
      await page.type(professionSelector, data.job, { delay: 100 });
      console.log(`Filled Profession with ${data.job}`);
    } else {
      console.log("Profession already has a value:", professionValue);
    }

    // Birth Country - select "Tunisia"
    console.log("Selecting Birth Country: Tunisia...");
    try {
      const birthCountryDropdownTrigger =
        'p-dropdown[formcontrolname="birthCountryId"] .p-dropdown-trigger';
      await page.waitForSelector(birthCountryDropdownTrigger, {
        visible: true,
      });
      await page.click(birthCountryDropdownTrigger);

      const ulSelector = "ul.p-dropdown-items";
      await page.waitForSelector(ulSelector, { visible: true });

      // get all options
      const items = await page.$$('ul.p-dropdown-items li[role="option"]');
      let found = false;

      for (const item of items) {
        const text = await item.evaluate((el) => el.textContent?.trim());
        if (text === "Tunisia") {
          await item.click();
          console.log("✅ Selected Birth Country: Tunisia");
          found = true;
          break;
        }
      }

      if (!found) {
        console.log('❌ Could not find "Tunisia" in Birth Country dropdown');
      }
    } catch (err) {
      console.error("Error selecting Birth Country:", err);
    }

    // Birth City
    const birthCitySelector = 'input[placeholder="Birth City"]';
    await page.waitForSelector(birthCitySelector, { visible: true });
    const birthCityValue = await page.$eval(
      birthCitySelector,
      (el) => el.value
    );
    if (!birthCityValue || birthCityValue.trim() === "") {
      await page.type(birthCitySelector, "Tunis", { delay: 100 });
      console.log('Filled Birth City with "Tunis"');
    } else {
      console.log("Birth City already has a value:", birthCityValue);
    }

    // Marital Status - select second option
    console.log("Selecting Marital Status second option...");
    try {
      const maritalDropdownTrigger =
        'p-dropdown[formcontrolname="martialStatusId"] .p-dropdown-trigger';
      await page.waitForSelector(maritalDropdownTrigger, { visible: true });
      await page.click(maritalDropdownTrigger);

      const ulSelector = ".p-dropdown-items";
      await page.waitForSelector(ulSelector, { visible: true });

      // get all the <li> elements under that list
      const items = await page.$$(".p-dropdown-items li");
      if (items.length >= 2) {
        await items[1].click();
        console.log("✅ Selected second Marital Status option");
      } else {
        console.log("❌ Less than two items found in Marital Status dropdown");
      }
    } catch (err) {
      console.error("Error selecting Marital Status:", err);
    }

    //adding attachments
    const attachmentPath = getAttachmentPath(
      fileOriginPath,
      data.passportNumber
    );
    await uploadAttachmentByLabel(page, "Iqama", attachmentPath);
    await uploadAttachmentByLabel(
      page,
      "Vaccination Certificate",
      attachmentPath
    );

    // Email
    console.log("Checking Email field...");
    try {
      const emailSelector = 'input[placeholder="Email"]';
      await page.waitForSelector(emailSelector, { visible: true });
      const emailValue = await page.$eval(emailSelector, (el) => el.value);
      if (!emailValue || emailValue.trim() === "") {
        await page.type(emailSelector, mutamarEmail, { delay: 100 });
        console.log(`Filled Email with ${mutamarEmail}`);
      } else {
        console.log("Email already has a value:", emailValue);
      }
    } catch (err) {
      console.error("Error filling Email:", err);
    }

    // Selecting Country Phone Code +216
    console.log("Selecting Country Phone Code +216...");
    try {
      const countryCodeDropdownTrigger =
        "app-phone-field p-dropdown .p-dropdown-trigger";
      await page.waitForSelector(countryCodeDropdownTrigger, { visible: true });
      await page.click(countryCodeDropdownTrigger);

      const ulSelector = "ul.p-dropdown-items";
      await page.waitForSelector(ulSelector, { visible: true });

      const items = await page.$$('ul.p-dropdown-items li[role="option"]');
      let found = false;

      for (const item of items) {
        const text = await item.evaluate((el) => el.textContent?.trim());
        if (text && text.includes("+216")) {
          await item.click();
          console.log("✅ Selected Country Phone Code +216");
          found = true;
          break;
        }
      }

      if (!found) {
        console.log("❌ Could not find +216 in Country Phone Code dropdown");
      }
    } catch (err) {
      console.error("Error selecting Country Phone Code:", err);
    }

    // Numeric input (maxlength=8, margin-inline-start:30px)
    console.log("Checking numeric input field...");
    try {
      const numericInputSelector =
        'input[maxlength="8"][style*="margin-inline-start: 30px"]';
      await page.waitForSelector(numericInputSelector, { visible: true });
      const currentValue = await page.$eval(
        numericInputSelector,
        (el) => el.value
      );
      if (!currentValue || currentValue.trim() === "") {
        await page.type(numericInputSelector, data.phoneNumber, { delay: 100 });
        console.log(`Filled numeric input with ${data.phoneNumber}`);
      } else {
        console.log("Numeric input already has a value:", currentValue);
      }

      // Companion information if illegal age
      if (data.mohramName && data.mohramType) {
        try {
          const companionDropdown = await page.$(
            'p-dropdown[formcontrolname="companionId"]'
          );
          if (companionDropdown) {
            const trigger = await companionDropdown.$(".p-dropdown-trigger");
            await trigger?.click();
            await page.waitForSelector(".p-dropdown-items li");

            const companionItems = await page.$$(".p-dropdown-items li");
            let found = false;

            for (const item of companionItems) {
              const text = await item.evaluate((el) => el.textContent?.trim());
              if (text === data.mohramName) {
                await item.click();
                found = true;
                console.log(`✅ Selected Companion: ${data.mohramName}`);
                break;
              }
            }

            if (!found) {
              console.log(`❌ Companion "${data.mohramName}" not found`);
            }
          } else {
            console.log("❌ Companion dropdown not found");
          }
        } catch (error) {
          console.error("❌ Error selecting Companion:", error);
        }

        // ✅ Select Relation
        try {
          const relationDropdown = await page.$(
            'p-dropdown[formcontrolname="relativeRelationId"]'
          );
          if (relationDropdown) {
            const trigger = await relationDropdown.$(".p-dropdown-trigger");
            await trigger?.click();
            await page.waitForSelector(".p-dropdown-items li");

            const relationItems = await page.$$(".p-dropdown-items li");
            let found = false;

            for (const item of relationItems) {
              const text = await item.evaluate((el) => el.textContent?.trim());
              if (text === mohramType) {
                await item.click();
                found = true;
                console.log(`✅ Selected Relation: ${mohramType}`);
                break;
              }
            }

            if (!found) {
              console.log(`❌ Relation "${mohramType}" not found`);
            }
          } else {
            console.log("❌ Relation dropdown not found");
          }
        } catch (error) {
          console.error("❌ Error selecting Relation:", error);
        }
      }
    } catch (err) {
      console.error("Error filling numeric input:", err);
    }

    await nextButtonClick(page);
  } catch (err) {
    console.error("Error in thirdStep:", err);
    // await browser.close();
    // await updateUserStatus(uuid, "SCRAPING_ERROR");
  }
};
