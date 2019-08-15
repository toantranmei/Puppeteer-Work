const fs = require("fs");
const puppeteer = require("puppeteer");
const { cookie } = require("./data/data.import");

const autoScroll = async page => {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 500);
    });
  });
};

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

  // Go to facebook.com/:id
  await page.waitFor(1000);
  await page.goto("https://m.facebook.com/groups_browse/your_groups/");

  await autoScroll(page);

  console.log("Finnish Process get info from facebook with facebook!");
})();
