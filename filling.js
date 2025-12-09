export const fillInLogin = async (page) => {
  const email = process.env.MASAR_EMAIL;
  const password = process.env.MASAR_PASSWORD;
  console.log(email);
  const inputSelector = 'input[maxlength="100"]';
  await page.waitForSelector(inputSelector, { visible: true });
  console.log("ok");
  await page.type(inputSelector, email, { delay: 100 });

  const passwordSelector = 'input[type="password"]';
  await page.waitForSelector(passwordSelector, { visible: true });
  await page.type(passwordSelector, password, { delay: 100 });
};
