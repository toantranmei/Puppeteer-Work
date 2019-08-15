const fs = require("fs");
const puppeteer = require("puppeteer");
const { cookie } = require("./data/data.import");
const { findSubString } = require("./functions/support");

(async () => {
  // Open browser
  const browser = await puppeteer.launch({ headless: false });

  // Open a new tab
  const page = await browser.newPage();

  // Define turn off notification popup
  const context = browser.defaultBrowserContext();
  await context.overridePermissions("https://www.facebook.com", [
    "notifications"
  ]);

  // set viewport
  await page.setViewport({ width: 1366, height: 768 });

  // Set cookie before access to facebook
  await Promise.all(
    cookie.map(element => {
      page.setCookie(element);
    })
  );

  // Go to facebook.com/pages
  await page.waitFor(1000);
  await page.goto(
    "https://www.facebook.com/bookmarks/pages?ref_type=logout_gear"
  );

  await page.waitForSelector("#bookmarksSeeAllEntSection");

  const pageListElement = await page.$$("#bookmarksSeeAllEntSection li");

  for (const pageElement of pageListElement) {
    const uidGroup = await pageElement.$eval(
      'a[data-testid*="left_nav_item"]',
      a => {
        const shortInfoGroup = a.getAttribute("data-gt");
        const start = '"bmid":"';
        const end = '"';

        return shortInfoGroup.substring(
            shortInfoGroup.indexOf(start) + start.length,
            shortInfoGroup.indexOf(end, shortInfoGroup.indexOf(start) + start.length)
          );
      }
    );
    const nameGroup = await pageElement.$eval(
      "div.linkWrap > span",
      span => span.innerText
    );
    const thumbnailGroup = await pageElement.$eval(
      "span.imgWrap > img.img",
      img => img.getAttribute("src")
    );

    console.log(uidGroup);
    console.log(nameGroup);
    console.log(thumbnailGroup);
    console.log("-----------------");
  }

  console.log("Finnish Process get info from facebook with facebook!");
})();
