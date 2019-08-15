const fs = require ( "fs" );
const puppeteer = require("puppeteer");
const { cookie } = require("./data/data.import");

(async () => {
  // Open browser
  const browser = await puppeteer.launch({ headless: false });

  // Open a new tab
  const page = await browser.newPage();

  // Define turn off notification popup
  const context = browser.defaultBrowserContext();
  await context.overridePermissions('https://www.facebook.com', ['notifications']);

  // set viewport
  await page.setViewport({ width: 1366, height: 768 });

  // Set cookie before access to facebook
  await Promise.all(
    cookie.map(element => {
      page.setCookie(element);
    })
  );

  // Go to facebook.com/:id
  await page.waitFor(1000);
  await page.goto("https://www.facebook.com/trantoan.960");

  // Get info
  await page.waitForSelector('#fb-timeline-cover-name');
  const fullName = await page.title();
  const alternateName = await page.$eval('#fb-timeline-cover-name > a > span.alternate_name', el => el.textContent);
  console.log(fullName);
  console.log(alternateName);

  console.log('Finnish Process get info from facebook with facebook!');
})();
