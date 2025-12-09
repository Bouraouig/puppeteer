export const nextButtonClick = async (page) => {
  await new Promise((resolve) => setTimeout(resolve, 10000));
  const nextButtonSelector = "button.btn.btn-primary.m-0.ng-star-inserted";
  await page.click(nextButtonSelector);
};
