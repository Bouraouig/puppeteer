export const uploadAttachmentByLabel = async (page, labelText, filePath) => {
  try {
    // Locate the <input type="file"> based on the associated label text
    const inputHandle = await page.evaluateHandle((labelTextInner) => {
      const labels = Array.from(document.querySelectorAll("label"));
      for (const label of labels) {
        if (label.textContent?.includes(labelTextInner)) {
          const input = label
            .closest("div")
            ?.querySelector('input[type="file"]');
          return input || null;
        }
      }
      return null;
    }, labelText);

    const elementHandle = inputHandle.asElement();
    if (!elementHandle) {
      console.error(`❌ Input for label "${labelText}" not found`);
      return;
    }

    await elementHandle.uploadFile(filePath);

    // Manually dispatch a change event to ensure the app reacts
    await page.evaluate((input) => {
      const event = new Event("change", { bubbles: true });
      input.dispatchEvent(event);
    }, elementHandle);

    console.log(`✅ Uploaded "${filePath}" to "${labelText}"`);
  } catch (err) {
    console.error(`❌ Error uploading to "${labelText}":`, err);
  }
};
