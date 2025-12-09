export const clickExplorationLogin = async (page) => {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  await page.waitForSelector(".entity-card");

  // find all entity cards
  const cards = await page.$$(".entity-card");
  await new Promise((resolve) => setTimeout(resolve, 2000));

  for (const card of cards) {
    const name = await card.$eval(".entity__name", (el) =>
      el.textContent?.trim()
    );
    const status = await card.$eval(".p-tag span", (el) =>
      el.textContent?.trim()
    );

    if (name === "EXPLOORATION" && status === "Activated") {
      const loginButton = await card.$("button");
      if (loginButton) {
        await loginButton.click();
        console.log("Clicked on EXPLOORATION Login button");
      }
      break;
    }
  }
};
