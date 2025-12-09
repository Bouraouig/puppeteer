import { getAttachmentPath } from "../attachmentPath.js";

export const firstStep = async (page, data) => {
  console.log("Running firstStep...");
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const fileOriginPath = process.env.PASSPORTS_FILE_PATH || "";

  const fileInputSelector =
    'div.container__notes__upload__button input[type="file"]';
  const filePath = getAttachmentPath(fileOriginPath, data.passportNumber);
  console.log(data);

  try {
    // Wait for the file input
    await page.waitForSelector(fileInputSelector, { timeout: 5000 });
    const input = await page.$(fileInputSelector);
    if (!input) throw new Error("File input not found on the page.");

    // Upload file
    await input.uploadFile(filePath);
    console.log("✅ File uploaded");

    // Wait for the loading popup to appear
    await page
      .waitForSelector(
        "app-loading-passport-scan .popup-container:not(.d-none)",
        {
          timeout: 5000,
        }
      )
      .catch(() => console.log("No loading popup appeared"));

    // Wait for either the success popup or error popup
    const popupSelector = `
            app-passport-data-summary-popup .popup-container:not(.d-none),
            app-passport-expiry-popup .popup-container:not(.d-none)
          `;

    await page.waitForSelector(popupSelector, { timeout: 30000 });
    console.log("✅ Popup appeared");

    // Check which popup appeared and handle accordingly
    const isSuccessPopup =
      (await page.$(
        "app-passport-data-summary-popup .popup-container:not(.d-none)"
      )) !== null;

    if (isSuccessPopup) {
      await page.waitForSelector(
        "app-passport-data-summary-popup button.btn-primary",
        {
          visible: true,
          timeout: 5000,
        }
      );
      await page.click("app-passport-data-summary-popup button.btn-primary");
    }
    console.log("✅ Proceed button clicked successfully");
  } catch (error) {
    console.error("❌ uploadPassport error:", error);

    // await updateUserStatus(uuid, "SCRAPING_ERROR");

    throw error;
  }
};
